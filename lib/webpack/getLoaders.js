module.exports = function getLoader (loadersObj, context) {
  const loaders = Object.keys(loadersObj).reduce((p, k) => {
    const loaders = loadersObj[k].map(l => {
      if (typeof l === 'function') {
        return l(context);
      }
      return l;
    });
    return p.concat(loaders);
  }, []);
  return loaders;
};
