import {PinoLogger} from './shared/libs/logger/pino.logger.js';
import {RestApplication} from './rest/rest.application.js';
import {RestConfig} from './shared/libs/config/rest.config.js';
import {Container} from 'inversify';
import {Component} from './shared/types/component.enum.js';
import {Logger} from './shared/libs/logger/logger.interface.js';
import {Config} from './shared/libs/config/config.interface.js';
import {RestSchema} from './shared/libs/config/rest.schema.js';


async function bootstrap() {
  const container = new Container();

  container.bind<RestApplication>(Component.RestApplication).to(RestApplication).inSingletonScope();
  container.bind<Logger>(Component.Logger).to(PinoLogger).inSingletonScope();
  container.bind<Config<RestSchema>>(Component.Config).to(RestConfig).inSingletonScope();

  const application = container.get<RestApplication>(Component.RestApplication);
  await application.init();
}

bootstrap();
