$.rummy = {
  player: {},

  game: {},
  games: [],
  sharks: [],
  shark: {},

  baraja: null,

  getGame: function () {
    var gameId = $.rummy.game.id || getUrlVars().game;
    if (typeof gameId !== 'undefined') {
      dpd.games.get({"id": gameId}, function (game, error) {
        if (error) return $.rummy.loadPage('games');
        $.rummy.game = game;
        $.rummy.game.stack = $.rummy.game.stack || [];
        $.pub('game/get');
      });
    } else {
      $.rummy.loadPage('games');
    }
  },
  addGame: function () {
    dpd.games.post({"nextToGo": $.rummy.player.id, 'deck': r.newDeck()}, function(game) {
      $.pub('game/add', {
        game: game
      });
    });
  },
  setGame: function (data) {
    dpd.games.put($.rummy.game.id, data, function(game) {
      $.rummy.game = game;
      $.pub('game/set');
      for (item in data) {
        $.pub('game/' + item + '/set');
      }
    });
  },
  getGames: function () {
    var query = {};
    dpd.games.get(query, function (games) {
      $.pub('games/get', {
        games: games
      });
    });
  },

  getPlayer: function () {
    dpd.users.me(function (me) {
      if (me !== '') {
        $.rummy.player = me;
        $.pub('player/get');
      } else {
        $.rummy.loadPage('login');
      }
    });
  },

  getPlayersGames: function () {
    dpd.sharks.get({"playerId": $.rummy.player.id}, function (sharks) {
      var i = sharks.length;
      while (i--) {
        $.rummy.games.push(sharks[i].gameId);
      }
      $.pub('player/games', {
        'games': $.rummy.games
      });
    });
  },

  getShark: function () {
    dpd.sharks.get({"gameId": $.rummy.game.id, "playerId": $.rummy.player.id}, function (shark) {
      $.rummy.shark = shark[0];
      $.rummy.shark.hand = $.rummy.shark.hand || [];
      $.pub('shark/get');
    });
  },
  addShark: function (data) {
    dpd.sharks.post(data, function(shark) {
      $.pub('shark/add');
    });
  },
  setShark: function (data) {
    dpd.sharks.put($.rummy.shark.id, data, function (shark) {
      $.rummy.shark = shark;
      $.pub('shark/set');
      for (item in data) {
        $.pub('shark/' + item + '/set');
      }
    });
  },

  takeCard: function (e) {
    var id = $(e.target).parents('section').attr('id');
    var cardToTake = (id === 'deck' ? $.rummy.game.deck.pop() : $.rummy.game.stack.pop()),
      hand = $.rummy.shark.hand;
    hand.push(cardToTake);
    $.rummy.baraja.add($(cardTemplate(cardToTake.score).replace(/\{{card}}/g, cardToTake.card).replace(/\{{suit}}/g, cardToTake.suit).replace(/\{{rank}}/g, cardToTake.rank).replace(/\{{symbol}}/g, cardToTake.symbol)));
    $.rummy.setShark({
      'hand': hand
    });
    if (id === 'deck') {
      $.rummy.setGame({
        'deck': $.rummy.game.deck
      });
    } else {
      $.rummy.setGame({
        'stack': $.rummy.game.stack
      });
    }
  },
  dealCards: function () {
    var hand = $.rummy.game.deck.slice($.rummy.game.deck.length - 7, $.rummy.game.deck.length);
    $.rummy.setShark({
      'hand': hand
    });
    $.sub('shark/set', function () {
      $.rummy.loadPage('game');
    });
  },

  loadPage: function (page) {
    $('#page').load(page + '.html', function () {
      $.pub('page/load');
      $.pub('page/' + page);
    });
  }
}

$(document).ready(function () {

  $.rummy.getPlayer();

  $.sub('player/get', function () {
    $.rummy.getGame();
  });

  $.sub('game/get', function () {
    $.rummy.loadPage('game');
  });

  $.sub('game/add', function (e, args) {
    $.rummy.addShark({
      'gameId': args.game.id,
      'playerId': $.rummy.player.id
    });
  });

  $.sub('shark/add', function () {
    window.location = window.location;
  });

  $.sub('page/game', function () {
    $.rummy.getShark();
  });

  $.sub('page/games', function () {
    $.rummy.getGames();
    $.rummy.getPlayersGames();
  });

});