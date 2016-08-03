const resolve = require('resolve');

function isInstalled (context, dependency) {
  console.log(context.projectDir);
  let resolved;
  try {
    resolved = resolve.sync(dependency, {basedir: context.projectDir})
  } catch (e) {
    console.log(e.message)
  }
  return Boolean(resolved);
}

module.exports = isInstalled;
