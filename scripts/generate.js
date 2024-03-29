/**
 * @author czfadmin
 * @description 用于生成 `package.nls.<languageId>.json`文件
 *
 */
const path = require('node:path');
const fs = require('node:fs');
const enNlsPath = path.resolve(__dirname, '../package.nls.json');
const zhNlsPath = path.resolve(__dirname, '../package.nls.zh.json');

const packagePath = path.resolve(__dirname, '../package.json');

function exists(p) {
  return fs.existsSync(p);
}
String.prototype.getCharCode = function () {
  return this.charCodeAt(0);
};

String.prototype.upperCaseFirstChar = function () {
  const firstChar = this.charAt(0).toUpperCase();
  return firstChar.concat(this.slice(1));
};

const featureWords = ['GraphQL', 'CRUD'];

function transform(value) {
  const arr = value.split('.');
  let stack = [];
  let command = arr.length > 0 ? arr[1] : arr;
  let length = command.length;
  let char = command[0];
  let worlds = [];
  for (let idx = 0; idx < length; idx++) {
    if (idx === 0) {
      stack.push(char.toUpperCase());
      continue;
    }
    char = command[idx];
    if (char.getCharCode() > 96) {
      stack.push(char);
      continue;
    } else {
      const world = stack.join('');
      if (world.length) {
        worlds.push(world);
      }
      stack.length = 0;
      stack.push(char);
      for (let idx = worlds.length; idx > 0; idx--) {
        let cursor = idx;
        let newWorld = char;

        while (cursor > 0) {
          newWorld = worlds[cursor - 1].concat(newWorld);
          let popCount = 1;
          if (featureWords.includes(newWorld.split(' ').join(''))) {
            popCount = idx - cursor;
            while (popCount > 0) {
              worlds.pop();
              popCount -= 1;
            }
            worlds.pop();
            popCount = idx - cursor;
            while (popCount > 0) {
              worlds.push('');
              popCount--;
            }

            stack.length = 0;
            if (newWorld.length) {
              worlds.push(newWorld);
            }
            break;
          }
          cursor -= 1;
        }
      }
    }
  }
  if (stack.length) {
    worlds.push(stack.join(''));
  }
  return worlds
    .filter(it => it.length)
    .map(it => (!featureWords.includes(it) ? it.toLowerCase() : it))
    .join(' ')
    .upperCaseFirstChar();
}

function generateNLS() {
  if (!exists(enNlsPath)) {
    fs.writeFileSync(enNlsPath, '{}');
  }

  if (!exists(zhNlsPath)) {
    fs.writeFileSync(zhNlsPath, '{}');
  }

  const pkgContentBuffer = fs.readFileSync(packagePath);
  const pkgObj = JSON.parse(pkgContentBuffer.toString());
  const commands = pkgObj.contributes.commands || [];
  const content = {};
  commands.forEach(it => {
    const key = it.title.replace(/%/g, '');
    content[key] = transform(it.command);
  });

  [enNlsPath, zhNlsPath].forEach(p => {
    fs.writeFileSync(p, JSON.stringify(content), 'utf-8');
  });
}

/**
 * submenus:{
 *    id,
 *    label,
 *    icon: {
 *      dark:"",
 *      light:"",
 *   }
 * }
 */
function generateSubMenu() {}

function generateMenus() {}

function generateSubMenu() {}

/**
 * 辅助函数, 用于一开始获取命令数据的功能
 */
function generateCommandsObjs() {
  const pkgContentBuffer = fs.readFileSync(packagePath);
  const pkgObj = JSON.parse(pkgContentBuffer.toString());
  const commands = pkgObj.contributes.commands || [];
  const result = [];
  commands.forEach(cmd => {
    result.push({
      ...cmd,
      enablement: true,
      icon: '',
      shortTitle: '',
      when: '',
      group: '',
      alt: '',
    });
  });
  fs.writeFileSync(
    path.resolve(__dirname, 'commands.txt'),
    JSON.stringify(result),
  );
}

async function bootstrap() {
  generateCommandsObjs();
}

bootstrap();
