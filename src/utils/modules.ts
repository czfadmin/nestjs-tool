import fs from 'node:fs';
import {IModule, INestApplication, INestProject} from '../types/nest-cli';
import {l10n, QuickPickItem, Uri, window} from 'vscode';
import {joinPath, resolve} from './path';
import {statSync} from './fs';

/**
 * 列出指定项目(存在)的所有的模块
 * @param project
 */
export function getAllModules(
  application: INestApplication,
  project?: INestProject,
) {
  let modules: IModule[] = [];
  const targetPath = joinPath(
    application.workspace.uri.fsPath,
    application.name === 'root' ? '' : application.name,
    project ? project.root! : '',
    'src',
  );
  const allFiles = fs.readdirSync(targetPath);

  // 遍历目录下方的文件夹中是否存在module.ts/js 文件
  for (const file of allFiles) {
    const filePath = resolve(targetPath, file);
    if (statSync(filePath).isFile()) {
      continue;
    }
    const filesInDir = fs.readdirSync(filePath);
    for (const subFile of filesInDir) {
      if (/\w(.*?).module.(t|j)s/g.test(subFile)) {
        const moduleRoot = project ? `${project.sourceRoot}/${file}` : file;
        modules.push({
          name: file,
          moduleRoot,
          moduleEntry: `${moduleRoot}/${subFile}`,
          project: project,
        });
        break;
      }
    }
  }

  return modules;
}

export function getModulePickItems(modules: IModule[]): QuickPickItem[] {
  return [
    {
      label: 'None',
      description: 'None',
      detail: l10n.t('Do not select submodules and create them directly'),
    },
    ...modules.map(module => ({
      label: module.name,
      description: module.project ? module.project.name : '',
      detail: module.moduleEntry,
    })),
  ];
}

export function getModuleFromUri(uri: Uri) {}

export async function getModulesQuickPick(
  application: INestApplication,
  project?: INestProject,
) {
  const modules = getAllModules(application, project);
  if (!modules.length) {
    return;
  }

  const moduleQuickItems = getModulePickItems(modules);
  // 如果选择了一个module 将会在生成命令的时候追加到指定的module中
  const selectedModule = await window.showQuickPick(moduleQuickItems, {
    placeHolder: l10n.t('Please select a module'),
    matchOnDescription: true,
  });

  if (!selectedModule) {
    return;
  }
  return modules.find(module => module.name === selectedModule.label);
}
