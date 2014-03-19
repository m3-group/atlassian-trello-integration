module.exports = function(trello, organization){

  // ////////////////// //
  // Private functions. //
  // ////////////////// //
  function getBoardIdByName(name, callback){
    console.log("TRELLO: Get Board Id by Name ("+name+")");
    if(typeof name !== 'string') return;

    getBoards(function(boards){
      var bBoardFound = false;
      console.log("--> Get Boards callback... (" +boards.length+" boards found)");
      console.log(typeof boards, boards);

      boards.forEach(function(item, index){
        // Finds the first match and then breaks.
        if(bBoardFound) return;

        console.log("---> Checking " + item.name.toLowerCase() + " against " + name.toLowerCase() + "...");
        if(unescape(item.name.toLowerCase()) === unescape(name.toLowerCase())){
          bBoardFound = true;
          console.log("----> Found a board with the name " + item.name);

          if(typeof callback === 'function'){
            callback(item.id);
          }
        }

      });
    });
  }

  // Use without callback for a utility to grab board IDs if needed.
  function getBoards(callback){
    trello.get("/1/organizations/"+organization+"/boards", function(err, data){
      if(err) throw err;

      console.log("TRELLO: Get Organization's Boards");
      console.log("-> Boards Object: ", data);

      if(data.length){
        console.log("-> Found " + data.length + " boards...");
        data.forEach(function(item, index){
          console.log("--> Board Name: " + item.name + "\tID:" + item.id);
        });

        if(typeof callback === 'function'){
          // Pass all boards to callback.
          callback(data);
        }
      }
    });
  }

  function getListIdByName(name, lists){
    // Not async.
    if(!lists.length) return;

    var bListFound = false;
    console.log("TRELLO: Get List By Name (" + name + ")");

    lists.forEach(function(item, index){
      if(!bListFound && item.name.toLowerCase() === name.toLowerCase()){
        console.log("-> Found list: " + name);
        bListFound = item.id;
      }
    });

    return bListFound;

  }

  function getListsByBoardId(boardId, callback){
    console.log("TRELLO: Get Lists by Board Id ("+boardId+")");

    if(typeof boardId !== 'string') return;

    trello.get("/1/boards/"+boardId+"/lists?cards=open&card_fields=name&fields=name", function(err, data){
      if(err) throw err;

      if(typeof callback === 'function'){
        callback(data);
      }
    });
  }

  function getCardsByBoardId(id, callback){
    if(typeof id !== 'string') return;

    trello.get("/1/boards/"+id+"/cards?fields=name,idList,url", function(err, data){
      if(err) throw err;
      console.log("TRELLO: Get Cards by Board Id ("+id+")");

      if(typeof callback === 'function'){
        callback(data);
      }
    });
  }

  // ////////// //
  // Public API //
  // ////////// //
  return {
    postNewCard: function(boardName, listName, opts){
      console.log("TRELLO: Post New Card");
      console.log("-> Board Name: " + boardName);
      console.log("-> List Name: " + listName);
      console.log("-> Summary/Title: " + opts.summary);
      console.log("-> Description/Body: " + opts.description);

      getBoardIdByName(boardName, function(boardId){
        console.log("-> getBoardById callback...");
        console.log("-> Attempting to post to " + boardName + "(" + boardId + ")");

        getListsByBoardId(boardId, function(lists){
          var idList = getListIdByName(listName, lists);

          console.log("-> Attempting to post to list id " + idList);
          trello.post("/1/cards", { name: opts.summary, desc: opts.description || null, due: opts.due || null, idList: idList }, function(err, data){
            if(err){
              throw err;
            } else {
              if(typeof data == 'object' && data.id.length){
                console.log("-> POST success!");
              } else {
                console.log("-> ERROR (possible): ", data);
              }
            }

            if(typeof opts.callback === 'function') opts.callback();

          });
        });
      });
    }
  };
};