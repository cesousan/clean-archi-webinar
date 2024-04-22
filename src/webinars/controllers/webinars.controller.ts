import {
  Body,
  Controller,
  Delete,
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
import { ChangeDate } from '../usecases/change-date';
import { CancelWebinar } from '../usecases/cancel-webinar';
import { ReserveSeat } from '../usecases/reserve-seat';
import { CancelReservation } from '../usecases/cancel-reservation';

@Controller()
export class WebinarsController {
  constructor(
    private readonly organizeWebinar: OrganizeWebinar,
    private readonly changeSeats: ChangeSeats,
    private readonly changeDates: ChangeDate,
    private readonly cancelWebinar: CancelWebinar,
    private readonly reserveSeat: ReserveSeat,
    private readonly cancelReservation: CancelReservation,
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

  @HttpCode(200)
  @Post('/webinars/:id/dates')
  async handleChangeDates(
    @Param('id') webinarId: string,
    @Body(new ZodValidationPipe(WebinarAPI.ChangeDates.schema))
    body: WebinarAPI.ChangeDates.Request,
    @Request() request: { user: User },
  ): Promise<WebinarAPI.ChangeDates.Response> {
    return this.changeDates.execute({
      user: request.user,
      webinarId,
      startDate: body.startDate,
      endDate: body.endDate,
    });
  }

  @HttpCode(204)
  @Delete('/webinars/:id')
  async handleCancelWebinar(
    @Param('id') webinarId: string,
    @Request() request: { user: User },
  ): Promise<WebinarAPI.CancelWebinar.Response> {
    return this.cancelWebinar.execute({
      user: request.user,
      webinarId,
    });
  }

  @HttpCode(201)
  @Post('/webinars/:id/bookings')
  async handleReserveSeat(
    @Param('id') webinarId: string,
    @Request() request: { user: User },
  ): Promise<WebinarAPI.ReserveSeat.Response> {
    return this.reserveSeat.execute({
      user: request.user,
      webinarId,
    });
  }

  @HttpCode(204)
  @Delete('/webinars/:id/bookings')
  async handleCancelReservation(
    @Param('id') webinarId: string,
    @Request() request: { user: User },
  ): Promise<WebinarAPI.CancelReservation.Response> {
    return this.cancelReservation.execute({
      user: request.user,
      webinarId,
    });
  }
}
