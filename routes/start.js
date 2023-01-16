let logger = require("../logger");
let crypto = require("../ath");

var express = require('express');
const {athGetBalance, athIsAddress} = require("../ath");
var router = express.Router();

const needle = require('needle');
const tweettext='I get access to storage IPFS cloud and minting NFT using the $ETHO faucet. Redundant, safe, distributed and censor resistant @ethoprotocol. \n\nStore data: upload.ethoprotocol.com\nMInt NFT: ethonft.com\n';
const tweettextlen=120;

async function validate_twittername(tweetid){
  const token = config.BEARER_TOKEN;
  const endpointURL = "https://api.twitter.com/2/users/by?usernames="
  
  return new Promise(  async ( resolve, reject ) => {
    // These are the parameters for the API request
    // specify User names to fetch, and any additional fields that are required
    // by default, only the User ID, name and user name are returned
    const params = {
      usernames: tweetid, // Edit usernames to look up
      "user.fields": "created_at,description", // Edit optional query parameters here
      "expansions": "pinned_tweet_id"
    }
    
    // this is the HTTP header that adds bearer token authentication
    const res2 = await needle('get', endpointURL, params, {
      headers: {
        "User-Agent": "v2UserLookupJS",
        "authorization": `Bearer ${token}`
      }
    })
    
    if (res2.body) {
      if (res2.body.errors == undefined)
        resolve(res2.body);
      else {
        logger.error("#server.routes.start.validate_twittername: Unsuccessful request");
        reject();
      }
    } else {
      logger.error("#server.routes.start.validate_twittername: Unsuccessful request");
      reject();
    }
  });
}

async function validate_search(tweetid){
  const token = config.BEARER_TOKEN;
  const endpointUrl = "https://api.twitter.com/2/tweets/search/recent";
  
  return new Promise(  async ( resolve, reject ) => {
    // These are the parameters for the API request
    // specify User names to fetch, and any additional fields that are required
    // by default, only the User ID, name and user name are returned
    const params = {
      'query': 'from:'+tweetid+' @ethoprotocol'
    }
    
    // this is the HTTP header that adds bearer token authentication
    const res2 = await needle('get', endpointUrl, params, {
      headers: {
        "User-Agent": "v2UserLookupJS",
        "authorization": `Bearer ${token}`
      }
    })
    
    if (res2.body) {
      if (res2.body.errors == undefined)
        resolve(res2.body);
      else {
        logger.error("#server.routes.start.validate_search: Unsuccessful request");
        reject();
      }
    } else {
      logger.error("#server.routes.start.validate_search: Unsuccessful request");
      reject();
    }
  });
}

async function validate_followship(tweetid){
  const token = config.BEARER_TOKEN;
  const endpointURL = "https://api.twitter.com/1.1/friendships/show.json?source_screen_name=&target_screen_name"
  
  return new Promise(  async ( resolve, reject ) => {
    // These are the parameters for the API request
    // specify User names to fetch, and any additional fields that are required
    // by default, only the User ID, name and user name are returned
    const params = {
      source_screen_name: "ethoprotocol", // Edit usernames to look up
      target_screen_name: tweetid
    }
    
    // this is the HTTP header that adds bearer token authentication
    const res2 = await needle('get', endpointURL, params, {
      headers: {
        "User-Agent": "v2UserLookupJS",
        "authorization": `Bearer ${token}`
      }
    })
    
    if (res2.body) {
      if (res2.body.errors == undefined)
        resolve(res2.body);
      else {
        logger.error("#server.routes.start.validate_followship: Unsuccessful request");
        reject();
      }
    } else {
      logger.error("#server.routes.start.validate_followship: Unsuccessful request");
      reject();
    }
  });
}


/* GET home page. */
router.get('/1', async function(req, res, next) {
  
  if (config.DEVELOPMENT) {
    address="0x7771C1D3aF8E698bA0e43124c365F7C7202354e6";
  } else {
    address='0x...';
  }
  res.render('start', {
    title: 'Step 1',
    address: address
  });
});

router.get('/transfer', async function(req, res, next) {
  
  if (config.DEVELOPMENT) {
    address="0x7771C1D3aF8E698bA0e43124c365F7C7202354e6";
  } else {
    address='0x...';
  }
  res.render('start', {
    title: 'Step 1',
    address: address
  });
});






