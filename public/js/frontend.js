var assetline = angular.module('assetline', [
  'ngRoute'
]);

assetline.config(function($routeProvider){
  $routeProvider
  .when('/', {
    templateUrl: 'partials/popular',
    controller: 'popularCtrl'
  })
  .when('/new', {
    templateUrl: 'partials/new_package',
    controller: 'newPackageCtrl'
  })
  .when('/new_lib', {
    templateUrl: 'partials/new_lib',
    controller: 'newLibCtrl'
  });
});

assetline.controller('popularCtrl', function($scope, $http){
  $scope.query;

  $http.get('/packages').success(function(data){
    $scope.packages = data.packages;
    console.log($scope.packages);
  });

  $scope.namesForPackage = function(pack){
    var names = [];
    angular.forEach(pack.libs, function(lib){
      if(lib.version) {
        names.push(lib.name + '#' + lib.version);
      }
      else
        names.push(lib.name);
    });
    return names.join(', ');
  };
});

assetline.controller('newLibCtrl', function($scope, $http){
  $scope.newLib = {};
  $scope.types = ['JS', 'CSS'];
  $scope.editLib;

  $http.get('/libs').success(function(data){
    $scope.libs = data.libs;
  });

  $scope.submit = function(){
    $http.post('/libs', $scope.newLib).success(function(data){
      $scope.lib = data.lib;
      $scope.libs.push(data.lib);
      $scope.newLib = {};
    });
  };

  $scope.delete = function(lib){
    $http.delete('/libs/' + lib._id);
    $scope.libs = $scope.libs.filter(function(item){
      return item._id !== lib._id;
    });
  };

  $scope.edit = function(lib){
    $scope.editLib = angular.copy(lib);
  };

  $scope.cancelEdit = function(){
    $scope.editLib = null;
    $scope.original = null;
  };

  $scope.update = function(lib){
    $http.put('/libs/' + lib._id, lib).success(function(data){
      $scope.cancelEdit();
    });
  };
});

assetline.controller('newPackageCtrl', function($scope, $http){
  $scope.libs = [];

  $http.get('/libs').success(function(data){
    $scope.libs = data.libs;
  });

  $scope.create = function(){
    var selectedLibs = $scope.libs.filter(function(lib) {
      return lib.selected;
    });

    var package = {
      libs: selectedLibs
    };

    $scope.queryLib = '';

    angular.forEach(selectedLibs, function(lib) {
      return lib.selected = false;
    });

    $http.post('/packages', package).success(function(data){
      Packages.push(data);
    });
  };
});

assetline.filter('startFrom', function() {
  return function(input, start) {
    if(input) {
      start = +start; //parse to int
      return input.slice(start);
    };
    return [];
  };
});

assetline.filter('withHost', function($location) {
  return function(input) {
    return $location.protocol()
         + '://'
         + $location.host()
         + ':'
         + $location.port()
         + '/'
         + input;
  }
});

assetline.directive('packageCreationModal', function(){
  return {
    restrict: 'E',
    replace: true,
    templateUrl: '/partials/new_package',
    controller: function($scope){
      $scope.currentPage = 0;
      $scope.pageSize = 10;
      $scope.maxSize = 5; //pagination max size

      $scope.$watch('queryLib', function(){
        $scope.currentPage = 0;
        $scope.numberOfPages();
      });

      $scope.numberOfPages = function() {
        if(!$scope.filtered)
          return 0;
        return Math.ceil($scope.filtered.length/$scope.pageSize);
      };

      $scope.goBackOnePage = function() {
        if ($scope.currentPage > 0) {
          $scope.currentPage--;
        };
      };

      $scope.goForwardOnePage = function() {
        if ($scope.currentPage + 1 < $scope.numberOfPages()) {
          $scope.currentPage++;
        };
      };

      $scope.isFirstPage = function() {
        return ($scope.currentPage === 0);
      };

      $scope.isLastPage = function() {
        return ($scope.currentPage === $scope.numberOfPages() - 1);
      };

      $scope.advancePageInSteps = function(steps) {
        $scope.currentPage += steps;
      };

      $scope.goToPage = function(page) {
        if(page == 'first') {
          $scope.currentPage = 0;
        }
        if(page == 'last') {
          $scope.currentPage = $scope.numberOfPages() - 1;
        }
      };
    }
  };
});
