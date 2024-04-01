import {l10n, Uri, window, workspace} from 'vscode';
import {INestApplication, INestProject} from '../types';
import {getAllNestOptions} from './options';
import {resolve} from './path';

/**
 * 通过读取nest-cli.json文件判断工作文件中是否存在多个project
 * @returns {[boolean, any[]]}
 */
export async function getAllNestProjects(
  application?: INestApplication,
): Promise<INestProject[]> {
  let allNestOptions = await getAllNestOptions(application);
  if (!allNestOptions) {
    return [];
  }

  const projects = allNestOptions
    .filter(
      it =>
        it.configuration.projects &&
        Object.keys(it.configuration.projects).length,
    )
    .reduce((a, b) => {
      let projects = Object.entries(b.configuration.projects!).map(
        ([key, value]) => {
          return {
            name: key,
            workspace: b.workspace,
            application: b.application,
            ...value,
          };
        },
      );
      return a.concat(projects);
    }, [] as INestProject[]);

  return projects;
}

/**
 * 获取nestjs中的projects内容
 * @param projects
 * @returns
 */
export function getAllNestProjectPickItems(projects: INestProject[]) {
  return projects.map(project => {
    const applicationName =
      project.application.name === 'root'
        ? '/'
        : `${project.application.name}/`;

    return {
      label: project.name,
      description: project.type,
      detail: resolve(
        project.workspace.uri.fsPath,
        applicationName,
        project.name,
      ),
    };
  });
}

export async function getProjectFromUri(
  uri: Uri,
  application?: INestApplication,
) {
  const projects = await getAllNestProjects(application);
  return projects.find(
    it =>
      it.workspace === workspace.getWorkspaceFolder(uri) &&
      uri.fsPath.includes(
        Uri.joinPath(
          it.workspace.uri,
          it.application.name === 'root' ? '' : it.application.name,
          it.root || '',
        ).fsPath,
      ),
  );
}

export async function showProjectQuickPick(application: INestApplication) {
  const projects = await getAllNestProjects(application);
  const pickitems = getAllNestProjectPickItems(projects);

  const selectedItem = await window.showQuickPick(pickitems, {
    placeHolder:l10n.t("Please select a project"),
    matchOnDescription: true,
    matchOnDetail: true,
  });
  if (!selectedItem) {
    return;
  }

  return projects.find(it => it.name === selectedItem.label);
}
