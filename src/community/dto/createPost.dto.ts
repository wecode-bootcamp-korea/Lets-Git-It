import { UploadedFile } from '@nestjs/common';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  readonly title: string;
  @IsNumber()
  @IsNotEmpty()
  readonly subCategoryId: number;
  @IsString()
  @IsNotEmpty()
  readonly content: string;
}
