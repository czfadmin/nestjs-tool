import {
  commands,
  Disposable,
  ExtensionContext,
  l10n,
  Terminal,
  TerminalShellExecution,
  Uri,
  window,
} from 'vscode';
import {ServiceManager} from './service-manager';
import {
  COMMON_COMMANDS,
  EXTENSION_ID,
  EXTENSION_TERMINAL_NAME,
} from '../constants';
import {COMMANDS} from '../constants';
import {
  checkoutFolderIsModule,
  getModulesQuickPick,
  getModulesQuickPick2,
  getProjectFromUri,
  resolve,
  showCommandsQuickPick,
  showProjectQuickPick,
} from '../utils';
import {
  IModule,
  INestApplication,
  INestCommand,
  INestProject,
  NestGenerateAlias,
} from '../types';
import {
  getApplicationFromUri,
  showApplicationQuickPick,
} from '../utils/application';
import {LoggerService} from './logger-service';

export default class CommandService implements Disposable {
  private _context: ExtensionContext;

  private _terminal?: Terminal;

  private _execution: TerminalShellExecution | null = null;

  private _logger: LoggerService;

  private _disposers: Disposable[] = [];
  private get configuration() {
    return this.sm.configService.configuration;
  }

  constructor(private sm: ServiceManager) {
    const {shouldExecute} = this.sm.configService.configuration;

    this._context = this.sm.context;
    this._logger = LoggerService.createFactory(CommandService);

    this._terminal = window.terminals.find(
      it => it.name == EXTENSION_TERMINAL_NAME,
    );

    if (!this._terminal) {
      this._terminal = window.createTerminal({
        name: EXTENSION_TERMINAL_NAME,
        hideFromUser: shouldExecute,
      });
    }

    // 判断当前的是否为之前打开的nestjstool的terminal
    this._disposers.push(
      window.onDidCloseTerminal(t => {
        if (t.name === EXTENSION_TERMINAL_NAME) {
          this._terminal = undefined;
        }
      }),
    );

    this._initial();
  }

  private _initial() {
    const self = this;
    COMMANDS.forEach(cmd => {
      const {postExecute: callback, ...rest} = cmd;
      const options = {...rest, logger: self.sm.logger};
      this.registerCommand(options.name, async (...args: any[]) => {
        const isConfigCmd = cmd.alias === NestGenerateAlias.CONFIG;
        const meta = args.length === 1 ? args[0] : null;
        let userInput: string | undefined = '';
        let selectedModule: IModule | undefined = undefined;
        let application: INestApplication | undefined = undefined;
        let project: INestProject | undefined = undefined;
        let from: any;
        const cmdCtx = {
          fileUri: 'fsPath' in args[0] ? args[0] : undefined,
          command: cmd,
          extensionCtx: self._context,
        };
        if (cmd.preExecute) {
          await cmd.preExecute(cmdCtx);
        }

        if (meta) {
          application = meta.application;
          project = meta.project;
          from = meta.from;
        } else {
          // 获取当前文件所在的应用
          const fileUri = args[0] as Uri;

          if (cmd.preValidate && !(await cmd.preValidate(cmdCtx, cmd))) {
            return;
          }

          application = await getApplicationFromUri(fileUri);

          if (!isConfigCmd) {
            // 当有多个子项目的时候, 选中其中一个Project然后继续操作
            project = await getProjectFromUri(fileUri, application);

            if (!project && application) {
              project = await showProjectQuickPick(application);
            }
          }
        }

        if (options.needInput) {
          userInput = await this._showInputBox(options.description);
          if (!userInput || !userInput.length) {
            return;
          }

          if (!userInput) {
            return;
          }
        }

        // 获取从当前文件夹中创建的是否存在多个模块, 如果是模块, 直接在此某块块中创建, 反之选择模块
        const modules = await checkoutFolderIsModule(
          project,
          'fsPath' in args[0] ? args[0] : undefined,
        );

        if ((modules && modules.length) || (!isConfigCmd && !modules)) {
          if (modules && modules.length) {
            selectedModule = await getModulesQuickPick2(modules);
          } else {
            // 从app中选取模块进行将生成的文件添加到指定的模块中
            selectedModule = await getModulesQuickPick(application!, project);
          }

          if (!selectedModule) {
            return;
          }
          userInput = this._buildCommand(
            cmd,
            userInput,
            project,
            selectedModule,
          );
        }

        if (cmd.validateUserInput) {
          const isValid = await cmd.validateUserInput(cmdCtx, userInput);
          if (!isValid) {
            return;
          }
        }

        self._executeCommand(application!, options.alias, userInput);
      });
    });

    COMMON_COMMANDS.forEach(cmd => {
      const {callback, ...rest} = cmd;
      const options = {...rest, logger: self.sm.logger};
      this.registerCommand(options.name, async (...args: any[]) => {
        const selectedApplication: INestApplication | undefined =
          await showApplicationQuickPick();

        const selectedProject: INestProject | undefined | null =
          await showProjectQuickPick(selectedApplication!);

        const meta = await showCommandsQuickPick();

        if (!meta) return;

        commands.executeCommand(`${EXTENSION_ID}.${meta.name}`, {
          ...meta,
          application: selectedApplication,
          project: selectedProject,
          from: cmd.name,
        });
      });
    });
  }

