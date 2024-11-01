import fs from 'node:fs';
import fsPromises from 'node:fs/promises';
import nodePath from 'node:path';
import type { MakeDirectoryOptions } from './type.js';

function isPathValid(path: string): boolean {
  return !/[*\|\[\]=!#$~\n<>:"|?,']/.test(path);
}

function hasExist(path: string): boolean {
  return fs.existsSync(path);
}

function absolutePath(path: string) {
  return nodePath.resolve(path);
}

function checkPath(path: string) {
  if (!isPathValid(path)) {
    throw new Error(
      `cannot create directory '${absolutePath(path)}': It contains special character(s)`
    );
  }
  if (hasExist(path)) {
    if (fs.statSync(path).isFile()) {
      throw new Error(
        `cannot create directory '${absolutePath(path)}': File exists`
      );
    }
  }
}

export async function mkdirp(
  path: string,
  mode?: MakeDirectoryOptions['mode']
) {
  checkPath(path);
  try {
    await fsPromises.mkdir(path, { mode, recursive: true });
    return absolutePath(path);
  } catch (error) {
    try {
      const stats = await fsPromises.stat(path);
      if (!stats.isDirectory()) {
        throw new Error(
          `cannot create directory '${absolutePath(path)}': No such directory`
        );
      }
    } catch {
      throw error;
    }
    return absolutePath(path);
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
    checkPath(pth);
    try {
      fs.mkdirSync(pth, { mode: makeMode, recursive: true });
      paths.push(absolutePath(pth));
    } catch (error) {
      try {
        if (!fs.statSync(pth).isDirectory()) {
          throw new Error(
            `cannot create directory '${absolutePath(pth)}': No such directory`
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
