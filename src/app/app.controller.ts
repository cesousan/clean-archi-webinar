import { Body, Controller, Get, Post } from '@nestjs/common';

import { User } from '../entities';
import { ZodValidationPipe } from '../pipes/zod-validation.pipe';
import { OrganizeWebinar } from '../usecases/organize-webinar';

import { AppService } from './app.service';
import { WebinarAPI } from './contract';

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
  async handleOrganizeWebinar(
    @Body(new ZodValidationPipe(WebinarAPI.OrganizeWebinar.schema))
    body: WebinarAPI.OrganizeWebinar.Request,
  ): Promise<WebinarAPI.OrganizeWebinar.Response> {
    return this.organizeWebinar.execute({
      user: new User({
        id: 'john-doe',
        email: 'johndoe@gmail.com',
        password: 'azerty',
      }),
      title: body.title,
      seats: body.seats,
      startDate: body.startDate,
      endDate: body.endDate,
    });
  }
}
