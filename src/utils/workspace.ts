import {QuickPickItem, workspace} from 'vscode';

export function getAllWorkspaceFolderQuickPickItems(): QuickPickItem[] {
  const workspaceFolders = workspace.workspaceFolders || [];
  return workspaceFolders.map(ws => ({
    label: ws.name,
    description: ws.uri.fsPath,
  }));
}
