import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, UpdateQuery } from 'mongoose';
import { Task, TaskDocument } from './entity/task.schema';
import { User, UserDocument } from '../users/entity/user.schema';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<TaskDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async createTask(userId: string, createTaskDto: CreateTaskDto): Promise<TaskDocument> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const { title, description } = createTaskDto;
    const task = new this.taskModel({ title, description, user });
    return task.save();
  }

  async getTaskById(userId: string, taskId: string): Promise<TaskDocument> {
    const task = await this.taskModel.findOne({ _id: taskId, user: userId });
    if (!task) {
      throw new NotFoundException(`Task with ID ${taskId} not found`);
    }
    return task;
  }

  async getAllTasks(userId: string): Promise<TaskDocument[]> {
    return this.taskModel.find({ user: userId });
  }

  async updateTask(userId: string, taskId: string, updateTaskDto: UpdateTaskDto): Promise<TaskDocument> {
    const task = await this.getTaskById(userId, taskId);
    const update: UpdateQuery<TaskDocument> = {};

    if (updateTaskDto.title) {
      update.title = updateTaskDto.title;
    }

    if (updateTaskDto.description) {
      update.description = updateTaskDto.description;
    }

    return this.taskModel.findByIdAndUpdate(taskId, update, { new: true });
  }

  async deleteTask(userId: string, taskId: string): Promise<void> {
    await this.taskModel.deleteOne({ _id: taskId, user: userId });
  }
}
