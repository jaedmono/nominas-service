'use strict';

/* Controllers */

var nominaController = angular.module('nominaController', []);

nominaController.controller('EmpleadosCtrl', ['$scope', '$http', '$rootScope', 'personService', 'uiGridConstants', '$mdDialog', '$mdMedia', '$modal', '$mdToast',
    function($scope, $http, $rootScope, personService, uiGridConstants, $mdDialog, $mdMedia, $modal, $mdToast) {

        $scope.sortInfo = { fields: ['id'], directions: ['asc'] };
        $scope.personas = { currentPage: 1 };
        $scope.refresh = false;


        $scope.gridApi = {};

        $scope.columns = [{ field: 'accion', displayName: '', width: 60, cellTemplate: '<span class="glyphicon glyphicon-remove remove" ng-click="grid.appScope.deleteRow(row,$event)"></span> <span class="glyphicon glyphicon-upload update" data-toggle="modal" ng-click="grid.appScope.editRow(row)" ></span>', cellClass: 'grid-cell-style', enableCellEdit: false, enableFiltering: false },
            //Columna [0]
            { field: 'idEmpleado', displayName: 'Id', enableCellEdit: false, width: 40, enableHiding: false, enableFiltering: false },
            //Columna [1]
            { field: 'tipoDocumento', displayName: 'Tipo Documento', enableCellEdit: false, width: 150, enableHiding: false, enableFiltering: false, cellClass: 'grid-cell-style' },
            //Columna [2]
            { field: 'numeroDocumento', displayName: 'Numero Documento', enableCellEdit: false, width: 180, enableHiding: false },
            //Columna [3]
            { field: 'primerNombre', displayName: 'Primer Nombre', enableCellEdit: false, width: 150, enableHiding: false },
            //Columna [4]
            { field: 'segundoNombre', displayName: 'Segundo Nombre', enableCellEdit: false, width: 150, enableHiding: false },
            //Columna [5]
            { field: 'primerApellido', displayName: 'Primer Apellido', enableCellEdit: false, width: 150, enableHiding: false },
            //Columna [6]
            { field: 'segundoApellido', displayName: 'Segundo Apellido', enableCellEdit: false, width: 150, enableHiding: false },
            //Columna [7]
            { field: 'fechaNacimiento', displayName: 'Fecha Nacimiento', type: 'date', cellFilter: 'date:"dd/MM/yyyy"', enableCellEdit: true, width: 150, enableHiding: false, cellClass: 'grid-cell-style' },
            //Columna [8]
            { field: 'genero', displayName: 'Genero', enableCellEdit: false, width: 100, enableHiding: false, enableFiltering: false, cellClass: 'grid-cell-style' },
            //Columna [9]
            { field: 'celular', displayName: 'Celular', enableCellEdit: false, width: 100, enableHiding: false, enableFiltering: false },
            //Columna [10]
            { field: 'telefono', displayName: 'Telefono', enableCellEdit: false, width: 100, enableHiding: false, enableFiltering: false },
            //Columna [11]
            { field: 'direccion', displayName: 'Direccion', enableCellEdit: false, width: 250, enableHiding: false, enableFiltering: false },
            //Columna [12]
            { field: 'email', displayName: 'Correo Electronico', enableCellEdit: false, width: 250, enableHiding: false, enableFiltering: false }

        ];

        $scope.gridOptionsEmp = {
            data: 'personas',
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


        // Refresh the grid, calling the appropriate rest method.
        $scope.refreshGrid = function() {
            var listPersonsArgs = {
                // page: $scope.empleados.currentPage,
                sortFields: $scope.sortInfo.fields[0],
                sortDirections: $scope.sortInfo.directions[0]
            };

            personService.query(listPersonsArgs, function(response) {
                $scope.personas = response;

            })
        };

        // Broadcast an event when an element in the grid is deleted. No real deletion is perfomed at this point.
        $scope.deleteRow = function(row, ev) {

            var index = $scope.personas.indexOf(row.entity);
            $scope.titleMessage = 'Esta seguro de eliminar empleado? ';
            $scope.contentMessage = 'Confirma que quiere eliminar al empleado identificado con el documento No. ' + row.entity.numeroDocumento;

            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.confirm()
                .title($scope.titleMessage)
                .textContent($scope.contentMessage)
                .ariaLabel('Lucky day')
                .targetEvent(ev)
                .ok('Confirmar')
                .cancel('Cancelar');

            $mdDialog.show(confirm).then(function() {
                $scope.deleteEmpleado(row.entity.idEmpleado);
                $scope.personas.splice(index, 1);
            }, function() {

            });


        };


        // Watch the sortInfo variable. If changes are detected than we need to refresh the grid.
        // This also works for the first page access, since we assign the initial sorting in the initialize section.
        $scope.$watch('sortInfo.fields[0]', function() {

            $scope.refreshGrid();
        }, true);

        // Do something when the grid is sorted.
        // The grid throws the ngGridEventSorted that gets picked up here and assigns the sortInfo to the scope.
        // This will allow to watch the sortInfo in the scope for changed and refresh the grid.
        $scope.$on('ngGridEventSorted', function(event, sortInfo) {
            $scope.sortInfo = sortInfo;
        });

        // Picks the event broadcasted when a person is saved or deleted to refresh the grid elements with the most
        // updated information.
        $scope.$on('refreshGrid', function() {
            $scope.refreshGrid();
        });

        // Picks the event broadcasted when the form is cleared to also clear the grid selection.
        $scope.$on('clear', function() {
            $scope.gridOptionsEmp.selectAll(false);
        });

        /************* +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ **********************************/
        $scope.clearForm = function() {
            $scope.empleado = null;
            // For some reason, I was unable to clear field values with type 'url' if the value is invalid.
            // This is a workaroud. Needs proper investigation.
            //document.getElementById('imageUrl').value = null;
            // Resets the form validation state.
            //$scope.personForm.$setPristine();
            // Broadcast the event to also clear the grid selection.
            $rootScope.$broadcast('clear');
        };

        // Calls the rest method to save a person.
        $scope.insertEmpleado = function(toDo) {

            $scope.empleado.genero = $scope.genero;

            if ($scope.toDo == 'insert') {

                personService.save($scope.empleado).$promise.then(
                    function(response) {
                        $scope.clearForm();
                        $scope.personas.push(response);

                    },
                    function() {
                        // Broadcast the event for a server error.
                        $scope.clearForm();
                        $rootScope.$broadcast('error');
                    });
            } else if ($scope.toDo == 'update') {
                personService.update($scope.empleado).$promise.then(
                    function() {},
                    function() {});
            }
        };

        $scope.deleteEmpleado = function(idempleado) {
            personService.remove({ id: idempleado }).$promise.then(
                function() {
                    $scope.refreshGrid();
                    $scope.clearForm();
                },
                function() {
                    // Broadcast the event for a server error.
                    $rootScope.$broadcast('error');
                });
        };

        $scope.insertRow = function(row) {
            $scope.toDo = 'insert';
            $scope.empleado = {};
            $scope.titleModal = 'Insertar Nuevo Empleado';
            $scope.genero = 'F';
            $('#empleadosModal').modal('show');
        };

        // Broadcast an event when an element in the grid is deleted. No real deletion is perfomed at this point.
        $scope.editRow = function(row) {

            $scope.empleado = row.entity;
            $scope.empleado.fechaNacimiento = new Date(row.entity.fechaNacimiento);
            $scope.toDo = 'update';
            $scope.genero = row.entity.genero;
            $scope.titleModal = 'Editar Informacion Empleado';
            $('#empleadosModal').modal('show');

        };


    }
]);



nominaController.controller('ConceptosCtrl', ['$scope', '$http', '$rootScope', 'conceptosService', 'uiGridConstants', '$mdDialog', '$mdMedia', '$modal', '$mdToast',
    function($scope, $http, $rootScope, conceptosService, uiGridConstants, $mdDialog, $mdMedia, $modal, $mdToast) {

        $scope.sortInfo = { fields: ['id'], directions: ['asc'] };
        $scope.conceptos = { currentPage: 1 };

        $scope.columns = [{ field: 'accion', displayName: '', width: 60, cellTemplate: '<span class="glyphicon glyphicon-remove remove" ng-click="grid.appScope.deleteRow(row,$event)"></span> <span class="glyphicon glyphicon-upload update" data-toggle="modal" ng-click="grid.appScope.editRow(row)" ></span>', cellClass: 'grid-cell-style', enableCellEdit: false, enableFiltering: false },
            //Columna [0]
            { field: 'idConcepto', displayName: 'Id', enableCellEdit: false, width: 40, enableHiding: false, enableFiltering: false },
            //Columna [1]
            //Columna [2]
            { field: 'descripcion', displayName: 'Descripción', enableCellEdit: false, width: 250, enableHiding: false, enableFiltering: false, cellClass: 'grid-cell-style' },
            //Columna [3]
            { field: 'tipoNomina', displayName: 'Tipo Nomina', enableCellEdit: false, width: 100, enableFiltering: false, enableHiding: false },
            //Columna [4]
            { field: 'naturaleza', displayName: 'Naturaleza', enableCellEdit: false, width: 100, enableFiltering: false, enableHiding: false },
            //Columna [5]
            { field: 'tipo', displayName: 'Tipo', enableCellEdit: false, width: 100, enableFiltering: false, enableHiding: false },
            //Columna [6]
            { field: 'factor', displayName: 'Factor', enableCellEdit: false, width: 100, enableFiltering: false, enableHiding: false },
            //Columna [7]
            { field: 'ibcSeguridadSocial', displayName: 'IBC Seguridad Social', enableCellEdit: false, width: 100, enableFiltering: false, enableHiding: false },
            //Columna [8]
            { field: 'clasificacion', displayName: 'Clasificacion', enableCellEdit: true, width: 100, enableFiltering: false, enableHiding: false },
            //Columna [9]
            { field: 'modoLiquidacion', displayName: 'Modo Liquidación', enableCellEdit: false, width: 100, enableHiding: false, enableFiltering: false },
            //Columna [10]
            { field: 'cruzaConSalario', displayName: 'Cruza Con Salario', enableCellEdit: false, width: 110, enableHiding: false, enableFiltering: false, type: 'boolean', cellTemplate: '<md-checkbox ng-model="row.entity.cruzaConSalario" aria-label="Checkbox 1"/>' },
            //Columna [11]
            { field: 'relacionadoCon', displayName: 'Relacionado Con', enableCellEdit: false, width: 100, enableHiding: false, enableFiltering: false },
            //Columna [12]
            { field: 'pagoIndirecto', displayName: 'Pago Indirecto', enableCellEdit: false, width: 80, enableHiding: false, enableFiltering: false, type: 'boolean', cellTemplate: '<md-checkbox ng-model="row.entity.pagoIndirecto" aria-label="Checkbox 1"/>' },
            //Columna [13]
            { field: 'aplicaSalud', displayName: 'Salud', enableCellEdit: false, width: 80, enableHiding: false, enableFiltering: false, type: 'boolean', cellTemplate: '<md-checkbox ng-model="row.entity.aplicaSalud" aria-label="Checkbox 1"/>' },
            //Columna [14]
            { field: 'aplicaPension', displayName: 'Pension', enableCellEdit: false, width: 80, enableHiding: false, enableFiltering: false, type: 'boolean', cellTemplate: '<md-checkbox ng-model="row.entity.aplicaPension" aria-label="Checkbox 1"/>' },
            //Columna [15]
            { field: 'aplicaARL', displayName: 'ARL', enableCellEdit: false, width: 80, enableHiding: false, enableFiltering: false, type: 'boolean', cellTemplate: '<md-checkbox ng-model="row.entity.aplicaARL" aria-label="Checkbox 1"/>' },
            //Columna [16]
            { field: 'aplicaRetencion', displayName: 'Retención', enableCellEdit: false, width: 80, enableHiding: false, enableFiltering: false, type: 'boolean', cellTemplate: '<md-checkbox ng-model="row.entity.aplicaRetencion" aria-label="Checkbox 1"/>' },
            //Columna [17]
            { field: 'aplicaPrimaServicios', displayName: 'Prima Servicios', enableCellEdit: false, width: 80, enableHiding: false, enableFiltering: false, type: 'boolean', cellTemplate: '<md-checkbox ng-model="row.entity.aplicaPrimaServicios" aria-label="Checkbox 1"/>' },
            //Columna [18]
            { field: 'aplicaCesantias', displayName: 'Cesantias', enableCellEdit: false, width: 80, enableHiding: false, enableFiltering: false, type: 'boolean', cellTemplate: '<md-checkbox ng-model="row.entity.aplicaCesantias" aria-label="Checkbox 1"/>' },
            //Columna [19]
            { field: 'bonificacion', displayName: 'Bonificación', enableCellEdit: false, width: 80, enableHiding: false, enableFiltering: false, type: 'boolean', cellTemplate: '<md-checkbox ng-model="row.entity.bonificacion" aria-label="Checkbox 1"/>' },
            //Columna [20]
            { field: 'indemnizacion', displayName: 'Indemnización', enableCellEdit: false, width: 80, enableHiding: false, enableFiltering: false, type: 'boolean', cellTemplate: '<md-checkbox ng-model="row.entity.indemnizacion" aria-label="Checkbox 1"/>' },
            //Columna [21]
            { field: 'aplicaVacacionesDinero', displayName: 'VacacionesDinero', enableCellEdit: false, width: 80, enableHiding: false, enableFiltering: false, type: 'boolean', cellTemplate: '<md-checkbox ng-model="row.entity.aplicaVacacionesDinero" aria-label="Checkbox 1"/>' },
            //Columna [22]
            { field: 'aplicaVacacionesDisfrute', displayName: 'VacacionesDisfrute', enableCellEdit: false, width: 80, enableHiding: false, enableFiltering: false, type: 'boolean', cellTemplate: '<md-checkbox ng-model="row.entity.aplicaVacacionesDisfrute" aria-label="Checkbox 1"/>' },
            //Columna [23]
            { field: 'contratoLiqVacaciones', displayName: 'Contrato Liq Vacaciones', enableCellEdit: false, width: 80, enableHiding: false, enableFiltering: false, type: 'boolean', cellTemplate: '<md-checkbox ng-model="row.entity.contratoLiqVacaciones" aria-label="Checkbox 1"/>' },
            //Columna [24]
            { field: 'aplicaSubsidioTransporte', displayName: 'Subsidio Transporte', enableCellEdit: false, width: 80, enableHiding: false, enableFiltering: false, type: 'boolean', cellTemplate: '<md-checkbox ng-model="row.entity.aplicaSubsidioTransporte" aria-label="Checkbox 1"/>' },
            //Columna [25]
            { field: 'aplicaCajaCompensacion', displayName: 'Caja Compensacion', enableCellEdit: false, width: 80, enableHiding: false, enableFiltering: false, type: 'boolean', cellTemplate: '<md-checkbox ng-model="row.entity.aplicaCajaCompensacion" aria-label="Checkbox 1"/>' },
            //Columna [26]
            { field: 'aplicaICBF', displayName: 'ICBF', enableCellEdit: false, width: 80, enableHiding: false, enableFiltering: false, type: 'boolean', cellTemplate: '<md-checkbox ng-model="row.entity.aplicaICBF" aria-label="Checkbox 1"/>' },
            //Columna [27]
            { field: 'aplicaSENA', displayName: 'SENA', enableCellEdit: false, width: 80, enableHiding: false, enableFiltering: false, type: 'boolean', cellTemplate: '<md-checkbox ng-model="row.entity.aplicaSENA" aria-label="Checkbox 1"/>' },
            //Columna [28]
            { field: 'aplicaLey1393', displayName: 'Ley 1393', enableCellEdit: false, width: 80, enableHiding: false, enableFiltering: false, type: 'boolean', cellTemplate: '<md-checkbox ng-model="row.entity.aplicaLey1393" aria-label="Checkbox 1"/>' }


        ];

        $scope.gridOptionsConcepto = {
            data: 'conceptos',
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



        // Refresh the grid, calling the appropriate rest method.
        $scope.refreshGrid = function() {
            var listConceptosArgs = {
                id: "ALL"
            };

            conceptosService.query(listConceptosArgs, function(response) {
                $scope.conceptos = response;

            })
        };


        $scope.insertRow = function(row) {
            $scope.toDo = 'insert';
            $scope.concepto = {};
            $scope.titleModal = 'Insertar Nuevo Concepto';
            $('#conceptosModal').modal('show');
        };

        // Broadcast an event when an element in the grid is deleted. No real deletion is perfomed at this point.
        $scope.editRow = function(row) {

            $scope.concepto = row.entity;
            $scope.toDo = 'update';
            $scope.titleModal = 'Editar Informacion Concepto';
            $('#conceptosModal').modal('show');

        };
        // Broadcast an event when an element in the grid is deleted. No real deletion is perfomed at this point.
        $scope.deleteRow = function(row, ev) {

            var index = $scope.conceptos.indexOf(row.entity);
            $scope.titleMessage = 'Esta seguro de eliminar el concepto? ';
            $scope.contentMessage = 'Confirma que quiere eliminar el concepto identificado con el código No. ' + row.entity.codigo;

            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.confirm()
                .title($scope.titleMessage)
                .textContent($scope.contentMessage)
                .ariaLabel('Lucky day')
                .targetEvent(ev)
                .ok('Confirmar')
                .cancel('Cancelar');

            $mdDialog.show(confirm).then(function() {
                $scope.deleteConcepto(row.entity.idConcepto);
                $scope.conceptos.splice(index, 1);
            }, function() {

            });


        };

        // Calls the rest method to save a person.
        $scope.insertarConcepto = function(toDo) {
            if ($scope.toDo == 'insert') {
                alert(JSON.stringify($scope.concepto));
                conceptosService.save($scope.concepto).$promise.then(
                    function(response) {
                        //$scope.clearForm();
                        $scope.conceptos.push(response);

                    },
                    function() {
                        // Broadcast the event for a server error.
                        $scope.clearForm();
                        $rootScope.$broadcast('error');
                    });
            } else if ($scope.toDo == 'update') {
                alert(JSON.stringify($scope.concepto));
                conceptosService.update($scope.concepto).$promise.then(
                    function() {},
                    function() {});
            }
        };

        $scope.deleteConcepto = function(idConcepto) {
            conceptosService.remove({ id: idConcepto }).$promise.then(
                function() {
                    $scope.refreshGrid();
                    $scope.clearForm();
                },
                function() {
                    // Broadcast the event for a server error.
                    $rootScope.$broadcast('error');
                });
        };

    }
]);

nominaController.controller('PeriodosCtrl', ['$scope', '$http', '$rootScope', 'periodosService', 'empresaService', 'uiGridConstants', '$mdDialog', '$mdMedia', '$modal', '$mdToast',
    function($scope, $http, $rootScope, periodosService, empresaService, uiGridConstants, $mdDialog, $mdMedia, $modal, $mdToast) {

        $scope.sortInfo = { fields: ['id'], directions: ['asc'] };
        $scope.periodos = { currentPage: 1 };
        $scope.empresas = [];
        loadEmpresas();

        $scope.columns = [{ field: 'accion', displayName: '', width: 100, cellTemplate: 'mapBottons.html', cellClass: 'grid-cell-style', enableCellEdit: false, enableFiltering: false },
            //Columna [1]
            { field: 'idPeriodoNomina', displayName: 'Id', enableCellEdit: false, width: 100, enableHiding: false, enableFiltering: false },
            //Columna [2]
            { field: 'tipoNomina', displayName: 'Tipo Nomina', enableCellEdit: false, width: 150, enableHiding: false, enableFiltering: true, cellClass: 'grid-cell-style' },
            //Columna [3]
            { field: 'year', displayName: 'Año', enableCellEdit: false, width: 100, enableFiltering: true, enableHiding: false },
            //Columna [4]
            { field: 'periodo', displayName: 'Periodo', enableCellEdit: false, width: 250, enableFiltering: true, enableHiding: false },
            //Columna [5]
            { field: 'fechaPago', displayName: 'Fecha de Pago', type: 'date', cellFilter: 'date:"dd/MM/yyyy"', enableCellEdit: true, width: 150, enableHiding: false, cellClass: 'grid-cell-style' }
        ];

        $scope.gridPeriodos = {
            data: 'periodos',
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

        /*$scope.$watch('sortInfo.fields[0]', function () {

            $scope.refreshGrid();
        }, true);

         $scope.$on('refreshGrid', function () {
            $scope.refreshGrid();
        });*/


        // Refresh the grid, calling the appropriate rest method.
        $scope.refreshGrid = function() {
            var listPeriodosArgs = {
                company: $scope.empresaSelected.idEmpresa
            };

            periodosService.query(listPeriodosArgs, function(response) {
                $scope.periodos = response;

            })
        };



        function loadEmpresas() {
            var listEmpresaArgs = { idUsuario: $rootScope.globals.currentUser.user.idUsuario };
            empresaService.query(listEmpresaArgs, function(data) {
                $scope.empresas = data;
                $scope.empresaSelected = data[0];
                $scope.refreshGrid();
            });
        }

        $scope.generarPeriodos = function() {

            periodosService.update({ type: $scope.tipoNomina, year: $scope.year, company: $scope.empresaSelected.idEmpresa }).$promise.then(
                function(response) {
                    $scope.periodos = response;
                },
                function() {
                    $scope.showMessage("Se presento un error generando los periodos");
                }
            );
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

        $scope.updateRow = function(row, ev) {

            $scope.periodo = row.entity;
            $scope.titleMessage = 'Esta seguro de actualizar la fecha de pago? ';
            $scope.contentMessage = 'Confirma que quiere actualizar el periodo con el id No. ' + row.entity.idPeriodo;

            // Appending dialog to document.body to cover sidenav in docs app
            var confirm = $mdDialog.confirm()
                .title($scope.titleMessage)
                .textContent($scope.contentMessage)
                .ariaLabel('Lucky day')
                .targetEvent(ev)
                .ok('Confirmar')
                .cancel('Cancelar');

            $mdDialog.show(confirm).then(function() {
                periodosService.save($scope.periodo).$promise.then(
                    function(response) {
                        $scope.showMessage("Se actualizó el periodo: " + response.idPeriodo);
                    },
                    function() {
                        $scope.showMessage("Se presento un error actualizando el periodo");
                    }
                );
            }, function() {

            });


        };
    }
]);