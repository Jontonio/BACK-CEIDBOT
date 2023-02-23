import { Module, RequestMethod } from '@nestjs/common';
import { TeacherService } from './teacher.service';
import { TeacherController } from './teacher.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Teacher } from './entities/teacher.entity';
import { MiddlewareConsumer } from '@nestjs/common/interfaces';
import { VerifyTokenMiddleware } from 'src/middlewares/verify-token/verify-token.middleware';
import { VerifyTeacherEmailMiddleware } from 'src/middlewares/verify-teacher-email/verify-teacher-email.middleware';
import { VerifyTeacherDocMiddleware } from 'src/middlewares/verify-teacher-doc/verify-teacher-doc.middleware';

@Module({
  imports:[TypeOrmModule.forFeature([Teacher])],
  controllers: [TeacherController],
  providers: [TeacherService]
})
export class TeacherModule {

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(VerifyTokenMiddleware).forRoutes(TeacherController)
      .apply(VerifyTeacherEmailMiddleware, VerifyTeacherDocMiddleware)
      .forRoutes({ path:'teacher/add-teacher', method: RequestMethod.POST})
  }
}
