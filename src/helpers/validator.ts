import * as Yup from 'yup';
import { Request, Response, NextFunction } from 'express';
import { BadRequestError } from '../core/ApiError';

export enum ValidationSource {
  Body = 'body',
  Header = 'headers',
  Query = 'query',
  Param = 'params'
}

export default (schema: Yup.ObjectSchema<any>, source = ValidationSource.Body) => (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(req[source], req.file);
  schema.validate(req[source])
    .then(() => next())
    .catch(e => {
      console.log(e.errors);
      const message = e.errors.join(', ');
      next(new BadRequestError(message));
    })
}
