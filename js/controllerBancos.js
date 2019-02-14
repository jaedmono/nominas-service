
nominaController.controller('BancosCtrl', ['$scope','$http','$rootScope', 'bancosService', 'uiGridConstants','$mdDialog','$mdMedia','$modal','$mdToast',
    function($scope,$http, $rootScope, bancosService, uiGridConstants,$mdDialog, $mdMedia,$modal, $mdToast) {

        $scope.sortInfo = {fields: ['id'], directions: ['asc']};
        $scope.bancos = {currentPage: 1};

        $scope.columns = [      { field: 'accion', displayName: '',width: 60, cellTemplate: '<span class="glyphicon glyphicon-remove remove" ng-click="grid.appScope.deleteRow(row,$event)"></span> <span class="glyphicon glyphicon-upload update" data-toggle="modal" ng-click="grid.appScope.editRow(row)" ></span>' , cellClass: 'grid-cell-style', enableCellEdit: false, enableFiltering: false},
            //Columna [0]
            {field: 'idBanco', displayName: 'Id Entidad',  enableCellEdit: false, width: 40, enableHiding: false, enableFiltering: false},
            //Columna [1]
            {field:'razonSocial', displayName:'Razon Social Banco',  enableCellEdit: false, width: 250, enableHiding: false, enableFiltering: false},
            //Columna [2]
            {field:'direccion', displayName:'Dirección',  enableCellEdit: false, width: 250, enableHiding: false, enableFiltering: false, cellClass: 'grid-cell-style'},
            //Columna [3]
            {field:'telefono', displayName:'Teléfono', enableCellEdit: false, width: 150, enableFiltering: false, enableHiding: false},
            //Columna [4]
            {field:'email', displayName:'Correo Electronico', enableCellEdit: false, width: 250, enableFiltering: false, enableHiding: false},

        ];

        $scope.gridOptionsBancos = {
            data:'bancos',
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
            var listEntidadesArgs = {
                // page: $scope.empleados.currentPage,
                sortFields: $scope.sortInfo.fields[0],
                sortDirections: $scope.sortInfo.directions[0]
            };

            bancosService.query(listEntidadesArgs, function (response) {
                $scope.bancos = response;

            })
        };


        $scope.insertRow = function (row) {
            $scope.toDo = 'insert';
            $scope.banco = {};
            $scope.titleModal = 'Insertar Nuevo Concepto';
            $('#entidadesModal').modal('show') ;
        };

        // Broadcast an event when an element in the grid is deleted. No real deletion is perfomed at this point.
        $scope.editRow = function (row) {

            $scope.banco = row.entity;
            $scope.toDo = 'update';
            $scope.titleModal = 'Editar Informacion Banco';
            $('#entidadesModal').modal('show') ;

        };
        // Broadcast an event when an element in the grid is deleted. No real deletion is perfomed at this point.
        $scope.deleteRow = function (row,ev) {

            var index = $scope.bancos.indexOf(row.entity);
            $scope.titleMessage = 'Esta seguro de eliminar el Banco? ';
            $scope.contentMessage = 'Confirma que quiere eliminar el Banco: ' + row.entity.razonSocial;

            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.confirm()
                .title($scope.titleMessage)
                .textContent($scope.contentMessage)
                .ariaLabel('Lucky day')
                .targetEvent(ev)
                .ok('Confirmar')
                .cancel('Cancelar');

            $mdDialog.show(confirm).then(function() {
                $scope.deleteBanco(row.entity.idBanco);
                $scope.bancos.splice(index,1);
            }, function() {

            });


        };

        // Calls the rest method to save a person.
        $scope.insertarBanco = function () {


            if($scope.banco.idBanco == null){

                bancosService.save($scope.banco).$promise.then(
                    function (response) {
                        //$scope.clearForm();
                        $scope.bancos.push(response);

                    },
                    function () {
                        // Broadcast the event for a server error.
                        //$scope.clearForm();
                        $rootScope.$broadcast('error');
                    });
            }else {
                alert(JSON.stringify($scope.banco));
                bancosService.update($scope.banco).$promise.then(
                    function () {
                        alert("Opcion 1 guardado banco");
                    },
                    function () {
                        alert("No se actualizo la informacion");
                    });
            }
        };

        $scope.deleteBanco = function(idBanco){
            bancosService.remove({id: idBanco}).$promise.then(
                function () {
                    $scope.refreshGrid();
                    $scope.clearForm();
                },
                function () {
                    // Broadcast the event for a server error.
                    $rootScope.$broadcast('error');
                });
        };

        $scope.clearBanco = function(){
            $scope.banco = {};
        };

    }]);
