module.exports = function (babel) {
  return {
    visitor: {
      CallExpression(path) {
        // console.log(path);
        if (path.get("callee").node.object) {
            if (
                path.get("callee").node.object.name === 'console'
                && path.get("callee").node.property.name === 'log'
            ) { path.remove() };
        } 
        // reverse the name: JavaScript -> tpircSavaJ
        // path.node.name = name.split("").reverse().join("");
      }
    }
  };
}