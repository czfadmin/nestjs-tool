import {ExtensionContext, Uri} from 'vscode';

export type CommandContext = {
  fileUri: Uri | undefined;

  command: INestCommand;
  /**
   * 插件上下文
   */
  extensionCtx: ExtensionContext;
};

export interface IBaseCommon {
  /**
   * 命令名称
   */
  name: string;
  /**
   * 命令描述详情
   */
  description: string;

  [key: string]: any;
}

/**
 * Nest 命令声明接口
 */
export interface INestCommand extends IBaseCommon {
  /**
   * Nest 子命令别名
   */
  alias: string;
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
  preExecute?: (
    ctx: CommandContext,
    ...args: any[]
  ) => Promise<any | undefined>;
  
  /**
   * TODO: 未来的某个时期会用到此方法回调
   * @param ctx
   * @param args
   * @returns
   */
  postExecute:
    | ((ctx: CommandContext, ...args: any[]) => Promise<any | undefined>)
    | undefined;

  preValidate?: (ctx: CommandContext, ...args: any[]) => Promise<boolean> ;

  validateUserInput?: (ctx: CommandContext, ...args: any[]) => Promise<boolean> ;
}

/**
 * 通用命令声明接口
 */
export interface ICommonCommand extends IBaseCommon {
  callback: (options: any, ...args: any[]) => Promise<any> | void;
}

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
