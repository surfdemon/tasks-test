'use strict';

angular.module('tasksApp')
  .service('tasksService', ['$rootScope', '$q', '$window', function($rootScope, $q, $window){
    var indexedDB = $window.indexedDB;
    var db=null;
    var lastIndex=0;
    var version = 5;
    var newTask;
    var request = indexedDB.open('tasksData', version);
    request.onupgradeneeded = function(e){
      console.log('Upgrading db to version ' + version);
      db = e.target.result;
      e.target.transaction.onerror = indexedDB.onerror;
      if(db.objectStoreNames.contains('tasks')){
        db.deleteObjectStore('tasks');
      }
      var store = db.createObjectStore('tasks', { keyPath: 'id', autoIncrement : true });
    };
    request.onsuccess = function(e){
      db = e.target.result;
      console.log('tasks db has been created / updated');
    };
    request.onerror = function(){
      console.log('something went wrong trying to create / update the db');
    };
    var addTask = function(newTask){
      var q = $q.defer();
      console.log(db);
      var request = indexedDB.open('tasksData', version);
      request.onsuccess = function(e){
        console.log(newTask);
          db = e.target.result;
          var transaction = db.transaction(['tasks'], 'readwrite');
          var objectStore = transaction.objectStore('tasks');
          var req = objectStore.add(newTask);
          req.onsuccess = function(e){
            console.log(e.target.result);
            q.resolve(e.target.result);
          }
          req.onerror = function(){
            q.reject();
          }
      };
      request.onerror = function(e){
        q.reject();
      };
      return q.promise;
    };
    var getTasks = function(){
      console.log('hello from getTasks in service');
      var q = $q.defer();
      var request = indexedDB.open('tasksData', version);
      request.onsuccess = function(e){
        console.log('database was oppened successfully in the getTasks function in todoService');
          db = e.target.result;
          var transaction = db.transaction(['tasks'], 'readwrite');
          var objectStore = transaction.objectStore('tasks');
          var tasks = [];
          objectStore.openCursor().onsuccess = function(e){
            console.log('cursor is open');
            var cursor = e.target.result;
            if(cursor){
              console.log('got a task from indexedDB');
              tasks.push(cursor.value);
              cursor.continue();
            } else {
              q.resolve(tasks);
              console.log('no more entries in the cursor');
            }
          };
          //objectStore.add(newTask);
        console.log(db);
      };
      request.onerror = function(e){
        console.log('Something went wrong opening the database for getTasks');
        q.reject();
      };
      return q.promise;
    };
    var updateTask = function(task){
      console.log('hello from inside updateTask in the service');
      var q = $q.defer();
      var request = indexedDB.open('tasksData', version);
      request.onsuccess = function(e){
        console.log('database was opened and now in the onsuccess function for updateTask in the service ');
        db = e.target.result;
        var transaction = db.transaction(['tasks'], 'readwrite');
        var objectStore = transaction.objectStore('tasks');
        console.log(task);
        var request = objectStore.get(task.id);
        request.onsuccess = function(e){
          var oldTask = request.result;
          oldTask = task;
          var requestUpdate = objectStore.put(oldTask);
          requestUpdate.onsuccess = function(e){
            console.log('The task should now be updated in indexedDB');
            $rootScope.$apply();
            q.resolve();
          };
          requestUpdate.onerror = function(e){
            console.log('Something went wrong trying to update the task');
            q.reject(); 
          };
        };
        request.onerror = function(e){
          console.log('there was a problem trying to get the task to update in updateTask in the service');
          q.reject();
        };
      }
      return q.promise;
    };
    var deleteTask = function(task){
      console.log('now inside the deleteTask function in the service');
      var q = $q.defer();
      var request = indexedDB.open('tasksData', version);
      request.onsuccess = function(e){
        console.log('Opened the database successfully in the service in the deleteTask function');
        db = e.target.result;
        var transaction = db.transaction(['tasks'], 'readwrite');
        var objectStore = transaction.objectStore('tasks');
        var deleteRequest = objectStore.delete(task.id);
        deleteRequest.onsuccess = function(e){
          console.log('task should now be deleted from indexedDB');
          q.resolve();
        };
        deleteRequest.onerror = function(e){
          console.log('something went wrong trying to delete the task from indexedDB');
          q.reject();
        };
      };
      request.onerror = function(e){
        console.log('In deleteTask there was an error trying to open the database in the service');
        q.reject();
      };
      return q.promise;
    };
    return {
      getTasks: getTasks,
      addTask: addTask,
      updateTask: updateTask,
      deleteTask: deleteTask
    };
  }]);