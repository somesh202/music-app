import camelCase from 'lodash/camelCase';

const modules = {};
const context = require.context('.', false, /\.js$/);

// const modules = {},

context.keys().forEach((fileName) => {
  if (fileName === './index.js') {
    return;
  }

  const moduleConfig = context(fileName);
  const moduleName = camelCase(fileName.replace(/(\.\/|\.js)/g, ''));
  modules[moduleName] = moduleConfig.default || moduleConfig;
});

export default modules;
