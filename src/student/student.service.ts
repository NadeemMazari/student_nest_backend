import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Student } from './schema/student.schema';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './update-student.dto';

@Injectable()
export class StudentService {
  constructor(
    @InjectModel(Student.name) private studentModel: Model<Student>,
  ) {}

  // Helper function to transform Mongoose document
  private transformStudent(student: Student): any {
    const plainStudent = student.toObject();
    plainStudent._id = student._id.toString(); // Ensure _id is a string
    delete plainStudent.__v;
    return plainStudent;
  }

  async create(
    createStudentDto: CreateStudentDto,
  ): Promise<{ status: number; message: string; data: any }> {
    try {
      delete createStudentDto._id;

      const createdStudent = new this.studentModel(createStudentDto);
      const savedStudent = await createdStudent.save();
      return {
        status: 201,
        message: 'Student created successfully',
        data: this.transformStudent(savedStudent),
      };
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException(
          `Email ${createStudentDto.email} already exists`,
        );
      }
      throw new BadRequestException(
        `Failed to create student: ${error.message}`,
      );
    }
  }

  async findAll(query: {
    firstName?: string;
    lastName?: string;
    email?: string;
    page?: string;
    limit?: string;
  }): Promise<{
    status: number;
    message: string;
    data: any[];
    total: number;
    page: number;
    limit: number;
  }> {
    try {
      const filter: any = {};
      if (query.firstName)
        filter.firstName = { $regex: query.firstName, $options: 'i' };
      if (query.lastName)
        filter.lastName = { $regex: query.lastName, $options: 'i' };
      if (query.email) filter.email = { $regex: query.email, $options: 'i' };

      const page = parseInt(query.page || '1', 10);
      const limit = parseInt(query.limit || '10', 10);
      const skip = (page - 1) * limit;

      const total = await this.studentModel.countDocuments(filter).exec();
      const students = await this.studentModel
        .find(filter)
        .skip(skip)
        .limit(limit)
        .exec();

      const transformedStudents = students.map((student) =>
        this.transformStudent(student),
      );

      return {
        status: 200,
        message:
          transformedStudents.length > 0
            ? 'Students retrieved successfully'
            : 'No students found',
        data: transformedStudents,
        total,
        page,
        limit,
      };
    } catch (error) {
      throw new BadRequestException(
        `Failed to fetch students: ${error.message}`,
      );
    }
  }

  async findOne(
    id: string,
  ): Promise<{ status: number; message: string; data: any }> {
    try {
      const student = await this.studentModel.findById(id).exec();
      if (!student) {
        throw new NotFoundException(`Student with ID ${id} not found`);
      }
      return {
        status: 200,
        message: 'Student retrieved successfully',
        data: this.transformStudent(student),
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new BadRequestException(
        `Failed to fetch student: ${error.message}`,
      );
    }
  }

  async update(
    id: string,
    updateStudentDto: UpdateStudentDto,
  ): Promise<{ status: number; message: string; data: any }> {
    try {
      const updatedStudent = await this.studentModel
        .findByIdAndUpdate(id, updateStudentDto, { new: true })
        .exec();
      if (!updatedStudent) {
        throw new NotFoundException(`Student with ID ${id} not found`);
      }
      return {
        status: 200,
        message: 'Student updated successfully',
        data: this.transformStudent(updatedStudent),
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      if (error.code === 11000) {
        throw new BadRequestException(
          `Email ${updateStudentDto.email} already exists`,
        );
      }
      throw new BadRequestException(
        `Failed to update student: ${error.message}`,
      );
    }
  }

  async remove(
    id: string,
  ): Promise<{ status: number; message: string; data: null }> {
    try {
      const result = await this.studentModel.findByIdAndDelete(id).exec();
      if (!result) {
        throw new NotFoundException(`Student with ID ${id} not found`);
      }
      return {
        status: 200,
        message: `Student with ID ${id} deleted successfully`,
        data: null,
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new BadRequestException(
        `Failed to delete student: ${error.message}`,
      );
    }
  }
}
