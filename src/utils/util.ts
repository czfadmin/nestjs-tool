import { join, basename, relative, dirname } from "path";
import * as fs from 'fs-extra';
import { TextDecoder } from "util";
import { render } from 'mustache';
import { commands, Position, Uri, window, workspace, WorkspaceEdit } from "vscode";

import { NestAssociatedArrayEnum, NestFileOption, NestFileType, NestImports, NestProviders } from './../model/nest';
import { getPackedSettings } from "http2";
export async function getFileTemplate(file: NestFileOption): Promise<string> {
	return fs.readFile(join(__dirname, `../../src/templates/${NestFileType[file.type].toLowerCase()}.mustache`), 'utf8').then(data => {
		const name = getClassName(file.name);
		const type = getPascalCase(basename(file.uri.path).split('.')[1]);
		let view = {
			Name: name,
			Type: type,
			VarName: getCamelCase(name) + type
		};
		return render(data, view);
	});
}

export function getPascalCase(fileType: NestFileType | string): string {
	if (typeof fileType === 'string') {
		var fileName = fileType as string;
		return fileName.charAt(0).toUpperCase() + fileName.toLowerCase().slice(1);
	} else {
		return NestFileType[fileType].toLowerCase().charAt(0).toUpperCase() + NestFileType[fileType].toLowerCase().slice(1);

	}
}

export function getCamelCase(str: string): string {
	return str.charAt(0).toLowerCase() + str.slice(1);
}

export function getClassName(fileName: string): string {
	let specialCharIndex = fileName.indexOf('-');
	if (specialCharIndex !== -1) {
		return getPascalCase(fileName.substring(0, specialCharIndex))
			.concat(getPascalCase(fileName.substring(specialCharIndex + 1, fileName.length)));
	}

	specialCharIndex = fileName.indexOf('.');
	if (specialCharIndex !== -1) {
		return getPascalCase(fileName.substring(0, specialCharIndex)).concat(getPascalCase(fileName.substring(specialCharIndex + 1, fileName.length)));
	}
	return getPascalCase(fileName);
}

function getArraySchematics(nestAssociateArray: NestAssociatedArrayEnum) {
	return new RegExp(`${NestAssociatedArrayEnum[nestAssociateArray].toLowerCase()}(\\s+)?:(\\s+)?\\[`);
}

function getLineNoFromString(str: string, match: RegExpExecArray): Position {
	const array = str.substring(0, match.index).split('\n');
	const charPos = str.split('\n')[array.length - 1].indexOf('[');
	return new Position(array.length - 1, charPos + 1);
}

export async function addToArray(data: Uint8Array, file: NestFileOption, modulePath: Uri) {

	if (file.associatedArray !== undefined) {
		const pattern = getArraySchematics(file.associatedArray);
		let match;
		let pos: Position;
		let tempStrData = new TextDecoder().decode(data);

		if (match = pattern.exec(tempStrData)) {
			pos = getLineNoFromString(tempStrData, match);
			const toInsert = '\n        ' + getClassName(file.name) + getPascalCase(file.type) + ', ';
			let edit = new WorkspaceEdit();
			if (file.type === NestFileType.FILTER) {
				edit.insert(modulePath, new Position(0, 0), NestImports.filter + '\n');
				edit.insert(modulePath, pos, '\n' + NestProviders.filter);
			}
			else {
				edit.insert(modulePath, pos, toInsert);
			}
			const importPath = await getImportTemplate(file, modulePath);
			edit.insert(modulePath, new Position(0, 0), importPath + '\n');

			return workspace.applyEdit(edit)
				.then(() => {
					return formatTextDocument(modulePath);
				});
		}
	}
}

export async function getImportTemplate(file: NestFileOption, appModule: Uri): Promise<string> {
	return fs.readFile(join(__dirname, `../../src/templates/import.mustache`), 'utf8')
		.then((data) => {
			let view = {
				Name: getClassName(file.name) + getPascalCase(file.type),
				Path: getRelativePathForImport(appModule, file.uri)
			};
			return render(data, view);
		});
}

export function getRelativePathForImport(appModule: Uri, importFile: Uri) {
	return './' + relative(dirname(appModule.path), importFile.path).replace(/\\/g, '/').replace('.ts', '');
}


export async function formatTextDocument(uri: Uri) {
	return workspace.openTextDocument(uri).then(doc => {
		return window.showTextDocument(doc);
	}).then(() => {
		return commands.executeCommand('editor.action.formatDocument');
	});
}