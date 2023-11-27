import { Body, Controller, Get, Post } from '@nestjs/common';
import { User } from '../entities';
import { OrganizeWebinar } from '../usecases/organize-webinar';
import { AppService } from './app.service';
import { addDays, addHours, parseISO } from 'date-fns';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly organizeWebinar: OrganizeWebinar,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Post('/webinars')
  async handleOrganizeWebinar(@Body() body: any) {
    return this.organizeWebinar.execute({
      user: new User({ id: 'john-doe' }),
      title: body.title,
      seats: body.seats,
      startDate: new Date(body.startDate),
      endDate: new Date(body.endDate),
    });
  }
}
