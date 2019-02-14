
nominaController.controller('EntidadesCtrl', ['$scope','$http','$rootScope', 'entidadesService', 'uiGridConstants','$mdDialog','$mdMedia','$modal','$mdToast',
    function($scope,$http, $rootScope, entidadesService, uiGridConstants,$mdDialog, $mdMedia,$modal, $mdToast) {

        $scope.sortInfo = {fields: ['id'], directions: ['asc']};
        $scope.entidades = {currentPage: 1};

        $scope.columns = [      { field: 'accion', displayName: '',width: 60, cellTemplate: '<span class="glyphicon glyphicon-remove remove" ng-click="grid.appScope.deleteRow(row,$event)"></span> <span class="glyphicon glyphicon-upload update" data-toggle="modal" ng-click="grid.appScope.editRow(row)" ></span>' , cellClass: 'grid-cell-style', enableCellEdit: false, enableFiltering: false},
            //Columna [0]
            {field: 'idEntidad', displayName: 'Id Entidad',  enableCellEdit: false, width: 40, enableHiding: false, enableFiltering: false},
            //Columna [1]
            {field:'razonSocial', displayName:'Razon Social',  enableCellEdit: false, width: 240, enableHiding: false, enableFiltering: false},
            //Columna [2]
            {field:'direccion', displayName:'Dirección',  enableCellEdit: false, width: 180, enableHiding: false, enableFiltering: false, cellClass: 'grid-cell-style'},
            //Columna [3]
            {field:'telefono', displayName:'Teléfono', enableCellEdit: false, width: 100, enableFiltering: false, enableHiding: false},
            //Columna [4]
            {field:'paginaWeb', displayName:'Pagina Web', enableCellEdit: false, width: 150, enableFiltering: false, enableHiding: false},
            //Columna [5]
            {field:'email', displayName:'Correo Electronico', enableCellEdit: false, width: 150, enableFiltering: false, enableHiding: false},
            //Columna [6]
            {field:'codigo', displayName:'Codigo Entidad', enableCellEdit: false, width: 100, enableFiltering: false, enableHiding: false},
            //Columna [7]
            {field:'tipoEntidad', displayName:'Tipo Entidad', enableCellEdit: false,  width: 100, enableFiltering: false, enableHiding: false}


        ];

        $scope.gridOptionsEntidades = {
            data:'entidades',
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

            entidadesService.query(listEntidadesArgs, function (response) {
                $scope.entidades = response;

            })
        };


        $scope.insertRow = function (row) {
            $scope.toDo = 'insert';
            $scope.entidad = {};
            $scope.titleModal = 'Insertar Nuevo Concepto';
            $('#entidadesModal').modal('show') ;
        };

        // Broadcast an event when an element in the grid is deleted. No real deletion is perfomed at this point.
        $scope.editRow = function (row) {

            $scope.entidad = row.entity;
            $scope.toDo = 'update';
            $scope.titleModal = 'Editar Informacion Entidad Parafiscal';
            $('#entidadesModal').modal('show') ;

        };
        // Broadcast an event when an element in the grid is deleted. No real deletion is perfomed at this point.
        $scope.deleteRow = function (row,ev) {

            var index = $scope.entidades.indexOf(row.entity);
            $scope.titleMessage = 'Esta seguro de eliminar la entidad parafiscal? ';
            $scope.contentMessage = 'Confirma que quiere eliminar la entidad parafiscal identificado con el código No. ' + row.entity.codigo;

            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.confirm()
                .title($scope.titleMessage)
                .textContent($scope.contentMessage)
                .ariaLabel('Lucky day')
                .targetEvent(ev)
                .ok('Confirmar')
                .cancel('Cancelar');

            $mdDialog.show(confirm).then(function() {
                $scope.deleteEntidad(row.entity.idEntidad);
                $scope.entidades.splice(index,1);
            }, function() {

            });


        };

        $scope.insertarEntidad = function () {
            if($scope.entidad.idEntidad == null){
                entidadesService.save($scope.entidad).$promise.then(
                    function (response) {
                        $scope.entidades.push(response);
                    },
                    function () {
                        $rootScope.$broadcast('error');
                    });
            }else {
                alert(JSON.stringify($scope.entidad))
                entidadesService.update($scope.entidad).$promise.then(
                    function () {

                    },
                    function () {
                    });
            }
        };

        $scope.deleteEntidad = function(idEntidad){
            entidadesService.remove({id: idEntidad}).$promise.then(
                function () {
                    $scope.refreshGrid();
                    $scope.clearForm();
                },
                function () {
                    // Broadcast the event for a server error.
                    $rootScope.$broadcast('error');
                });
        };

        $scope.clearEntidad = function(){
            $scope.entidad = {};
        };

    }]);