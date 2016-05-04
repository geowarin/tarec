module.exports = function addPlugins (context) {

  context.userConfig.plugins.forEach(plugin => {
    if (plugin.indexOf('.') === 0) {
      console.log('local plugin');
    } else {
      console.log('module plugin');
    }
  })
}
