const resolve = require('resolve');

function isInstalled (context, dependency) {
  console.log(context.projectDir);
  let resolved;
  try {
    resolved = resolve.sync(dependency, {basedir: context.projectDir})
  } catch (e) {}
  return Boolean(resolved);
}

module.exports = isInstalled;
