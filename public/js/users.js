Array.prototype.contains = function ( needle ) {
   for (i in this) {
       if (this[i] == needle) return true;
   }
   return false;
}

var user,
    params,
    userGames,
    gameTemplate = '<li>' +
      '<a href="/?game={{gameId}}">Game:{{gameId}}</a>' +
      '</li>',
   gameTemplateNoLink = '<li>' +
      'Game:{{gameId}}' +
      '</li>';



/**** Get the current user. ****/
dpd.users.me(function (me) {
  if (me !== '') {
    user = me;
    params = getUrlVars();

    if (params.game !== undefined) {
      $('#page').load('game.html', function () {
        $('h1').append(params.game);

        var query = {"gameId": params.game, "playerId": user.id};

        dpd.sharks.get(query, function (result) {
         if (result.length !== 0) {
            $('#leave-game').removeClass('hide').click(function () {
              dpd.sharks.del(result[0].id, function (err) {
                window.location = window.location;
              });
            });
            $('#join-game').addClass('hide');
          } else {
            $('#join-game').removeClass('hide');
            $('#join-game').click(function () {
              dpd.sharks.post(query, function(result, err) {
                window.location = window.location;
              });
            });
         }
        });
        
      });
    } else {
      $('#page').load('games.html');
      var query = {"playerId": user.id};
      dpd.sharks.get(query, function (result) {
       var getUserGamesQuery = new Array();
       for (var i = 0; i < result.length; i++) {
        getUserGamesQuery.push(result[i].gameId);
       }

       var yourGameIds = [];

       dpd.games.get({"id": {"$in": getUserGamesQuery}}, function (userGames) {
        for (var i = 0; i < userGames.length; i++) {
          yourGameIds.push(userGames[i].id);
          $('#your-games').append(gameTemplate.replace(/\{{gameId}}/g, userGames[i].id));
        }
        dpd.games.get({}, function (allGames) {
          for (var i = 0; i < allGames.length; i++) {
            if (yourGameIds.contains(allGames[i].id)) {
              $('#all-games').append(gameTemplateNoLink.replace(/\{{gameId}}/g, allGames[i].id));
            } else {
              $('#all-games').append(gameTemplate.replace(/\{{gameId}}/g, allGames[i].id));
            }
          }
          $('#all-games').append('<button class="btn btn-primary" id="add-game">Add new game</button>');
          $('#add-game').click(function () {
            dpd.games.post({"nextToGo": user.id}, function(result, err) {
              dpd.sharks.post({"gameId": result.id,"playerId": user.id}, function(result, err) {
                window.location = window.location;
              });
            });
          });
         });
       });
       
      });
    }
  } else {
    $('#page').load('login.html', function () {
      //
      // When a user clicks login...
      //
      $('button' ,'#login_form').click(function (e) {
        e.preventDefault();
        //
        // Create the credentials from the input text.
        //
        var credentials = {
          username: $('#username').val(),
          password: $('#password').val()
        };

        dpd.users.login(credentials, function (session) {
          if(session.uid) {
            dpd.users.put(session.uid, {visited: new Date()}, function () {
              window.location = '/';
            })
          }
        });
      });

      //
      // Also, send when the user presses enter.
      //
      $('input', '#login_form').keypress(function(e) {
          if(e.keyCode === 13) {
              e.preventDefault();
              $('button').click();
              return false;
          }
      });
    });
  }
});


function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}