#!/usr/bin/env node
import { createInterface } from 'readline';
import { mkdirpSync } from './index.js';
import packageConfig from '../package.json' assert { type: 'json' };
import type { Mode } from './type.js';

const { name, version } = packageConfig;

const log = (str: string) => {
  console.log('\x1b[31m%s\x1b[0m', str);
};

const helpInfo = () => {
  log(`Try '${name} --help' for more information.`);
};

export const help = `${name} ${version}

Usage: ${name} [OPTION]... DIRECTORY...
Create the DIRECTORY(ies), if they do not already exist.

Options:
  --                     Treat all subsequent arguments as DIRECTORY(ies)
  -h, --help             display this help and exit
  -v, --version          output version information and exit
  -m=MODE, --mode=MODE   set file mode (as in chmod), not a=rwx - umask
`;

const validArgs = ['--', '-h', '-v', '-m', '--help', '--version', '--mode'];

const main = async (...args: string[]) => {
  const _args = args.filter((i) => i.trim());
  let paths: string[] = [];
  let options: string[] = [];
  const splitChar = '--';
  const idx = _args.findIndex((arg) => arg === splitChar);
  if (!_args.length || (_args.length === 1 && idx > -1)) {
    log(`${name}: missing operand`);
    helpInfo();
    return 1;
  }
  if (idx > -1 && _args.length > 1) {
    options = _args.slice(0, idx);
    paths = _args.slice(idx).filter((a) => a !== splitChar);
  }
  if (idx < 0 && _args.length) {
    options = _args.filter((a) => /^-/.test(a));
    paths = _args.filter((a) => !/^-/.test(a));
  }
  let mode: Mode = undefined;
  if (options.length) {
    const arg =
      options.length === 1
        ? options[0]
        : options.filter((o) => o !== '-m' && o !== '--mode')[0];
    const setMode = arg.includes('-m=') || arg.includes('--mode=');
    if (validArgs.includes(arg) || setMode) {
      if (arg === '-h' || arg === '--help') {
        console.log(help);
        return 0;
      } else if (arg === '-v' || arg === '--version') {
        console.log(`${name} ${version}`);
        return 0;
      } else if (setMode) {
        mode = parseInt(arg.replace(/^(-m|--mode)=/, ''), 8);
        if (isNaN(mode)) {
          log(`invalid mode '${mode}'. It must be an octal number.`);
          helpInfo();
          return 1;
        }
      }
    } else {
      log(`unknown option: ${arg}`);
      helpInfo();
      return 1;
    }
  }

  const rl = createInterface({
    input: process.stdin,
    output: process.stdout
  });

  mkdirpSync(paths, mode);

  rl.close();

  return 0;
};
main.help = help;
main.version = version;

export default main;

const args = process.argv.slice(2);
main(...args).then(
  (code) => process.exit(code),
  (err) => {
    log(err);
    process.exit(1);
  }
);
