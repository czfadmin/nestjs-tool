import path from 'path';
import {workspace, QuickPickItem, Uri, window, l10n} from 'vscode';
import {INestApplication} from '../types';
import {loadNestConfiguration} from './configuration';
import {exclude_dirs, config_files} from '../constants';
import {resolve} from './path';
import {existsSync, readdirSync, statSync} from './fs';

/**
 * 根据工作文件夹检测当前文件夹是否为一个nestjs应用
 * @param folder
 * @returns
 */
export function checkIsNestApplication(folder: string): string {
  let configFileName = '';
  for (const configFile of config_files) {
    if (existsSync(path.resolve(folder, configFile))) {
      configFileName = configFile;
      break;
    }
  }
  return configFileName;
}

/**
 *  判断当前文件夹夹是否为nest应用
 * @param uri
 * @returns
 */
export function judgeFolderIsApplication(uri?: Uri) {
  if (!uri) {
    return false;
  }
  return checkIsNestApplication(uri.fsPath).length !== 0;
}

/**
 * 读取对应的工作区间目录获取所有的nest应用
 */
export async function getAllNestApplications() {
  const apps: INestApplication[] = [];
  const workspaceFolders = workspace.workspaceFolders || [];
  if (!workspaceFolders.length) {
    return apps;
  }

  for (let wsFolder of workspaceFolders) {
    const wsPath = wsFolder.uri.fsPath;
    const wsDirs = readdirSync(wsPath);
    for (const dir of wsDirs) {
      if (exclude_dirs.includes(dir)) {
        continue;
      }
      const dirPath = resolve(wsPath, dir);

      if (config_files.includes(dir)) {
        const configuration = loadNestConfiguration(wsFolder, dir);
        apps.push({
          name: 'root',
          workspace: wsFolder,
          configuration,
        });
        continue;
      }
      // 判断当前的文件中是否存在 nestjs的配置文件, 如果存在就表明当前文件夹是一个nestjs应用
      if (dirPath && statSync(dirPath).isDirectory()) {
        const configFilename = checkIsNestApplication(dirPath);
        if (configFilename) {
          apps.push({
            name: dir,
            workspace: wsFolder,
            configuration: loadNestConfiguration(dirPath, configFilename),
          });
          continue;
        }
      }
    }
  }
  return apps;
}

export function getApplicationQuickPickItems(
  apps: INestApplication[],
): QuickPickItem[] {
  return apps.map(app => ({
    label: app.name,
    description: 'Application',
    detail: app.configuration.sourceRoot,
  }));
}

export async function getApplicationFromUri(uri: Uri) {
  const applications = await getAllNestApplications();
  const workspaceFolder = workspace.getWorkspaceFolder(uri);
  return applications.find(it => {
    return (
      it.workspace === workspaceFolder &&
      uri.fsPath.includes(it.workspace.uri.fsPath)
    );
  });
}

export async function showApplicationQuickPick() {
  let apps: INestApplication[] = await getAllNestApplications();
  const appQuickItems = getApplicationQuickPickItems(apps);
  const selectedAppPickItem = await window.showQuickPick(appQuickItems, {
    placeHolder: l10n.t('Please select an app'),
    matchOnDescription: true,
  });
  if (!selectedAppPickItem) {
    return;
  }
  return apps.find(app => app.name === selectedAppPickItem.label);
}
