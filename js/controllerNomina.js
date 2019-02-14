nominaController.controller('NominaCtrl', ['$scope', '$http', '$rootScope', '$location', 'nominaService', 'empresaService', 'fileUploadService', 'periodosService', 'uiGridConstants', '$mdDialog', '$mdMedia', '$modal', '$mdToast',
    function($scope, $http, $rootScope, $location, nominaService, empresaService, fileUploadService, periodosService, uiGridConstants, $mdDialog, $mdMedia, $modal, $mdToast) {

        $scope.nominas = [];
        $scope.empresas = [];
        $scope.empresaSelected = [];
        $scope.sortInfo = { fields: ['id'], directions: ['asc'] };
        $scope.idEmpresa = 1;
        crl = this;

        empresaService.query({ idUsuario: $rootScope.globals.currentUser.user.idUsuario }, function(data) {
            $scope.empresas = data;
            $scope.empresaSelected = data[0];
            $scope.loadPayrolls();
        });

        $scope.loadPayrolls = function() {
            var listNominasArgs = {
                idEmpresa: $scope.empresaSelected.idEmpresa
            };
            nominaService.query(listNominasArgs, function(data) {

                for (var index = data.length - 1; index >= 0; index--) {
                    var nominaJSON = {
                        idNomina: data[index].idNomina,
                        idEmpresa: data[index].idEmpresa,
                        periodoPago: data[index].periodoNomina.periodo,
                        tipoNomina: data[index].periodoNomina.tipoNomina,
                        fechaPago: new Date(data[index].periodoNomina.fechaPago).toLocaleDateString(),
                        estado: data[index].estado,
                        totalEps: data[index].totalEps,
                        totalPension: data[index].totalPension,
                        totalCesantias: data[index].totalCesantias,
                        totalDeducido: data[index].totalDeducido,
                        totalDevengado: data[index].totalDevengado,
                        pagoNeto: data[index].pagoNeto
                    }

                    $scope.nominas.push(nominaJSON);
                }

            });
        };


        $scope.goToNomina = function(idNomina) {
            $rootScope.idNomina = idNomina;
            $location.path('/liquidacionnomina');
        };

        $scope.uploadFile = function() {
            var file = $scope.myFile;
            var idEmpresa = 1;
            fileUploadService.uploadFileToUrl(file, idEmpresa);
            $location.path('/archivosnovedades');

        };




        // Calls the rest method to save a person.
        $scope.insertarNomina = function() {
            //alert($scope.nomina.periodoNomina);
            var nominaJSON = {
                idEmpresa: $scope.empresaSelected.idEmpresa,
                periodoNomina: $scope.nomina.periodoNomina,
                estado: "PENDIENTE"

            };
            if ($scope.nomina.idNomina == null) {
                nominaService.save(nominaJSON).$promise.then(
                    function(response) {
                        $scope.showMessage("Nomina creada exitosamente");
                        $scope.nominas.push(response);

                    },
                    function() {
                        $scope.showMessage("Se presento un error en la creacion de la nomina");
                    });
            }

        };

        // Calls the rest method to delete a nomina.
        $scope.deleteRow = function(nominaLst) {

            $scope.titleMessage = 'Esta seguro de eliminar la nomina? ';
            $scope.contentMessage = 'Confirma que quiere eliminar la nomina: ' + nominaLst.idNomina;


            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.confirm()
                .title($scope.titleMessage)
                .textContent($scope.contentMessage)
                .ariaLabel('Lucky day')
                .ok('Confirmar')
                .cancel('Cancelar');

            $mdDialog.show(confirm).then(function() {
                $scope.deleteNomina(nominaLst.idNomina, nominaLst);
            }, function() {

            });

        };

        $scope.deleteNomina = function(idNomina, nominaLst) {
            var index = $scope.nominas.indexOf(nominaLst);
            nominaService.remove({ idNomina: idNomina }).$promise.then(
                function(response) {
                    $scope.showMessage("Nomina eliminada");
                    $scope.nominas.splice(index, 1);
                },
                function() {
                    $scope.showMessage("Se presento un error en la eliminación de la nomina");
                });
        };

        $scope.showMessage = function(messageResponse) {
            $mdToast.show(
                $mdToast.simple()
                .textContent(messageResponse)
                .position('top right')
                .hideDelay(3000)
                .theme('red')
            );
        };

        $scope.updatePeriod = function(tipoNomina) {
            var listPeriodsArgs = {
                type: tipoNomina,
                year: 2018,
                company: $scope.empresaSelected.idEmpresa
            };
            $scope.nomina.periodoPago = null;
            $scope.nomina.fechaPago = null;
            $scope.nomina.periodoNomina = null;
            periodosService.query(listPeriodsArgs, function(data) {
                $scope.nomina.periodoPago = data[0].periodo;
                $scope.nomina.fechaPago = new Date(data[0].fechaPago);
                $scope.nomina.periodoNomina = data[0];
            });
        };


        $scope.clearNomina = function() {
            $scope.nomina = {};
        };

    }
]);