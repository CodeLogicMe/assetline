var assetline = angular.module('assetline', ['ngRoute', 'ngAnimate']);

assetline.config(function($routeProvider){
  $routeProvider
  .when('/', {
    templateUrl: 'partials/popular',
    controller: 'popularCtrl'
  })
  .when('/new', {
    templateUrl: 'partials/new_asset',
    controller: 'newAssetCtrl'
  });
});

assetline.controller('popularCtrl', function($scope, $http){
  $scope.query;

  $http.get('/assets').success(function(data){
    $scope.assets = data.assets;
  });
});

assetline.controller('newAssetCtrl', function($scope, $http){
  $http.get('/libs').success(function(data){
    $scope.libs = data.libs;
  });
});
