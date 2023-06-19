import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';


export class UpdateTaskDto {
  @ApiProperty({ example: '', description: 'title' })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  title?: string;

  @ApiProperty({ example: '', description: 'description' })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  description?: string;
}
