import fs from 'node:fs';
import {l10n, QuickPickItem, Uri, window, workspace} from 'vscode';
import fg from 'fast-glob';
import {IModule, INestApplication, INestProject} from '../types/nest-cli';
import {joinPath, resolve} from './path';
import {statSync} from './fs';
import {getApplicationFromUri} from './application';
import {getProjectFromUri} from './project';
import path from 'node:path';

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
    if (file === 'app.module.ts') {
      modules.push({
        name: 'app',
        moduleRoot: project ? `${project.sourceRoot}/app` : 'app',
        moduleEntry: `${project ? project.sourceRoot + '/' : ''}app.module.ts`,
        project: project,
      });
      continue;
    }
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

  return await getModulesQuickPick2(modules);
}

export async function getModulesQuickPick2(modules: IModule[]) {
  if (modules.length === 0) {
    return;
  }
  if (modules.length === 1) {
    return modules[0];
  }

  const moduleQuickItems = getModulePickItems(modules);
  // 如果选择了一个module将会在生成命令的时候追加到指定的module中
  const selectedModule = await window.showQuickPick(moduleQuickItems, {
    placeHolder: l10n.t('Please select a module'),
    matchOnDescription: true,
  });

  if (!selectedModule) {
    return;
  }

  if (selectedModule.label === 'None') {
    return modules[0];
  }
  return modules.find(module => module.name === selectedModule.label);
}

export async function checkoutFolderIsModule(project?: INestProject, p?: Uri) {
  if (!p) {
    return;
  }

  if (fs.statSync(p.fsPath).isFile()) {
    return;
  }

  let _modules: IModule[] = [];

  // 从当前的项目中的sourceRoot下选择对应的module出来
  const entries = fg.globSync([`**/*.module.(t|j)s`], {
    cwd: !project ? p.fsPath : Uri.joinPath(p, project.name).fsPath,
    deep: 4,
    dot: false,
    absolute: true,
  });

  if (entries.length) {
    const application = await getApplicationFromUri(p);
    const project = await getProjectFromUri(p, application);
    for (let entry of entries) {
      const arr = entry.split('/');
      const name = arr[arr.length - 1].split('.')[0];
      _modules.push({
        name,
        moduleRoot: p.fsPath,
        moduleEntry: entry,
        project: project,
      });
    }
  }
  console.log(_modules);
  return _modules;
}
