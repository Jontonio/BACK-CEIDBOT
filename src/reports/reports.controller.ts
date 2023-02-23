import { Controller, Get } from '@nestjs/common';
import { Query } from '@nestjs/common/decorators';
import { PaginationQueryDto } from 'src/user/dto/pagination-query.dto';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('users')
  reportsUsers(@Query() pagination: PaginationQueryDto){
    return this.reportsService.generateReportUser(pagination);
  }

}
