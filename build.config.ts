import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  declaration: true,
  rollup: {
    emitCJS: true,
    output: {
      exports: 'named'
    }
  },
  entries: [
    'src/index',
    {
      input: 'src/bin',
      format: 'cjs'
    }
  ]
})