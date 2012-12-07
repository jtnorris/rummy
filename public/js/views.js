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

$.sub('page/game game/deck/set', function () {
  $('#deck').empty();
  var cards = $.rummy.game.deck ? $.rummy.game.deck.length : 0,
    i = 0,
    $card;
  while (i < cards) {
    $card = $('<article>' + $.rummy.game.deck[i].card + '</article>').css({
      'top': (i/3) +'px',
      'left': (i/3) +'px'
    });
    $('#deck').append($card);
    i++;
  }

});

$.sub('page/game game/stack/set', function () {
  $('#stack').empty();
  var cards = $.rummy.game.stack ? $.rummy.game.stack.length : 0,
    i = 0,
    $card;
  while (i < cards) {
    var n = $.rummy.game.stack[i];
    $card = $(stackTemplate(n.score).replace(/\{{card}}/g, n.card).replace(/\{{suit}}/g, n.suit).replace(/\{{rank}}/g, n.rank).replace(/\{{symbol}}/g, n.symbol));
    $('#stack').append($card);
    i++;
  }
});

$.sub('shark/get', function () {
  var i = typeof $.rummy.shark.hand !== 'undefined' ? $.rummy.shark.hand.length : 0,
    n,
    $hand = $('#hand').empty();

  while (i--) {
    n = $.rummy.shark.hand[i];
    var $article = $(cardTemplate(n.score).replace(/\{{card}}/g, n.card).replace(/\{{suit}}/g, n.suit).replace(/\{{rank}}/g, n.rank).replace(/\{{symbol}}/g, n.symbol));
    $hand.append($article);
  }

  $.rummy.baraja = $hand.baraja();

});

$('#page').on('click', '#deck', function (e) {
  $.rummy.takeCard(e);
});

$('#page').on('click', '#stack', function (e) {
  $.rummy.takeCard(e);
});

$('#page').on('click', '#hand article', function () {
  var $stack = $('#stack');
  var i = $.rummy.shark.hand.length - $(this).index() - 1;
  var n = $.rummy.shark.hand[i];
  var $card = $(cardTemplate(n.score).replace(/\{{card}}/g, n.card).replace(/\{{suit}}/g, n.suit).replace(/\{{rank}}/g, n.rank).replace(/\{{symbol}}/g, n.symbol));

  var hand = $.rummy.shark.hand;

  $.rummy.game.stack.push(hand.splice(i, 1)[0]);

  $.sub('shark/hand/set', function () {
    $.pub('shark/get');
    $stack.append($card);
  });

  $.rummy.setShark({
    'hand': hand
  });
  $.rummy.setGame({
    'stack': $.rummy.game.stack
  });

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

stackTemplate = function (score) {
  var templated = '<article class="card {{suit}}">' +
   ' <h1>{{rank}}<br/>{{symbol}}</h1>' +
   '<span class="footer">' +
      '<h2>{{rank}} <em>of</em> {{suit}}</h2>' +
    '</span>' +
  '</article>';
  return templated;
};