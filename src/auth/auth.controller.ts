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
import { RegisterResponseDto } from './dto/register-response.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private userService: UserService) {}

  @Post('register')
  @UsePipes(new ValidationPipe())
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: RegisterDto })
  async register(@Body() registerDto: RegisterDto): Promise<any> {
    try {
      const user: User = await this.userService.createUser(registerDto);
      const { password, ...userData } = user.toObject();

      const loginDto: LoginDto = {
        email: registerDto.email,
        password: registerDto.password,
      };

      const { token } = await this.userService.loginUser(loginDto);

      return {
        message: 'User registered successfully',
        user: user,
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
  async login(@Body() loginDto: LoginDto): Promise<any> {
    try {
      const { token, user } = await this.userService.loginUser(loginDto);
      return {
        message: 'Login successful',
        token,
        user: user,
      };
    } catch (error) {
      throw error;
    }
  }
}
