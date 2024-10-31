import { Client } from '@modules/client/entities/client.entity'
import { Restaurant } from '@modules/restaurant/entities/restaurant.entity'
import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { Repository } from 'typeorm'
import { CreateOrderDto } from './dto/create-order.dto'
import { UpdateOrderDto } from './dto/update-order.dto'
import { Order } from './entities/order.entity'

@Injectable()
export class OrderService {
  constructor(
    @Inject('ORDER_REPOSITORY')
    private readonly orderRepository: Repository<Order>,
    @Inject('CLIENT_REPOSITORY')
    private readonly clientRepository: Repository<Client>,
    @Inject('RESTAURANT_REPOSITORY')
    private readonly restaurantRepository: Repository<Restaurant>
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const client = await this.clientRepository.findOneBy({
      id: createOrderDto.clientId
    })
    const restaurant = await this.restaurantRepository.findOneBy({
      id: createOrderDto.restaurantId
    })

    if (!client || !restaurant) {
      throw new Error('Client or Restaurant not found')
    }

    const order = this.orderRepository.create({
      description: createOrderDto.description,
      client,
      restaurant
    })

    return this.orderRepository.save(order)
  }

  async findAll(): Promise<Order[]> {
    return this.orderRepository.find({ relations: ['client', 'restaurant'] })
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['client', 'restaurant']
    })
    if (!order) throw new NotFoundException(`Order with ID ${id} not found`)
    return order
  }

  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const order = await this.findOne(id)
    if (updateOrderDto.description) {
      order.description = updateOrderDto.description
    }
    return this.orderRepository.save(order)
  }

  async remove(id: string): Promise<void> {
    const result = await this.orderRepository.delete(id)
    if (result.affected === 0)
      throw new NotFoundException(`Order with ID ${id} not found`)
  }
}
