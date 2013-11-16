var assetline = angular.module('assetline', ['ngRoute', 'ngAnimate']);

assetline.config(function($routeProvider){
  $routeProvider
  .when('/', {
    templateUrl: 'partials/popular',
    controller: 'popularCtrl'
  });
});

assetline.controller('popularCtrl', function($scope, $http){
  $scope.query;

  $http.get('/assets').success(function(data){
    $scope.assets = data.assets;
  });
});
