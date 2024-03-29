import {ExtensionContext} from 'vscode';

export type CommandType = {
  name: string;
  alias: string;
  description: string;
  /**
   * 代表用户可以进行输入操作
   */
  needInput: boolean;
  /**
   * TODO: 未来的某个时期会用到此方法回调
   * @param ctx
   * @param args
   * @returns
   */
  callback: (
    ctx: ExtensionContext,
    ...args: any[]
  ) => Promise<string | undefined>;
};

export enum NestGenerateAlias {
  APPLICATION_WORKSPACE = 'application',
  CLASS = 'cl',
  CONFIG = 'config',
  CONTROLLER = 'co',
  DECORATOR = 'd',
  FILTER = 'f',
  GATEWAY = 'ga',
  GUARD = 'gu',
  INTERCEPTOR = 'itc',
  INTERFACE = 'itf',
  LIBRARY = 'lib',
  MIDDLEWARE = 'mi',
  MODULE = 'mo',
  PIPE = 'pi',
  PROVIDER = 'pr',
  GRAPHQL_RESOLVER = 'r',
  CRUD_DECLARATION = 'res',
  SERVICE = 's',
  APPLICATION_MONOREPO = 'app',
}
