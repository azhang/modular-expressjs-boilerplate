require("colors");

/**
 * Register each module with `app`
 * @param  {Object} app     Express app
 * @param  {String[]} modules Modules to load
 */
module.exports = function(app, modules) {
  process.stdout.write("Register modules:");
  modules.forEach(function(moduleName) {
    var modulePath = __dirname + "/../" + moduleName;
    try {
      var module = require(modulePath);

      // Register router
      if (module.router) app.use('/', module.router);
      process.stdout.write(" "+moduleName.green);

    } catch (err) {
      console.log("\n"+moduleName.red, err.stack);
    }
  });
  process.stdout.write("\n");
};


/* (Possible future use, for automatic module loading)
// EXAMPLE
//var fs      = require("fs")
//Bootstrap models
var models_path = __dirname + '/app/models';
var walk = function(path) {
    fs.readdirSync(path).forEach(function(file) {
        var newPath = path + '/' + file;
        var stat = fs.statSync(newPath);
        if (stat.isFile()) {
            if (/(.*)\.(js$|coffee$)/.test(file)) {
                require(newPath);
            }
        } else if (stat.isDirectory()) {
            walk(newPath);
        }
    });
};
walk(models_path);
*/