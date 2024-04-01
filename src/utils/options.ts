import {WorkspaceFolder} from 'vscode';
import {INestApplication, Configuration} from '../types';
import {getAllNestApplications} from './application';

/**
 * 获取各个工作文件夹下面所有的nestjs-cli.json的数据
 */
export async function getAllNestOptions(
  application?: INestApplication,
): Promise<
  {
    workspace: WorkspaceFolder;
    application: INestApplication;
    configuration: Configuration;
  }[]
> {
  let data: any[] = [];
  if (application) {
    data.push({
      workspace: application.workspace,
      application,
      configuration: application.configuration,
    });
    return data;
  }

  const applications = await getAllNestApplications();
  return applications.map(it => ({
    workspace: it.workspace,
    application: it,
    configuration: it.configuration,
  }));
}
