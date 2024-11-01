import { Client } from '@modules/client/entities/client.entity'
import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException
} from '@nestjs/common'
import { Repository } from 'typeorm'
import { CreateRestaurantDto } from './dto/create-restaurant.dto'
import { UpdateRestaurantDto } from './dto/update-restaurant.dto'
import { Restaurant } from './entities/restaurant.entity'
import { TRestaurantResponse } from './types/get-all-response.type'

@Injectable()
export class RestaurantService {
  constructor(
    @Inject('RESTAURANT_REPOSITORY')
    private readonly restaurantRepository: Repository<Restaurant>,
    @Inject('CLIENT_REPOSITORY')
    private readonly clientRepository: Repository<Client>
  ) {}

  async create(createRestaurantDto: CreateRestaurantDto): Promise<Restaurant> {
    const restaurant = this.restaurantRepository.create(createRestaurantDto)
    return await this.saveRestaurant(restaurant)
  }

  async findAll(
    search?: {
      name?: string
      address?: string
      capacity?: number
    },
    page: number = 1,
    limit: number = 10
  ): Promise<TRestaurantResponse> {
    const queryBuilder =
      this.restaurantRepository.createQueryBuilder('restaurant')

    const searchFields = {
      name: 'restaurant.name',
      address: 'restaurant.address',
      capacity: 'restaurant.capacity'
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

      if (conditions) {
        queryBuilder.where(conditions, parameters)
      }
    }

    const offset = (page - 1) * limit

    if (offset < 0) {
      throw new Error('Page must be greater than or equal to 1')
    }

    if (limit <= 0) {
      throw new Error('Limit must be greater than zero')
    }

    try {
      const [restaurants, total] = await queryBuilder
        .skip(offset)
        .take(limit)
        .getManyAndCount()

      return {
        data: restaurants,
        total,
        page,
        lastPage: Math.ceil(total / limit)
      }
    } catch (error) {
      console.error('Error fetching restaurants:', error)
      throw new Error('Could not fetch restaurants')
    }
  }

  async findOne(id: string): Promise<Restaurant> {
    const restaurant = await this.restaurantRepository.findOne({
      where: { id },
      relations: ['clients']
    })
    if (!restaurant) {
      throw new NotFoundException(`Restaurant with ID ${id} not found`)
    }
    return restaurant
  }

  async update(
    id: string,
    updateRestaurantDto: UpdateRestaurantDto
  ): Promise<Restaurant> {
    const restaurant = await this.findOne(id)
    Object.assign(restaurant, updateRestaurantDto)
    return await this.saveRestaurant(restaurant)
  }

  async remove(id: string): Promise<{ message: string }> {
    const restaurant = await this.findOne(id)
    await this.restaurantRepository.remove(restaurant)
    return { message: `Restaurant with ID ${id} has been removed` }
  }

  async addClientToRestaurant(
    restaurantId: string,
    clientId: string
  ): Promise<Restaurant> {
    const restaurant = await this.findOne(restaurantId)
    const client = await this.clientRepository.findOneBy({ id: clientId })

    if (!client) {
      throw new NotFoundException(`Client with ID ${clientId} not found`)
    }

    if (restaurant.clients.length >= restaurant.capacity) {
      throw new BadRequestException('Maximum capacity reached')
    }
    if (restaurant.clients.map((c) => c.id).includes(client.id)) {
      throw new BadRequestException(
        'This client is already registered in the restaurant'
      )
    }

    if (client.age < 18) {
      throw new BadRequestException('Only adults are allowed')
    }

    restaurant.clients.push(client)
    return await this.saveRestaurant(restaurant)
  }

  private async saveRestaurant(restaurant: Restaurant): Promise<Restaurant> {
    try {
      return await this.restaurantRepository.save(restaurant)
    } catch (error) {
      throw new InternalServerErrorException(
        `Could not save restaurant: ${error.message}`
      )
    }
  }
}
