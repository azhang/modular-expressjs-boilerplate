var express = require("express");
var router = express.Router();
var controller = require("./controller");

// ## Preload model middleware
// e.g. router.param('user_id', controller.loadUser);

// ## Routes
router.get('/', controller.index);


module.exports = router;