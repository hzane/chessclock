'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', []).
  factory('firebase', function () {
    var myFirebaseRef = new Firebase("https://chessclock.firebaseio.com");

    return myFirebaseRef;
  }).
  factory('tools', function () {
  	var tools = {
  		generate:function(){
	    	var x=Math.random().toString(36).substring(7).substr(0,5);
	    	while (x.length!=5){
	        	x=Math.random().toString(36).substring(7).substr(0,5);
	    	}
	    	return x;
  		}
  	};
    return tools;
  }).
  factory('gameSvc', function ($state, $window, firebase) {
  	
  	var game = {
  		start:function(){
  			$state.go('game');
  		},
  		setScope:function(scope){
  			game.scope = scope;
  		},
  		setVars:function(vars){
  			game.id = vars.id;
  			game.player = vars.player;
  			game.status = vars.status;
  			game.turn = null; //default null, first timer press sets
  			game.interval;
  			game.gameRef = firebase.child('games/'+game.id);
        	$window.sessionStorage.setItem('game', JSON.stringify(vars));
  		},
  		getVars:function(){
  			var res = null;
  			if(typeof game.id === 'string'){
  				res = {id:game.id, player:game.player, status:game.status}
  			}
  			else if(typeof $window.sessionStorage.getItem('game') === 'string'){
  				res = JSON.parse($window.sessionStorage.getItem('game'));
  			}
  			return res;
  		},
      updateView:function(player){
            if(game.scope[player].seconds.toString() === '00' && game.scope[player].minutes === 0){
              game.timer.stop(player);
              return false;
            }
            if(game.scope[player].seconds.toString() === '00'){
              game.scope[player].seconds = '59';
              game.scope[player].minutes = game.scope[player].minutes-1;
            }else{
              var secs = parseInt(game.scope[player].seconds)-1;
              secs = secs < 10 ? 0+secs.toString() : secs;
              game.scope[player].seconds = secs;
            }
            game.scope.$apply();

      },
  		timer:{
  			status:'stopped',
  			press:function(){
  				game.turn = game.player;
  				if(game.turn === game.player){
  					var player = 'my_time';
  				}else{
  					var player = 'opponent_time';
  				}
  				this.toggle(player);
  			},
  			toggle:function(player){

          if(game.scope[player].seconds.toString() === '00' && game.scope[player].minutes === 0){
            return false;
          }
  				if(this.status==='stopped'){
  					this.start(player);
  				}else{
  					this.stop(player);
  				}
  				
  			},
  			start:function(player){
			    game.gameRef.update({status:'running'});
  				this.status = 'running';
  				game.interval = setInterval(function(){
              game.updateView(player);
        			game.gameRef.update({turns:{player:game.player, time:game.scope[player].minutes+':'+game.scope[player].seconds}});
  				}, 1000);
  			},
  			stop:function(player){
			    game.gameRef.update({status:'stopped'});
  				this.status = 'stopped';
  				clearInterval(game.interval);
          this.lock = true;
  			},
        lock:false
  		}
  	};
    return game;
  });
