
import { ExtensionContext, window, workspace ,extensions} from 'vscode';
import {ServiceManager} from './services';
export function activate(context: ExtensionContext) {
  if (!workspace.workspaceFolders) {
    return;
  }
  ServiceManager.initial(context);
}

export function deactivate() {}
