class filelist {
  constructor(options) {
    this.options = options;
  }

  apply(compiler) {
    // compiler.plugin("after-emit", (compilation, callback) => {
    //   console.log("Hello world");
    //   callback();
    // })



    compiler.plugin('emit', function(compilation, callback) {
      // Create a header string for the generated file:
      var filelist = 'In this build:\n\n';
  
      // Loop through all compiled assets,
      // adding a new line item for each filename.
      for (var filename in compilation.assets) {
        filelist += ('- '+ filename +'\n');
      }
      
      // Insert this list into the Webpack build as a new file asset:
      compilation.assets['filelist.md'] = {
        source: function() {
          return filelist;
        },
        size: function() {
          return filelist.length;
        }
      };
  
      console.log("filelist");
      callback();
    });
  }
}

module.exports = filelist;