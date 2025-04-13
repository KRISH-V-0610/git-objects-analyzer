#!/usr/bin/env node
import { startServer } from '../src/server.js';
import { program } from 'commander';
import chalk from 'chalk';

program
  .version('1.0.0')
  .description('Launch Git Objects Analyzer GUI')
  .argument('[path]', 'Git repository path', process.cwd())
  .option('-p, --port <number>', 'Port number', '3006')
  .action(async (repoPath, options) => {
    try {
      const { url } = await startServer(repoPath, options.port);
      // console.log(chalk.green(`Server running at ${url}`));
      console.log(chalk.yellow('Press Ctrl+C to stop'));
    } catch (error) {
      console.error(chalk.red('Error:', error.message));
      process.exit(1);
    }
  });

program.parse();