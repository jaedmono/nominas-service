nominaController.controller('liquidaNominaContoller', ['$scope', '$http', '$rootScope', '$mdDialog', '$location', 'uiGridConstants', 'nominaContratosService', 'nominaService', 'conceptosService', 'novedadService',
    function($scope, $http, $rootScope, $mdDialog, $location, uiGridConstants, nominaContratosService, nominaService, conceptosService, novedadService) {

        $scope.totalArl = 0;
        $scope.totalCesantias = 0;
        $scope.interesesCesantias = 0;
        $scope.primasServicios = 0;
        $scope.vacaciones = 0;
        $scope.cajasCompensacion = 0;
        $scope.totalSena = 0;
        $scope.totalIcbf = 0;
        $scope.idNomina = $rootScope.idNomina;
        $scope.nominacontratos = [];

        $scope.nomina = {};

        function loadDataNomina() {
            var listNominasArgs = { idNomina: $rootScope.idNomina };
            nominaService.search(listNominasArgs, function(data) {
                var nominaJSON = {
                    idNomina: data.idNomina,
                    idEmpresa: data.idEmpresa,
                    periodoPago: data.periodoNomina.periodo,
                    tipoNomina: data.periodoNomina.tipoNomina,
                    estado: data.estado,
                    totalEps: data.totalEps,
                    totalPension: data.totalPension,
                    totalCesantias: data.totalCesantias,
                    totalDeducido: data.totalDeducido,
                    totalDevengado: data.totalDevengado,
                    pagoNeto: data.pagoNeto
                }
                $scope.nomina = nominaJSON;
            });
        };



        $scope.columns = [{ field: 'accion', displayName: '', width: 60, cellTemplate: '<span class="glyphicon glyphicon-remove remove" ng-click="grid.appScope.deleteRow(row,$event)"></span> <span class="glyphicon glyphicon-upload update" data-toggle="modal" ng-click="grid.appScope.adicionarNovedades(row)" ></span>', cellClass: 'grid-cell-style', enableCellEdit: false, enableFiltering: false },
            //Columna [0]
            { field: 'idContract', displayName: 'Id Contrato', enableCellEdit: false, width: 40, enableHiding: false, enableFiltering: false },
            //Columna [1]
            { field: 'document', displayName: 'No. Documento', enableCellEdit: false, width: 140, enableHiding: false },
            //Columna [2]
            { field: 'employeeName', displayName: 'Empleado', enableCellEdit: false, width: 200, enableHiding: false },
            //Columna [3]
            { field: 'startDate', displayName: 'Fecha de Ingreso', type: 'date', cellFilter: 'date:\'dd-MM-yyyy\'', enableCellEdit: false, width: 150, enableHiding: false },
            //Columna [3]
            { field: 'retirementDate', displayName: 'Fecha de Retiro', type: 'date', cellFilter: 'date:\'dd-MM-yyyy\'', enableCellEdit: false, width: 150, enableHiding: false, enableFiltering: false },
            //Columna [4]
            { field: 'salary', displayName: 'Sueldo', type: 'number', cellFilter: 'number: 0', enableCellEdit: false, width: 120, enableHiding: false, enableFiltering: false },
            //Columna [5]
            { field: 'workedDays', displayName: 'Dias Liquidados', enableCellEdit: false, width: 140, enableHiding: false, enableFiltering: false }
        ];


        $scope.gridOptions = {
            data: 'nominacontratos',
            enableGridMenu: false,
            enableCellSelection: true,
            enableRowSelection: false,
            enableCellEditOnFocus: true,
            enableColumnResize: true,
            enableFiltering: true,
            showColumnFooter: true,
            columnDefs: $scope.columns
        };

        $scope.$watch('sortInfo.fields[0]', function() {
            $scope.refreshGrid();
        }, true);

        $scope.$on('refreshGrid', function() {
            $scope.refreshGrid();
        });

        function loadColumsGrid() {
            var listNominaArgs = {
                id: $scope.idNomina
            };
            novedadService.query(listNominaArgs, function(data) {

                for (var idx = data.length - 1; idx >= 0; idx--) {
                    if (data[idx].naturaleza == "devengo") {
                        $scope.columns.push({ field: "changesPayroll." + data[idx].idConcepto + ".cantidad", displayName: "Cantidad", type: 'number', cellFilter: 'number: 0', aggregationType: uiGridConstants.aggregationTypes.sum, cellClass: 'grid-cell-style-number', enableCellEdit: false, width: 80, enableHiding: false, enableFiltering: false });
                        $scope.columns.push({ field: "changesPayroll." + data[idx].idConcepto + ".valor", displayName: data[idx].descripcion, type: 'number', cellFilter: 'number: 0', aggregationType: uiGridConstants.aggregationTypes.sum, cellClass: 'grid-cell-style-number', enableCellEdit: false, width: 160, enableHiding: false, enableFiltering: false });
                    }
                }
                $scope.columns.push({ field: 'totalAccrued', displayName: 'Total Devengado', type: 'number', cellFilter: 'number: 0', aggregationType: uiGridConstants.aggregationTypes.sum, cellClass: 'grid-cell-style-number', enableCellEdit: false, width: 160, enableHiding: false, enableFiltering: false });
                for (var idx = data.length - 1; idx >= 0; idx--) {
                    if (data[idx].naturaleza == "deduccion") {
                        $scope.columns.push({ field: "changesPayroll." + data[idx].idConcepto + ".cantidad", displayName: "Cantidad", type: 'number', cellFilter: 'number: 0', aggregationType: uiGridConstants.aggregationTypes.sum, cellClass: 'grid-cell-style-number', enableCellEdit: false, width: 80, enableHiding: false, enableFiltering: false });
                        $scope.columns.push({ field: "changesPayroll." + data[idx].idConcepto + ".valor", displayName: data[idx].descripcion, type: 'number', cellFilter: 'number: 0', aggregationType: uiGridConstants.aggregationTypes.sum, cellClass: 'grid-cell-style-number', enableCellEdit: false, width: 160, enableHiding: false, enableFiltering: false });
                    }
                }
                $scope.columns.push({ field: 'totalDeducted', displayName: 'Total Deducido', type: 'number', cellFilter: 'number: 0', aggregationType: uiGridConstants.aggregationTypes.sum, cellClass: 'grid-cell-style-number', enableCellEdit: false, width: 160, enableHiding: false, enableFiltering: false });
                $scope.columns.push({ field: 'netPay', displayName: 'Pago Neto', type: 'number', cellFilter: 'number: 0', aggregationType: uiGridConstants.aggregationTypes.sum, cellClass: 'grid-cell-style-number', enableCellEdit: false, width: 160, enableHiding: false, enableFiltering: false });
            });
        };

        $scope.refreshGrid = function() {
            loadDataNomina();
            loadColumsGrid();
            var listNominaContratosArgs = {
                id: $scope.idNomina
            };

            nominaContratosService.query(listNominaContratosArgs, function(data) {
                $scope.nominacontratos = data;
            });




        };



        $scope.adicionarNovedades = function(row) {

            $scope.empleado = row.entity;
            $mdDialog.show({
                scope: $scope,
                preserveScope: true,
                controller: DialogCtrl,
                controllerAs: 'ctrl',
                templateUrl: 'pages/adicionarnovedades.html',
                parent: angular.element(document.body),
                //targetEvent: $event,
                clickOutsideToClose: true
            });
        };

        // Broadcast an event when an element in the grid is deleted. No real deletion is perfomed at this point.
        $scope.deleteRow = function(row, ev) {

            var index = $scope.personas.indexOf(row.entity);
            $scope.titleMessage = 'Esta seguro de eliminar empleado de esta nomins? ';
            $scope.contentMessage = 'Confirma que quiere eliminar al empleado identificado con el documento No. ' + row.entity.numeroDocumento + ' de esta nomina';

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

        $scope.backToNomina = function() {
            $location.path('/nomina');
        };

    }
]);

function DialogCtrl($timeout, $q, $scope, $mdDialog, conceptosService, novedadService, novedadContratoService) {
    var self = this;

    //alert(JSON.stringify($scope.empleado));

    self.conceptos = loadAll();
    $scope.novedades = loadNovedades();

    $scope.columns = [{ field: 'accion', displayName: '', width: 60, cellTemplate: '<span class="glyphicon glyphicon-remove remove" ng-click="grid.appScope.deleteRow(row,$event)"></span>', cellClass: 'grid-cell-style', enableCellEdit: false, enableFiltering: false },
        //Columna [0]
        { field: 'idNominaNovedad', displayName: 'Id Novedad', enableCellEdit: false, width: 100, enableHiding: false, enableFiltering: false },
        //Columna [1]
        { field: 'concepto.descripcion', displayName: 'Concepto', enableCellEdit: false, width: 340, enableHiding: false },
        //Columna [2]
        { field: 'cantidad', displayName: 'Cantidad', type: 'number', cellFilter: 'number: 0', cellClass: 'grid-cell-style-number', enableCellEdit: false, width: 100, enableHiding: false },
        //Columna [3]
        { field: 'valor', displayName: 'Valor', type: 'number', cellFilter: 'number: 0', cellClass: 'grid-cell-style-number', enableCellEdit: false, width: 200, enableHiding: false }
    ];

    $scope.gridChangesPayroll = {
        data: 'novedades',
        enableGridMenu: false,
        enableCellSelection: true,
        enableRowSelection: false,
        enableCellEditOnFocus: true,
        enableColumnResize: true,
        enableFiltering: true,
        columnDefs: $scope.columns
    };

    $scope.deleteNovedad = function(row) {
        var idNominaNovedad = row.idNominaNovedad;
        var index = $scope.novedades.indexOf(row);
        alert(index);
        novedadService.remove({ id: idNominaNovedad }).$promise.then(
            function(response) {
                $scope.novedades.splice(index, 1);

            },
            function() {

            });
    };

    function loadAll() {
        conceptosService.query(function(response) {
            self.conceptos = response;
            //alert(JSON.stringify(response));
        });


    }

    function loadNovedades() {
        var listNovedadContratosArgs = {
            idContract: $scope.empleado.idContract,
            idPayroll: $scope.idNomina
        };
        novedadContratoService.query(listNovedadContratosArgs, function(responseData) {
            $scope.novedades = responseData;
        });
    }

    function querySearch(query) {
        return query ? self.conceptos.filter(createFilterFor(query)) : self.conceptos;
    }

    function createFilterFor(query) {
        var lowercaseQuery = angular.lowercase(query);

        return function filterFn(concepto) {
            return (concepto.value.indexOf(lowercaseQuery) === 0);
        };

    }

    self.cancel = function($event) {
        $mdDialog.cancel();
    };

    self.addNovedad = function($event) {
        var novedadJSON = {
            idNomina: $scope.idNomina,
            idContrato: $scope.empleado.idContract,
            concepto: self.selectedItem,
            cantidad: $scope.novedad.cantidad,
            valor: $scope.novedad.valor,
            idEmpresa: 1
        };
        novedadService.save(novedadJSON).$promise.then(
            function(response) {
                $scope.novedades.push(response);
            },
            function() {

            });
    };
};