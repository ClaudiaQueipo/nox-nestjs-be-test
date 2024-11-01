import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger'
import { CreateOrderDto } from './dto/create-order.dto'
import { UpdateOrderDto } from './dto/update-order.dto'
import { Order } from './entities/order.entity'
import { OrderService } from './order.service'
import { TOrderResponse } from './types/get-all-response.type'

@ApiBearerAuth()
@ApiTags('ORDER')
@Controller('order')
export class OrderController {
  constructor(private readonly ordersService: OrderService) {}

  @ApiOperation({
    summary: 'Create a new order',
    description: 'Creates a new order in the system.'
  })
  @ApiResponse({
    status: 201,
    description: 'Order created successfully.',
    type: Order
  })
  @ApiResponse({ status: 400, description: 'Bad Request. Validation errors.' })
  @ApiBody({ type: CreateOrderDto })
  @Post()
  async create(@Body() createOrderDto: CreateOrderDto): Promise<Order> {
    return this.ordersService.create(createOrderDto)
  }

  @Get()
  @ApiOperation({
    summary: 'Get all orders',
    description:
      'Retrieves a list of all orders with optional search and pagination.'
  })
  @ApiResponse({
    status: 200,
    description: 'List of orders retrieved successfully.',
    type: [Order]
  })
  @ApiQuery({
    name: 'clientName',
    required: false,
    description: 'Client name term for filtering orders.'
  })
  @ApiQuery({
    name: 'restaurantName',
    required: false,
    description: 'Restaurant name term for filtering orders.'
  })
  @ApiQuery({
    name: 'totalAmount',
    required: false,
    description: 'Total amount term for filtering orders.',
    type: Number
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number for pagination.',
    type: Number
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of orders per page.',
    type: Number
  })
  async findAll(
    @Query('clientName') clientName?: string,
    @Query('restaurantName') restaurantName?: string,
    @Query('totalAmount') totalAmount?: number,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10
  ): Promise<TOrderResponse> {
    const search = {
      ...(clientName && { clientName }),
      ...(restaurantName && { restaurantName }),
      ...(totalAmount !== undefined && { totalAmount })
    }

    return this.ordersService.findAll(search, page, limit)
  }

  @ApiOperation({
    summary: 'Get an order by ID',
    description: 'Retrieves an order by its ID.'
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID of the order to retrieve.'
  })
  @ApiResponse({
    status: 200,
    description: 'Order found.',
    type: Order
  })
  @ApiResponse({ status: 404, description: 'Order not found.' })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Order> {
    const order = await this.ordersService.findOne(id)
    if (!order) throw new NotFoundException(`Order with ID ${id} not found`)
    return order
  }

  @ApiOperation({
    summary: 'Update an order by ID',
    description: 'Updates an existing order by its ID.'
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID of the order to update.'
  })
  @ApiBody({ type: UpdateOrderDto })
  @ApiResponse({
    status: 200,
    description: 'Order updated successfully.',
    type: Order
  })
  @ApiResponse({ status: 404, description: 'Order not found.' })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto
  ): Promise<Order> {
    return await this.ordersService.update(id, updateOrderDto)
  }

  @ApiOperation({
    summary: 'Remove an order by ID',
    description: 'Deletes an order by its ID.'
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID of the order to delete.'
  })
  @ApiResponse({ status: 204, description: 'Order removed successfully.' })
  @ApiResponse({ status: 404, description: 'Order not found.' })
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return await this.ordersService.remove(id)
  }
}
