process.on('unhandledRejection', (error) => {
  throw error
})

const cp = require('child_process')
const jest = require('jest')

const jestConfig = {
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
  testMatch: ['**/*.test.js'],
}

function spawn(command, args) {
  return new Promise((resolve, reject) => {
    cp.spawn(command, args, { stdio: 'inherit' }).on('close', (code) => {
      if (code === 0) {
        resolve()
      } else {
        reject(code)
      }
    })
  })
}

async function test() {
  await spawn('node_modules/typescript/bin/tsc', ['--project', 'test/ts'])
  await jest.run(['--config', JSON.stringify(jestConfig), ...process.argv.slice(2)])
}

module.exports = module.parent ? test : test().catch(process.exit)
