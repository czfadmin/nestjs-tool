import { commands, Uri, window, workspace } from 'vscode';

import { NestAssociatedArrayEnum, NestFileType } from './../model/nest';
import { buildFileName, buildFullName, createFile, invalidFileName } from './file';
export function buildCommand(command: string, fileType: NestFileType, associatedArray: NestAssociatedArrayEnum = NestAssociatedArrayEnum.UNDEFIND) {
	return commands.registerCommand(command, (resource: Uri) => {
		if (checkWorkspace()) {
			return window.showInputBox({
				placeHolder: "please enter module name!"
			}).then<any>(input => {
				if (input === undefined) {
					return;
				}
				if (validFileInput(input)) {
					let fileName = buildFileName(input);
					let fullName = buildFullName(fileName, fileType);
					return createFile({
						name: fileName,
						type: fileType,
						associatedArray: associatedArray == NestAssociatedArrayEnum.UNDEFIND ? undefined : associatedArray,
						uri: resource,
						fullName: fullName,
					});
				} else {
					return window.showErrorMessage('Invaild filename');
				}
			})
		}
	});
}



function checkWorkspace(): boolean {
	if (workspace === undefined) {
		window.showErrorMessage('Please select a workspace first');
		return false;
	}
	return true;
}

function validFileInput(input: string): boolean {
	// TODO modify it
	if (!invalidFileName.test(input)) {
		return true;
	} else {
		// TODO: 空格
		input = input.trim();
		if (input.includes(' ')) {
			return true;
		}
		return false;
	}
}





