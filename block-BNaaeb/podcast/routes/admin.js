let express = require('express');
let router = express.Router();

app.get('/', (req, res, next) => {
  res.render('adminDashboard');
})

module.exports = router;