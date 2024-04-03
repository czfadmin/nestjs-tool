import {commands} from 'vscode';
import {ServiceManager} from './service-manager';
import {EXTENSION_ID} from '../constants';

/**
 * 自定义上下文服务
 */
export default class CustomContextService {
  constructor(private readonly sm: ServiceManager) {}

  registerExtCustomCtxKey(key: string, value: any) {
    commands.executeCommand('setContext', `${EXTENSION_ID}.${key}`, value);
  }
}
