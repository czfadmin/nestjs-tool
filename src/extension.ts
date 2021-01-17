
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { NestAssociatedArrayEnum, NestFileType } from './model';
import * as utils from './utils';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "nestjs-tool" is now active!');

	let createModuleCommand = utils.buildCommand('extension.GenerateNestJsModule', NestFileType.MODULE, NestAssociatedArrayEnum.IMPORTS);
	let createServiceCommand = utils.buildCommand('extension.GenerateNestJsService', NestFileType.SERVICE, NestAssociatedArrayEnum.PROVIDERS);
	let createControllerCommand = utils.buildCommand('extension.GenerateNestJsController', NestFileType.CONTROLLER, NestAssociatedArrayEnum.CONTROLLERS);
	let createExceptionCommand = utils.buildCommand('extension.GenerateNestJsException', NestFileType.EXCEPTION);
	let createMiddlewareCommand = utils.buildCommand('extension.GenerateNestJsMiddleware', NestFileType.MIDDLEWARE);
	let createInterceptorCommand = utils.buildCommand('extension.GenerateNestJsInterceptor', NestFileType.INTERCEPTION);
	let createPipeCommand = utils.buildCommand('extension.GenerateNestJsPipe', NestFileType.PIPE);
	let createGuardCommand = utils.buildCommand('extension.GenerateNestJsGuard', NestFileType.GUARD);
	let createDecoratorCommand = utils.buildCommand('extension.GenerateNestJsDecorator', NestFileType.DECORATOR);
	let createExceptionFilterCommand = utils.buildCommand('extension.GenerateNestJsExcepFilter', NestFileType.FILTER, NestAssociatedArrayEnum.PROVIDERS);
	let createUnittestCommand = utils.buildCommand('extension.GenerateNestJsUnittest', NestFileType.SPEC);
	context.subscriptions.push(
		createModuleCommand,
		createServiceCommand,
		createControllerCommand,
		createExceptionCommand,
		createMiddlewareCommand,
		createInterceptorCommand,
		createPipeCommand,
		createGuardCommand,
		createDecoratorCommand,
		createExceptionFilterCommand,
		createUnittestCommand
	);
}

// this method is called when your extension is deactivated
export function deactivate() { }
