import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException
} from '@nestjs/common'
import { validate, ValidationError } from 'class-validator'
import { Repository } from 'typeorm'
import { CreateClientDto } from './dto/create-client.dto'
import { UpdateClientDto } from './dto/update-client.dto'
import { Client } from './entities/client.entity'
import { TClientResponse } from './types/get-all-response'

@Injectable()
export class ClientService {
  constructor(
    @Inject('CLIENT_REPOSITORY')
    private readonly clientRepository: Repository<Client>
  ) {}

  async create(createClientDto: CreateClientDto): Promise<Client> {
    const clientOrErrors = await this.validateClient(createClientDto)

    if (clientOrErrors instanceof Client) {
      this.checkAge(clientOrErrors.age)
      return this.saveClient(clientOrErrors)
    } else {
      throw new BadRequestException({
        statusCode: 400,
        message: 'Validation failed',
        errors: clientOrErrors
      })
    }
  }

  async findAll(
    search?: { name?: string; email?: string; phone?: string; age?: number },
    page: number = 1,
    limit: number = 10
  ): Promise<TClientResponse> {
    const queryBuilder = this.clientRepository.createQueryBuilder('client')

    const searchFields = {
      name: 'client.name',
      email: 'client.email',
      phone: 'client.phone',
      age: 'client.age'
    }

    if (search) {
      const conditions = Object.keys(search)
        .filter((key) => searchFields[key] && search[key] !== undefined)
        .map((key) => {
          const value = search[key]
          if (typeof value === 'string') {
            return `${searchFields[key]} LIKE :${key}`
          } else if (typeof value === 'number') {
            return `${searchFields[key]} = :${key}`
          }
          return ''
        })
        .filter(Boolean)
        .join(' OR ')

      const parameters = Object.keys(search).reduce((acc, key) => {
        acc[key] =
          typeof search[key] === 'string' ? `%${search[key]}%` : search[key]
        return acc
      }, {})

      queryBuilder.where(conditions, parameters)
    }

    const offset = (page - 1) * limit
    if (offset < 0) {
      throw new Error('Page must be greater than or equal to 1')
    }

    if (limit <= 0) {
      throw new Error('Limit must be greater than zero')
    }

    const [clients, total] = await queryBuilder
      .skip(offset)
      .take(limit)
      .getManyAndCount()

    return {
      data: clients,
      total,
      page,
      lastPage: Math.ceil(total / limit)
    }
  }

  async findOne(id: string): Promise<Client> {
    return this.handleRepositoryOperation(
      () => this.clientRepository.findOneBy({ id }),
      id
    )
  }

  async update(id: string, updateClientDto: UpdateClientDto): Promise<Client> {
    const clientOrErrors = await this.validateClient(updateClientDto, true)

    if (clientOrErrors instanceof Client) {
      const existingClient = await this.findExistingClient(id)
      Object.assign(existingClient, clientOrErrors)
      return this.saveClient(existingClient)
    } else {
      throw new BadRequestException({
        statusCode: 400,
        message: 'Validation failed',
        errors: clientOrErrors
      })
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    const existingClient = await this.findExistingClient(id)

    await this.clientRepository.remove(existingClient)
    return { message: `Client with ID ${id} has been removed` }
  }

  private async validateClient(
    clientData: CreateClientDto | UpdateClientDto,
    isPartial: boolean = false
  ): Promise<Client | ValidationError[]> {
    const client = new Client()
    Object.assign(client, clientData)

    const errors = await validate(client, {
      skipMissingProperties: isPartial
    })

    return errors.length > 0 ? errors : client
  }

  private async findExistingClient(id: string): Promise<Client> {
    const client = await this.clientRepository.findOneBy({ id })

    if (!client) {
      throw new NotFoundException(`Client with ID ${id} not found`)
    }

    return client
  }

  private checkAge(age: number): void {
    if (age < 18) {
      throw new BadRequestException(
        'Only clients over the age of 18 can be registered.'
      )
    }
  }

  private async saveClient(client: Client): Promise<Client> {
    try {
      return await this.clientRepository.save(client)
    } catch (error) {
      throw new InternalServerErrorException(
        `Could not save client: ${error.message}`
      )
    }
  }

  private async handleRepositoryOperation<T>(
    operation: () => Promise<T>,
    id?: string
  ): Promise<T> {
    try {
      return await operation()
    } catch (error) {
      throw new InternalServerErrorException(
        id
          ? `Could not retrieve client with ID ${id}: ${error.message}`
          : `Could not retrieve clients: ${error.message}`
      )
    }
  }
}
