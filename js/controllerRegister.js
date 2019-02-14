nominaController.controller('RegisterCtrl', ['$scope','$http','$rootScope', 'userService','flashService','$mdDialog','$mdMedia','$modal','$mdToast',
  function($scope,$http, $rootScope, userService, flashService,$mdDialog, $mdMedia,$modal, $mdToast) {
        var vm = this;
        vm.register = register;

        function register() {
            vm.dataLoading = true;
            userService.save(vm.user).$promise
                .then(function (response) {
                    if (response.success) {
                        flashService.Success('Registration successful', true);
                        $location.path('/login');
                    } else {
                        flashService.Error(response.message);
                        vm.dataLoading = false;
                    }
                });
        }

}]);