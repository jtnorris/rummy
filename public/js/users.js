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
      '</li>',
    cardTemplate = function (score) {
      var templated = '<article class="card {{suit}}">' +
        '<h1>{{rank}}</h1>' +
        '<ul class="symbols">';
          for (var i=0; i<score; i++) {
            templated += '<li>{{symbol}}</li>'
          }
        templated += '</ul>' +
        '<span class="header">' +
          score + ' {{symbol}} <h2>{{card}} <em>of</em> {{suit}}</h2>' +
        '</span>' +
        '<span class="footer">' +
          score + ' {{symbol}} <h2>{{card}} <em>of</em> {{suit}}</h2>' +
        '</span>' +
      '</article>';
      return templated;
    },
    cardTemplateSimple = '<article class="card"></article>';

/**** Get the current user. ****/
dpd.users.me(function (me) {
  if (me !== '') {
    user = me;
    params = getUrlVars();

    if (params.game !== undefined) {
      $('#page').load('game.html', function () {
        $('h1').append(params.game);

        dpd.games.get({"id": params.game}, function (game, err) {
          if(err) return console.warn(err.message);
          
          var query = {"gameId": params.game, "playerId": user.id};

          if (typeof game.deck === 'undefined') {
            dpd.sharks.get({"gameId": params.game}, function (result) {
              if(result.length > 0) {
                 $('#start-game').removeClass('hide').click(function () {
                  dpd.games.put(params.game, {"deck": r.newDeck()}, function(result, err) {
                    var sharkquery = {"gameId": params.game,"playerId": user.id};
                    dpd.sharks.get(sharkquery, function (shark) {
                      var hand = result.deck.slice(0, 7);
                      dpd.sharks.put(shark[0].id, {hand: hand}, function () {
                        window.location = window.location;
                      });
                    });
                    
                  });
                 });
              }
            });
          } else {
            $.each(game.deck, function (i, n) {
              $('#deck').append($(cardTemplateSimple).css({
                'top': (i/3) +'px',
                'left': (i/3) +'px'
              }));
            });

            var sharkquery = {"gameId": params.game,"playerId": user.id};
            dpd.sharks.get(sharkquery, function (shark) {
              $.each(shark[0].hand, function (i, n) {
                $('#hand').append(cardTemplate(n.score).replace(/\{{card}}/g, n.card).replace(/\{{suit}}/g, n.suit).replace(/\{{rank}}/g, n.rank).replace(/\{{symbol}}/g, n.symbol));
              });
              var baraja = $('#hand').baraja();
              $('#deck').click(function () {
                var n = game.deck[0];
                baraja.add($(cardTemplate(n.score).replace(/\{{card}}/g, n.card).replace(/\{{suit}}/g, n.suit).replace(/\{{rank}}/g, n.rank).replace(/\{{symbol}}/g, n.symbol)));
              });
            });
          }

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
              dpd.sharks.post({"gameId": result.id, "playerId": user.id}, function(result, err) {
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