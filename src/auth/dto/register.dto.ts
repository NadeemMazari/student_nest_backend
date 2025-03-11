import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ description: 'The firstname of the user', example: 'john' })
  @IsNotEmpty()
  firstname: string;

  @ApiProperty({ description: 'The lastname of the user', example: 'doe' })
  @IsNotEmpty()
  lastname: string;

  @ApiProperty({
    description: 'The email of the user',
    example: 'john@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'password123',
  })
  @IsNotEmpty()
  password: string;
}
