import { Client } from '@modules/client/entities/client.entity'
import { Restaurant } from '@modules/restaurant/entities/restaurant.entity'
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException
} from '@nestjs/common'
import { LoggerService } from 'src/core/logger/logger.service'
import { Repository } from 'typeorm'
import { CreateOrderDto } from './dto/create-order.dto'
import { UpdateOrderDto } from './dto/update-order.dto'
import { Order } from './entities/order.entity'
import { TOrderResponse } from './types/get-all-response.type'

@Injectable()
export class OrderService {
  constructor(
    @Inject('ORDER_REPOSITORY')
    private readonly orderRepository: Repository<Order>,
    @Inject('CLIENT_REPOSITORY')
    private readonly clientRepository: Repository<Client>,
    @Inject('RESTAURANT_REPOSITORY')
    private readonly restaurantRepository: Repository<Restaurant>,
    private readonly logger: LoggerService
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    this.logger.log(
      `Creating order for client ID ${createOrderDto.clientId} at restaurant ID ${createOrderDto.restaurantId}`
    )

    const client = await this.clientRepository.findOneBy({
      id: createOrderDto.clientId
    })
    const restaurant = await this.restaurantRepository.findOneBy({
      id: createOrderDto.restaurantId
    })

    if (!client || !restaurant) {
      const errorMessage = 'Client or Restaurant not found'
      this.logger.error(errorMessage)
      throw new BadRequestException(errorMessage)
    }

    const order = this.orderRepository.create({
      description: createOrderDto.description,
      client,
      restaurant
    })

    const savedOrder = await this.orderRepository.save(order)
    this.logger.log(`Order created successfully with ID ${savedOrder.id}`)

    return savedOrder
  }

  async findAll(
    search?: {
      clientName?: string
      restaurantName?: string
      totalAmount?: number
    },
    page: number = 1,
    limit: number = 10
  ): Promise<TOrderResponse> {
    this.logger.log(
      `Fetching orders with search parameters: ${JSON.stringify(search)}`
    )

    const queryBuilder = this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.client', 'client')
      .leftJoinAndSelect('order.restaurant', 'restaurant')

    const searchFields = {
      clientName: 'client.name',
      restaurantName: 'restaurant.name',
      totalAmount: 'order.totalAmount'
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
      const [orders, total] = await queryBuilder
        .skip(offset)
        .take(limit)
        .getManyAndCount()

      this.logger.log(`Fetched ${orders.length} orders successfully`)

      return {
        data: orders,
        total,
        page,
        lastPage: Math.ceil(total / limit)
      }
    } catch (error) {
      this.logger.error('Error fetching orders:', error)
      throw new Error('Could not fetch orders')
    }
  }

  async findOne(id: string): Promise<Order> {
    this.logger.log(`Fetching order with ID ${id}`)

    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['client', 'restaurant']
    })

    if (!order) {
      this.logger.warn(`Order with ID ${id} not found`)
      throw new NotFoundException(`Order with ID ${id} not found`)
    }

    return order
  }

  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    this.logger.log(`Updating order with ID ${id}`)

    const order = await this.findOne(id)

    if (updateOrderDto.description) {
      order.description = updateOrderDto.description
      this.logger.log(`Updated description for order ID ${id}`)
    }

    return this.orderRepository.save(order)
  }

  async remove(id: string): Promise<void> {
    this.logger.log(`Removing order with ID ${id}`)

    const result = await this.orderRepository.delete(id)

    if (result.affected === 0) {
      this.logger.warn(`Attempted to remove non-existent order with ID ${id}`)
      throw new NotFoundException(`Order with ID ${id} not found`)
    }

    this.logger.log(`Successfully removed order with ID ${id}`)
  }
}
