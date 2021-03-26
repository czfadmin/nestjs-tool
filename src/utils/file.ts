import { FileType, Uri, window, workspace } from "vscode";
import { join, basename } from "path";
import { TextEncoder } from "util";
import * as fs from 'fs-extra';

import { NestAssociatedArrayEnum, NestFileOption, NestFileType } from "../model";
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

export async function createModuleFolder(option: NestFileOption) {
	if (fs.existsSync(join(option.uri.fsPath, option.name))) {
		return window.showErrorMessage(`The file or folder ${option.name} already exists at this location.Please choose a different name or choose a different location.`)
	}
	fs.mkdirSync(join(option.uri.fsPath, option.name));

	const stats = await workspace.fs.stat(option.uri);
	if (stats.type === FileType.Directory) {
		option.uri = Uri.parse(`${option.uri.path}/${option.name}`);
	} else {
		return window.showErrorMessage(`Please choose a folder!`);
	}

	let tasks = [];
	let fileExtTypes = [NestFileType.CONTROLLER, NestFileType.SERVICE, NestFileType.MODULE]
	for (let idx in fileExtTypes) {
		let fullName = buildFullName(option.name, fileExtTypes[idx]);
		let opt: NestFileOption = {
			name: option.name,
			uri: option.uri,
			type: NestFileType.UNDEFIND,
			fullName: fullName,
			associatedArray: NestAssociatedArrayEnum.UNDEFIND
		}
		switch (fileExtTypes[idx]) {
			case NestFileType.CONTROLLER:
				opt.type = NestFileType.CONTROLLER;
				opt.associatedArray = NestAssociatedArrayEnum.CONTROLLERS;
				break;
			case NestFileType.SERVICE:
				opt.type = NestFileType.SERVICE;
				opt.associatedArray = NestAssociatedArrayEnum.PROVIDERS;
				break;
			case NestFileType.MODULE:
				opt.type = NestFileType.MODULE;
				opt.associatedArray = NestAssociatedArrayEnum.PROVIDERS;
				break;
		}
		// await ;
		tasks.push(createFile(opt));
	}
	return Promise.all(tasks).then((data) => {
		console.log(data)
	}).catch(() => {
		return true;
	}).catch(error => {
		console.log(error)
	});
}