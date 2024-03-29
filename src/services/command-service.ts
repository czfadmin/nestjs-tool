import {
  commands,
  Disposable,
  ExtensionContext,
  l10n,
  Terminal,
  window,
} from 'vscode';
import {ServiceManager} from './service-manager';
import {EXTENSION_ID, EXTENSION_TERMINAL_NAME} from '../constants';
import {COMMANDS} from '../constants';

export default class CommandService implements Disposable {
  private _context: ExtensionContext;

  private _terminal: Terminal;

  constructor(private sm: ServiceManager) {
    const {shouldExecute} = this.sm.configService.configuration;

    this._context = this.sm.context;

    this._terminal =
      window.terminals.find(it => it.name == EXTENSION_TERMINAL_NAME) ||
      window.createTerminal({
        name: EXTENSION_TERMINAL_NAME,
        hideFromUser: shouldExecute,
      });

    this._initial();
  }

  private _initial() {
    const self = this;
    COMMANDS.forEach(cmd => {
      const {callback: _callback, ...rest} = cmd;
      const options = {...rest, logger: self.sm.logger};
      this.registerCommand(options.name, async (ctx, args) => {
        if (options.needInput) {
          const userInput = await this.showInputBox(
            options.alias,
            ctx,
            ...args,
          );
          if (!userInput || !userInput.length) {
            return;
          }

          // const result = await _callback(ctx, options, userInput);
          // if (result) {
          // }
          self._executeCommand(options.alias, userInput);
        } else {
          self._executeCommand(options.alias);
        }
      });
    });
  }

  async showInputBox(alias: string, ...args: any[]) {
    const input = await window.showInputBox({
      placeHolder: l10n.t(
        'Please enter the name and optional parameters, separated by spaces, such as: application --dry-run',
      ),
    });
    if (!input) {
      window.showInformationMessage(l10n.t('Canceled'));
      return;
    }
    return input;
  }

  registerCommand(
    name: string,
    callback: (ctx: ExtensionContext, ...args: any[]) => void,
  ) {
    this._context.subscriptions.push(
      commands.registerCommand(`${EXTENSION_ID}.${name}`, callback),
    );
  }

  private _executeCommand(alias: string, ...args: any[]) {
    const {showTerminal, shouldExecute} = this.sm.configService.configuration;
    if (
      this._terminal.exitStatus &&
      this._terminal.exitStatus.code === undefined
    ) {
      this._terminal = window.createTerminal({
        name: EXTENSION_TERMINAL_NAME,
        hideFromUser: shouldExecute,
      });
    }
    this._terminal.sendText(`nest g ${alias} ${args.join(' ')}`);
    if (showTerminal) {
      this._terminal.show();
    }
  }

  dispose() {
    this._terminal.dispose();
    this._context.subscriptions.forEach(it => it.dispose());
  }
}
