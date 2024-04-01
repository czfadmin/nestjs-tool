import {LogLevel} from 'vscode';
import {ServiceManager} from './service-manager';
import OutputService from './output-service';

export class LoggerService {
  level: LogLevel = LogLevel.Debug;

  private _contextName: string = '';
  private _output: OutputService;

  constructor(private readonly sm: ServiceManager) {
    this._output = this.sm.outputService;
  }

  static createFactory(contextName: Function) {
    const instance = new LoggerService(ServiceManager.instance);
    instance.setContext(contextName);
    return instance;
  }

  setContext(Service: Function) {
    this._contextName = Service.name;
  }
  changeLevel(level: LogLevel) {
    this.level = level;
  }

  info(msg: string, ...args: any[]) {
    this._output.info(this._buildMessage(msg, ...args));
  }

  warn(msg: string, ...args: any[]) {
    this._output.warning(this._buildMessage(msg, ...args));
  }
  error(msg: string, ...args: any[]) {
    this._output.error(this._buildMessage(msg, ...args));
  }
  trace(msg: string, ...args: any[]) {
    this._output.trace(this._buildMessage(msg, ...args));
  }
  private _buildMessage(msg: string, ...args: any[]) {
    return `[${this._contextName}]: ${msg}\t ${args.length && JSON.stringify(args.join(' '))}`;
  }
}
