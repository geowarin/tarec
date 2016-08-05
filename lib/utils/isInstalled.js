const resolve = require('resolve');

function isInstalled (context, dependency) {
  let resolved;
  try {
    resolved = resolve.sync(dependency, {basedir: context.projectDir})
  } catch (e) {}
  return Boolean(resolved);
}

module.exports = isInstalled;
