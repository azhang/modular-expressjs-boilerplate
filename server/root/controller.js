/**
 * Load the default layout for index
 * @param  {Object} req 
 * @param  {Object} res 
 */
exports.index = function (req, res) {
  var data = {};
  
  res.render("root/views/index", data);
};