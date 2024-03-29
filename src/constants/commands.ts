import { ExtensionContext, l10n } from 'vscode';
import {CommandType, NestGenerateAlias} from '../types/command';
export const COMMANDS: CommandType[] = [
  {
    name: 'generateANewApplicationWorkspace',
    needInput: true,
    alias: NestGenerateAlias.APPLICATION_WORKSPACE,
    description: l10n.t('Generate a new application workspace'),
    callback: async (ctx: ExtensionContext, ...args: any[]) => {
      return undefined;
    },
  },
  {
    name: 'generateANewClass',
    alias: NestGenerateAlias.CLASS,
    needInput: true,
    description: l10n.t('Generate a new class'),
    callback: async (ctx: ExtensionContext, ...args: any[]) => {
      return undefined;
    },
  },
  {
    name: 'generateACliConfigurationFile',
    alias: NestGenerateAlias.CONFIG,
    needInput: false,
    description: l10n.t('Generate a new cli configuration file'),
    callback: async (ctx: ExtensionContext, ...args: any[]) => {
      return undefined;
    },
  },
  {
    name: 'generateAContorllerDeclaration',
    alias: NestGenerateAlias.CONTROLLER,
    needInput: true,
    description: l10n.t('Generate a new controller declaration'),
    callback: async (ctx: ExtensionContext, ...args: any[]) => {
      return undefined;
    },
  },
  {
    name: 'generateACustomDecorator',
    alias: NestGenerateAlias.DECORATOR,
    needInput: true,
    description: l10n.t('Generate a new custom decorator'),
    callback: async (ctx: ExtensionContext, ...args: any[]) => {
      return undefined;
    },
  },
  {
    name: 'generateAFilterDeclaration',
    alias: NestGenerateAlias.FILTER,
    needInput: true,
    description: l10n.t('Generate a new filter declaration'),
    callback: async (ctx: ExtensionContext, ...args: any[]) => {
      return undefined;
    },
  },
  {
    name: 'generateAGatewayDeclaration',
    alias: NestGenerateAlias.GATEWAY,
    needInput: true,
    description: l10n.t('Generate a new gateway declaration'),
    callback: async (ctx: ExtensionContext, ...args: any[]) => {
      return undefined;
    },
  },
  {
    name: 'generateAGuardDelcaration',
    alias: NestGenerateAlias.GUARD,
    needInput: true,
    description: l10n.t('Generate a new guard declaration'),
    callback: async (ctx: ExtensionContext, ...args: any[]) => {
      return undefined;
    },
  },
  {
    name: 'generateAnInterceptorDeclaration',
    alias: NestGenerateAlias.INTERCEPTOR,
    needInput: true,
    description: l10n.t('Generate a new interceptor declaration'),
    callback: async (ctx: ExtensionContext, ...args: any[]) => {
      return undefined;
    },
  },
  {
    name: 'generateAnInterface',
    alias: NestGenerateAlias.INTERFACE,
    needInput: true,
    description: l10n.t('Generate a new interface'),
    callback: async (ctx: ExtensionContext, ...args: any[]) => {
      return undefined;
    },
  },
  {
    name: 'generateANewLibraryWithAMonorepo',
    alias: NestGenerateAlias.LIBRARY,
    needInput: true,
    description: l10n.t('Generate a new library with a monorepo'),
    callback: async (ctx: ExtensionContext, ...args: any[]) => {
      return undefined;
    },
  },
  {
    name: 'generateAMiddleWareDeclaration',
    alias: NestGenerateAlias.MIDDLEWARE,
    needInput: true,
    description: l10n.t('Generate a new middleware declaration'),
    callback: async (ctx: ExtensionContext, ...args: any[]) => {
      return undefined;
    },
  },
  {
    name: 'generateAModuleDeclaration',
    alias: NestGenerateAlias.MODULE,
    needInput: true,
    description: l10n.t('Generate a new module declaration'),
    callback: async (ctx: ExtensionContext, ...args: any[]) => {
      return undefined;
    },
  },
  {
    name: 'generateAPipeDeclaration',
    alias: NestGenerateAlias.PIPE,
    needInput: true,
    description: l10n.t('Generate a new pipe declaration'),
    callback: async (ctx: ExtensionContext, ...args: any[]) => {
      return undefined;
    },
  },
  {
    name: 'generateAProviderDeclaration',
    alias: NestGenerateAlias.PROVIDER,
    needInput: true,
    description: l10n.t('Generate a new provider declaration'),
    callback: async (ctx: ExtensionContext, ...args: any[]) => {
      return undefined;
    },
  },
  {
    name: 'generateAGraphQLResolverDeclaration',
    alias: NestGenerateAlias.GRAPHQL_RESOLVER,
    needInput: true,
    description: l10n.t('Generate a new GraphQL resolver declaration'),
    callback: async (ctx: ExtensionContext, ...args: any[]) => {
      return undefined;
    },
  },
  {
    name: 'generateANewCRUDDeclaration',
    alias: NestGenerateAlias.CRUD_DECLARATION,
    needInput: true,
    description: l10n.t('Generate a new CRUD declaration'),
    callback: async (ctx: ExtensionContext, ...args: any[]) => {
      return undefined;
    },
  },
  {
    name: 'generateAServiceDeclaration',
    alias: NestGenerateAlias.SERVICE,
    needInput: true,
    description: l10n.t('Generate a new service declaration'),
    callback: async (ctx: ExtensionContext, ...args: any[]) => {
      return undefined;
    },
  },
  {
    name: 'generateANewApplicationWithAMonorepo',
    alias: NestGenerateAlias.APPLICATION_MONOREPO,
    needInput: true,
    description: l10n.t('Generate a new application with a monorepo'),
    callback: async (ctx: ExtensionContext, ...args: any[]) => {
      return undefined;
    },
  },
];