nominaController.controller('LoginCtrl', ['$scope','$rootScope', '$location', 'authenticationService','flashService','$mdDialog','$mdMedia','$modal','$mdToast',
  function($scope, $rootScope, $location, authenticationService,flashService,$mdDialog, $mdMedia,$modal, $mdToast) {
    var vm = this;

    vm.login = login;

    (function initController() {
        // reset login status
        authenticationService.ClearCredentials();
    })();

    function login() {
        vm.dataLoading = true;
        authenticationService.Login(vm.username, vm.password, function (response) {
            if (response.success) {
                authenticationService.SetCredentials(vm.username, vm.password, response.user);
                $location.path('/nomina');
            } else {
                flashService.Error(response.message);
                vm.dataLoading = false;
            }
        });
    };

}]);