import { inject, injectable } from 'inversify';
import { ExceptionFilter } from './exception-filter.interface.js';
import { Component } from '../../../types/component.enum.js';
import { Logger } from '../../logger/logger.interface.js';
import { HttpError } from '../errors/http-error.js';
import { NextFunction, Request, Response } from 'express';
import { createErrorObject } from '../../../helpers/createErrorObject.js';
import { StatusCodes } from 'http-status-codes';

@injectable()
export class AppExceptionFilter implements ExceptionFilter {
  constructor(@inject(Component.Logger) private readonly logger: Logger) {
    this.logger.info('Register AppExceptionFilter');
  }

  private handleHttpError(
    error: HttpError,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    this.logger.error(`[${error.detail}]: ${error.httpStatusCode} — ${error.message}`, error);

    res
      .status(error.httpStatusCode)
      .json(createErrorObject(error.message));
  }

  private handleOtherError(
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    this.logger.error(error.message, error);

    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(createErrorObject(error.message));
  }

  public catch(error: Error, req: Request, res: Response, next: NextFunction) {
    if (error instanceof HttpError) {
      this.handleHttpError(error, req, res, next);
      return;
    }

    this.handleOtherError(error, req, res, next);
  }
}
