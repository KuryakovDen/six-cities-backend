import {Expose} from 'class-transformer';
import {UserVariant} from '../../../types/user.type.js';

export class UserRdo {
  @Expose()
  public name: string;

  @Expose()
  public email: string;

  @Expose()
  public avatar: string;

  @Expose()
  public userType: UserVariant;
}
