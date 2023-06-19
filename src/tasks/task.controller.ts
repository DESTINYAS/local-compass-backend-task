import {
  Controller,
  UseGuards,
  Request,
  Body,
  Param,
  Get,
  Post,
  Put,
  Delete,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  HttpStatus,
  BadGatewayException,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entity/task.entity';
import { JwtStrategy } from '../auth-middleware/jwt-strategy';
import { CurrentUser } from '../auth-middleware/current-user.decorator';
import { User } from '../users/entity/user.entity';
import { ApiBearerAuth, ApiParam, ApiOperation } from '@nestjs/swagger';
import { ApiTags, ApiResponse, ApiBadRequestResponse, ApiInternalServerErrorResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth-middleware/jwt-auth.guard';

@ApiTags('tasks')
@Controller('tasks')
@ApiBearerAuth()
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Task created successfully' })
  @ApiBadRequestResponse({ description: 'Failed to create task' })
  async createTask(
    @CurrentUser() user: User,
    @Body() createTaskDto: CreateTaskDto,
  ): Promise<Task> {
    try {
      console.log(user);
      return await this.taskService.createTask(user.id, createTaskDto);
    } catch (error) {
      throw new BadGatewayException('Failed to create task');
    }
  }
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    description:
      'Returns all tasks created by a particular logged in user.',
  })
  @Get()
  @ApiResponse({ status: HttpStatus.OK, description: 'Tasks retrieved successfully'})
  @ApiBadRequestResponse({ description: 'Failed to retrieve tasks' })
  async getAllTasks(@CurrentUser() user: User): Promise<Task[]> {
    try {
      return await this.taskService.getAllTasks(user._id);
    } catch (error) {
      throw new InternalServerErrorException('Failed to retrieve tasks');
    }
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    description:
      'Returns a particular task of which the id is provided.',
  })
  @Get(':id')
  @ApiResponse({ status: HttpStatus.OK, description: 'Task retrieved successfully'})
  @ApiBadRequestResponse({ description: 'Failed to retrieve task' })
  async getTaskById(@CurrentUser() user: User, @Param('id') id: string): Promise<Task> {
    try {
      const task = await this.taskService.getTaskById(user._id, id);
      if (!task) {
        throw new NotFoundException('Task not found');
      }
      return task;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to retrieve task');
    }
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    description:
      'updates a particular task.',
  })
  @Put(':id')
  @ApiResponse({ status: HttpStatus.OK, description: 'Task updated successfully'})
  @ApiBadRequestResponse({ description: 'Failed to update task' })
  async updateTask(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    try {
      const updatedTask = await this.taskService.updateTask(user._id, id, updateTaskDto);
      if (!updatedTask) {
        throw new NotFoundException('Task not found');
      }
      return updatedTask;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update task');
    }
  }

  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    description:
      'deletes a particular task.',
  })
  @Delete(':id')
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Task deleted successfully' })
  @ApiBadRequestResponse({ description: 'Failed to delete task' })
  async deleteTask(@CurrentUser() user: User, @Param('id') id: string): Promise<void> {
    try {
      const deleted = await this.taskService.deleteTask(user._id, id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to delete task');
    }
  }
}