  /**
   * 判断用户的输入内容,并结合用户的配置,生成最终的命令
   *
   *
   * @param userInput 用户输入的内容
   * @returns 处理后的用户输入
   */
  private _buildCommand(
    cmd: INestCommand,
    userInput: string,
    project?: INestProject,
    module?: IModule,
  ) {
    let _userInput = userInput.trim();
    const {flat, noSpec, noFlat, skipImport, spec} = this.configuration;

    if (cmd.alias === NestGenerateAlias.CONFIG) {
      return _userInput;
    }

    // 追加到指定的项目中
    if (project) {
      _userInput = _userInput + ` --project ${project.name}`;
    }

    // 在指定的module中生成对应的文件
    if (
      !_userInput.startsWith('-') &&
      module &&
      module.name &&
      module.name !== 'None' &&
      module.name !== 'app'
    ) {
      _userInput = `${module.name}/${_userInput}`;
    }

    if (!_userInput.includes('flat') && flat) {
      _userInput = _userInput + ` --flat`;
    }

    if (!_userInput.includes('--no-flat') && noFlat) {
      _userInput = _userInput + ` --no-flat`;
    }

    if (!_userInput.includes('skipImport') && skipImport) {
      _userInput = _userInput + ` --skip-import`;
    }

    if (!_userInput.includes('--no-spec') && noSpec) {
      _userInput = _userInput + ` --no-spec`;
    }

    if (!_userInput.includes('spec') && spec) {
      _userInput = _userInput + ` --spec`;
    }

    return _userInput;
  }

  private async _showInputBox(title: string) {
    const input = await window.showInputBox({
      title: title,
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

  registerCommand(name: string, callback: (...args: any[]) => void) {
    this._context.subscriptions.push(
      commands.registerCommand(`${EXTENSION_ID}.${name}`, (...args: any[]) => {
        callback(...args);
      }),
    );
  }

  private _executeCommand(
    application: INestApplication,
    alias: string,
    ...args: any[]
  ) {
    const {showTerminal, shouldExecute} = this.sm.configService.configuration;
    if (!this._terminal) {
      this._terminal = window.createTerminal({
        name: EXTENSION_TERMINAL_NAME,
        hideFromUser: shouldExecute,
      });
    }

    let commandLine = `nest g ${alias} ${args.join(' ')}`;
    if (application) {
      const distPath = resolve(
        application.workspace.uri.fsPath,
        application.name === 'root' ? '' : application.name,
      );
      commandLine = `cd ${distPath} && ${commandLine}`;
    }

    if (this._terminal.shellIntegration) {
      this._execution =
        this._terminal.shellIntegration.executeCommand(commandLine);

      this._disposers.push(
        window.onDidEndTerminalShellExecution(e => {
          if (e.execution === this._execution) {
            this._logger.info(
              `execute command successfully!`,
              e.execution.commandLine,
            );
          }
        }),
      );
    } else {
      this._terminal.sendText(commandLine);
    }

    if (showTerminal) {
      this._terminal.show();
    }
    this._logger.info(`execute command: ${commandLine}`);
  }

  dispose() {
    for (const d of this._disposers) {
      d.dispose();
    }
    this._terminal?.dispose();
    this._context.subscriptions.forEach(it => it.dispose());
  }
}
