#!/usr/bin/env node

import Enquirer from 'enquirer';
import { readdir } from 'fs/promises';
import Ora from 'ora';
import { homedir } from 'os';
import { join as joinPath } from 'path';
import { copyDirectory } from './copy-directory';

const cwd = process.cwd();
const templatePath = joinPath(homedir(), 'source', 'repos', 'templates');
const getTemplateNames = () => readdir(templatePath);

interface PromptAnswers {
  templateName: string;
  projectName: string;
}

// Hack: "limit" is not yet defined in Enquirer's type declarations for "autocomplete" prompt
// So we have to explictly cast to to the appropriate type
type PromptOptions = Parameters<typeof Enquirer.prompt>[0];

async function promptForAnswers(templateNames: string[]): Promise<PromptAnswers> {
  return Enquirer.prompt<PromptAnswers>([
    {
      name: 'templateName',
      type: 'autocomplete',
      message: 'Project template:',
      choices: templateNames,
      limit: 10,
    } as PromptOptions,
    {
      name: 'projectName',
      type: 'input',
      message: 'Project name (leave empty to use current directory):',
      initial: '',
    } as PromptOptions,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ] as any);
}

async function main() {
  const templateNames = await getTemplateNames();
  const { templateName, projectName } = await promptForAnswers(templateNames);
  const sourceDirPath = joinPath(templatePath, templateName);
  const targetDirPath = joinPath(cwd, projectName || '.');

  const spinner = Ora('Generating files').start();
  try {
    await copyDirectory(sourceDirPath, targetDirPath);
    spinner.succeed('Files generated');
  } catch (err) {
    spinner.fail(`Failed to generate files - ${err.message}`);
    process.exit(1);
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
