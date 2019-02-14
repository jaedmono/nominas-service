nominaController.controller('EmpresaCtrl', ['$scope','$http','$rootScope', '$location', 'empresaService', 'uiGridConstants','$mdDialog','$mdMedia','$modal','$mdToast',
    function($scope,$http, $rootScope, $location, empresaService, uiGridConstants,$mdDialog, $mdMedia,$modal, $mdToast) {

            $scope.sortInfo = {fields: ['id'], directions: ['asc']};
            $scope.empresas= [];

            $scope.columns = [      { field: 'accion', displayName: '',width: 60, cellTemplate: '<span class="glyphicon glyphicon-remove remove" ng-click="grid.appScope.deleteRow(row,$event)"></span> <span class="glyphicon glyphicon-upload update" data-toggle="modal" ng-click="grid.appScope.editRow(row)" ></span>' , cellClass: 'grid-cell-style', enableCellEdit: false, enableFiltering: false},
                        //Columna [0]
                        {field: 'idEmpresa', displayName: 'Id Empresa',  enableCellEdit: false, width: 40, enableHiding: false, enableFiltering: false},
                        //Columna [1]
                        {field:'nit', displayName:'Nit',  enableCellEdit: false, width: 100, enableHiding: false, enableFiltering: false},
                        //Columna [2]
                        {field:'digitoVerificacion', displayName:'DV',  enableCellEdit: false, width: 40, enableHiding: false, enableFiltering: false, cellClass: 'grid-cell-style'},
                        //Columna [3]
                        {field:'razonSocial', displayName:'Razón Social', enableCellEdit: false, width: 250, enableFiltering: false, enableHiding: false},
                        //Columna [4]
                        {field:'direccion', displayName:'Dirección', enableCellEdit: false, width: 250, enableFiltering: false, enableHiding: false},
                        //Columna [5]
                        {field:'telefono', displayName:'Teléfono', enableCellEdit: false, width: 100, enableFiltering: false, enableHiding: false},
                        //Columna [6]
                        {field:'celular', displayName:'Celular', enableCellEdit: false, width: 100, enableFiltering: false, enableHiding: false},
                        //Columna [7]
                        {field:'email', displayName:'Correo Electronico', enableCellEdit: false, width: 250, enableFiltering: false, enableHiding: false},
                    ];

            $scope.gridOptionsEmpresas = {
                        data:'empresas',
                        enableGridMenu: false,
                        enableCellSelection: true,
                        enableRowSelection: false,
                        enableSelectAll: false,
                        enableRowHeaderSelection: false,
                        enableCellEditOnFocus: true,
                        enableColumnResize: true,
                        enableFiltering: true,
                        noUnselect: false,
                        onRegisterApi: function(gridApi){
                            $scope.gridApi = gridApi;
                        },
                        columnDefs: $scope.columns

                    };


             $scope.$watch('sortInfo.fields[0]', function () {
                         $scope.refreshGrid();
                     }, true);

             $scope.$on('refreshGrid', function () {
                 $scope.refreshGrid();
             });

             $scope.refreshGrid = function () {
                 var listEmpresaArgs = {
                     //sortFields: $scope.sortInfo.fields[0],
                     //sortDirections: $scope.sortInfo.directions[0]
                 };

                 empresaService.query(listEmpresaArgs, function (data) {
                    $scope.empresas = data;

                 })
             };

        $scope.insertarEmpresa = function(){
            var empresaJSON = {
                idEmpresa: $scope.empresa.idEmpresa,
                nit: $scope.empresa.nit,
                digitoVerificacion: $scope.empresa.digitoVerificacion,
                razonSocial: $scope.empresa.razonSocial,
                direccion: $scope.empresa.direccion  ,
                telefono: $scope.empresa.telefono,
                email: $scope.empresa.email,
                celular: $scope.empresa.celular,
                idUsuario: $rootScope.globals.currentUser.user.idUsuario
            };
            empresaService.save(empresaJSON).$promise.then(
                function (response) {
                    if(empresaJSON.idEmpresa == null){
                        $scope.empresas.push(response);
                     }else{
                        $scope.refreshGrid();
                     }

                },
                function () {
                    // Broadcast the event for a server error.
                    //$scope.clearForm();
                    $rootScope.$broadcast('error');
                });
        };

        $scope.editRow = function (row) {
            $scope.empresa = row.entity;
        };

        $scope.deleteRow = function (row,ev) {

            var index = $scope.empresa.indexOf(row.entity);
            $scope.titleMessage = 'Esta seguro de eliminar la Empresa? ';
            $scope.contentMessage = 'Confirma que quiere eliminar la empreas: ' + row.entity.razonSocial;

            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.confirm()
                .title($scope.titleMessage)
                .textContent($scope.contentMessage)
                .ariaLabel('Lucky day')
                .targetEvent(ev)
                .ok('Confirmar')
                .cancel('Cancelar');

            $mdDialog.show(confirm).then(function() {
                $scope.deleteEmpresa(row.entity.idEmpresa);
                $scope.empresas.splice(index,1);
            }, function() {

            });


        };

        $scope.deleteEmpresa = function(idEmpresa){
            empresaService.remove({id: idEmpresa}).$promise.then(
                function () {
                    $scope.refreshGrid();
                },
                function () {
                    // Broadcast the event for a server error.
                    $rootScope.$broadcast('error');
                });
        };
    }]);