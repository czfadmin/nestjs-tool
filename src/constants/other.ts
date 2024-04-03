export const USER_INPUT_OPTIONS = [
  {
    key: 'dryRun',
    alias: ['-d', '--dry-run'],
  },
  {
    key: 'flat',
    alias: ['--flat'],
  },
  {
    key: 'project',
    alias: ['-p', '--project'],
  },
  {
    key: 'noFlat',
    alias: ['--no-flat'],
  },

  {
    key: 'spec',
    alias: ['--spec'],
  },
  {
    key: 'specFileSuffix',
    alias: ['--spec-file-suffix'],
  },

  {
    key: 'skipImport',
    alias: ['--skip-import'],
  },
  {
    key: 'noSpec',
    alias: ['--no-spec'],
  },
  {
    key: 'collection',
    alias: ['-c', '--collection'],
  },
  {
    key: 'help',
    alias: ['-h', '--help'],
  },
];

export interface IUserInputOptions {
  dryRun: boolean;
  project: boolean;
  flat: boolean;
  noFlat: boolean;
  spec: boolean;
  specFileSuffix: boolean;
  skipImport: boolean;
  noSpec: boolean;
  collection: boolean;
  help: boolean;

  [index: string]: boolean;
}
export function parseUserInputOptions(arr: string[]): IUserInputOptions {
  const userInputOptions: IUserInputOptions = {
    dryRun: false,
    project: false,
    flat: false,
    noFlat: false,
    spec: false,
    specFileSuffix: false,
    skipImport: false,
    noSpec: false,
    collection: false,
    help: false,
  };
  if (!arr.length) {
    return userInputOptions;
  }
  USER_INPUT_OPTIONS.forEach(it => {
    userInputOptions[it.key] = it.alias.every(a => arr.includes(a));
  });
  return userInputOptions;
}
