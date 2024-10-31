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

  async findAll(): Promise<Restaurant[]> {
    return await this.restaurantRepository.find({ relations: ['clients'] })
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
