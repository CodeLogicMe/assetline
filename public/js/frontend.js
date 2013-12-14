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

assetline.factory('Packages', function(){
  var packagesService = {};
  packagesService.list = []

  return packagesService;
});

assetline.controller('popularCtrl', function($scope, $http, Packages){
  $scope.query;

  $http.get('/packages').success(function(data){
    Packages.list = data.packages;
    $scope.packages = data.packages;
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

assetline.controller('newPackageCtrl', function($rootScope, $scope, $http, Packages){
  $scope.libs = [];

  $http.get('/libs').success(function(data){
    $scope.libs = data.libs;

    // console.log($scope.libs);

    var libsNamesList = getAllNames();

    $scope.$watch("queryLib", function(val, old) {
      if(val === undefined) {
        console.log("UNDEFINED MY ASS!");
      };
      $scope.libsFiltered = fuzzySearch.findPatterns(val, libsNamesList);
    });
  });

  getAllNames = function() {
    var array = [];

    $scope.libs.forEach(function(lib) {
      array.push(lib.name);
    });

    return array;
  };

  var getAllNames;


  $scope.create = function(){
      var package = {
        libs: $scope.selectedLibs()
    };

    $scope.queryLib = '';

    $http.post('/packages', package).success(function(data){
      $rootScope.$broadcast('packaged-created');
      Packages.list.push(data);
    }).error(function(err){
      alert(err);
    });

    $rootScope.$broadcast('packaged-pushed');

    $scope.unselectPreviousLibs();
  };

  $scope.selectedLibs = function(){
    return $scope.libs.filter(function(lib) {
      return lib.selected;
    });
  };

  $scope.unselectPreviousLibs = function(){
    angular.forEach($scope.selectedLibs(), function(lib) {
      return lib.selected = false;
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
    var absUrl = $location.absUrl().replace(/\/\#\/$/, '');
    return absUrl + '/' + input;
  };
});

assetline.directive('pleaseWaitDialog', function($rootScope){
  return {
    restrict: 'E',
    replace: true,
    templateUrl: '/partials/loading',
    link: function(scope, elm){
      $rootScope.$on('packaged-pushed', function(){
        elm.modal();
      });

      $rootScope.$on('packaged-created', function(){
        elm.modal('hide');
      });
    }
  };
});

assetline.directive('packageCreationModal', function(){
  return {
    restrict: 'E',
    replace: true,
    templateUrl: '/partials/new_package',
    link: function(scope, elm){
      $('#myModal').on('shown.bs.modal', function () {
        $('.search-input.form-control').focus();
      });

      $('#myModal').on('hidden.bs.modal', function () {
        scope.$apply(function(){
          scope.queryLib = '';
        });
      });
    },
    controller: function($scope){
      $scope.currentPage = 0;
      $scope.pageSize = 10;
      $scope.maxSize = 5;

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

assetline.directive('copyToClipboard', function($compile){
  var copiedNotificationTpl = angular.element('<div class="copy-notification alert alert-success fade">' +
    '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>' +
    'The package url is in your clipboard. <strong>Happy Hacking!</strong>' +
  '</div>');

  var notificationElm;

  return {
    restrict: 'E',
    replace: true,
    scope: {
      value: '@text'
    },
    template: '<button class="copy-button btn btn-primary"' +
      'data-clipboard-text="{{value}}"' +
      'data-copied-hint="copied!"' +
      'title="copy to clipboard">' +
      'Copy Url' +
    '</button>',
    controller: function($scope){
      notificationElm = $compile(copiedNotificationTpl)($scope);
      $('body').prepend(notificationElm);
    },
    link: function(scope, elm){
      var clip = new ZeroClipboard(
        elm, {moviePath: "/js/ZeroClipboard.swf"}
      );

      var hideNotification = function(){
        notificationElm.removeClass('in');
      };

      clip.on('load', function(client){
        client.on('complete', function(client, args){
          notificationElm.addClass('in');
          setTimeout(hideNotification, 2000);
        });
      });
    }
  };
});
