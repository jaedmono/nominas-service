nominaController.controller('ContratosCtrl', ['$scope', '$http', '$rootScope', 'contratosService', 'empresaService', 'centroCostosService', 'personService', 'bancosService', 'entidadesService', 'uiGridConstants', '$mdDialog', '$mdMedia', '$modal', '$mdToast',
    function($scope, $http, $rootScope, contratosService, empresaService, centroCostosService, personService, bancosService, entidadesService, uiGridConstants, $mdDialog, $mdMedia, $modal, $mdToast) {




        $scope.sortInfo = { fields: ['id'], directions: ['asc'] };
        $scope.empresas = [];
        loadEmpresas();
        var self = this;


        // list of  value/display objects
        self.empleados = loadEmpleados();
        self.bancos = loadAllBancos();
        self.entidadEPS = loadAllEntidades("EPS");
        self.entidadCCP = loadAllEntidades("CCP");
        self.entidadARL = loadAllEntidades("ARL");
        self.entidadFDP = loadAllEntidades("FDP");
        self.entidadFDC = loadAllEntidades("FDC");
        self.centrosCostosType = loadCentroCostos("CENTRO_COSTOS");
        self.subCentrosCostosType = loadCentroCostos("SUB_CENTRO_COSTOS");
        self.selectedItemEmp = null;
        self.selectedItemBanco = null;
        self.selectedItemEPS = null;
        self.selectedItemCCP = null;
        self.selectedItemARL = null;
        self.selectedItemFDP = null;
        self.selectedItemFDC = null;
        self.searchText = null;
        self.searchTextBanco = null;

        self.selectedItemCentroCostos = null;
        self.searchTextCentroCostos = null;
        self.selectedItemSubCentroCostos = null;
        self.searchTextSubCentroCostos = null;

        function loadEmpresas() {
            var listEmpresaArgs = { idUsuario: $rootScope.globals.currentUser.user.idUsuario };
            empresaService.query(listEmpresaArgs, function(data) {
                $scope.empresas = data;
                $scope.empresaSelected = data[0];
                $scope.refreshGrid();
            });
        }

        function loadCentroCostos(tipoCentro) {
            var listEntidadesArgs = { id: tipoCentro };

            centroCostosService.query(listEntidadesArgs, function(resp) {
                if (tipoCentro == 'CENTRO_COSTOS') {
                    self.centrosCostosType = resp;
                } else {
                    self.subCentrosCostosType = resp;
                }
            });
        }

        function loadEmpleados() {

            personService.query(function(data) {
                self.empleados = data;
            });

        };

        /**
         * Build `components` list of key/value pairs
         */
        function loadAllBancos() {

            bancosService.query(function(resp) {
                self.bancos = resp;

            });

        };

        /**
         * Build `components` list of key/value pairs
         */
        function loadAllEntidades(entidad) {
            var listEntidadesArgs = { id: entidad };
            entidadesService.query(listEntidadesArgs, function(resp) {
                if (entidad == "EPS") {
                    self.entidadEPS = resp;
                } else if (entidad == "CCP") {
                    self.entidadCCP = resp;
                } else if (entidad == "ARL") {
                    self.entidadARL = resp;
                } else if (entidad == "FDP") {
                    self.entidadFDP = resp;
                } else {
                    self.entidadFDC = resp;
                }
            });

        };

        $scope.contratos = { currentPage: 1 };

        $scope.columns = [{ field: 'accion', displayName: '', width: 60, cellTemplate: '<span class="glyphicon glyphicon-remove remove" ng-click="grid.appScope.deleteRow(row,$event)"></span> <span class="glyphicon glyphicon-upload update" data-toggle="modal" ng-click="grid.appScope.editRow(row)" ></span>', cellClass: 'grid-cell-style', enableCellEdit: false, enableFiltering: false },
            //Columna [0]
            { field: 'idContrato', displayName: 'Id Contrato', enableCellEdit: false, width: 80, enableHiding: false, enableFiltering: false },
            //Columna [1]
            { field: 'empleado.numeroDocumento', displayName: 'Identificación', enableCellEdit: false, width: 150, enableHiding: false, enableFiltering: false, cellClass: 'grid-cell-style' },
            //Columna [2]
            { field: 'empleado.primerNombre', displayName: 'Trabajador', enableCellEdit: false, width: 250, enableHiding: false, enableFiltering: false, cellClass: 'grid-cell-style' },
            //Columna [3]
            { field: 'fechaInicio', displayName: 'Fecha Inicio', type: 'date', cellFilter: 'date:\'dd-MM-yyyy\'', enableCellEdit: false, width: 100, enableFiltering: false, enableHiding: false },
            //Columna [4]
            { field: 'fechaFin', displayName: 'Fecha Fin', type: 'date', cellFilter: 'date:\'dd-MM-yyyy\'', enableCellEdit: false, width: 100, enableFiltering: false, enableHiding: false },
            //Columna [4]
            { field: 'estado', displayName: 'estado', enableCellEdit: false, width: 100, enableFiltering: false, enableHiding: false },
            //Columna [5]
            { field: 'tipoContrato', displayName: 'Tipo Contrato', enableCellEdit: false, width: 150, enableFiltering: false, enableHiding: false },
            //Columna [6]
            { field: 'periodoPago', displayName: 'Periodo Pago', enableCellEdit: false, width: 100, enableFiltering: false, enableHiding: false },
            //Columna [7]
            { field: 'sueldo', displayName: 'Sueldo', type: 'number', cellFilter: 'number: 0', enableCellEdit: false, width: 150, enableFiltering: false, enableHiding: false },
            //Columna [8]
            { field: 'jornada', displayName: 'Jornada', enableCellEdit: false, width: 100, enableFiltering: false, enableHiding: false },
            //Columna [9]
            { field: 'centroCostos.descripcion', displayName: 'Centro Costos', enableCellEdit: false, width: 140, enableFiltering: false, enableHiding: false },
            //Columna [10]
            { field: 'subCentroCostos.descripcion', displayName: 'Sub Centro Costos', enableCellEdit: false, width: 140, enableFiltering: false, enableHiding: false },
            //Columna [11]
            { field: 'banco.razonSocial', displayName: 'Banco', enableCellEdit: false, width: 150, enableFiltering: false, enableHiding: false },
            //Columna [12]
            { field: 'numeroCuenta', displayName: 'Numero Cuenta', enableCellEdit: false, width: 150, enableFiltering: false, enableHiding: false },
            //Columna [13]
            { field: 'tipoCuenta', displayName: 'Tipo de Cuenta', enableCellEdit: false, width: 150, enableFiltering: false, enableHiding: false },
            //Columna [13]
            { field: 'eps.razonSocial', displayName: 'EPS', enableCellEdit: false, width: 100, enableFiltering: false, enableHiding: false },
            //Columna [14]
            { field: 'cajaCompensacion.razonSocial', displayName: 'Caja de Compensación', enableCellEdit: false, width: 100, enableFiltering: false, enableHiding: false },
            //Columna [15]
            { field: 'arl.razonSocial', displayName: 'ARL', enableCellEdit: false, width: 150, enableFiltering: false, enableHiding: false },
            //Columna [16]
            { field: 'fondoPension.razonSocial', displayName: 'Fondo de Pensiones', enableCellEdit: false, width: 150, enableFiltering: false, enableHiding: false },
            //Columna [17]
            { field: 'fondoCesantias.razonSocial', displayName: 'Fonde de Cesantias', enableCellEdit: false, width: 150, enableFiltering: false, enableHiding: false }
        ];

        $scope.gridOptionsContratos = {
            data: 'contratos',
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
            var listContratosArgs = {
                idEmpresa: $scope.empresaSelected.idEmpresa,
                estado: "ACTIVO"
            };

            contratosService.query(listContratosArgs, function(data) {
                $scope.contratos = data;
            });

        };


        // Broadcast an event when an element in the grid is deleted. No real deletion is perfomed at this point.
        $scope.editRow = function(row) {

            $scope.contrato = {
                idContrato: row.entity.idContrato,
                idEmpleado: row.entity.empleado.idEmpleado,
                estado: row.entity.estado,
                fechaInicio: new Date(row.entity.fechaInicio),
                fechaFin: new Date(row.entity.fechaFin),
                tipoContrato: row.entity.tipoContrato,
                periodoPago: row.entity.periodoPago,
                jornada: row.entity.jornada,
                sueldo: row.entity.sueldo,
                idBanco: row.entity.banco.idBanco,
                numeroCuenta: row.entity.numeroCuenta,
                tipoCuenta: row.entity.tipoCuenta,
                idCentroCostos: row.entity.centroCostos.idCentroCostos,
                idSubcentroCostos: row.entity.subCentroCostos.idCentroCostos,
                idEps: row.entity.eps.idEntidad,
                idCcp: row.entity.cajaCompensacion.idEntidad,
                idArl: row.entity.arl.idEntidad,
                idFdp: row.entity.fondoPension.idEntidad,
                idFdc: row.entity.fondoCesantias.idEntidad
            };

            self.selectedItemEmp = null;
            for (var i = self.empleados.length - 1; i >= 0; i--) {
                if (self.empleados[i].idEmpleado == $scope.contrato.idEmpleado) {
                    self.selectedItemEmp = self.empleados[i];
                    break;
                }

            };

            self.selectedItemBanco = null;
            for (var i = self.bancos.length - 1; i >= 0; i--) {
                if (self.bancos[i].idBanco == $scope.contrato.idBanco) {
                    self.selectedItemBanco = self.bancos[i];
                    break;
                }

            };

            self.selectedItemCentroCostos = null;
            for (var i = self.centrosCostosType.length - 1; i >= 0; i--) {
                if (self.centrosCostosType[i].idCentroCostos == $scope.contrato.idCentroCostos) {
                    self.selectedItemCentroCostos = self.centrosCostosType[i];
                    break;
                }

            };

            self.selectedItemSubCentroCostos = null;
            for (var i = self.subCentrosCostosType.length - 1; i >= 0; i--) {
                if (self.subCentrosCostosType[i].idCentroCostos == $scope.contrato.idSubcentroCostos) {
                    self.selectedItemSubCentroCostos = self.subCentrosCostosType[i];
                    break;
                }

            };

            self.selectedItemEPS = null;
            for (var i = self.entidadEPS.length - 1; i >= 0; i--) {
                if (self.entidadEPS[i].idEntidad == $scope.contrato.idEps) {
                    self.selectedItemEPS = self.entidadEPS[i];
                    break;
                }

            };

            self.selectedItemCCP = null;
            for (var i = self.entidadCCP.length - 1; i >= 0; i--) {
                if (self.entidadCCP[i].idEntidad == $scope.contrato.idCcp) {
                    self.selectedItemCCP = self.entidadCCP[i];
                    break;
                }

            };

            self.selectedItemARL = null;
            for (var i = self.entidadARL.length - 1; i >= 0; i--) {
                if (self.entidadARL[i].idEntidad == $scope.contrato.idArl) {
                    self.selectedItemARL = self.entidadARL[i];
                    break;
                }

            };

            self.selectedItemFDP = null;
            for (var i = self.entidadFDP.length - 1; i >= 0; i--) {
                if (self.entidadFDP[i].idEntidad == $scope.contrato.idFdp) {
                    self.selectedItemFDP = self.entidadFDP[i];
                    break;
                }

            };

            self.selectedItemFDC = null;
            for (var i = self.entidadFDC.length - 1; i >= 0; i--) {
                if (self.entidadFDC[i].idEntidad == $scope.contrato.idFdc) {
                    self.selectedItemFDC = self.entidadFDC[i];
                    break;
                }

            };

        };

        // Broadcast an event when an element in the grid is deleted. No real deletion is perfomed at this point.
        $scope.deleteRow = function(row, ev) {

            var index = $scope.contratos.indexOf(row.entity);
            $scope.titleMessage = 'Esta seguro de eliminar la informacion del contrato? ';
            $scope.contentMessage = 'Confirma que quiere eliminar la informacion del contrato No. ' + row.entity.idContrato;

            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.confirm()
                .title($scope.titleMessage)
                .textContent($scope.contentMessage)
                .ariaLabel('Lucky day')
                .targetEvent(ev)
                .ok('Confirmar')
                .cancel('Cancelar');

            $mdDialog.show(confirm).then(function() {
                $scope.deleteContrato(row.entity.idContrato);
                $scope.contratos.splice(index, 1);
            }, function() {

            });


        };

        // Calls the rest method to save a person.
        $scope.insertarContrato = function() {

            var contratoJSON = {
                idContrato: $scope.contrato.idContrato,
                empleado: self.selectedItemEmp,
                fechaInicio: $scope.contrato.fechaInicio,
                fechaFin: $scope.contrato.fechaFin,
                tipoContrato: $scope.contrato.tipoContrato,
                periodoPago: $scope.contrato.periodoPago,
                sueldo: $scope.contrato.sueldo,
                jornada: $scope.contrato.jornada,
                centroCostos: self.selectedItemCentroCostos,
                subCentroCostos: self.selectedItemSubCentroCostos,
                banco: self.selectedItemBanco,
                numeroCuenta: $scope.contrato.numeroCuenta,
                tipoCuenta: $scope.contrato.tipoCuenta,
                eps: self.selectedItemEPS,
                cajaCompensacion: self.selectedItemCCP,
                arl: self.selectedItemARL,
                fondoPension: self.selectedItemFDP,
                fondoCesantias: self.selectedItemFDC,
                estado: $scope.contrato.estado,
                idEmpresa: $scope.empresaSelected.idEmpresa
            };

            if ($scope.contrato.idContrato == null) {



                contratosService.save(contratoJSON).$promise.then(
                    function(response) {
                        $scope.clearForm();
                        $scope.contratos.push(response);
                        $scope.contrato = {};

                    },
                    function() {
                        // Broadcast the event for a server error.
                        //$scope.clearForm();
                        $rootScope.$broadcast('error');
                    });
            } else {
                contratosService.update(contratoJSON).$promise.then(
                    function() {

                        $scope.refreshGrid();
                    },
                    function() {

                    });
            }
        };

        $scope.deleteContrato = function(idContrato) {
            contratosService.remove({ id: idContrato }).$promise.then(
                function() {
                    $scope.refreshGrid();
                },
                function() {
                    $rootScope.$broadcast('error');
                });
        };

        $scope.clearForm = function() {
            $scope.contrato = {};
            self.selectedItemEmp = null;
            self.selectedItemBanco = null;
            self.selectedItemCentroCostos = null;
            self.selectedItemSubCentroCostos = null;
            self.selectedItemEPS = null;
            self.selectedItemCCP = null;
            self.selectedItemARL = null;
            self.selectedItemFDP = null;
            self.selectedItemFDC = null;

        };



    }
]);