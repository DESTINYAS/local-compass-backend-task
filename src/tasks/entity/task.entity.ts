import { Schema, model, Document } from 'mongoose';
import { User } from '../../users/entity/user.entity';

export interface Task extends Document {
  title: string;
  description: string;
  user: User['_id'];
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new Schema<Task>({
  title: String,
  description: String,
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const TaskModel = model<Task>('Task', taskSchema);
