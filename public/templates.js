var templates = {
	player: '<section class="player"><h1 class="playerName">{{name}}</h1>{{#cards}}{{> card}}{{/cards}}</section>'
},
partials = {
	card: '<article class="card {{suit}}"><div class="wrapper"><h2>{{card}}</h2></div><ul class="symbols">{{#symbols}}{{/symbols}}</ul><span class="header">{{card}} {{{symbol}}} <h3>{{name}} <em>of</em> {{suit}}</h3></span><span class="footer">{{card}} {{{symbol}} <h3>{{name}} <em>of</em> {{suit}}</h3></span></article>'
}
