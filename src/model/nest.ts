import { Uri } from "vscode";

export interface NestFileOption {
	type: NestFileType,
	name: string,
	fullName: string;
	uri: Uri,
	associatedArray: NestAssociatedArrayEnum | undefined;
}


export enum NestAssociatedArrayEnum {
	IMPORTS = 0x01,
	PROVIDERS,

	CONTROLLERS,
	UNDEFIND,
}

export enum NestFileType {
	MODULE = 0x01,
	CONTROLLER,
	SERVICE,
	EXCEPTION,
	MIDDLEWARE,
	INTERCEPTION,
	PIPE,
	GUARD,
	DECORATOR,
	FILTER,
	SPEC,
	MODULE_FOLDER,
	UNDEFIND
}

export const NestImports = {
	filter: `import { APP_FILTER } from '@nestjs/core';`,
};

export const NestProviders = {
	filter: `{
        provide: APP_FILTER,
        useClass: AllExceptionsFilter,
      },`,
};