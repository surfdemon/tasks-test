'use strict';

angular.module('tasksApp')
   .controller('todosCtrl', [ '$scope', 'tasksService', 'assigneesService' , function ($scope, tasksService, assigneesService) {
        $scope.todos = [];
        $scope.count = 0;
        $scope.moreDetails = false;
        $scope.showFilter = false;
        $scope.users = [
            {id : 0 , name : 'None'},
            {id : 1 , name : 'Zoe' },
            {id : 2 , name : 'Rob'},
            {id : 3 , name : 'Andy'}
          ];
        $scope.projects = [
            {id : 0 , name : 'None'},
            {id : 1, name : 'House' },
            {id : 2, name : 'Garden' },
            {id : 3, name : 'Garage' },
            {id : 4, name : 'Programming' }
          ];
        $scope.toggleFilter = function(){
          console.log('show filter has been clicked');
          $scope.showFilter = !$scope.showFilter;
        };
        $scope.nextCount = function(){
            $scope.count =  $scope.count + 1;
            return $scope.count;
          };
        $scope.getTodos = function(){
            console.log('getting todos 123');
              tasksService.getTasks()
                .then(function(status){
                  console.log('getTasks service call worked!');
                  $scope.todos = status;
                }, function(err){
                  console.log('something went wrong getting tasks');
                });
          };
        $scope.getTodos();
        $scope.addTodo = function(){
            if($scope.todo !== undefined){
              if($scope.todo.todo !== undefined){
                $scope.todo.todo = $scope.todo.todo.trim();
                if ($scope.todo.todo === '') {
                  $scope.errorMessage = 'You can\'t enter a blank task!';
                  return;
                }
                $scope.errorMessage = '';
                tasksService.addTask($scope.todo)
                  .then(function(status){ 
                    console.log(status);
                      console.log('task should now have been added');
                      $scope.todo.id = status;
                      $scope.todos.push($scope.todo);
                      $scope.todo = '';
                  }, function(err){
                    console.log('problem adding task' + err);
                  });
            } else {
                $scope.errorMessage = 'Your task must have a title';
              }
            } else {
              $scope.errorMessage = 'You can\'t enter a blank todo!';
            }
          };
        $scope.showMoreDetails = function(){
            console.log('show more details clicked');
            $scope.moreDetails = !$scope.moreDetails;
          };
        $scope.deleteTodo = function(todo){
          console.log('todo that needs to be deleted is ');
          console.log(todo);
            tasksService.deleteTask(todo).then(function (status){
              console.log('the task should now be deleted, call to deleteTask on service was success');
              $scope.todos.splice($scope.todos.indexOf(todo), 1);
            }, function(err){
              console.log('Call to deleteTask on the service failed');
            });
          };
    }])
    .controller('todoCtrl', [ '$scope', 'tasksService', function ($scope, tasksService ) {
        $scope.edit = false;
        $scope.view = false;
        $scope.editTodo = function(){
            if($scope.todo.assignTo){
              $scope.todo.assignTo = $scope.users[$scope.todo.assignTo.id];
            };
            if($scope.todo.project){
              $scope.todo.project = $scope.projects[$scope.todo.project.id];
            };
            $scope.edit = true;
          };
        $scope.saveTodo = function() {
            tasksService.updateTask($scope.todo).then(function(status){
              console.log('updateTask on the service should have worked successfully');
            }, function(err){
              console.log('something went wrong trying to run updateTask on the service');
            });
            $scope.edit = false;
          };
        $scope.viewTodo = function(){
            console.log('the viewTodo function has run'); 
            $scope.view = !$scope.view;
          };
      }])
    .controller('assigneesController', ['$scope', 'assigneesService', function($scope, assigneesService){

    }]);