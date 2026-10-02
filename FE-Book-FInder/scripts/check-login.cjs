// Run with: node scripts/check-login.cjs
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

const state = [];
let cursor = 0;
const native = new Proxy({ StyleSheet: { create: value => value }, Platform: { OS: 'android' } }, {
  get: (target, name) => target[name] ?? name,
});
const moduleMock = { exports: {} };
const code = ts.transpileModule(fs.readFileSync(`${__dirname}/../src/app/login.tsx`, 'utf8'), {
  compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.CommonJS },
}).outputText;
vm.runInNewContext(code, {
  exports: moduleMock.exports,
  require: name => {
    if (name.endsWith('.png')) return 1;
    if (name === 'react') return { useState: initial => {
      const index = cursor++;
      state[index] ??= initial;
      return [state[index], value => { state[index] = value; }];
    } };
    if (name === 'react/jsx-runtime') return { jsx: (type, props) => ({ type, props }), jsxs: (type, props) => ({ type, props }) };
    return native;
  },
});
function render() {
  cursor = 0;
  const nodes = [];
  function visit(node) {
    if (!node || typeof node !== 'object') return;
    nodes.push(node);
    [node.props.children].flat().forEach(visit);
  }
  visit(moduleMock.exports.default());
  return nodes;
}
let nodes = render();
const login = nodes.find(node => node.type === 'TouchableOpacity');
assert.equal(login.props.style.backgroundColor, '#FA6326');
assert.ok(login.props.style.minHeight >= 48);
const google = nodes.find(node => node.props.source?.uri);
assert.ok(google.props.source.uri.startsWith('data:image/svg+xml;base64,'));
assert.ok(Buffer.from(google.props.source.uri.split(',')[1], 'base64').toString().startsWith('<svg'));
assert.equal(nodes.find(node => node.props.accessibilityLabel === 'Password').props.secureTextEntry, true);
nodes.find(node => node.props.accessibilityLabel === 'Show password').props.onPress();
nodes = render();
assert.equal(nodes.find(node => node.props.accessibilityLabel === 'Password').props.secureTextEntry, false);
nodes.find(node => node.props.accessibilityLabel === 'Hide password').props.onPress();
assert.equal(render().find(node => node.props.accessibilityLabel === 'Password').props.secureTextEntry, true);
console.log('Login password visibility check passed.');
