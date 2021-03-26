import { commands, Uri, window, workspace } from 'vscode';

import { NestAssociatedArrayEnum, NestFileType } from './../model/nest';
import { buildFileName, buildFullName, createFile, createModuleFolder, invalidFileName } from './file';
export function buildCommand(command: string, fileType: NestFileType, associatedArray: NestAssociatedArrayEnum = NestAssociatedArrayEnum.UNDEFIND) {
	return commands.registerCommand(command, (resource: Uri) => {
		if (checkWorkspace()) {
			return window.showInputBox({
				placeHolder: "please enter name!"
			}).then<any>(input => {
				if (input === undefined) {
					return;
				}
				if (validFileInput(input)) {
					let fileName = buildFileName(input);
					if (NestFileType.MODULE_FOLDER === fileType) {
						return createModuleFolder({
							name:fileName,
							type: fileType,
							associatedArray: NestAssociatedArrayEnum.UNDEFIND,
							uri: resource,
							fullName:fileName
						});
					}
					let fullName = buildFullName(fileName, fileType);
					return createFile({
						name: fileName,
						type: fileType,
						associatedArray: associatedArray == NestAssociatedArrayEnum.UNDEFIND ? undefined : associatedArray,
						uri: resource,
						fullName: fullName,
					});
				} else {
					return window.showErrorMessage('Invalid Filename');
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
		input = input.trim();
		if (input.includes(' ')) {
			return true;
		}
		return false;
	}
}





