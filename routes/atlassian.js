/*
  Atlassian REST API.

  JIRA Webhooks covers only these events:

  Issue Created (jira:issue_created)
  -> should create Trello card in specified board/list

  Issue Deleted (jira:issue_deleted)
  -> should remove Trello card from specified board/list

  Issue Updated (jira:issue_updated)
  Worklog Updated (jira:worklog_updated)
  -> should update Trello card with new data

*/

// Trello-specific deps
var Trello = require("node-trello");
var settings = require("../settings.js");
var trello = new Trello(
    settings.key,
    settings.token
);
var TrelloCtrl = require('../controllers/Trello')(trello, settings.organization);

exports.webhook = {
	get: function(req, res){
    console.log("WEBHOOK - GET - BODY\n ", req.body, "\n -PARAMS:", req.params, "\n - QUERY:", req.query);

    // FOR TESTING PURPOSES. Allows you to attempt to run a post to Trello via GET instead of POST for testing purposes.
    TrelloCtrl.postNewCard(req.query.board, "To Do", {
      summary: "get test" ,
      description: "testing a get request to ticket",
      callback: function(){
        res.json({ status: "400 OK" });
      }
    });
  },
  post: function(req, res){
    console.log("WEBHOOK - POST - BODY\n ", req.body, "\n -PARAMS:", req.params, "\n - QUERY:", req.query);
    if(req.body.webhookEvent === 'jira:issue_created'){
      TrelloCtrl.postNewCard(req.query.board, 'To Do', {
        summary: req.body.issue.summary,
        description: req.body.issue.description,
        callback: function(){
          res.json({ status: '400 OK' });
        }
      });
    }


  }
};