//    /$$$$$$$   /$$$$$$   /$$$$$$  /$$$$$$$$
//    | $$__  $$ /$$__  $$ /$$__  $$|__  $$__/
//    | $$  \ $$| $$  \ $$| $$  \__/   | $$
//    | $$$$$$$/| $$  | $$|  $$$$$$    | $$
//    | $$____/ | $$  | $$ \____  $$   | $$
//    | $$      | $$  | $$ /$$  \ $$   | $$
//    | $$      |  $$$$$$/|  $$$$$$/   | $$
//    |__/       \______/  \______/    |__/

// Register Proccess




router.post('/1',function(req, res, next){
  logger.info("#server.routes.start.post.1: %s", req.body.ethoaddr);
  
  if (!crypto.athIsAddress("ETHO", req.body.ethoaddr)) {
    req.flash('danger', 'The address \"' + req.body.ethoaddr + '\" provided is not correct. Make sure it is a valid ETHO or Ethereum based address.');
    res.redirect('/start/1');
  } else {
    logger.info("#server.routes.start.post.1: Success.");
    req.flash('success', 'The address \"' + req.body.ethoaddr + '\" is valid.');
    
    res.render('tweet', {
      title: 'Step 2',
      tweet: 'I get access to storage IPFS cloud and minting NFT using the $ETHO faucet. Redundant, safe, distributed and censor resistant @ethoprotocol. \n\nStore data: upload.ethoprotocol.com\nMInt NFT: ethonft.com\n',
      ethoaddr: req.body.ethoaddr,
      tweetid: ""
    });
    
  }
});


router.post('/2',async function(req, res, next){
  logger.info("#server.routes.start.post.2: %s", req.body.ethoaddr);
  logger.info("#server.routes.start.post.2: %s",req.body.id);
  logger.info("#server.routes.start.post.2: %s",req.body.tweetid);
  
  
  await validate_twittername(req.body.tweetid)
    .then(function (response) {
      req.flash('success', 'Your Tweetname \"' + req.body.tweetid + '\" is valid.');
      
      // Now let's check if we are friends already in that case we can jump the next step
      validate_followship(req.body.tweetid)
        .then(function (response) {
          if(response.relationship.target.following) {
            // We will check now if there is a recent tweet with the body id if so we will skip following
            res.render('like', {
              title: 'Step 3',
              tweetid: req.body.tweetid,
              ethoaddr: req.body.ethoaddr,
              follow: true
            });
          } else {
            res.render('like', {
              title: 'Step 3',
              tweetid: req.body.tweetid,
              ethoaddr: req.body.ethoaddr,
              follow: false
            });
          }
        })
        .catch(function(error) {
          logger.error("#server.routes.start.post.2: Can not determine followship: %s", error);
        })
    })
    .catch(function(error) {
      logger.info("#server.routes.start.post.2: Wrong twitter name: ",req.body.tweetid);
      console.log(error);
      req.flash('danger', 'The Twittername \"' + req.body.tweetid + '\" provided is not correct. Make sure it is valid.');
      res.render('tweet', {
        title: 'Step 2',
        tweet: 'I get access to storage IPFS cloud and minting NFT using the $ETHO faucet. Redundant, safe, distributed and censor resistant @ethoprotocol. \n\nStore data: upload.ethoprotocol.com\nMInt NFT: ethonft.com\n'+ req.body.id,
        ethoaddr: req.body.ethoaddr,
        tweetid: req.body.tweetid
      });
    })
});

