var r = {};
 r.cards = [],
 r.cardScores = {
   "ace": 11,
   "king": 10,
   "queen": 10,
   "jack": 10,
   "ten": 10,
   "nine": 9,
   "eight": 8,
   "seven": 7,
   "six": 6,
   "five": 5,
   "four": 4,
   "three": 3,
   "two": 2,
 },
 r.suits = ['hearts', 'diamonds', 'clubs', 'spades'];
r.generateCards = function () {
 for (var i = 0; i < r.suits.length; i++) {
   for (var card in r.cardScores) {
      var rank = r.cardScores[card];
      switch (card) {
        case "ace": rank = "a"; break;
        case "king": rank = "k"; break;
        case "queen": rank = "q"; break;
        case "jack": rank = "j"; break;
      }
     r.cards.push({
       "suit": r.suits[i],
       "card": card,
       "score": r.cardScores[card],
       "symbol": '&' + (r.suits[i] === 'diamonds' ? 'diams' : r.suits[i]) + ';',
       "rank": rank
     });
   }
 }
 r.shuffleCards();
}
r.shuffleCards = function() {
 var i = r.cards.length,
   j,
   temp;
   if ( i == 0 ) return;
   while ( --i ) {
       j = Math.floor( Math.random() * ( i + 1 ) );
       temp = r.cards[i];
       r.cards[i] = r.cards[j];
       r.cards[j] = temp;
   }
}
r.newDeck = function () {
  r.generateCards();
  return r.cards;
};

// var r = {};
//     r.cards = [],
//     r.cardScores = {
//       "ace": 11,
//       "king": 10,
//       "queen": 10,
//       "jack": 10,
//       "ten": 10,
//       "nine": 9,
//       "eight": 8,
//       "seven": 7,
//       "six": 6,
//       "five": 5,
//       "four": 4,
//       "three": 3,
//       "two": 2,
//     },
//     r.suits = ['hearts', 'diamonds', 'clubs', 'spades'];

//   r.generateCards = function () {
//     for (var i = 0; i < r.suits.length; i++) {
//       for (var card in r.cardScores) {
//         r.cards.push({
//           "suit": r.suits[i],
//           "card": card,
//           "score": r.cardScores[card]
//         });
//       }
//     }
//   }

//   r.shuffleCards = function() {
//     var i = r.cards.length,
//       j,
//       temp;

//       if ( i == 0 ) return;
//       while ( --i ) {
//           j = Math.floor( Math.random() * ( i + 1 ) );
//           temp = r.cards[i];
//           r.cards[i] = r.cards[j];
//           r.cards[j] = temp;
//       }
//   }
  //
  // Show new cards as they are created.
  //
  // var user,
  //   currentGame,
  //   gameDeck,
  //   players,
  //   nextToGo;

  // dpd.on('cards changed', function () {
  //   getCards();
  // });

  // function getGame() {
  //   dpd.games.get({id:getUrlVars()["game"]}, function (game) {
  //     currentGame = game;
  //     gameDeck = currentGame.deck;
  //   });
  // }

  // //
  // // Get the current user.
  // //
  // dpd.users.me(function (me) {
  //   if (me !== '') {
  //     $('#page').load('games.html');
  //     user = me;

  //     var query = {"playerId": user.id};
  //     dpd.sharks.get(query, function (result) {
  //       console.log(result);
  //     });


  //     // dpd.games.get({id:getUrlVars()["game"]}, function (game) {
  //     //   currentGame = game;

  //     //   r.generateCards();
  //     //   r.shuffleCards();
  //     //   gameDeck = r.cards;

  //     //   if (typeof currentGame.deck === 'undefined') {
  //     //     dpd.games.put({
  //     //       id: currentGame.id,
  //     //       deck: gameDeck
  //     //     }, function(result, err) {
  //     //       if(err) return console.log(err);
  //     //     });
  //     //   }
  //     // });

  //     //
  //     // If the user is logged in, display the name.
  //     //
  //     //
  //     // Only get cards if the user is logged in.
  //     //
  //     // getCards();
  //   } else {
  //     $('#page').load('login.html', function () {
  //       //
  //       // When a user clicks login...
  //       //
  //       $('button' ,'#login_form').click(function (e) {
  //         e.preventDefault();
  //         //
  //         // Create the credentials from the input text.
  //         //
  //         var credentials = {
  //           username: $('#username').val(),
  //           password: $('#password').val()
  //         };

  //         dpd.users.login(credentials, function (session) {
  //           if(session.uid) {
  //             dpd.users.put(session.uid, {visited: new Date()}, function () {
  //               window.location = '/';
  //             })
  //           }
  //         })
  //       });

  //       //
  //       // Also, send when the user presses enter.
  //       //
  //       $('input', '#login_form').keypress(function(e) {
  //           if(e.keyCode === 13) {
  //               e.preventDefault();
  //               $('button').click();
  //               return false;
  //           }
  //       });
  //     });
  //   }
  // });


























  // //
  // // Here is a simple example of reading and saving data with a deployd collection.
  // //
  // function getCards() {
  //   getGame();
  //   //
  //   // Get cards from the `/cards` collection using jQuery.
  //   //
  //   dpd.cards.get(function (cards) {
  //     $('#cards').empty();
  //       if(!cards) return;
  //       //
  //       // Render out the table of cards.
  //       //
  //       cards.reverse();
  //       for(var i = 0; i < cards.length; i++) {
  //         if (cards[i].gameId === currentGame.id) {
  //           $('#cards').append('<tr><td><div class="person">' + cards[i].creator + '</div>' + cards[i].text + '</td></tr>');
  //         } else {
  //           console.log("Game does not match");
  //         }
  //       }
  //     });
  //   }

  //   //
  //   // When a user clicks send...
  //   //
  //   $('button').click(function () {
  //     if (currentGame.nextToGo === user.id) {
  //       gameDeck = currentGame.deck;
  //       //
  //       // Create a message from the input text.
  //       //
  //       var playerCard = gameDeck.splice(0,1)[0];
  //       var message = playerCard.card + " of " + playerCard.suit;

  //       dpd.games.put({
  //         id: currentGame.id,
  //         deck:gameDeck
  //       }, function(result, err) {
  //         if(err) return console.log(err);
  //       });


  //       dpd.sharks.get({gameId:getUrlVars()["game"]}, function (sharks) {
  //         for (var i = 0; i < sharks.length; i++) {
  //           shark = sharks[i];
  //           if (shark.playerId === currentGame.nextToGo) {
  //             nextToGo = sharks[i + 1].playerId;
  //           }
  //         }
  //         dpd.cards.post({
  //           text: message,
  //           card: playerCard,
  //           gameId: currentGame.id
  //         }, function () {
  //           dpd.games.put(currentGame.id, {"nextToGo":nextToGo}, function () {
  //             getCards();
  //           });
  //         });
  //       });
  //     } else {
  //       alert("it is not your go yet, moron.");
  //       getCards();
  //     }
  //   });

  //   //
  //   // Also, send when the user presses enter.
  //   //
  //   $('form').keypress(function(e) {
  //     if(e.keyCode === 13) {
  //         e.preventDefault();
  //         $('button').click();
  //         return false;
  //     }
  //   });

  //   //
  //   // Logout the user when they click on the logout button.
  //   //
  //   $('#logout').click(function() {
  //     dpd.users.logout(function () {
  //       window.location = '/login.html';
  //     })
  //   });