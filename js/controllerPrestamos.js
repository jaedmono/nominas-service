nominaController.controller('PrestamosCtrl', ['$scope', '$http', '$rootScope', 'descuentoService', 'conceptosService', 'empresaService', 'contratosService', 'uiGridConstants', '$mdDialog', '$mdMedia', '$modal', '$mdToast',
    function($scope, $http, $rootScope, descuentoService, conceptosService, empresaService, contratosService, uiGridConstants, $mdDialog, $mdMedia, $modal, $mdToast) {

        $scope.empresas = [];
        loadEmpresas();
        var self = this;

        self.contratos = [];
        self.conceptos = [];
        $scope.prestamos = {};
        loadConceptos();

        $scope.columns = [{ field: 'accion', displayName: '', width: 60, cellTemplate: '<span class="glyphicon glyphicon-remove remove" ng-click="grid.appScope.deleteRow(row,$event)"></span> <span class="glyphicon glyphicon-upload update" data-toggle="modal" ng-click="grid.appScope.editRow(row)" ></span>', cellClass: 'grid-cell-style', enableCellEdit: false, enableFiltering: false },
            //Columna [0]
            { field: 'idDescuento', displayName: 'Id', enableCellEdit: false, width: 80, enableHiding: false, enableFiltering: false },
            //Columna [1]
            { field: 'concepto.descripcion', displayName: 'Concepto', enableCellEdit: false, width: 150, enableHiding: false, enableFiltering: false, cellClass: 'grid-cell-style' },
            //Columna [2]
            { field: 'contrato.empleado.primerNombre', displayName: 'Empleado', enableCellEdit: false, width: 250, enableHiding: false, enableFiltering: false, cellClass: 'grid-cell-style' },
            //Columna [3]
            { field: 'fechaInicio', displayName: 'Fecha Inicio', type: 'date', cellFilter: 'date:\'dd-MM-yyyy\'', enableCellEdit: false, width: 100, enableFiltering: false, enableHiding: false },
            //Columna [4]
            { field: 'fechaFinalizacion', displayName: 'Fecha Fin', type: 'date', cellFilter: 'date:\'dd-MM-yyyy\'', enableCellEdit: false, width: 100, enableFiltering: false, enableHiding: false },
            //Columna [4]
            { field: 'numeroCuotas', displayName: 'Número Cuotas', enableCellEdit: false, width: 100, enableFiltering: false, enableHiding: false },
            //Columna [5]
            { field: 'totalDescuento', displayName: 'Total Prestamo', enableCellEdit: false, width: 150, enableFiltering: false, enableHiding: false },
            //Columna [6]
            { field: 'periodoPago', displayName: 'Periodo Pago', enableCellEdit: false, width: 100, enableFiltering: false, enableHiding: false },
            //Columna [7]
            { field: 'estado', displayName: 'Estado', enableCellEdit: false, width: 150, enableFiltering: false, enableHiding: false },
            //Columna [8]
            { field: 'descripcion', displayName: 'Descripción', enableCellEdit: false, width: 140, enableFiltering: false, enableHiding: false }
        ];

        $scope.gridOptionsPrestamos = {
            data: 'prestamos',
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
            var descuentoArgs = {
                idCompany: self.empresaSelected.idEmpresa,
                relacionadoCon: "prestamo"
            };
            descuentoService.query(descuentoArgs, function(data) {
                $scope.prestamos = data;
            });

        };

        function loadEmpresas() {
            var listEmpresaArgs = { idUsuario: $rootScope.globals.currentUser.user.idUsuario };
            empresaService.query(listEmpresaArgs, function(data) {
                $scope.empresas = data;
                self.empresaSelected = data[0];
                $scope.refreshGrid();
                $scope.loadContratos();
            });
        }

        $scope.loadContratos = function() {
            var contratosArgs = { idEmpresa: self.empresaSelected.idEmpresa, estado: "ACTIVO" };
            contratosService.query(contratosArgs, function(data) {
                self.contratos = data;
                self.selectedItemContrato = null;
                //alert(JSON.stringify(data));
            });

        };

        function loadConceptos() {
            var conceptosArgs = { relacionadoCon: "prestamo" };
            conceptosService.query(conceptosArgs, function(response) {
                self.conceptos = response;
                //alert(JSON.stringify(response));
            });


        }

        $scope.insertarPrestamo = function() {
            var descuentoJSON = {
                idDescuento: $scope.prestamo.idPrestamo,
                concepto: self.selectedItemConcepto,
                contrato: self.selectedItemContrato,
                idContrato: self.selectedItemContrato.idContrato,
                totalDescuento: $scope.prestamo.valorTotal,
                numeroCuotas: $scope.prestamo.cuotas,
                fechaInicio: $scope.prestamo.fechaInicio,
                estado: "ACTIVO",
                periodoPago: $scope.prestamo.periodoPago,
                descripcion: $scope.prestamo.descripcion
            };
            if ($scope.prestamo.idPrestamo == null) {
                descuentoService.save(descuentoJSON).$promise.then(
                    function(response) {
                        $scope.clearForm();
                        $scope.prestamos.push(response);
                        $scope.prestamo = {};

                    },
                    function() {

                        $rootScope.$broadcast('error');
                    });
            } else {
                descuentoService.update(descuentoJSON).$promise.then(
                    function(response) {
                        $scope.refreshGrid();

                    },
                    function() {

                    });
            }

        }

        $scope.editRow = function(row) {

            $scope.prestamo = {
                valorTotal: row.entity.totalDescuento,
                cuotas: row.entity.numeroCuotas,
                fechaInicio: new Date(row.entity.fechaInicio),
                idPrestamo: row.entity.idDescuento,
                idConcepto: row.entity.concepto.idConcepto,
                idContrato: row.entity.contrato.idContrato,
                periodoPago: row.entity.periodoPago
            };

            self.selectedItemConcepto = null;
            for (var i = self.conceptos.length - 1; i >= 0; i--) {
                if (self.conceptos[i].idConcepto == $scope.prestamo.idConcepto) {
                    self.selectedItemConcepto = self.conceptos[i];
                    break;
                }

            };

            self.selectedItemContrato = null;
            for (var i = self.contratos.length - 1; i >= 0; i--) {
                if (self.contratos[i].idContrato == $scope.prestamo.idContrato) {
                    self.selectedItemContrato = self.contratos[i];
                    break;
                }

            };

        };

        // Broadcast an event when an element in the grid is deleted. No real deletion is perfomed at this point.
        $scope.deleteRow = function(row, ev) {

            var index = $scope.prestamos.indexOf(row.entity);
            $scope.titleMessage = 'Esta seguro de eliminar la informacion del prestamo? ';
            $scope.contentMessage = 'Confirma que quiere eliminar la informacion del prestamo No. ' + row.entity.idDescuento;

            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.confirm()
                .title($scope.titleMessage)
                .textContent($scope.contentMessage)
                .ariaLabel('Lucky day')
                .targetEvent(ev)
                .ok('Confirmar')
                .cancel('Cancelar');

            $mdDialog.show(confirm).then(function() {
                $scope.deleteDescuento(row.entity.idDescuento);
                $scope.prestamos.splice(index, 1);
            }, function() {

            });


        };

        $scope.deleteDescuento = function(idDescuento) {
            descuentoService.remove({ id: idDescuento }).$promise.then(
                function() {
                    $scope.refreshGrid();
                },
                function() {
                    $rootScope.$broadcast('error');
                });
        };



    }


]);