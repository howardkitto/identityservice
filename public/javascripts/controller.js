'use strict';

/**********************************************************************
 * Angular Application
 **********************************************************************/
var app = angular.module('app', ['ngResource', 'ngRoute'])
  .config(function($routeProvider, $locationProvider, $httpProvider) {
    //================================================
    // Check if the user is connected
    //================================================
    var checkLoggedin = function($q, $timeout, $http, $location, $rootScope){
      // Initialize a new promise
      var deferred = $q.defer();

      // Make an AJAX call to check if the user is logged in
      $http.get('/loggedin').success(function(user){
        // Authenticated
        if (user !== '0')
          /*$timeout(deferred.resolve, 0);*/
          deferred.resolve();

        // Not Authenticated
        else {
          $rootScope.message = 'You need to log in.';
          //$timeout(function(){deferred.reject();}, 0);
          deferred.reject();
          $location.url('/login');
        }
      });

      return deferred.promise;
    };
    //================================================
    
    //================================================
    // Add an interceptor for AJAX errors
    //================================================
    $httpProvider.interceptors.push(function($q, $location) {
      return {
        response: function(response) {
          // do something on success
          return response;
        },
        responseError: function(response) {
          if (response.status === 401)
            $location.url('/login');
          return $q.reject(response);
        }
      };
    });
    //================================================

    //================================================
    // Define all the routes
    //================================================
    $routeProvider
      .when('/', {
        templateUrl: '/views/main.html'
      })
      .when('/admin', {
        templateUrl: 'views/admin.html',
        controller: 'AdminCtrl',
        resolve: {
          loggedin: checkLoggedin
        }
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      })
       .when('/register', {
        templateUrl: 'views/register.html',
        controller: 'RegCtrl'
      })
     .when('/profile', {
        templateUrl: 'views/profile.html',
        controller: 'ProfileCtrl',
          resolve: {
          loggedin: checkLoggedin
        }
      })
    
      .otherwise({
        redirectTo: '/'
      });
    //================================================

  }) // end of config()
  .run(function($rootScope, $http){
    $rootScope.message = '';

    // Logout function is available in any pages
    $rootScope.logout = function(){
      $rootScope.message = 'Logged out.';
      $http.post('/logout');
    };
  });


/**********************************************************************
 * Login controller
 **********************************************************************/
app.controller('LoginCtrl', function($scope, $rootScope, $http, $location) {
  // This object will be filled by the form
  $scope.user = {};

  // Register the login() function
  $scope.login = function(){
    $http.post('/login', {
      username: $scope.user.username,
      password: $scope.user.password,
    })
    .success(function(user){
      // No error: authentication OK
      $rootScope.message = 'Authentication successful!';
      $location.url('/admin');
    })
    .error(function(){
      // Error: authentication failed
      $rootScope.message = 'Authentication failed.';
      $location.url('/login');
    });
  };
});



/**********************************************************************
 * Admin controller
 **********************************************************************/
app.controller('AdminCtrl', function($scope, $rootScope, $http, $location) {
  // List of  got from the server
  $scope.identities = [];

  // Fill the array to display it in the page
  $http.get('/identity').success(function(identities){
    for (var i in identities)
      $scope.identities.push(identities[i]);
  });
    
    $scope.loadProfile = function(id){
        $rootScope.editThisOne = id;
        $location.url('/profile');
    };
    
    $scope.deleteIdentity = function(id){
        $http.delete('/identity/' + id).success(function(response){
        });
    };
});

/**********************************************************************
 * Registration controller
 **********************************************************************/

app.controller('RegCtrl', function($scope, $http, $location) {
    $scope.register = function(){
    $http.post('/identity', {
        username: $scope.identity.username,
        password: $scope.identity.password,
        email: $scope.identity.password,
        name: $scope.identity.name,}
              )
    .success(function(){
        $location.url('/admin');
        });
    }; 
});

/**********************************************************************
 * Profile controller
 **********************************************************************/

app.controller('ProfileCtrl', function($scope, $rootScope, $http, $location){ 
    if(!$rootScope.editThisOne){
        
                //$location.url('/admin');
    }
    console.log("edit this one" + $rootScope.editThisOne);
    $http.get('/identity/' +                    $rootScope.editThisOne).success(function(response){
    $rootScope.message = 'Editing User!';    
    $scope.identity = response;
    console.log(response);
        });
    
    $scope.update = function(id){
        $http.put('/identity/' + id, $scope.identity).success(function(response){
        $rootScope.message = 'Details Updated!';
        });
    };
    
});
               
               


