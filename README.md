# makedirp
The 'mkdir -p' command implementation for nodejs.Make directory recursively.

## Installation

```js
npm install makedirp
```

## Usage

```js
import { mkdirpSync, mkdirp } from 'makedirp'
// or
import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
const { mkdirpSync, mkdirp } = require('makedirp')

mkdirpSync(path, mode?)

mkdirpSync([path1, path2], mode?)

mkdirpSync([{ path: path1, mode: 0o777 }, {path: path2}])

const paths = Promise.all([
  mkdirp('dir1/test'),
  mkdirp('dir2/config')
])

console.log(paths)

/*
[
	'/workspace/proj/dir1/test',
	'/workspace/proj/dir2/config'
]
*/
```

### Command Line Interface

```
Usage: makedirp [OPTION]... DIRECTORY...
Create the DIRECTORY(ies), if they do not already exist.

Options:
  --                     Treat all subsequent arguments as DIRECTORY(ies)
  -h, --help             display this help and exit
  -v, --version          output version information and exit
  -m=MODE, --mode=MODE   set file mode (as in chmod), not a=rwx - umask
