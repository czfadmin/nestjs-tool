import path from 'node:path';

export function resolve(...args: string[]) {
  return path.resolve(...args);
}


export function joinPath(...args: string[]) {
  return path.join(...args)
}