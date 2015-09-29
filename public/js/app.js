'use strict';

// Declare app level module which depends on filters, and services

angular.module('myApp', [
  'ui.router',
  'myApp.controllers',
  'myApp.filters',
  'myApp.services',
  'myApp.directives'
]).
config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
  $urlRouterProvider.otherwise("/");

  $stateProvider
    .state('home', {
      url: "/",
      templateUrl: "partials/home.jade"
    })
    .state('new', {
      url: "/new",
      templateUrl: "partials/new.jade",
      controller: 'NewCtrl'
    })
    .state('join', {
      url: "/join",
      templateUrl: "partials/join.jade",
      controller: 'JoinCtrl'
    })
    .state('game', {
      url: "/game",
      templateUrl: "partials/game.jade",
      controller: 'GameCtrl'
    });
    $locationProvider.html5Mode(true);
});