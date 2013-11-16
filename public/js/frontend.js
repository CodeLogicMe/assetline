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
  })
  .when('/new_lib', {
    templateUrl: 'partials/new_lib',
    controller: 'newLibCtrl'
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

assetline.controller('newLibCtrl', function($scope, $http){
  $scope.new_lib = {};
  $scope.types = ['JS', 'CSS'];

  $http.get('/libs').success(function(data){
    $scope.libs = data.libs;
  });

  $scope.submit = function(){
    $http.post('/libs', $scope.new_lib).success(function(data){
      $scope.lib = data.lib;
      $scope.libs.push(data.lib);
      $scope.new_lib = {}
    });
  };

  $scope.delete = function(lib){
    $http.delete('/libs/' + lib._id);
    $scope.libs = $scope.libs.filter(function(item){
      return item._id !== lib._id;
    });
  };
});
