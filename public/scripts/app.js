'use strict';

angular.module('tasksApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'ui.bootstrap'
])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: '/views/main.html',
        controller: 'todosCtrl'
      })
      .when('/assignees',{
        templateUrl: '/views/assignees.html',
        controller: 'assigneesController'
      })
      .otherwise({
        redirectTo: '/'
      });
  });