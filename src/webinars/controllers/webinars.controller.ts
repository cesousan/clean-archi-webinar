import {
  Body,
  Controller,
  HttpCode,
  Param,
  Post,
  Request,
} from '@nestjs/common';

import { ZodValidationPipe } from '@webinar/core/pipes/zod-validation.pipe';
import { User } from '@webinar/users/entities';

import { WebinarAPI } from '../contract';
import { ChangeSeats } from '../usecases/change-seats';
import { OrganizeWebinar } from '../usecases/organize-webinar';

@Controller()
export class WebinarsController {
  constructor(
    private readonly organizeWebinar: OrganizeWebinar,
    private readonly changeSeats: ChangeSeats,
  ) {}
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
  @HttpCode(200)
  @Post('/webinars/:id/seats')
  async handleChangeSeats(
    @Param('id') webinarId: string,
    @Body(new ZodValidationPipe(WebinarAPI.ChangeSeats.schema))
    body: WebinarAPI.ChangeSeats.Request,
    @Request() request: { user: User },
  ): Promise<WebinarAPI.ChangeSeats.Response> {
    return this.changeSeats.execute({
      user: request.user,
      webinarId,
      seats: body.seats,
    });
  }
}
