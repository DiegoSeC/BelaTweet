var dotenv = require('dotenv');
var express = require('express');
var OAuth = require('oauth-1.0a');
var OAuthRequest = require('oauth-request');
var request = require('request');
var crypto = require('crypto');
var session = require('express-session');
var qs = require('querystring')

dotenv.config();

const _twitterConsumerKey = process.env.TWITTER_CONSUMER_KEY;
const _twitterConsumerSecret = process.env.TWITTER_CONSUMER_SECRET;

const _twitterAccessTockenKey = process.env.TWITTER_ACCESS_TOKEN_KEY;
const _twitterAccessTockenKeySecret = process.env.TWITTER_ACCESS_TOKEN_SECRET;

const _port = process.env.PORT || 8080;
const _OAuthOptions = {
    consumer: {
        key: _twitterConsumerKey,
        secret: _twitterConsumerSecret,
    },
    signature_method: 'HMAC-SHA1',
    hash_function(baseString, key) {
        return crypto.createHmac('sha1', key).update(baseString).digest('base64')
    },
}

var app = express();
app.use(express.json())
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));

const oauth = OAuth(_OAuthOptions)

app.get('/auth/twitter', function (req, res) {
    const options = {
        url: 'https://api.twitter.com/oauth/request_token',
        method: 'POST',
        data: {
            oauth_callback: `http://127.0.0.1:${_port}/auth/twitter/callback`
        },
    }
    request(
        {
            url: options.url,
            method: options.method,
            form: options.data,
            headers: oauth.toHeader(oauth.authorize(options))
        },
        function (error, response, body) {
            var resData = qs.parse(body)
            if (error) {
                res.statusCode = 500;
                res.send(resData);
            }

            req.session.oauthRequestToken = resData.oauth_token;
            req.session.oauthRequestTokenSecret = resData.oauth_token_secret;

            res.redirect(`https://twitter.com/oauth/authorize?${qs.stringify({ oauth_token: resData.oauth_token })}`);
        }
    )

})

app.get('/auth/twitter/callback', function (req, res) {
    const options = {
        url: 'https://api.twitter.com/oauth/access_token',
        method: 'POST',
        data: {
            oauth_consumer_key: _twitterConsumerKey,
            oauth_verifier: req.query.oauth_verifier,
            oauth_token: req.query.oauth_token,
        },
    }
    request(
        {
            url: options.url,
            method: options.method,
            form: oauth.authorize(options),
            headers: oauth.toHeader(oauth.authorize(options))
        },
        function (error, response, body) {
            var resData = qs.parse(body)
            if (error) {
                res.statusCode = 500;
                res.send(resData);
            }

            console.log(resData)

            req.session.oauthToken = resData.oauth_token;
            req.session.oauthTokenSecret = resData.oauth_token_secret;
            req.session.userId = resData.user_id;
            req.session.screenName = resData.screen_name;

            // res.send(resData)

            res.redirect(`https://twitter.com/oauth/authorize?${qs.stringify({ oauth_token: resData.oauth_token })}`);
        }
    )
})

app.get('/twitter/user_timeline', function (req, res) {
    var twitter = OAuthRequest(_OAuthOptions)

    var authToken = {
        key: req.session.oauthToken,
        secret: req.session.oauthTokenSecret,
    }

    twitter.setToken(authToken);

    twitter.get('https://api.twitter.com/1.1/statuses/user_timeline.json', function (error, response, body) {
        var resData = JSON.parse(body)
        if (error) {
            res.statusCode = 500;
            res.send(resData);
        }
        res.send(resData)
    });
})

app.get('/twitter/timeline', function (req, res) {
    var twitter = OAuthRequest(_OAuthOptions)

    var authToken = {
        key: req.session.oauthToken,
        secret: req.session.oauthTokenSecret,
    }

    twitter.setToken(authToken);

    twitter.get('https://api.twitter.com/1.1/statuses/home_timeline.json', function (error, response, body) {
        var resData = JSON.parse(body)
        if (error) {
            res.statusCode = 500;
            res.send(resData);
        }
        res.send(resData)
    });
})

app.get('/twitter/user_timeline', function (req, res) {
    var twitter = OAuthRequest(_OAuthOptions)

    var authToken = {
        key: req.session.oauthToken,
        secret: req.session.oauthTokenSecret,
    }

    twitter.setToken(authToken);

    twitter.get('https://api.twitter.com/1.1/statuses/user_timeline.json', function (error, response, body) {
        var resData = JSON.parse(body)
        if (error) {
            res.statusCode = 500;
            res.send(resData);
        }
        res.send(resData)
    });
})

app.get('/twitter/favorites', function (req, res) {
    var twitter = OAuthRequest(_OAuthOptions)

    var authToken = {
        key: req.session.oauthToken,
        secret: req.session.oauthTokenSecret,
    }

    twitter.setToken(authToken);

    twitter.get('https://api.twitter.com/1.1/favorites/list.json', function (error, response, body) {
        var resData = JSON.parse(body)
        if (error) {
            res.statusCode = 500;
            res.send(resData);
        }
        res.send(resData)
    });
})

