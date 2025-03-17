// // src/auth/user.service.ts
// import {
//   Injectable,
//   ConflictException,
//   UnauthorizedException,
// } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model, Document } from 'mongoose';
// import * as bcrypt from 'bcrypt';
// import { JwtService } from '@nestjs/jwt';
// import { RegisterDto } from './dto/register.dto';
// import { LoginDto } from './dto/login.dto';

// export interface User extends Document {
//   firstname: string;
//   lastname: string;
//   email: string;
//   password: string;
// }

// @Injectable()
// export class UserService {
//   constructor(
//     @InjectModel('User') private userModel: Model<User>,
//     private jwtService: JwtService,
//   ) {}

//   async createUser(registerDto: RegisterDto): Promise<User> {
//     const { email, password } = registerDto;
//     const existingUser = await this.userModel.findOne({ email });
//     if (existingUser) {
//       throw new ConflictException('Email already exists');
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const newUser = new this.userModel({
//       ...registerDto,
//       password: hashedPassword,
//     });
//     return newUser.save();
//   }

//   async loginUser(
//     email: string,
//     password: string,
//   ): Promise<{ token: string; user: User }> {
//     const user = await this.userModel.findOne({ email });
//     if (!user) {
//       throw new UnauthorizedException('Invalid credentials');
//     }

//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid) {
//       throw new UnauthorizedException('Invalid credentials');
//     }

//     const token = this.jwtService.sign(
//       { userId: user._id },
//       { secret: 'your-secret-key' },
//     );
//     return { token, user };
//   }
// }

import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Document } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

export interface User extends Document {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private userModel: Model<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async createUser(registerDto: RegisterDto): Promise<User> {
    const { email, password } = registerDto;
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new this.userModel({
      ...registerDto,
      password: hashedPassword,
    });
    return newUser.save();
  }

  async loginUser(
    email: string,
    password: string,
  ): Promise<{ token: string; user: User }> {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.jwtService.sign(
      { userId: user._id },
      {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: '1h',
      },
    );
    return { token, user };
  }
}
