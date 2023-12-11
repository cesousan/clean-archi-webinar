import { Body, Controller, Post, Request } from '@nestjs/common';

import { ZodValidationPipe } from '@webinar/core/pipes/zod-validation.pipe';
import { User } from '@webinar/users/entities';

import { WebinarAPI } from '../contract';
import { OrganizeWebinar } from '../usecases/organize-webinar';

@Controller()
export class WebinarsController {
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
