$.sub('games/get', function (e, args) {
  $.each(args.games, function (i, n) {
    $('#all-games').append('<li><a href="/?game=' + n.id + '">' + n.id + '</a></li>');
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