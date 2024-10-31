import { JwtAuthGuard } from '@modules/auth/jwt-auth.guard'
import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger'
import { CreateRestaurantDto } from './dto/create-restaurant.dto'
import { UpdateRestaurantDto } from './dto/update-restaurant.dto'
import { RestaurantService } from './restaurant.service'

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('RESTAURANT')
@Controller('restaurant')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @ApiOperation({
    summary: 'Create a restaurant',
    description: 'Creates a new restaurant in the system.'
  })
  @ApiResponse({
    status: 201,
    description: 'Restaurant created successfully.',
    type: CreateRestaurantDto
  })
  @ApiResponse({ status: 400, description: 'Bad Request. Validation errors.' })
  @ApiBody({ type: CreateRestaurantDto })
  @Post()
  async create(@Body() createRestaurantDto: CreateRestaurantDto) {
    return await this.restaurantService.create(createRestaurantDto)
  }

  @ApiOperation({
    summary: 'Add a client to a restaurant',
    description: 'Adds an existing client to a specified restaurant by ID.'
  })
  @ApiParam({
    name: 'restaurantId',
    required: true,
    description: 'ID of the restaurant to which the client will be added.'
  })
  @ApiParam({
    name: 'clientId',
    required: true,
    description: 'ID of the client to add to the restaurant.'
  })
  @ApiResponse({
    status: 200,
    description: 'Client added to the restaurant successfully.'
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request. Validation errors or capacity limit reached.'
  })
  @ApiResponse({
    status: 404,
    description: 'Restaurant or client not found.'
  })
  @Post(':restaurantId/add-client/:clientId')
  async addClientToRestaurant(
    @Param('restaurantId') restaurantId: string,
    @Param('clientId') clientId: string
  ) {
    return await this.restaurantService.addClientToRestaurant(
      restaurantId,
      clientId
    )
  }

  @ApiOperation({
    summary: 'Get all restaurants',
    description: 'Retrieves a list of all restaurants.'
  })
  @ApiResponse({
    status: 200,
    description: 'List of restaurants retrieved successfully.'
  })
  @Get()
  async findAll() {
    return await this.restaurantService.findAll()
  }

  @ApiOperation({
    summary: 'Get a restaurant by ID',
    description: 'Retrieves a restaurant by its ID.'
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID of the restaurant to retrieve.'
  })
  @ApiResponse({
    status: 200,
    description: 'Restaurant found.',
    type: CreateRestaurantDto
  })
  @ApiResponse({ status: 404, description: 'Restaurant not found.' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const restaurant = await this.restaurantService.findOne(id)
    if (!restaurant)
      throw new NotFoundException(`Restaurant with ID ${id} not found`)
    return restaurant
  }

  @ApiOperation({
    summary: 'Update a restaurant by ID',
    description: 'Updates an existing restaurant by its ID.'
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID of the restaurant to update.'
  })
  @ApiBody({ type: UpdateRestaurantDto })
  @ApiResponse({
    status: 200,
    description: 'Restaurant updated successfully.',
    type: UpdateRestaurantDto
  })
  @ApiResponse({ status: 404, description: 'Restaurant not found.' })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateRestaurantDto: UpdateRestaurantDto
  ) {
    return await this.restaurantService.update(id, updateRestaurantDto)
  }

  @ApiOperation({
    summary: 'Remove a restaurant by ID',
    description: 'Deletes a restaurant by its ID.'
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID of the restaurant to delete.'
  })
  @ApiResponse({ status: 204, description: 'Restaurant removed successfully.' })
  @ApiResponse({ status: 404, description: 'Restaurant not found.' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.restaurantService.remove(id)
  }
}
