import { existsSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import type { MakeDirectoryOptions } from './type.js';
import {
  mkdirSyncRecursive,
  mkdirAsyncRecursive
} from '@lxf2513/mkdir-recursive';

function checkPath(path: string) {
  if (!!/[*\|\[\]=!#$~\n<>:"|?,']/.test(path)) {
    throw new Error(
      `cannot create directory '${path}': It contains special character(s)`
    );
  }
  if (existsSync(path)) {
    if (statSync(path).isFile()) {
      throw new Error(`cannot create directory '${path}': File exists`);
    }
  }
}

export async function mkdirp(
  path: string,
  mode?: MakeDirectoryOptions['mode']
) {
  const _path = resolve(path);
  checkPath(_path);
  try {
    await mkdirAsyncRecursive(path, mode);
    return _path;
  } catch (error) {
    try {
      if (!statSync(path).isDirectory()) {
        throw new Error(
          `cannot create directory '${_path}': No such directory`
        );
      }
    } catch {
      throw error;
    }
    return _path;
  }
}

export function mkdirpSync(
  path:
    | string
    | string[]
    | { path: string; mode?: MakeDirectoryOptions['mode'] }[],
  mode?: MakeDirectoryOptions['mode']
) {
  const paths: string[] = [];
  function makeSync(pth: string, makeMode?: MakeDirectoryOptions['mode']) {
    const _path = resolve(pth);
    checkPath(_path);
    try {
      mkdirSyncRecursive(pth, makeMode);
      paths.push(_path);
    } catch (error) {
      try {
        if (!statSync(pth).isDirectory()) {
          throw new Error(
            `cannot create directory '${_path}': No such directory`
          );
        }
      } catch {
        throw error;
      }
    }
  }
  if (typeof path === 'string') {
    makeSync(path, mode);
  } else {
    path.forEach((p) => {
      if (typeof p === 'string') {
        makeSync(p, mode);
      } else {
        makeSync(p.path, p.mode);
      }
    });
  }
  return paths;
}
