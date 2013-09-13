/**
* Messaging Routes Module
*   Requires authenticated users
*/
var mongoose = require('mongoose')
  , MessageThread = mongoose.model('MessageThread')
  , SystemMessage = mongoose.model('SystemMessage')
  , SystemMessageArchive = mongoose.model('SystemMessageArchive')
  , ObjectId = mongoose.Types.ObjectId
  , restify = require('restify');


module.exports = function (app, config, auth) {

   /**
   * Post a message thread
   *
   * @param request need to include the toUsername, toUserId, subject and message
   * @param response
   * @param next method
   */
   function postMessageThread(req, res, next) {
      if (req.session && req.session.user) {
        var messageThread = new MessageThread(req.params);
        messageThread.version = 1;
        messageThread.fromUsername = req.session.user.username;
        messageThread.fromUserId = req.session.user._id;
        messageThread.message = null;
        messageThread.messages = [];
        messageThread.messages.push(req.params.message);
        messageThread.createDate = new Date();

        messageThread.save(function (err, messageThread) {
          if (!err) {
            res.send({});
          } else {
            return next(err);
          }
        });
      }
   }

   /**
   * Put (Update) a message thread
   *
   * @param request can include an id, a username or no search param
   * @param response
   * @param next method
   */
   function putMessageThread(req, res, next) {
     // TODO how to avoid collisions? Pull a message and check version #
      if (req.session && req.session.user) {
        // update, remove message form archival view
        // messageThread.fromArchiveFlag = false;
        // messageThread.toArchiveFlag = false;
      }
   }

   /**
   * Get a message thread
   *
   * @param request filter (optional) by fromUsername, fromUserId, archiveFlag if true does not filter out archived
   * @param response array of MessageThreads
   * @param next method
   */
   function getMessageThread(req, res, next) {
      if (req.session && req.session.user) {
// archiveFlag, senderFlag (true retrieves messageThreads user started, false: messageThreads started by another user)
      }
   }

   /**
   * Archive a message thread
   *
   * @param request can include an id, a username or no search param
   * @param response
   * @param next method
   */
   function archiveMessageThread(req, res, next) {
      if (req.session && req.session.user) {
        // only archive this users' view
        // not using an else, possibly admin might moderate a message?
        /*
        if (req.session.user._id == messageThread.fromUserId) {
          messageThread.fromArchiveFlag = false;
        }
        if (req.session.user._id == messageThread.toUserId) {
          messageThread.toArchiveFlag = false;
        }*/
      }
   }

   /**
   * Post a system message
   *
   * @param request include subject and message
   * @param response
   * @param next method
   */
   function postSystemMessage(req, res, next) {
      if (req.session && req.session.user) {
        var systemMessage = new SystemMessage(req.params);
        systemMessage.createDate = new Date();
        systemMessage.fromUsername = req.session.user.username;
        systemMessage.fromUserId = req.session.user._id;
        systemMessage.save(function (err, systemMessage) {
          if (!err) {
            res.send({});
          } else {
            return next(err);
          }
        });
      }
   }

  /**
   * Get a system messages
   *
   * @param request filter (optional) archiveFlag if true includes all
   * @param response array of SystemMessages
   * @param next method
   */
   function getSystemMessage(req, res, next) {
      if (req.session && req.session.user) {
          if (req.params.archiveFlag) {
              // skip the archive, retrieve all messages
              filterSystemMessage(req, res, null, next);
         } else {
             // retrieve all the archive flags for this user then filter the
             var query = SystemMessageArchive.where( 'userId', req.session.user._id );
             query.find(function (err, systemMessageArchive) {
                if (!err) {
                   if (systemMessageArchive) {
                       filterSystemMessage(req, res, systemMessageArchive, next);
                   } else {
                       res.send({});
                       return next();
                   }
                } else {
                      var errObj = err;
                      if (err.err) errObj = err.err;
                      return next(new restify.InternalError(errObj));
                }
             });
      }
   }
  /**
   * Filter the system messages and return
   *
   * @param request filter (optional) archiveFlag if true includes all
   * @param response array of SystemMessages
   * @param next method
   */
    function filterSystemMessage(req, res, systemMessageArchiveArr, next) {
      res.send(SystemMessage.find(function (err, systemMessageArr) {
        if (!err) {
          if (systemMessageArr) {
            if (systemMessageArchiveArr) {
                // going to be SLOW so admins need to keep the message count low and purge them when done
                for (var i = systemMessageArr.length-1; i >= 0; i--) {
                  for (var j = 0; j < systemMessageArchiveArr.length; j++) {
                      if (systemMessageArr[i]._id == systemMessageArchiveArr[j].systemMessageId) {
                          systemMessageArr.split(i, 1);
                      }
                  }
                }
            }
            res.send(systemMessageArr);
          } else {
            res.send({});
            return next();
          }
        } else {
          var errObj = err;
          if (err.err) errObj = err.err;
          return next(new restify.InternalError(errObj));
        }
      });
    }
    /**
     * Purge a system messages
     *
     * @param request input systemMessageId
     * @param response
     * @param next method
     */
     function purgeSystemMessage(req, res, next) {
        if (req.session && req.session.systemMessageId) {
          SystemMessage.findById(req.params.systemMessageId).remove(function (err) {
            if (!err) {
               res.send({});
               return next();
            } else {
               return next(new restify.MissingParameterError('ObjectId required.'));
            }
          });
        }
     }

     /**
     * Post a message thread
     *
     * @param path
     * @param promised callback check authorization
     * @param promised 2nd callback post
     */
     app.post('/api/v1/messageThread', auth.requiresLogin, postMessageThread);

     /**
     * Update a message thread
     *
     * @param path
     * @param promised callback check authorization
     * @param promised 2nd callback update
     */
     app.put('/api/v1/messageThread', auth.requiresLogin, putMessageThread);

     /**
     * Get a message thread
     *
     * @param path
     * @param promised callback check authorization
     * @param promised 2nd callback update
     */
     app.get('/api/v1/messageThread', auth.requiresLogin, getMessageThread);

     /**
     * Archive a message thread
     *
     * @param path
     * @param promised callback check authorization
     * @param promised 2nd callback update
     */
     app.delete('/api/v1/messageThread', auth.requiresLogin, archiveMessageThread);

     /**
     * Post a system message thread
     *
     * @param path
     * @param promised callback check admin access
     * @param promised 2nd callback post
     */
     app.post('/api/v1/systemMessage', auth.adminAccess, postSystemMessage);

     /**
     * Get a message thread
     *
     * @param path
     * @param promised callback check authorization
     * @param promised 2nd callback update
     */
     app.get('/api/v1/systemMessage', auth.requiresLogin, getSystemMessage);

     /**
     * Archive a message thread
     *
     * @param path
     * @param promised callback check authorization
     * @param promised 2nd callback update
     */
     app.delete('/api/v1/systemMessage', auth.requiresLogin, archiveSystemMessage);

     /**
     * Deletes a System Message by the administrator
     *
     * @param path
     * @param promised callback check authorization
     * @param promised 2nd callback update
     */
     app.delete('/api/v1/systemMessage/purge', auth.adminAccess, purgeSystemMessage);

}








