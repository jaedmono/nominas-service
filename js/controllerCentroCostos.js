
nominaController.controller('CentroCostosCtrl', ['$scope','$http','$rootScope', 'centroCostosService', 'uiGridConstants','$mdDialog','$mdMedia','$modal','$mdToast',
    function($scope,$http, $rootScope, centroCostosService, uiGridConstants,$mdDialog, $mdMedia,$modal, $mdToast) {

        $scope.sortInfo = {fields: ['id'], directions: ['asc']};
        $scope.centrosCostos = {currentPage: 1};
        var self = this;

        self.centrosCostosType   = loadCentroCostos("CENTRO_COSTOS");
        self.selectedItemCentroCostos    = null;
        self.searchTextCentroCostos    = null;

        function loadCentroCostos  (tipoCentro){
            var listEntidadesArgs = { id: tipoCentro };
           
            centroCostosService.query(listEntidadesArgs, function (resp) {
                self.centrosCostosType = resp;
          });
        }


        $scope.columns = [      
            { field: 'accion', displayName: '',width: 60, cellTemplate: '<span class="glyphicon glyphicon-remove remove" ng-click="grid.appScope.deleteRow(row,$event)"></span> <span class="glyphicon glyphicon-upload update" data-toggle="modal" ng-click="grid.appScope.editRow(row)" ></span>' , cellClass: 'grid-cell-style', enableCellEdit: false, enableFiltering: false},
            //Columna [0]
            {field: 'idCentroCostos', displayName: 'Id ',  enableCellEdit: false, width: 80, enableHiding: false, enableFiltering: false},
            //Columna [1]
            {field: 'codigo', displayName: 'Codigo Centro de Costos',  enableCellEdit: false, width: 80, enableHiding: false, enableFiltering: false},
            //Columna [2]
            {field:'descripcion', displayName:'Descripcion',  enableCellEdit: false, width: 300, enableHiding: false, enableFiltering: false},
            //Columna [3]
            {field:'tipo', displayName:'Tipo Centro Costos',  enableCellEdit: false, width: 200, enableHiding: false, enableFiltering: false},
            //Columna [4]
            {field:'relacionCentroCostos', displayName:'Centro Costos Padre',  enableCellEdit: false, width: 150, enableHiding: false, enableFiltering: false}


        ];

        $scope.gridCentroCostos = {
            data:'centrosCostos',
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
                sortFields: $scope.sortInfo.fields[0],
                sortDirections: $scope.sortInfo.directions[0]
            };

            centroCostosService.query(listEntidadesArgs, function (response) {
                $scope.centrosCostos = response;

            })
        };



       // Broadcast an event when an element in the grid is deleted. No real deletion is perfomed at this point.
        $scope.editRow = function (row) {
            self.selectedItemCentroCostos = null;
            $scope.centroCostos = row.entity;
            for (var i = self.centrosCostosType.length - 1; i >= 0; i--) {
                if (self.centrosCostosType[i].idCentroCostos == $scope.centroCostos.idRelacionCentroCostos) {
                    self.selectedItemCentroCostos = self.centrosCostosType[i];
                } 
                
            };

        };
        // Broadcast an event when an element in the grid is deleted. No real deletion is perfomed at this point.
        $scope.deleteRow = function (row,ev) {

            var index = $scope.centrosCostos.indexOf(row.entity);
            $scope.titleMessage = 'Esta seguro de eliminar el Centro de Costos? ';
            $scope.contentMessage = 'Confirma que quiere eliminar el Centro de Costos: ' + row.entity.descripcion;

            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.confirm()
                .title($scope.titleMessage)
                .textContent($scope.contentMessage)
                .ariaLabel('Lucky day')
                .targetEvent(ev)
                .ok('Confirmar')
                .cancel('Cancelar');

            $mdDialog.show(confirm).then(function() {
                $scope.deleteCentroCostos(row.entity.idCentroCostos);
                $scope.centrosCostos.splice(index,1);
            }, function() {

            });


        };

        
        // Calls the rest method to save a person.
        $scope.insertarCentroCostos = function () {
            var centroCostosJSON = {
                    idCentroCostos : $scope.centroCostos.idCentroCostos,
                    descripcion : $scope.centroCostos.descripcion,
                    tipo : $scope.centroCostos.tipo,
                    codigo : $scope.centroCostos.codigo,
                    relacionCentroCostos : self.selectedItemCentroCostos != null? self.selectedItemCentroCostos.idCentroCostos : null
                };

            if($scope.centroCostos.idCentroCostos == null){


                centroCostosService.save(centroCostosJSON).$promise.then(
                    function (response) {
                        $scope.centrosCostos.push(response);

                    },
                    function () {
                        $rootScope.$broadcast('error');
                    });
            }else {
                centroCostosService.update(centroCostosJSON).$promise.then(
                    function () {
                       $scope.centroCostos.idRelacionCentroCostos = self.selectedItemCentroCostos.idCentroCostos
                    },
                    function () {
                    });
            }
        };

        $scope.deleteCentroCostos = function(idCentroCostos){
            centroCostosService.remove({id: idCentroCostos}).$promise.then(
                function () {
                    $scope.refreshGrid();
                    $scope.clearForm();
                },
                function () {
                    // Broadcast the event for a server error.
                    $rootScope.$broadcast('error');
                });
        };

        $scope.clearCentroCostos = function(){
            $scope.centroCostos = {};
        };

    }]);
