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
});
