import { ApiProperty } from '@nestjs/swagger';

export class RegisterResponseDto {
  @ApiProperty({
    description: 'Success message',
    example: 'User registered successfully',
  })
  message: string;

  @ApiProperty({ description: 'User details excluding password' })
  user: {
    _id: string;
    firstname: string;
    lastname: string;
    email: string;
  };
}
