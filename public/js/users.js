$.rummy = {
  player: {},

  game: {},
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

  getShark: function () {
    dpd.sharks.get({"gameId": $.rummy.game.id, "playerId": $.rummy.player.id}, function (shark) {
      $.rummy.shark = shark;
      $.pub('shark/get');
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
    $.sub('game/get', function () {
      $.rummy.loadPage('game');
      $.sub('page/game', function () {
        $.rummy.getShark();
      });
    });
  });

  $.sub('page/games', function () {
    $.rummy.getGames();
  });

});