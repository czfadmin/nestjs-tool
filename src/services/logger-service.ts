import {LogLevel} from 'vscode';
import {ServiceManager} from './service-manager';
import OutputService from './output-service';

export class LoggeService {
  level: LogLevel = LogLevel.Debug;

  private _output: OutputService;

  constructor(private sm: ServiceManager) {
    this._output = this.sm.outputService;
  }

  changeLevel(level: LogLevel) {
    this.level = level;
  }

  info(msg: string, ...args: any[]) {
    this._output.info(msg, args);
  }

  warn(msg: string, ...args: any[]) {
    this._output.info(msg, args);
  }
  error(msg: string, ...args: any[]) {
    this._output.info(msg, args);
  }
  trace(msg: string, ...args: any[]) {
    this._output.info(msg, args);
  }
}
