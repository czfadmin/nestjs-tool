import {l10n, Uri, window} from 'vscode';
import {
  CommandContext,
  INestCommand,
  ICommonCommand,
  NestGenerateAlias,
} from '../types/command';
import {judgeFolderIsApplication} from '../utils/application';
export const COMMANDS: INestCommand[] = [
  {
    name: 'generateANewApplicationWorkspace',
    needInput: true,
    alias: NestGenerateAlias.APPLICATION_WORKSPACE,
    description: l10n.t('Generate a new application workspace'),

    postExecute: async (ctx: CommandContext, ...args: any[]) => {
      return undefined;
    },
  },
  {
    name: 'generateANewClass',
    alias: NestGenerateAlias.CLASS,
    needInput: true,
    description: l10n.t('Generate a new class'),
    postExecute: async (ctx: CommandContext, ...args: any[]) => {
      return undefined;
    },
  },
  {
    name: 'generateACliConfigurationFile',
    alias: NestGenerateAlias.CONFIG,
    needInput: false,
    description: l10n.t('Generate a new cli configuration file'),
    preValidate: async (ctx, ...args): Promise<boolean> => {
      // 当从菜单上下文中创建 config 文件时,判断当前是否为 nest应用, 如果是,直接提示用户不可以先进行创建配置文件
      const fileUri = ctx.fileUri as Uri;
      const cmd = args[0] as INestCommand;
      if (
        cmd.alias === NestGenerateAlias.CONFIG &&
        judgeFolderIsApplication(fileUri)
      ) {
        window.showInformationMessage(
          l10n.t("Can't create config file in nest application"),
        );
        return false;
      }
      return true;
    },
    postExecute: async (ctx: CommandContext, ...args: any[]) => {
      return undefined;
    },
  },
  {
    name: 'generateAContorllerDeclaration',
    alias: NestGenerateAlias.CONTROLLER,
    needInput: true,
    description: l10n.t('Generate a new controller declaration'),
    postExecute: async (ctx: CommandContext, ...args: any[]) => {
      return undefined;
    },
  },
  {
    name: 'generateACustomDecorator',
    alias: NestGenerateAlias.DECORATOR,
    needInput: true,
    description: l10n.t('Generate a new custom decorator'),
    postExecute: async (ctx: CommandContext, ...args: any[]) => {
      return undefined;
    },
  },
  {
    name: 'generateAFilterDeclaration',
    alias: NestGenerateAlias.FILTER,
    needInput: true,
    description: l10n.t('Generate a new filter declaration'),
    postExecute: async (ctx: CommandContext, ...args: any[]) => {
      return undefined;
    },
  },
  {
    name: 'generateAGatewayDeclaration',
    alias: NestGenerateAlias.GATEWAY,
    needInput: true,
    description: l10n.t('Generate a new gateway declaration'),
    postExecute: async (ctx: CommandContext, ...args: any[]) => {
      return undefined;
    },
  },
  {
    name: 'generateAGuardDelcaration',
    alias: NestGenerateAlias.GUARD,
    needInput: true,
    description: l10n.t('Generate a new guard declaration'),
    postExecute: async (ctx: CommandContext, ...args: any[]) => {
      return undefined;
    },
  },
  {
    name: 'generateAnInterceptorDeclaration',
    alias: NestGenerateAlias.INTERCEPTOR,
    needInput: true,
    description: l10n.t('Generate a new interceptor declaration'),
    postExecute: async (ctx: CommandContext, ...args: any[]) => {
      return undefined;
    },
  },
  {
    name: 'generateAnInterface',
    alias: NestGenerateAlias.INTERFACE,
    needInput: true,
    description: l10n.t('Generate a new interface'),
    postExecute: async (ctx: CommandContext, ...args: any[]) => {
      return undefined;
    },
  },
  {
    name: 'generateANewLibraryWithAMonorepo',
    alias: NestGenerateAlias.LIBRARY,
    needInput: true,
    description: l10n.t('Generate a new library with a monorepo'),
    postExecute: async (ctx: CommandContext, ...args: any[]) => {
      return undefined;
    },
  },
  {
    name: 'generateAMiddleWareDeclaration',
    alias: NestGenerateAlias.MIDDLEWARE,
    needInput: true,
    description: l10n.t('Generate a new middleware declaration'),
    postExecute: async (ctx: CommandContext, ...args: any[]) => {
      return undefined;
    },
  },
  {
    name: 'generateAModuleDeclaration',
    alias: NestGenerateAlias.MODULE,
    needInput: true,
    description: l10n.t('Generate a new module declaration'),
    postExecute: async (ctx: CommandContext, ...args: any[]) => {
      return undefined;
    },
  },
  {
    name: 'generateAPipeDeclaration',
    alias: NestGenerateAlias.PIPE,
    needInput: true,
    description: l10n.t('Generate a new pipe declaration'),
    postExecute: async (ctx: CommandContext, ...args: any[]) => {
      return undefined;
    },
  },
  {
    name: 'generateAProviderDeclaration',
    alias: NestGenerateAlias.PROVIDER,
    needInput: true,
    description: l10n.t('Generate a new provider declaration'),
    postExecute: async (ctx: CommandContext, ...args: any[]) => {
      return undefined;
    },
  },
  {
    name: 'generateAGraphQLResolverDeclaration',
    alias: NestGenerateAlias.GRAPHQL_RESOLVER,
    needInput: true,
    description: l10n.t('Generate a new GraphQL resolver declaration'),
    postExecute: async (ctx: CommandContext, ...args: any[]) => {
      return undefined;
    },
  },
  {
    name: 'generateANewCRUDDeclaration',
    alias: NestGenerateAlias.CRUD_DECLARATION,
    needInput: true,
    description: l10n.t('Generate a new CRUD declaration'),
    postExecute: async (ctx: CommandContext, ...args: any[]) => {
      return undefined;
    },
  },
  {
    name: 'generateAServiceDeclaration',
    alias: NestGenerateAlias.SERVICE,
    needInput: true,
    description: l10n.t('Generate a new service declaration'),
    postExecute: async (ctx: CommandContext, ...args: any[]) => {
      return undefined;
    },
  },
  {
    name: 'generateANewApplicationWithAMonorepo',
    alias: NestGenerateAlias.APPLICATION_MONOREPO,
    needInput: true,
    description: l10n.t('Generate a new application with a monorepo'),
    postExecute: async (ctx: CommandContext, ...args: any[]) => {
      return undefined;
    },
  },
];

export const COMMON_COMMANDS: ICommonCommand[] = [
  {
    name: 'quickOperation',
    description: 'Quick operation',
    callback(...args) {},
  },
];
