let logger = require("../logger");
let crypto = require("../ath");

var express = require('express');
const {athGetBalance} = require("../ath");
var router = express.Router();

/* GET home page. */
router.get('/', async function(req, res, next) {
  let balance="";

  await crypto.athGetBalance("ETHO", config.FAUCET_ADDR)
    .then((result) => {
      balance=Math.round(result*1000)/1000;
  })
    .catch((error) => {
        logger.error('#routes.index: %s', error);
        req.flash('danger', 'The faucet is in maintenance. Please check later or contact us on discord');
        res.redirect('/error');
    });
  
  res.render('index', {
    title: 'Faucet',
    faucetAmount: config.FAUCET_AMOUNT,
    faucetCurrency: config.FAUCET_CURRENCY,
    faucetAddress: config.FAUCET_ADDR,
    faucetBalance: balance
  });
});

router.get('/termsofservice', async function(req, res, next) {
  
  res.render('termsofservice', {
    title: 'Faucet - Terms of service',
  });
});



module.exports = router;
