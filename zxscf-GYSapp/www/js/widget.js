/**
 * Created by haibo on 2017/8/12.
 */
angular.module('zxscf.widget', [])
.directive('hideTabs', function ($rootScope) {
  return {
    restrict: 'A',
    link: function (scope, element, attributes) {
      scope.$on('$ionicView.beforeEnter', function () {
        scope.$watch(attributes.hideTabs, function (value) {
          $rootScope.hideTabs = 'tabs-item-hide';
        });
      });
      scope.$on('$ionicView.beforeLeave', function () {
        scope.$watch(attributes.hideTabs, function (value) {
          $rootScope.hideTabs = 'tabs-item-hide';
        });
        scope.$watch('$destroy', function () {
          $rootScope.hideTabs = false;
        });
      });
    }
  };
})
  .directive("fileModel", [function () {
    return {
      scope: {
        fileModel: "="
      },
      link: function (scope, element) {
        element.bind("change", function (changeEvent) {
          var reader = new FileReader();
          reader.onload = function (loadEvent) {
            scope.$apply(function () {
              scope.fileModel = loadEvent.target.result;
            });
          }
          reader.readAsDataURL(changeEvent.target.files[0]);
        });
      }
    }
  }]);
