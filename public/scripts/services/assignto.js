'use strict';

angular.module('tasksApp')
  .service('assigneesService', ['$q', '$window', function($q, $window){
    var indexedDB = $window.indexedDB;
    var db=null;
    var lastIndex=0;
    var version = 1;
    var newAssignee;
    var request = indexedDB.open('tasksData', version);
    request.onupgradeneeded = function(e){
      console.log('Upgrading db to version ' + version);
      db = e.target.result;
      e.target.transaction.onerror = indexedDB.onerror;
      if(db.objectStoreNames.contains('assignees')){
        db.deleteObjectStore('assignees');
      }
      var store = db.createObjectStore('assignees', { keyPath: 'id', autoIncrement : true });
    };
    request.onsuccess = function(e){
      db = e.target.result;
      console.log('assignees db has been created / updated');
    };
    request.onerror = function(){
      console.log('something went wrong trying to create / update the db');
    };
    var addAssignee = function(newAssignee){
      var q = $q.defer();
      console.log(db);
      var request = indexedDB.open('tasksData', version);
      request.onsuccess = function(e){
        console.log(newAssignee);
          db = e.target.result;
          var transaction = db.transaction(['assignees'], 'readwrite');
          var objectStore = transaction.objectStore('assignees');
          objectStore.add(newAssignee);
        console.log(db);
        q.resolve();
      };
      request.onerror = function(e){
        q.reject();
      };
      return q.promise;
    };
    var getAssignees = function(){
      console.log('hello from getAssignees in service');
      var q = $q.defer();
      var request = indexedDB.open('tasksData', version);
      request.onsuccess = function(e){
        console.log('database was oppened successfully in the getAssignees function in todoService');
          db = e.target.result;
          var transaction = db.transaction(['assignees'], 'readwrite');
          var objectStore = transaction.objectStore('assignees');
          var assignees = [];
          objectStore.openCursor().onsuccess = function(e){
            console.log('cursor is open');
            var cursor = e.target.result;
            if(cursor){
              console.log('got an Assignee from indexedDB');
              assignees.push(cursor.value);
              cursor.continue();
            } else {
              q.resolve(assignees);
              console.log('no more entries in the cursor');
            }
          };
        console.log(db);
      };
      request.onerror = function(e){
        console.log('Something went wrong opening the database for getAssignees');
        q.reject();
      };
      return q.promise;
    };
    var updateAssignee = function(assignee){
      console.log('hello from inside updateAssignee in the service');
      var q = $q.defer();
      var request = indexedDB.open('tasksData', version);
      request.onsuccess = function(e){
        console.log('database was opened and now in the onsuccess function for updateAssignee in the service ');
        db = e.target.result;
        var transaction = db.transaction(['assignees'], 'readwrite');
        var objectStore = transaction.objectStore('assignees');
        var request = objectStore.get(assignee.id);
        request.onsuccess = function(e){
          var oldAssignee = request.result;
          oldAssignee = assignee;
          var requestUpdate = objectStore.put(oldAssignee);
          requestUpdate.onsuccess = function(e){
            console.log('The assignee should now be updated in indexedDB');
            q.resolve();
          };
          requestUpdate.onerror = function(e){
            console.log('Something went wrong trying to update the Assignee');
            q.reject(); 
          };
        };
        request.onerror = function(e){
          console.log('there was a problem trying to get the assignee to update in updateAssignee in the service');
          q.reject();
        };
      }
      return q.promise;
    };
    var deleteAssignee = function(assignee){
      console.log('now inside the deleteAssignee function in the service');
      var q = $q.defer();
      var request = indexedDB.open('tasksData', version);
      request.onsuccess = function(e){
        console.log('Opened the database successfully in the service in the deleteAssignee function');
        db = e.target.result;
        var transaction = db.transaction(['assignees'], 'readwrite');
        var objectStore = transaction.objectStore('assignees');
        var deleteRequest = objectStore.delete(assignee.id);
        deleteRequest.onsuccess = function(e){
          console.log('assignee should now be deleted from indexedDB');
          q.resolve();
        };
        deleteRequest.onerror = function(e){
          console.log('something went wrong trying to delete the assignee from indexedDB');
          q.reject();
        };
      };
      request.onerror = function(e){
        console.log('In deleteAssignee there was an error trying to open the database in the service');
        q.reject();
      };
      return q.promise;
    };
    return {
      getAssignees: getAssignees,
      addAssignee: addAssignee,
      updateAssignee: updateAssignee,
      deleteAssignee: deleteAssignee
    };
  }]);