router.post('/3',async function(req, res, next){
  logger.info("#server.routes.start.post.3: %s",req.body.id);
  logger.info("#server.routes.start.post.3: %s",req.body.ethoaddr);
  logger.info("#server.routes.start.post.3: %s",req.body.tweetid);
  let explore;
  let sql;
  
  if (config.FAUCET_CURRENCY=="ETHO") {
    explore="https://explorer.ethoprotocol.com";
  } else {
    explore="https://testnetexplorer.ethoprotocol.com";
  }
  
  // First we check if the user has been here
  sql = "SELECT * FROM tweet WHERE screenname = " + pool.escape(req.body.tweetid);
  pool.query(sql)
    .then((userrows) => {
      if (userrows.length == 0) {
        logger.info("#server.routes.start.post.3: Great.User not found %s", req.body.tweetid);
        // No entry: a new user
        // Let us check the other conditions before entering him
        // We check again if the user follow us
        validate_followship(req.body.tweetid)
          .then(async function (response) {
            if (response.relationship.target.following) {
              req.flash('success', 'You liked us already, that is great. So let us finish things up...');
              // We will check now if there is a recent tweet with the body id if so we will transfer funds to the address
              let explore;
          
              if (config.FAUCET_CURRENCY == "ETHO") {
                explore = "https://explorer.ethoprotocol.com";
              } else {
                explore = "https://testnetexplorer.ethoprotocol.com";
              }
              await validate_search(req.body.tweetid)
                .then(function (response) {
                  console.dir(response, {
                    depth: null
                  });
                  let i=0;
                  // check all tweets with 7 days retention
                  if (response.meta.result_count != 0) {
                    console.log("we see tweets");
                    // We could find a tweets mentioning @ethoprotocol, so let us check further
                    for (i = 0; i < response.data.length; i++) {
                      console.log(response.data[i].text.substring(0, tweettextlen));
                      console.log(tweettext);
                      
                      if (response.data[i].text.substring(0, tweettextlen) == tweettext.substring(0, tweettextlen)) {
                        console.log("found");
                        break;
                      }
                    }
                    console.log(response.data.length);
                    if (i < response.data.length) {
                      // So we found a tweet
                      // if we have come here we transfer funds
                      crypto.athdoTransfer(config.FAUCET_CURRENCY, config.FAUCET_ADDR, req.body.ethoaddr, "0.01").then((response) => {
                        logger.info("#server.routes.start.post.3: Success %s", response);
                        sql = "INSERT INTO tweet (screenname, tweettime) VALUES (" +
                          pool.escape(req.body.tweetid) + ", '" +
                          pool.mysqlNow() +
                          "')";
                        pool.query(sql)
                          .then(() => {
                            // Finalize
                            explore = explore + "/tx/" + response;
                            res.render('transfer', {
                              title: 'Validation',
                              ethoaddr: req.body.ethoaddr,
                              tweetid: req.body.tweetid,
                              explorerurl: explore,
                              tx: response
                            });
                          })
                          .catch((error) => {
                            logger.error("#server.routes.start.post.3: Error %s", error);
                            req.flash('danger', 'Database issue. please contact our support');
                            res.redirect("/");
                          })
  
                      })
                        .catch((error) => {
                          logger.error("#server.routes.start.post.3: Error %s", error);
                          req.flash('danger', 'Issue when transfering funds. Please contact support');
                          res.redirect("/");
                        })
    
    
                    } else {
                      logger.info("#server.routes.start.post.3: You seem not to have sent the tweet.");
                      req.flash('danger', 'The tweet cannot be found. Please make sure you sent the tweet unchanged.');
                      res.render('tweet', {
                        title: 'Step 2',
                        tweet: tweettext,
                        ethoaddr: req.body.ethoaddr,
                        tweetid: req.body.tweetid
                      });
                    }
                  } else {
                    logger.info("#server.routes.start.post.3: You seem not to have sent the tweet.");
                    req.flash('danger', 'The tweet cannot be found. Please make sure you sent the tweet unchanged.');
                    res.render('tweet', {
                      title: 'Step 2',
                      tweet: tweettext,
                      ethoaddr: req.body.ethoaddr,
                      tweetid: req.body.tweetid
                    });
                  }
                })
                .catch(function (error) {
                  logger.info("#server.routes.start.post.3: Tweet issue: %s", error);
                  req.flash('danger', 'The tweet cannot be found. Please contact support.');
                  res.redirect("/");
                })
  
            } else {
              req.flash('danger', 'Please follow us to claim ETHO.');
              res.render('like', {
                title: 'Step 3',
                tweet: tweettext,
                tweetid: req.body.tweetid,
                ethoaddr: req.body.ethoaddr
              });
            }
          })
          .catch(function (error) {
            logger.error("#server.routes.start.post.3: Can not determine followship: %s", error);
          })
    
    
      } else {
        logger.info("#server.routes.start.post.3: User got faucet already: %s", req.body.tweetid);
        req.flash('danger', 'You already used the faucet.');
        res.redirect("/");
  
      }
    })
    .catch((error) => {
      logger.error('#server.routes.start.post.3: Database error %s', error);
    });
  
  
  
});


module.exports = router;
