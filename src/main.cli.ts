#!/usr/bin/env node
import 'reflect-metadata';

import {CliApplication} from './cli/cli-application.js';
import {VersionCommand} from './cli/commands/version.command.js';
import {HelpCommand} from './cli/commands/help.command.js';
import {ImportCommand} from './cli/commands/import.command.js';
import {GenerateCommand} from './cli/commands/generate.command.js';

function bootstrap() {
  const cliApplication = new CliApplication();

  cliApplication.registerCommands([
    new VersionCommand(),
    new HelpCommand(),
    new ImportCommand(),
    new GenerateCommand(),
  ]);

  cliApplication.processCommand(process.argv);
}

bootstrap();
