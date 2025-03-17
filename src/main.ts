// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
// import { ValidationPipe } from '@nestjs/common';
// import * as dotenv from 'dotenv';
// import * as cors from 'cors';

// dotenv.config();

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);

//   // Enable CORS
//   app.use(
//     cors({
//       origin: '*', // Allow all origins
//       methods: ['GET', 'POST', 'PATCH', 'PUT', 'UPDATE', 'DELETE'], // Allowed HTTP methods
//       allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
//     }),
//   );

//   app.setGlobalPrefix('api');
//   app.useGlobalPipes(new ValidationPipe());

//   // Swagger Configuration
//   const config = new DocumentBuilder()
//     .setTitle('Student CRUD API')
//     .setDescription('API for managing student biodata')
//     .setVersion('1.0')
//     .addSecurity('JWT-Auth', {
//       type: 'apiKey',
//       in: 'header',
//       name: 'Authorization', // Allows entering token directly
//     })
//     .build();

//   const document = SwaggerModule.createDocument(app, config);
//   SwaggerModule.setup('student_api/swagger', app, document);

//   const port = process.env.PORT || 3000;
//   await app.listen(port);
//   console.log(`Application is running on: http://localhost:${port}`);
// }

// bootstrap();

import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Set global prefix
  app.setGlobalPrefix('api');

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Student API')
    .setDescription('API documentation for student management')
    .setVersion('1.0')
    .addBearerAuth() // ✅ Enable JWT Authentication in Swagger
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document); // Swagger URL: http://localhost:3000/swagger

  await app.listen(3000);
}
bootstrap();
