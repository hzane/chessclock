'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
  controller('AppCtrl', function ($scope) {
  }).
  controller('NewCtrl', function ($scope, firebase, tools, gameSvc) {

function createGame(){
  var id = tools.generate();
  firebase.once("value", function(snapshot) {
    if (snapshot.hasChild('games/'+id)) {
      createGame();
    }else{
      setup(id);
    }
  });

   function setup(id){
    $scope.game = {};
    $scope.game.id = id;
    $scope.$apply();
      var gameRef = firebase.child('games/'+id);
      gameRef.set({
        status:'pending',
        start_time:Date.now(),
        game_length:"2:12",
        time_log:'[]'
      });
      var vars = {id:id, player:1, status:'pending'}
      gameSvc.setVars(vars);
      listen(id);
   }

  function listen(id){
    var gameRef = firebase.child('games/'+id);
    gameRef.on('child_changed', function(nameSnapshot) {
      var status = nameSnapshot.val();
      if(status === 'join'){
        gameSvc.start();
      }
    });
  }
}

createGame();

  }).
  controller('JoinCtrl', function ($scope, firebase, gameSvc) {
    // write Ctrl here
    $scope.loadRoom = function(){

    firebase.once("value", function(snapshot) {
      var id = $scope.room_id;
      if (snapshot.hasChild('games/'+id)) {
        var gameRef = firebase.child('games/'+id);
        gameRef.update({status:'join'});
        var vars = {id:id, player:2, status:'join'}
        gameSvc.setVars(vars);
        gameSvc.start();
      }else{
        alert('error');
      }

    });
}



  }).
  controller('GameCtrl', function ($scope, $timeout, firebase, gameSvc) {
    var game = {};
    game.devFirstRun = false;//temp patch
    game.start = function(){

      $scope.game = gameSvc.getVars();
      $scope.timer = gameSvc.timer;


      game.id = gameSvc.getVars().id;
      game.player = gameSvc.getVars().player;
      game.status = gameSvc.getVars().status;

      game.gameRef = firebase.child('games/'+game.id);
      game.gameRef.on("value", game.ready);
      game.gameRef.on('child_changed', game.update);
      
    };
    game.ready = function(obj){
      var res = obj.val();
      
      //if(res.status != 'join'){return false;}
      if(game.devFirstRun){return false;}
      game.devFirstRun=true;
      //temp patch ^^^

      var vars = {id:game.id,player:game.player,status:res.status};
      gameSvc.setVars(vars);
      gameSvc.setScope($scope);
      $scope.game.status = res.status;

      var minutes = res.game_length.split(':')[0];
      var seconds = res.game_length.split(':')[1];
      $scope.opponent_time = {};
      $scope.my_time = {};
      $scope.opponent_time.minutes = minutes;
      $scope.opponent_time.seconds = seconds;
      $scope.my_time.minutes = minutes;
      $scope.my_time.seconds = seconds;

      $timeout(function() {
        $scope.$apply();
      });
      
    }

    game.update = function(item){
      console.log('updated...');
      console.log(item.val());
      console.log(game);
    }

    game.start();

  });
