var user,
    params,
    userGames,
    gameTemplate = '<li>' +
      '<a href="/?game={{gameId}}">Game:{{gameId}}</a>' +
      '</li>';



/**** Get the current user. ****/
dpd.users.me(function (me) {
  if (me !== '') {
    user = me;
    params = getUrlVars();

    if (params.game !== undefined) {
      $('#page').html('<h1>Game: ' + params.game + '</h1>');
    } else {
      $('#page').load('games.html');
      var query = {"playerId": user.id};
      dpd.sharks.get(query, function (result) {
       var getUserGamesQuery = new Array();
       for (var i = 0; i < result.length; i++) {
        getUserGamesQuery.push(result[i].gameId);
       }

       dpd.games.get({"id": {"$in": getUserGamesQuery}}, function (userGames) {
        for (var i = 0; i < userGames.length; i++) {
          $('#games').append(gameTemplate.replace(/\{{gameId}}/g, userGames[i].id));
        }
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
        })
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