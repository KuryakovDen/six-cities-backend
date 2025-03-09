import {Logger} from '../shared/libs/logger/logger.interface.js';
import {Config} from '../shared/libs/config/config.interface.js';
import {RestSchema} from '../shared/libs/config/rest.schema.js';
import {inject, injectable} from 'inversify';
import {Component} from '../shared/types/component.enum.js';
import {DatabaseClient} from '../shared/libs/database-client/database-client.interface.js';
import {getMongoURI} from '../shared/helpers/getMongoURI.js';
import {UserModel} from '../shared/modules/user/user.model.js';

@injectable()
export class RestApplication {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.Config) private readonly config: Config<RestSchema>,
    @inject(Component.DatabaseClient) private readonly databaseClient: DatabaseClient
  ) {}

  private async initDb() {
    const mongoUri = getMongoURI(
      this.config.get('DB_USERNAME'),
      this.config.get('DB_PASSWORD'),
      this.config.get('DB_HOST'),
      this.config.get('DB_PORT'),
      this.config.get('DB_NAME'),
    );

    return this.databaseClient.connect(mongoUri);
  }

  public async init() {
    this.logger.info('RestApplication initialized.');
    this.logger.info(`Get value from env $PORT: ${this.config.get('PORT')}`);

    this.logger.info('Init MongoDB server...');
    await this.initDb();
    this.logger.info('Init MongoDB server completed.');

    const user = await UserModel.create({
      name: 'Alisa',
      userType: 'standard',
      email: 'lisina@gmail.com',
      password: 'tbhfrmrrrr',
    });

    console.log(user);
  }
}
