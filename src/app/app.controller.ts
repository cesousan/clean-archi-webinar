import { Body, Controller, Post, Request } from '@nestjs/common';

import { User } from '../entities';
import { ZodValidationPipe } from '../pipes/zod-validation.pipe';
import { OrganizeWebinar } from '../usecases/organize-webinar';

import { WebinarAPI } from './contract';

@Controller()
export class AppController {
  constructor(private readonly organizeWebinar: OrganizeWebinar) {}
  @Post('/webinars')
  async handleOrganizeWebinar(
    @Body(new ZodValidationPipe(WebinarAPI.OrganizeWebinar.schema))
    body: WebinarAPI.OrganizeWebinar.Request,
    @Request() request: { user: User },
  ): Promise<WebinarAPI.OrganizeWebinar.Response> {
    return this.organizeWebinar.execute({
      user: request.user,
      title: body.title,
      seats: body.seats,
      startDate: body.startDate,
      endDate: body.endDate,
    });
  }
}
