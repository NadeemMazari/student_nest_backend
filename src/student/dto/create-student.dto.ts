import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsDateString, IsNotEmpty } from 'class-validator';

export class CreateStudentDto {
  _id:any
  @ApiProperty({ example: 'Jane' })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ example: '2000-01-01' })

  @IsNotEmpty()
  dateOfBirth: string;

  @ApiProperty({ example: 'jane.doe@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: '1234567890' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ example: '456 Elm St' })
  @IsString()
  @IsNotEmpty()
  address: string;
}
