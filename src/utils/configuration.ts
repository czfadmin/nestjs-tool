import {WorkspaceFolder} from 'vscode';
import fs from 'node:fs';
import {Configuration} from '../types/nest-cli';
import { readFileSync } from './fs';
import { joinPath } from './path';

const TSCONFIG_BUILD_JSON = 'tsconfig.build.json';
const TSCONFIG_JSON = 'tsconfig.json';

export function getDefaultTsconfigPath(rootDir: string) {
  return fs.existsSync(joinPath(rootDir, TSCONFIG_BUILD_JSON))
    ? TSCONFIG_BUILD_JSON
    : TSCONFIG_JSON;
}

function getDefaultConfiguration(folder: string) {
  return {
    language: 'ts',
    sourceRoot: 'src',
    collection: '@nestjs/schematics',
    entryFile: 'main',
    exec: 'node',
    projects: {},
    monorepo: false,
    compilerOptions: {
      builder: {
        type: 'tsc',
        options: {
          configPath: getDefaultTsconfigPath(folder),
        },
      },
      webpack: false,
      plugins: [],
      assets: [],
      manualRestart: false,
    },
    generateOptions: {},
  } as Required<Configuration>;
}

/**
 * 获取各个工作文件夹下面所有的nestjs-cli.json的数据
 *
 * @param folder
 * @param name
 * @returns
 */
export function loadNestConfiguration(
  folder: WorkspaceFolder | string,
  name: string,
) {
  const directory = typeof folder === 'string' ? folder : folder.uri.fsPath;
  let loadedConfig: Configuration = getDefaultConfiguration(directory);
  try {
    const content = readFileSync(joinPath(directory, name));
    const fileConfig = JSON.parse(content);
    if (fileConfig.compilerOptions) {
      loadedConfig = {
        ...loadedConfig,
        ...fileConfig,
        compilerOptions: {
          ...loadedConfig.compilerOptions,
          ...fileConfig.compilerOptions,
        },
      };
    } else {
      loadedConfig = {
        ...loadedConfig,
        ...fileConfig,
      };
    }
  } catch (error) {
    // @ts-ignore
    console.error(error.message);
  }

  return loadedConfig;
}
