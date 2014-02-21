/**
 * Environment dependent configuration properties
 */
module.exports = {
    development: {
      root: require('path').normalize(__dirname + '/..')
      , app: {
          name: 'Nodejs Restify Mongoose Demo'
        , version: '0.9.14'
      }
      , openUserSignup: false // set to true to create users and assign a role, if false, API only allows admins to create an Admin role user
      , usernameOrPassword: true // true: Login, password reset and resend email verification can use either password or username, false: only username
      , host: 'localhost'
	    , port: '3000'
	    , db_prefix: 'mongodb'
  	  , db_port: '27017'
	    , db_database: 'test_database'
      , session_timeout:  1200000 // defaults to 20 minutes, in ms (20 * 60 * 1000)
      , ephemeral_cookie: false // if true, session cookie expires when browser closes
      , socket_loglevel: '1' // 0 - error, 1 - warn, 2 - info, 3 - debug
      , mailSettings : {
          mailService: null // use mailService (i.e. Gmail) or set up the host and port
          , from: 'someuser@validdomain.com'
          , host:'smtp.someserver.com'
          , port:'465'
          , secureConnection: true // use SSL
          , mailAuth: {user: "someuser@validdomain.com", pass: "somepassword"}
          , sendEmailFlag: false // if false uses email preview
          , browserPreview: true // if true email preview is shown in a new browser window/tab
      // see routes-user.js searchUsers
      // the search results only inlcude ObjectId, name, username and email
      // to further restrict returned fields, each (or all) of these can be set

      }
      , searchSettings : { // if any of these are false, that field will not be
          allowEmail: false
          , allowName: false
          , allowUsername: true


      // see routes-user.js searchUsers
      // the search results only inlcude ObjectId, name, username and email
      // to further restrict returned fields, each (or all) of these can be set to false
      }
      , searchSettings : { // if any of these are false, that field will not be populated
          allowEmail: false
          , allowName: false
          , allowUsername: true
      }
      // Range Check
      // https://npmjs.org/package/range_check
      // https://www.mediawiki.org/wiki/Help:Range_blocks
      // 24-bit block (/8 prefix, 1 × A)	10.0.0.0 - 10.255.255.255
      // 20-bit block (/12 prefix, 16 × B)	172.16.0.0 - 172.31.255.255
      // 16-bit block (/16 prefix, 256 × C)	192.168.0.0 - 192.168.255.255
      , ipRangeCheckFlag: true
      , adminIPRange: ['10.0.0.0/12', '192.0.0.0/16', '192.168.1.0/24', '127.0.0.0/8']
    }
    ,  unit_test: {
        root: require('path').normalize(__dirname + '/..')
        , openUserSignup: false // set to true to create users and assign a role, if false, API only allows admins to create an Admin role user
        , usernameOrPassword: true // true: Login, password reset and resend email verification can use either password or username, false: only username
        , host: 'localhost'
        , port: '3000'
        , db_prefix: 'mongodb'
        , db_port: '27017'
        , db_database: 'unit_test_database'
        , session_timeout:  1200000 // defaults to 20 minutes, in ms (20 * 60 * 1000)
        , ephemeral_cookie: false // if true, session cookie expires when browser closes
        , socket_loglevel: '1' // 0 - error, 1 - warn, 2 - info, 3 - debug
        , mailSettings : {
            mailFrom: 'test@gmail.com'
            , mailService: "Gmail"
            , mailAuth: {user: "test@gmail.com", pass: "testpass"}
            , sendEmail: false // if true need to have the mail service setup properly
            , browserPreview: false
        // see routes-user.js searchUsers
        // the search results only inlcude ObjectId, name, username and email
        // to further restrict returned fields, each (or all) of these can be set to false
        }
        , searchSettings : { // if any of these are false, that field will not be populated
            allowEmail: true
            , allowName: true
            , allowUsername: true
        }
        // Range Check
        // https://npmjs.org/package/range_check
        // https://www.mediawiki.org/wiki/Help:Range_blocks
        // 24-bit block (/8 prefix, 1 × A)	10.0.0.0 - 10.255.255.255
        // 20-bit block (/12 prefix, 16 × B)	172.16.0.0 - 172.31.255.255
        // 16-bit block (/16 prefix, 256 × C)	192.168.0.0 - 192.168.255.255
        , ipRangeCheckFlag: false
        , adminIPRange: ['10.0.0.0/12', '192.0.0.0/16', '192.168.1.0/24', '127.0.0.0/8']
    }
    , qa: {
        root: require('path').normalize(__dirname + '/..')
        , app: {
            name: 'Nodejs Restify Mongoose Demo'
        }
        , openUserSignup: false
    }
    , production: {
        root: require('path').normalize(__dirname + '/..')
        , app: {
            name: 'Nodejs Restify Mongoose Demo'
        }
        , openUserSignup: false
    }
}






