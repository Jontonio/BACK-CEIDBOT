import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from './entities/course.entity';
import { MiddlewareConsumer } from '@nestjs/common/interfaces';
import { VerifyTokenMiddleware } from 'src/middlewares/verify-token/verify-token.middleware';
import { AppGateway } from 'src/socket/socket.gateway';

@Module({
  imports:[TypeOrmModule.forFeature([Course])],
  controllers: [CourseController],
  providers: [CourseService, AppGateway]
})
export class CourseModule {

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(VerifyTokenMiddleware).forRoutes(CourseController)
      // .forRoutes({ path:'teacher/add-teacher', method: RequestMethod.POST})
  }

}
