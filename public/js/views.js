$.sub('games/get', function (e, args) {
  $.each(args.games, function (i, n) {
    $('#all-games').append('<li><a href="/?game=' + n.id + '">' + n.id + '</a></li>');
  });
});

$.sub('player/games', function (e, args) {
  $.each(args.games, function (i, n) {
    $('#your-games').append('<li><a href="/?game=' + n + '">' + n + '</a></li>');
  });
});

$.sub('page/game', function () {
  var cards = $.rummy.game.deck.length,
    i = 0,
    $card;
  while (i < cards) {
    $card = $('<article></article>').css({
      'top': (i/3) +'px',
      'left': (i/3) +'px'
    });
    $('#deck').append($card);
    i++;
  }
});

$.sub('shark/get', function () {
  $.each($.rummy.shark.hand, function (i, n) {
    $('#hand').append(cardTemplate(n.score).replace(/\{{card}}/g, n.card).replace(/\{{suit}}/g, n.suit).replace(/\{{rank}}/g, n.rank).replace(/\{{symbol}}/g, n.symbol));
  });
  var baraja = $('#hand').baraja();
});

$.sub('page/login', function () {
  $('button' ,'#login_form').click(function (e) {
      e.preventDefault();

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

    $('input', '#login_form').keypress(function(e) {
        if(e.keyCode === 13) {
            e.preventDefault();
            $('button').click();
            return false;
        }
    });
});

$.sub('page/games', function () {
  $('#add-game').click(function () {
    $.rummy.addGame();
  });
});

cardTemplate = function (score) {
  var templated = '<article class="card {{suit}}">' +
    '<h1>{{rank}}</h1>' +
    '<ul class="symbols">';
      if (score <= 10) {
        for (var i=0; i<score; i++) {
          templated += '<li>{{symbol}}</li>'
        }
      }
    templated += '</ul>' +
    '<span class="header">' +
      '{{rank}} {{symbol}} <h2>{{rank}} <em>of</em> {{suit}}</h2>' +
    '</span>' +
    '<span class="footer">' +
      '{{rank}} {{symbol}} <h2>{{rank}} <em>of</em> {{suit}}</h2>' +
    '</span>' +
  '</article>';
  return templated;
};