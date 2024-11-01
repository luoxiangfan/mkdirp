# makedirp
The 'mkdir -p' command implementation for nodejs.Make directory recursively.

## Installation

```js
npm install makedirp
```

## Usage

```js
import { rmrfSync } from 'makedirp'
// or
import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
const { rmrfSync } = require('makedirp')
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