app.delete('/twitter/like/:id_str', function (req, res) {
    var twitter = OAuthRequest(_OAuthOptions)
    var authToken = {
        key: req.session.oauthToken,
        secret: req.session.oauthTokenSecret
    }
    twitter.setToken(authToken);
    var options = {
        url: `https://api.twitter.com/1.1/favorites/destroy.json`,
        qs: { id: req.params.id_str }
    };

    twitter.post(options, function (error, response, body) {
        var resData = JSON.parse(body)
        if (error) {
            res.statusCode = 500;
            res.send(resData);
        }
        res.send(resData)
    });
})

app.post('/twitter/like/:id_str', function (req, res) {
    var twitter = OAuthRequest(_OAuthOptions)
    var authToken = {
        key: req.session.oauthToken,
        secret: req.session.oauthTokenSecret
    }
    twitter.setToken(authToken);
    var options = {
        url: `https://api.twitter.com/1.1/favorites/create.json`,
        qs: { id: req.params.id_str }
    };

    twitter.post(options, function (error, response, body) {
        var resData = JSON.parse(body)
        if (error) {
            res.statusCode = 500;
            res.send(resData);
        }
        res.send(resData)
    });
})

app.get('/twitter/tweet/:id_str', function (req, res) {
    var twitter = OAuthRequest(_OAuthOptions)
    var authToken = {
        key: req.session.oauthToken,
        secret: req.session.oauthTokenSecret
    }
    twitter.setToken(authToken);
    var options = {
        url: 'https://api.twitter.com/1.1/statuses/show.json',
        qs: { id: req.params.id_str }
    };

    twitter.get(options, function (error, response, body) {
        var resData = JSON.parse(body)
        if (error) {
            res.statusCode = 500;
            res.send(resData);
        }
        res.send(resData)
    });
})
/**/
app.post('/twitter/tweet', function (req, res) {
    var twitter = OAuthRequest(_OAuthOptions)
    var authToken = {
        key: req.session.oauthToken,
        secret: req.session.oauthTokenSecret
    }
    // var authToken = {
    //     key: _twitterAccessTockenKey,
    //     secret: _twitterAccessTockenKeySecret
    // }
    twitter.setToken(authToken);
    var options = {
        url: 'https://api.twitter.com/1.1/statuses/update.json',
        form: req.body
    };
    twitter.post(options, function (error, response, body) {
        var resData = JSON.parse(body)
        if (error) {
            res.statusCode = 500;
            res.send(resData);
        }
        res.send(resData)
    });
})

app.get('/twitter/retweets/:id_str', function (req, res) {
    var twitter = OAuthRequest(_OAuthOptions)
    var authToken = {
        key: req.session.oauthToken,
        secret: req.session.oauthTokenSecret
    }
    twitter.setToken(authToken);
    var options = {
        url: `https://api.twitter.com/1.1/statuses/retweets/${req.params.id_str}.json`,
    };

    twitter.get(options, function (error, response, body) {
        var resData = JSON.parse(body)
        if (error) {
            res.statusCode = 500;
            res.send(resData);
        }
        res.send(resData)
    });
})

app.delete('/twitter/retweet/:id_str', function (req, res) {
    var twitter = OAuthRequest(_OAuthOptions)
    var authToken = {
        key: req.session.oauthToken,
        secret: req.session.oauthTokenSecret
    }
    twitter.setToken(authToken);
    var options = {
        url: `https://api.twitter.com/1.1/statuses/unretweet/${req.params.id_str}.json`,
    };

    twitter.post(options, function (error, response, body) {
        var resData = JSON.parse(body)
        if (error) {
            res.statusCode = 500;
            res.send(resData);
        }
        res.send(resData)
    });
})

app.post('/twitter/retweet/:id_str', function (req, res) {
    var twitter = OAuthRequest(_OAuthOptions)
    var authToken = {
        key: req.session.oauthToken,
        secret: req.session.oauthTokenSecret
    }
    twitter.setToken(authToken);
    var options = {
        url: `https://api.twitter.com/1.1/statuses/retweet/${req.params.id_str}.json`,
    };

    twitter.post(options, function (error, response, body) {
        var resData = JSON.parse(body)
        if (error) {
            res.statusCode = 500;
            res.send(resData);
        }
        res.send(resData)
    });
})

app.get('/twitter/search/:q', function (req, res) {
    var twitter = OAuthRequest(_OAuthOptions)
    var authToken = {
        key: req.session.oauthToken,
        secret: req.session.oauthTokenSecret
    }
    twitter.setToken(authToken);
    var options = {
        url: `https://api.twitter.com/1.1/search/tweets.json`,
        qs: { q: req.params.q }
    };

    twitter.get(options, function (error, response, body) {
        var resData = JSON.parse(body)
        if (error) {
            res.statusCode = 500;
            res.send(resData);
        }
        res.send(resData)
    });
})

app.listen(_port, () => console.log(`Listening on port ${_port}`));
