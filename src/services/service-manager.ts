import {ExtensionContext} from 'vscode';
import OutputService from './output-service';
import CommandService from './command-service';
import {LoggeService} from './logger-service';
import {ConfigService} from './config-service';

export class ServiceManager {
  private static _instance: ServiceManager;
  readonly outputService: OutputService;
  readonly commandService: CommandService;

  readonly configService: ConfigService;

  readonly logger: LoggeService;
  
  public static get instance() {
    return this._instance;
  }

  /**
   * 按照顺序初始化各个服务, 可能其他的服务中依赖前者的服务
   * @param context 
   */
  constructor(public readonly context: ExtensionContext) {
    this.configService = new ConfigService(this);
    this.outputService = new OutputService(this);
    this.logger = new LoggeService(this);
    this.commandService = new CommandService(this);
  }

  static initial(context: ExtensionContext) {
    if (!this._instance) {
      this._instance = new ServiceManager(context);
    }
  }
}
