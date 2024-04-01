import fs from 'node:fs';
export function existsSync(p: string) {
  return fs.existsSync(p);
}

export function statSync(p: string) {
  return fs.statSync(p);
}

export function readdirSync(p: string) {
  return fs.readdirSync(p);
}

export function readFileSync(p: string) {
  return fs.readFileSync(p,'utf-8')
}