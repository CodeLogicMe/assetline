var assetline = angular.module('assetline', []);

assetline.controller('popularCtrl', function($scope, $http){
  $scope.query;

  $http.get('/assets').success(function(data){
    $scope.assets = data.assets;
  });
});
