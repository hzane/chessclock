'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
  controller('AppCtrl', function ($scope) {
  }).
  controller('MyCtrl1', function ($scope) {

    var myFirebaseRef = new Firebase("https://chessclock.firebaseio.com/");

    $scope.newGame = function(){
      myFirebaseRef.set({
        title: "Hello CHESS CLOCL!",
        location: {
        city: "Austin"
    }
});

    }
  }).
  controller('MyCtrl2', function ($scope) {
    // write Ctrl here
  });
