import {
  l10n,
  QuickPickItem,
  Uri,
  window,
  workspace,
  WorkspaceFolder,
} from 'vscode';
import fs from 'node:fs';
import path from 'node:path';
import {COMMANDS} from '../constants';

/**
 * 判断当前的上下文是否为一个 Nestjs 的app
 * @param folderUri
 */
export function judgeIsSubApp(folderUri: Uri) {
  return false;
}

/**
 * 判断当前文件夹是否是一个模块
 * @param folderUri
 * @returns
 */
export function judgeIsModule(folderUri: Uri) {
  return false;
}

/**
 * 读取当前工作区间的subapp或者mononrepo 中的app
 */
export function showSubAppQuickPicker() {}

export async function showCommandsQuickPick() {
  const generateOptQuickItems: QuickPickItem[] = COMMANDS.map(it => {
    return {
      label: it.description,
      description: it.name,
    };
  });
  const selectedOperation = await window.showQuickPick(generateOptQuickItems, {
    placeHolder: l10n.t('Please select a operation'),
    matchOnDescription: true,
  });

  if (!selectedOperation) {
    return;
  }
  return COMMANDS.find(it => it.name === selectedOperation.description);
}
