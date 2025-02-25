import {Config} from './config.interface.js';
import {Logger} from '../logger/logger.interface.js';
import {config, DotenvParseOutput} from 'dotenv';

export class RestConfig implements Config {
  private readonly config: NodeJS.ProcessEnv;

  constructor(private readonly logger: Logger) {
    const parsedOutput = config();

    if (parsedOutput.error) {
      throw new Error('Can\'t read .env file. Perhaps the file does not exists.');
    }

    this.config = <DotenvParseOutput>parsedOutput.parsed;
    this.logger.info('.env file found and successfully parsed!');
  }

  public get(key: string) {
    return this.config[key];
  }
}
