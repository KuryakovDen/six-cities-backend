import {BaseController} from '../../libs/rest/controller/base-controller.abstract.js';
import {inject, injectable} from 'inversify';
import {Component} from '../../types/component.enum.js';
import {Logger} from '../../libs/logger/logger.interface.js';
import {UserService} from './user-service.interface.js';
import {Config} from '../../libs/config/config.interface.js';
import {RestSchema} from '../../libs/config/rest.schema.js';
import {logger} from '@typegoose/typegoose/lib/logSettings.js';
import {HttpMethod} from '../../types/http-method.enum.js';
import {CreateUserRequest} from './create-user-request.type.js';
import {Response} from 'express';
import {StatusCodes} from 'http-status-codes';
import {HttpError} from '../../libs/rest/errors/http-error.js';
import {fillDTO} from '../../helpers/fillDTO.js';
import {UserRdo} from './rdo/user.rdo.js';
import {LoginUserRequest} from './login-user-request.type.js';

@injectable()
export class UserController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly log: Logger,
    @inject(Component.UserService) private readonly userService: UserService,
    @inject(Component.Config) private readonly config: Config<RestSchema>,
  ) {
    super(logger);
    this.logger.info('Register routes for UserController…');

    this.addRoute({ path: '/register', method: HttpMethod.Post, handler: this.create });
    this.addRoute({ path: '/check', method: HttpMethod.Get, handler: this.check });
    this.addRoute({ path: '/login', method: HttpMethod.Post, handler: this.login });
    this.addRoute({ path: '/logout', method: HttpMethod.Post, handler: this.logout });
    this.addRoute({ path: '/:id/avatar', method: HttpMethod.Post, handler: this.downloadAvatar });
  }

  public async create(
    { body }: CreateUserRequest,
    res: Response,
  ): Promise<void> {
    const existsUser = await this.userService.findByEmail(body.email);

    if (existsUser) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `User with email «${body.email}» exists.`,
        UserController.name
      );
    }

    const result = await this.userService.create(body, this.config.get('SALT'));
    this.created(res, fillDTO(UserRdo, result));
  }

  public async check() {
    throw new HttpError(
      StatusCodes.NOT_IMPLEMENTED,
      'Not implemented',
      UserController.name,
    );
  }

  public async login(
    { body }: LoginUserRequest,
    _res: Response,
  ) {
    const existsUser = await this.userService.findByEmail(body.email);

    if (! existsUser) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        `User with email ${body.email} not found.`,
        UserController.name,
      );
    }

    throw new HttpError(
      StatusCodes.NOT_IMPLEMENTED,
      'Not implemented',
      UserController.name,
    );
  }

  public async logout() {
    throw new HttpError(
      StatusCodes.NOT_IMPLEMENTED,
      'Not implemented',
      UserController.name,
    );
  }

  public downloadAvatar() {
    throw new HttpError(
      StatusCodes.NOT_IMPLEMENTED,
      'Not implemented',
      UserController.name,
    );
  }
}
