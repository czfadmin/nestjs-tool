import {commands, Uri, window, workspace} from 'vscode';

export async function formatTextDocument(uri: Uri) {
  return workspace
    .openTextDocument(uri)
    .then(doc => {
      return window.showTextDocument(doc);
    })
    .then(() => {
      return commands.executeCommand('editor.action.formatDocument');
    });
}
