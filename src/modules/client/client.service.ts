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

  async findAll(): Promise<Client[]> {
    return this.handleRepositoryOperation(() => this.clientRepository.find())
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
