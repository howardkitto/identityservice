var identityservice = angular.module('identityservice', []);
identityservice.controller('AppCtrl', ['$scope', '$http', function($scope, $http){
    console.log("The controller is working!");



    $scope.addIdentity = function(){
        console.log($scope.identity);
        $http.post('api/signup', $scope.identity);
    };

}]);
