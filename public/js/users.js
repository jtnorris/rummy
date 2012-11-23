$.rummy = {
  player: {},

  game: {},
  games: [],
  sharks: [],
  shark: {},

  getGame: function () {
    var gameId = $.rummy.game.id || getUrlVars().game;
    if (gameId !== undefined) {
      dpd.games.get({"id": gameId}, function (game) {
        $.rummy.game = game;
        $.pub('game/get');
      });
    } else {
      $.rummy.loadPage('games');
    }
  },
  addGame: function () {
    dpd.games.post({"nextToGo": $.rummy.player.id}, function(game) {
      $.pub('game/add', {
        game: game
      });
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
      $.pub('shark/get');
    });
  },
  addShark: function (data) {
    dpd.sharks.post(data, function(shark) {
      $.pub('shark/add');
    });
  },
  setShark: function (data) {
    dpd.sharks.put($.rummy.shark.id, data, function () {
      $.pub('shark/set');
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