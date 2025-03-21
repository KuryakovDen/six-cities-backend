import {Logger} from '../shared/libs/logger/logger.interface.js';
import {Config} from '../shared/libs/config/config.interface.js';
import {RestSchema} from '../shared/libs/config/rest.schema.js';
import {inject, injectable} from 'inversify';
import {Component} from '../shared/types/component.enum.js';
import {DatabaseClient} from '../shared/libs/database-client/database-client.interface.js';
import {getMongoURI} from '../shared/helpers/getMongoURI.js';
import express, {Express} from 'express';

@injectable()
export class RestApplication {
  private readonly server: Express;

  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.Config) private readonly config: Config<RestSchema>,
    @inject(Component.DatabaseClient) private readonly databaseClient: DatabaseClient
  ) {
    this.server = express();
  }

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

  private async _initServer() {
    const port = this.config.get('SERVER_PORT');

    this.server.listen(port);
  }

  public async init() {
    this.logger.info('RestApplication initialized.');
    this.logger.info(`Get value from env $PORT: ${this.config.get('PORT')}`);

    this.logger.info('Init MongoDB server...');
    await this.initDb();
    this.logger.info('Init MongoDB server completed.');

    this.logger.info('Try to init server...');
    await this._initServer();
    this.logger.info(`🚀 Server started on http://localhost:${this.config.get('SERVER_PORT')}`);
  }
}
