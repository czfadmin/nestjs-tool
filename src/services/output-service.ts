import {Disposable, ExtensionContext, LogOutputChannel, window} from 'vscode';
import {EXTENSION_NAME} from '../constants';
import {ServiceManager} from './service-manager';

export default class OutputService implements Disposable {
  private output: LogOutputChannel;
  private _context: ExtensionContext;

  constructor(private sm: ServiceManager) {
    this.output = window.createOutputChannel(EXTENSION_NAME, {log: true});
    this._context = this.sm.context;
  }

  info(msg: string, ...args: any[]) {
    this.output.info(msg, args);
  }

  warning(msg: string, ...args: any[]) {
    this.output.warn(msg, args);
  }

  error(msg: string, ...args: any[]) {
    this.output.error(msg, args);
  }

  trace(msg: string, ...args: any[]) {
    this.output.trace(msg, args);
  }

  show() {
    this.output.show();
  }

  hide() {
    this.output.hide();
  }

  clear() {
    this.output.clear();
  }

  dispose() {
    this.output.dispose();
  }
}
