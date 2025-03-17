import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  HttpCode,
} from '@nestjs/common';
import { UserService, User } from './user.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  @UsePipes(new ValidationPipe())
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({
    status: 201,
    description: 'User registered successfully',
    schema: {
      example: {
        message: 'User registered successfully',
        user: {
          _id: '1234567890abcdef',
          firstname: 'John',
          lastname: 'Doe',
          email: 'john@example.com',
        },
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
    },
  })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  async register(
    @Body() registerDto: RegisterDto,
  ): Promise<{ message: string; user: Partial<User>; token: string }> {
    try {
      const user = await this.userService.createUser(registerDto);
      const { password, ...userData } = user.toObject();

      const loginDto: LoginDto = {
        email: registerDto.email,
        password: registerDto.password,
      };

      const { token } = await this.userService.loginUser(
        loginDto.email,
        loginDto.password,
      );

      return {
        message: 'User registered successfully',
        user: userData,
        token,
      };
    } catch (error) {
      throw error;
    }
  }

  @Post('login')
  @HttpCode(200)
  @UsePipes(new ValidationPipe())
  @ApiOperation({ summary: 'Login a user and return a JWT token' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    schema: {
      example: {
        message: 'Login successful',
        user: {
          _id: '1234567890abcdef',
          firstname: 'John',
          lastname: 'Doe',
          email: 'john@example.com',
        },
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(
    @Body() loginDto: LoginDto,
  ): Promise<{ message: string; user: Partial<User>; token: string }> {
    try {
      const { token, user } = await this.userService.loginUser(
        loginDto.email,
        loginDto.password,
      );
      const { password, ...userData } = user.toObject();

      return {
        message: 'Login successful',
        token,
        user: userData,
      };
    } catch (error) {
      throw error;
    }
  }
}
