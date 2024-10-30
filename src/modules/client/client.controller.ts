import { JwtAuthGuard } from '@modules/auth/jwt-auth.guard'
import {
  Body,
  Controller,
  Delete,
  Get,
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
import { ClientService } from './client.service'
import { CreateClientDto } from './dto/create-client.dto'
import { UpdateClientDto } from './dto/update-client.dto'

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('CLIENT')
@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @ApiOperation({
    summary: 'Create a client',
    description: 'Creates a new client in the system.'
  })
  @ApiResponse({
    status: 201,
    description: 'Client created successfully.',
    type: CreateClientDto
  })
  @ApiResponse({ status: 400, description: 'Bad Request. Validation errors.' })
  @ApiBody({ type: CreateClientDto })
  @Post()
  create(@Body() createClientDto: CreateClientDto) {
    return this.clientService.create(createClientDto)
  }

  @ApiOperation({
    summary: 'Get all clients',
    description: 'Retrieves a list of all clients.'
  })
  @ApiResponse({
    status: 200,
    description: 'List of clients retrieved successfully.'
  })
  @Get()
  findAll() {
    return this.clientService.findAll()
  }

  @ApiOperation({
    summary: 'Get one client by ID',
    description: 'Retrieves a client by its ID.'
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID of the client to retrieve.'
  })
  @ApiResponse({
    status: 200,
    description: 'Client found.',
    type: CreateClientDto
  })
  @ApiResponse({ status: 404, description: 'Client not found.' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clientService.findOne(id)
  }

  @ApiOperation({
    summary: 'Update a client by ID',
    description: 'Updates an existing client by its ID.'
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID of the client to update.'
  })
  @ApiBody({ type: UpdateClientDto })
  @ApiResponse({
    status: 200,
    description: 'Client updated successfully.',
    type: UpdateClientDto
  })
  @ApiResponse({ status: 404, description: 'Client not found.' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClientDto: UpdateClientDto) {
    return this.clientService.update(id, updateClientDto)
  }

  @ApiOperation({
    summary: 'Remove client by ID',
    description: 'Deletes a client by its ID.'
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID of the client to delete.'
  })
  @ApiResponse({ status: 204, description: 'Client removed successfully.' })
  @ApiResponse({ status: 404, description: 'Client not found.' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clientService.remove(id)
  }
}
