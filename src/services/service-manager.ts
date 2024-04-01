import {ExtensionContext} from 'vscode';
import OutputService from './output-service';
import CommandService from './command-service';
import {LoggerService} from './logger-service';
import {ConfigService} from './config-service';
import CustomContextService from './context-service';

export class ServiceManager {
  private static _instance: ServiceManager;
  readonly outputService: OutputService;
  private _commandService!: CommandService;

  readonly configService: ConfigService;

  readonly logger: LoggerService;

  readonly customCtxService: CustomContextService;

  public static get instance() {
    return this._instance;
  }

  get commandService() {
    return this._commandService;
  }

  private set commandService(commandService: CommandService) {
    this._commandService = commandService;
  }

  /**
   * 按照顺序初始化各个服务, 可能其他的服务中依赖前者的服务
   * @param context
   */
  constructor(public readonly context: ExtensionContext) {
    this.configService = new ConfigService(this);
    this.outputService = new OutputService(this);
    this.logger = new LoggerService(this);
    this.customCtxService = new CustomContextService(this);
  }

  static initial(context: ExtensionContext) {
    if (!this._instance) {
      this._instance = new ServiceManager(context);
      this._instance.commandService = new CommandService(this._instance);
    }
  }
}
