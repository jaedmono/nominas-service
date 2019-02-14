nominaController.controller('NovedadesProgramadasCtrl', ['$scope', '$http', '$rootScope', 'novedadProgramadaService', 'conceptosService', 'empresaService', 'contratosService', 'uiGridConstants', '$mdDialog', '$mdMedia', '$modal', '$mdToast',
    function($scope, $http, $rootScope, novedadProgramadaService, conceptosService, empresaService, contratosService, uiGridConstants, $mdDialog, $mdMedia, $modal, $mdToast) {
        $scope.empresas = [];
        loadEmpresas();
        var self = this;


        self.contratos = [];
        self.conceptos = [];
        $scope.novedadesProgramadas = {};
        loadConceptos();

        function loadEmpresas() {
            var listEmpresaArgs = { idUsuario: $rootScope.globals.currentUser.user.idUsuario };
            empresaService.query(listEmpresaArgs, function(data) {
                $scope.empresas = data;
                self.empresaSelected = data[0];
                $scope.refreshGrid();
                $scope.loadContratos();
            });
        };

        $scope.loadContratos = function() {
            var contratosArgs = { idEmpresa: self.empresaSelected.idEmpresa, estado: "ACTIVO" };
            contratosService.query(contratosArgs, function(data) {
                self.contratos = data;
                self.selectedItemContrato = null;
                self.searchTextContract = '';
                //alert(JSON.stringify(data));
            });

        };

        function loadConceptos() {
            var conceptosArgs = { relacionadoCon: "novedad fija" };
            conceptosService.query(conceptosArgs, function(response) {
                self.conceptos = response;
                //alert(JSON.stringify(response));
            });


        };

        $scope.searchTextChangeEmp = function() {
            alert("wqqwerqwe");
        }

        $scope.columns = [{ field: 'accion', displayName: '', width: 60, cellTemplate: '<span class="glyphicon glyphicon-remove remove" ng-click="grid.appScope.deleteRow(row,$event)"></span> <span class="glyphicon glyphicon-upload update" data-toggle="modal" ng-click="grid.appScope.editRow(row)" ></span>', cellClass: 'grid-cell-style', enableCellEdit: false, enableFiltering: false },
            //Columna [0]
            { field: 'idNovedadProgramada', displayName: 'Id', enableCellEdit: false, width: 80, enableHiding: false, enableFiltering: false },
            //Columna [1]
            { field: 'concepto.descripcion', displayName: 'Concepto', enableCellEdit: false, width: 150, enableHiding: false, enableFiltering: false, cellClass: 'grid-cell-style' },
            //Columna [2]
            { field: 'contrato.empleado.primerNombre', displayName: 'Empleado', enableCellEdit: false, width: 250, enableHiding: false, enableFiltering: false, cellClass: 'grid-cell-style' },
            //Columna [3]
            { field: 'fechaInicio', displayName: 'Fecha Inicio', type: 'date', cellFilter: 'date:\'dd-MM-yyyy\'', enableCellEdit: false, width: 100, enableFiltering: false, enableHiding: false },
            //Columna [4]
            { field: 'fechaFinalizacion', displayName: 'Fecha Fin', type: 'date', cellFilter: 'date:\'dd-MM-yyyy\'', enableCellEdit: false, width: 100, enableFiltering: false, enableHiding: false },
            //Columna [4]
            { field: 'cantidad', displayName: 'Cantidad', enableCellEdit: false, width: 100, enableFiltering: false, enableHiding: false },
            //Columna [5]
            { field: 'valor', displayName: 'Valor', enableCellEdit: false, width: 150, enableFiltering: false, enableHiding: false },
            //Columna [7]
            { field: 'estadoNovedad', displayName: 'Estado', enableCellEdit: false, width: 150, enableFiltering: false, enableHiding: false }
        ];


        $scope.gridOptionsNovedades = {
            data: 'novedadesProgramadas',
            enableGridMenu: false,
            enableCellSelection: true,
            enableRowSelection: false,
            enableSelectAll: false,
            enableRowHeaderSelection: false,
            enableCellEditOnFocus: true,
            enableColumnResize: true,
            enableFiltering: true,
            noUnselect: false,
            onRegisterApi: function(gridApi) {
                $scope.gridApi = gridApi;
            },
            columnDefs: $scope.columns

        };

        $scope.$watch('sortInfo.fields[0]', function() {
            $scope.refreshGrid();
        }, true);

        $scope.$on('refreshGrid', function() {
            $scope.refreshGrid();
        });

        $scope.refreshGrid = function() {
            var novedadesProgramadasArgs = {
                idCompany: self.empresaSelected.idEmpresa
            };
            novedadProgramadaService.query(novedadesProgramadasArgs, function(data) {
                $scope.novedadesProgramadas = data;
            });

        };

        $scope.insertarNovedad = function() {
            var novedadProgramadaJSON = {
                idNovedadProgramada: $scope.novedad.idNovedad,
                concepto: self.selectedItemConcepto,
                cantidad: $scope.novedad.valor,
                valor: $scope.novedad.valor,
                contrato: self.selectedItemContrato,
                idContrato: self.selectedItemContrato.idContrato,
                estadoNovedad: "ACTIVO",
                fechaInicio: $scope.novedad.fechaInicio,
                fechaFinalizacion: $scope.novedad.fechaFin,
                idEmpresa: self.empresaSelected.idEmpresa
            };
            if ($scope.novedad.idNovedad == null) {
                novedadProgramadaService.save(novedadProgramadaJSON).$promise.then(
                    function(response) {
                        $scope.clearForm();
                        $scope.novedadesProgramadas.push(response);
                        $scope.novedad = {};
                    },
                    function() {

                        $rootScope.$broadcast('error');
                    });
            } else {
                novedadProgramadaService.update(novedadProgramadaJSON).$promise.then(
                    function(response) {
                        $scope.refreshGrid();

                    },
                    function() {

                    });
            }

        };

        $scope.clearForm = function() {
            $scope.novedad = {};
            self.selectedItemContrato = null;
            self.selectedItemConcepto = null;

        };


    }



]);