const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('../../frontend/node_modules/typescript');

// Run the production TS modules with dependency seams, not reimplemented logic.
module.exports = function createLoader(mocks = {}, globals = {}) {
  const cache = new Map();
  function load(filename) {
    const absolute = path.resolve(filename);
    if (cache.has(absolute)) return cache.get(absolute);
    const exports = {};
    cache.set(absolute, exports);
    const source = ts.transpileModule(fs.readFileSync(absolute, 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020,
        jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
    }).outputText;
    vm.runInNewContext(source, { exports, console, URL, URLSearchParams, fetch, ...globals,
      require(name) {
        if (name.startsWith('node:')) return require(name);
        if (Object.hasOwn(mocks, name)) return mocks[name];
        if (name.startsWith('@/')) return load(`frontend/src/${name.slice(2)}.ts`);
        if (name.startsWith('.')) return load(path.resolve(path.dirname(absolute), `${name}.ts`));
        return require(path.resolve('frontend/node_modules', name));
      },
    }, { filename: absolute });
    return exports;
  }
  return load;
};
