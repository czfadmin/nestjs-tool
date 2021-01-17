import { FileType, Uri, window, workspace } from "vscode";
import { join, basename } from "path";
import { TextEncoder } from "util";
import * as fs from 'fs-extra';

import { NestFileOption, NestFileType } from "../model";
import { addToArray, formatTextDocument, getFileTemplate } from './util';


export const invalidFileName = /^(\d|\-)|[\\\s+={}\(\)\[\]"`/;,:.*?'<>|#$%^@!~&]|\-$/;
export async function createFile(option: NestFileOption) {
	if (fs.existsSync(join(option.uri.fsPath, `${option.name.toLowerCase()}.${NestFileType[option.type]}.ts`))) {
		return window.showErrorMessage('A file already exists with given name');
	}
	const stats = await workspace.fs.stat(option.uri);
	if (stats.type === FileType.Directory) {
		option.uri = Uri.parse(`${option.uri.path}/${option.fullName}`);
	} else {
		option.uri = Uri.parse(option.uri.path.replace(basename(option.uri.path), '') + '/' + option.fullName);
	}
	return getFileTemplate(option).then(data => {
		return workspace.fs.writeFile(option.uri, new TextEncoder().encode(data));
	}).then(() => {
		return addFilesToAppModule(option);
	}).then(() => {
		return formatTextDocument(option.uri);
	}).then(() => {
		return true;
	}).catch(err => {
		return window.showErrorMessage(err);
	});
}

export function buildFileName(input: string) {
	let fileName = input.trim();
	if (fileName.includes(' ')) {
		var list = fileName.split(' ');
		fileName = list.join('.');
	}
	return fileName;
}

export function buildFullName(fileName: string, fileType: NestFileType): string {
	let extType = NestFileType[fileType];
	return `${fileName.toLowerCase()}.${extType.toLowerCase()}.ts`;
}



async function addFilesToAppModule(option: NestFileOption) {
	let moduleFile: Uri[] = [];
	if (option.type === NestFileType.SERVICE || option.type === NestFileType.CONTROLLER) {
		moduleFile = await workspace.findFiles(`**/${option.name}.module.ts`, `**/node_modules/**`, 1);
	}

	if (moduleFile.length === 0 && option.name !== 'app') {
		moduleFile = await workspace.findFiles(`**/app.module.ts`, '**/node_modules/**', 1);
	}

	if (moduleFile.length !== 0) {
		workspace.saveAll().then(() => {
			return workspace.fs.readFile(moduleFile[0]);
		}).then(data => {
			return addToArray(data, option, moduleFile[0]);
		});
	}
}


