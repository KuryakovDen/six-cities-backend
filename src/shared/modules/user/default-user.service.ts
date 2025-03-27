import {UserService} from './user-service.interface.js';
import {CreateUserDto} from './dto/create-user.dto.js';
import {UserEntity} from './user.entity.js';
import {inject, injectable} from 'inversify';
import {Component} from '../../types/component.enum.js';
import {Logger} from '../../libs/logger/logger.interface.js';
import {DocumentType, types} from '@typegoose/typegoose';
import {HttpError} from '../../libs/rest/errors/http-error.js';
import {StatusCodes} from 'http-status-codes';

@injectable()
export class DefaultUserService implements UserService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.UserModel) private readonly userModel: types.ModelType<UserEntity>
  ) {}

  public async create(dto: CreateUserDto, salt: string) {
    const user = new UserEntity(dto);
    user.setPassword(dto.password, salt);

    const result = await this.userModel.create(user);
    this.logger.info(`New user created: ${user.email}`);

    return result;
  }

  public async findByEmail(email: string) {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new HttpError(StatusCodes.NOT_FOUND, `User with email ${email} not found`);
    }
    return user as DocumentType<UserEntity>;
  }

  public async findOrCreate(dto: CreateUserDto, salt: string) {
    try {
      const existedUser = await this.findByEmail(dto.email);
      if (existedUser) {
        return existedUser;
      }

      return this.create(dto, salt);
    } catch (error) {
      throw new HttpError(StatusCodes.INTERNAL_SERVER_ERROR, 'Internal Server Error');
    }
  }
}
