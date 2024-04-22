import { Executable } from '@webinar/shared/executable';
import { WebinarDTO } from '../dto/webinar.dto';
import { WebinarNotFoundException } from '../exceptions';

export type Request = { id: string };
export type Response = WebinarDTO;
export class GetWebinarById implements Executable<Request, Response> {
  async execute(request: Request): Promise<WebinarDTO> {
    throw new WebinarNotFoundException();
  }
}
