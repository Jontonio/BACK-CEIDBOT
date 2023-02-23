import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { PaginationQueryDto } from 'src/user/dto/pagination-query.dto';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { AppGateway } from 'src/socket/socket.gateway';

@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService, private socketGateway: AppGateway) {}

  @Post('/add-course')
  create(@Body() createCourseDto: CreateCourseDto) {
    const resul = this.courseService.create(createCourseDto)
    this.socketGateway.server.emit('userCreated', resul);
    return resul;
  }

  @Get('/get-courses')
  findAll(@Query() pagination: PaginationQueryDto) {
    return this.courseService.findAll(pagination);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.courseService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto) {
    return this.courseService.update(+id, updateCourseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.courseService.remove(+id);
  }
}
