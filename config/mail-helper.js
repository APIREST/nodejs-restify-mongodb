var path = require('path')
    , nodemailer = require('nodemailer')
    , emailTemplates = require('swig-email-templates'); // https://github.com/superjoe30/swig-email-templates
  
// create reusable transport method (opens pool of SMTP connections)
var transport = null;

// setup e-mail data with unicode symbols
var mailOptions = {
    from: "", // sender address
    to: "", // list of receivers
    subject: "", // Subject line
    text: "", // plaintext body
    html: "", // html body
    service: {},
    auth: {}
}

var templateOptions = {
  root: path.join(__dirname, "templates"),
  // any other swig options allowed here
};

/**
 * <p>Generates a MailHelper object which is the main 'hub' for managing the
 * send process</p>
 *
 * @constructor
 * @param {Object} options Message options object, see README for the complete list of possible options
 */
var MailHelper = function(config) {
    this.initialize(config);
}

MailHelper.prototype.initialize = function(appConfig){
    if (!appConfig.mailSettings) throw "no options provided, some are required"; 
    if (!appConfig.mailSettings.mailFrom) throw "cannot send email without send address";
    if (!appConfig.mailSettings.mailService) throw "Service required";
    if (!appConfig.mailSettings.mailAuth) throw "Authorization required";

    mailOptions.from = appConfig.mailFrom; 

    mailOptions.service = appConfig.mailSettings.service;
    mailOptions.auth = appConfig.mailSettings.auth;
};

// send mail with defined transport object
MailHelper.prototype.sendMail = function(recipient, subject, body, htmlFlag) {
    if (null === transport) {
        this.createTransport();
    }
    var sendOptions = {};
    sendOptions.mailFrom = mailOptions.mailFrom;
    sendOptions.to = recipient;
    sendOptions.subject = subject;
    if (htmlFlag) {
        sendOptions.html = body;
    } else {
        sendOptions.text = body;
    }            
    transport.sendMail(sendOptions, function(error, response){
        if (error) {
            console.log(error);
        } else {
            console.log("Message sent: " + response.message);
        }
    });
};
  
// close the connection
MailHelper.prototype.closeConnection = function(){
    if (null != transport) {
        transport.close(); // shut down the connection pool, no more messages
    }
    transport = null;
};

// create the transport
MailHelper.prototype.createTransport = function() {
    if (null != transport) {
        this.closeConnection();
    }
    if (config.mailSettings.sendEmail) {
        transport = nodemailer.createTransport("SMTP",{
            service: config.mailSettings.mailService,
            auth: config.mailSettings.mailAuth
        });
    } else {
        // For email previews
        require('mail-preview');
        var tmpdir = path.join(__dirname, 'tmp', 'nodemailer');

         transport = nodemailer.createTransport('MailPreview', {
           dir: tmpdir,  // defaults to ./tmp/nodemailer
           browser: config.mailSettings.browserPreview // open sent email in browser (mac only, defaults to true)
         });
    }
}
  
// Export MailHelper constructor
module.exports.MailHelper = MailHelper;