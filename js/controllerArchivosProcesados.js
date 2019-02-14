nominaController.controller('ArchivosProcesadosCtrl', ['$scope','$http','$rootScope', '$location', 'archivoNovedadService', 'novedadValidadaService', 'uiGridConstants','$mdDialog','$mdMedia','$modal','$mdToast',
    function($scope,$http, $rootScope, $location, archivoNovedadService, novedadValidadaService, uiGridConstants,$mdDialog, $mdMedia,$modal, $mdToast) {

            $scope.archivosNovedades = [];

            archivoNovedadService.query( function (data) {
                  for(var index = data.length-1; index >= 0; index-- ){
                    var archivosNovedadesJSON = {
                        idArchivoNovedad: data[index].idArchivoNovedad,
                        nombreArchivo: data[index].nombreArchivo,
                        estado: data[index].estado,
                        fechaCarga: new Date(data[index].fechaCarga).toLocaleDateString(),
                        fechaProceso: data[index].fechaProceso != null ? new Date(data[index].fechaProceso).toLocaleDateString():'' ,
                        empresa: data[index].empresa,
                        isProcessed: data[index].estado == 'PROCESADO' ? true : false,
                        isValidated: data[index].estado == 'VALIDADO' ? true : false,
                        isUploading: data[index].estado == 'CARGADO' ? true : false,
                        isWrong: data[index].estado == 'ERROR' ? true : false
                    }

                    $scope.archivosNovedades.push(archivosNovedadesJSON);
                  }

            });

            $scope.novedades = {currentPage: 1};

            $scope.columns = [
                             //Columna [0]
                             {field: 'idNovedadValidada', displayName: 'Id',  enableCellEdit: false, width: 80, enableHiding: false, enableFiltering: false},
                             //Columna [1]
                             {field:'documento', displayName:'Identificación',  enableCellEdit: true, width: 150, enableHiding: false, enableFiltering: false},
                             //Columna [2]
                             {field:'concepto.idConcepto', displayName:'Id Concepto',  enableCellEdit: true, width: 150, enableHiding: false, enableFiltering: false},
                             //Columna [3]
                             {field:'cantidad', displayName:'Cantidad', enableCellEdit: true, width: 100, enableFiltering: false, enableHiding: false},
                             //Columna [4]
                             {field:'valor', displayName:'Valor', enableCellEdit: true, width: 100, enableFiltering: false, enableHiding: false},
                             //Columna [4]
                             {field:'centroCostos', displayName:'Id Centro Costos', enableCellEdit: true, width: 150, enableFiltering: false, enableHiding: false},
                             //Columna [5]
                             {field:'subCentroCostos', displayName:'Id Sub Centro Costos', enableCellEdit: true, width: 150, enableFiltering: false, enableHiding: false},
                             //Columna [6]
                             {field:'estado', displayName:'Estado', enableCellEdit: false, width: 100, enableFiltering: false, enableHiding: false},
                             //Columna [7]
                             {field:'observacion', displayName:'Observación', enableCellEdit: false,  width: 550, enableFiltering: false, enableHiding: false}
                             ];

            $scope.gridNovedades = {
                data:'novedades',
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


            $scope.verify = function(item){
                $('#modalNovedadesCargadas').modal('show') ;
                $scope.archivo = item;
                var listFileArgs = {
                                    id: item.idArchivoNovedad,
                                    type: 'IDARCHIVO'
                                };
                novedadValidadaService.query( listFileArgs, function(data){
                                    $scope.novedades = data;
                                });

            };

            $scope.cargarValidos = function(event){
                var listFileArgs = {
                                    id: $scope.archivo.idArchivoNovedad,
                                    type: 'LOAD',
                                    company: 1
                                };
                                alert("Cargar Validos: "+ event.idArchivoNovedad);
                novedadValidadaService.update( listFileArgs, function(){

                });
            };

            $scope.generarPlano = function(event){
                var listFileArgs = {
                                    id: item.idArchivoNovedad,
                                    type: 'PLANE',
                                    empresa: 1
                                };
                novedadValidadaService.update( listFileArgs, function(){

                });
            };

            $scope.backToNomina = function(){
                $location.path('/nomina');
            };
    }]);