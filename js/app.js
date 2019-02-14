'use strict';

/* App Module */
var nominasApp = angular.module('nominasApp', ['ngRoute', 'ngResource', 'ngCookies', 'ngTouch', 'ngMaterial', 'nominaController', 'ui.grid', 'ui.grid.edit', 'ui.grid.cellNav', 'ui.grid.saveState', 'ui.grid.selection', 'ui.grid.resizeColumns', 'ui.grid.moveColumns', 'ui.grid.pinning', 'ui.bootstrap', 'ui.grid.autoResize']);

nominasApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
        when('/', {
            templateUrl: 'pages/home.html',
            controller: 'HomeCtrl'
        }).
        when('/liquidacionnomina', {
            templateUrl: 'pages/liquidacionNomina.html',
            controller: 'liquidaNominaContoller as ctrl'
        }).
        when('/empleados', {
            templateUrl: 'pages/empleados.html',
            controller: 'EmpleadosCtrl'
        }).
        when('/empresas', {
            templateUrl: 'pages/empresa.html',
            controller: 'EmpresaCtrl'
        }).
        when('/conceptos', {
            templateUrl: 'pages/conceptos.html',
            controller: 'ConceptosCtrl'
        }).
        when('/contratos', {
            templateUrl: 'pages/contratos.html',
            controller: 'ContratosCtrl as ctrl'
        }).
        when('/entidades', {
            templateUrl: 'pages/entidades.html',
            controller: 'EntidadesCtrl'
        }).
        when('/bancos', {
            templateUrl: 'pages/bancos.html',
            controller: 'BancosCtrl'
        }).
        when('/centrocostos', {
            templateUrl: 'pages/centroCostos.html',
            controller: 'CentroCostosCtrl as ctrl'
        }).
        when('/subcentrocostos', {
            templateUrl: 'pages/subCentroCostos.html',
            controller: 'SubCentroCosotosCtrl'
        }).
        when('/nomina', {
            templateUrl: 'pages/nomina.html',
            controller: 'NominaCtrl'
        }).
        when('/usuarios', {
            templateUrl: 'pages/usuarios.html',
            controller: 'UsuariosCtrl'
        }).
        when('/prestamos', {
            templateUrl: 'pages/prestamos.html',
            controller: 'PrestamosCtrl as ctrl'
        }).
        when('/novedadesprogramadas', {
            templateUrl: 'pages/novedadesProgramadas.html',
            controller: 'NovedadesProgramadasCtrl as ctrl'
        }).
        when('/ausentismos', {
            templateUrl: 'pages/ausentismos.html',
            controller: 'AusentismosCtrl as ctrl'
        }).
        when('/archivosnovedades', {
            templateUrl: 'pages/archivosProcesados.html',
            controller: 'ArchivosProcesadosCtrl'
        }).
        when('/periodos', {
            templateUrl: 'pages/periodos.html',
            controller: 'PeriodosCtrl'
        }).
        when('/login', {
            templateUrl: 'pages/login.html',
            controller: 'LoginCtrl',
            controllerAs: 'vm'
        }).
        when('/register', {
            templateUrl: 'pages/register.html',
            controller: 'RegisterCtrl',
            controllerAs: 'vm'
        }).
        otherwise({
            redirectTo: '/login'
        });
    }
]);

nominasApp.run(['$rootScope', '$location', '$cookies', '$http',
    function($rootScope, $location, $cookies, $http) {
        // keep user logged in after page refresh
        $rootScope.globals = $cookies.getObject('globals') || {};
        if ($rootScope.globals.currentUser) {
            $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata;
        }

        $rootScope.$on('$locationChangeStart', function(event, next, current) {
            // redirect to login page if not logged in and trying to access a restricted page
            var restrictedPage = $.inArray($location.path(), ['/login', '/register']) === -1;
            var loggedIn = $rootScope.globals.currentUser;
            if (restrictedPage && !loggedIn) {
                $location.path('/login');
            }
        });
    }
]);

nominasApp.factory('personService', function($resource) {
    return $resource('http://localhost:8080/SmartServiceWs/rest/empleado/:id', {}, {
        query: {
            method: 'GET',
            params: {},
            isArray: true
        },
        save: { method: 'POST' },
        update: { method: 'PUT' },
        remove: { method: 'DELETE', params: { id: '@id' } }
    });
});

nominasApp.factory('entidadesService', function($resource) {
    return $resource('http://localhost:8080/SmartServiceWs/rest/entidad/:id', {}, {
        query: {
            method: 'GET',
            params: {},
            isArray: true
        },
        save: { method: 'POST' },
        update: { method: 'PUT' },
        remove: { method: 'DELETE', params: { id: '@id' } }
    });
});


nominasApp.factory('bancosService', function($resource) {
    return $resource('http://localhost:8080/SmartServiceWs/rest/banco/:id', {}, {
        query: {
            method: 'GET',
            params: {},
            isArray: true
        },
        save: { method: 'POST' },
        update: { method: 'PUT' },
        remove: { method: 'DELETE', params: { id: '@id' } }
    });
});

nominasApp.factory('centroCostosService', function($resource) {
    return $resource('http://localhost:8080/SmartServiceWs/rest/centroCostos/:id', {}, {
        query: {
            method: 'GET',
            params: { id: '@id' },
            isArray: true
        },
        save: { method: 'POST' },
        update: { method: 'PUT' },
        remove: { method: 'DELETE', params: { id: '@id' } }
    });
});

nominasApp.factory('nominaService', function($resource) {
    return $resource('http://localhost:8080/SmartServiceWs/rest/nomina/:idNomina', {}, {
        query: {
            method: 'GET',
            params: { idNomina: '@id', idEmpresa: '@idEmpresa' },
            isArray: true
        },
        search: {
            method: 'GET',
            params: { idNomina: '@id' },
            isArray: false
        },
        save: { method: 'POST' },
        update: { method: 'PUT' },
        remove: { method: 'DELETE', params: { idNomina: '@id' } }
    });
});

nominasApp.factory('empresaService', function($resource) {
    return $resource('http://localhost:8080/SmartServiceWs/rest/empresa/:idUsuario', {}, {
        query: {
            method: 'GET',
            params: { id: '@idUsuario' },
            isArray: true
        },
        save: { method: 'POST' },
        update: { method: 'PUT' },
        remove: { method: 'DELETE', params: { id: '@idUsuario' } }
    });
});

nominasApp.factory('usuariosService', function($resource) {
    return $resource('http://localhost:8080/SmartServiceWs/rest/usuario/:id', {}, {
        query: {
            method: 'GET',
            params: { id: '@id' },
            isArray: true
        },
        save: { method: 'POST' },
        update: { method: 'PUT' },
        remove: { method: 'DELETE', params: { id: '@id' } }
    });
});

nominasApp.factory('ausentismosService', function($resource) {
    return $resource('http://localhost:8080/SmartServiceWs/rest/ausentismos/:id', {}, {
        query: {
            method: 'GET',
            params: { id: '@id' },
            isArray: true
        },
        save: { method: 'POST' },
        update: { method: 'PUT' },
        remove: { method: 'DELETE', params: { id: '@id' } }
    });
});

nominasApp.factory('novedadesProgramadasService', function($resource) {
    return $resource('http://localhost:8080/SmartServiceWs/rest/novedades/:id', {}, {
        query: {
            method: 'GET',
            params: { id: '@id' },
            isArray: true
        },
        save: { method: 'POST' },
        update: { method: 'PUT' },
        remove: { method: 'DELETE', params: { id: '@id' } }
    });
});

nominasApp.factory('nominaContratosService', function($resource) {
    return $resource('http://localhost:8080/SmartServiceWs/rest/nominacontrato/:id', {}, {
        query: {
            method: 'GET',
            params: { id: '@id' },
            isArray: true
        },
        save: { method: 'POST' },
        update: { method: 'PUT' },
        remove: { method: 'DELETE', params: { id: '@id' } }
    });
});


nominasApp.factory('novedadService', function($resource) {
    return $resource('http://localhost:8080/SmartServiceWs/rest/novedad/:id', {}, {
        query: {
            method: 'GET',
            params: { id: '@id' },
            isArray: true
        },
        save: { method: 'POST' },
        update: { method: 'PUT' },
        remove: { method: 'DELETE', params: { id: '@id' } }
    });
});

nominasApp.factory('archivoNovedadService', function($resource) {
    return $resource('http://localhost:8080/SmartServiceWs/rest/archivonovedad/:id', {}, {
        query: {
            method: 'GET',
            params: { id: '@id' },
            isArray: true
        },
        save: { method: 'POST' },
        update: { method: 'PUT' },
        remove: { method: 'DELETE', params: { id: '@id' } }
    });
});


nominasApp.directive('fileModel', ['$parse', function($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function() {
                scope.$apply(function() {
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);

nominasApp.service('fileUploadService', ['$http', function($http) {
    this.uploadFileToUrl = function(file, idEmpresa) {
        var fd = new FormData();
        var uploadUrl = "http://localhost:8080/SmartServiceWs/rest/uploadfile/";
        fd.append('file', file);
        $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: { 'Content-Type': undefined, 'empresa_id': idEmpresa }
        })

        .success(function() {

        })

        .error(function() {
            alert("Error cargando el archivo");
        });
    }
}]);

nominasApp.factory('novedadValidadaService', function($resource) {
    return $resource('http://localhost:8080/SmartServiceWs/rest/novedadValidada/:id/:type/:company', {}, {
        query: {
            method: 'GET',
            params: { id: '@id', type: '@type' },
            isArray: true
        },
        save: { method: 'POST' },
        update: { method: 'PUT', params: { id: '@id', type: '@type', company: '@company' } },
        remove: { method: 'DELETE', params: { id: '@id' } }
    });
});

nominasApp.factory('periodosService', function($resource) {
    return $resource('http://localhost:8080/SmartServiceWs/rest/periodos/:type/:year/:company', {}, {
        query: {
            method: 'GET',
            params: { type: '@type', year: '@year', company: '@company' },
            isArray: true
        },
        save: { method: 'POST' },
        update: { method: 'PUT', params: { type: '@type', year: '@year', company: '@company' }, isArray: true },
        remove: { method: 'DELETE', params: { type: '@type', year: '@year', company: '@company' } }
    });
});

nominasApp.factory('novedadContratoService', function($resource) {
    return $resource('http://localhost:8080/SmartServiceWs/rest/empleadoNovedad/:idContract/:idPayroll', {}, {
        query: {
            method: 'GET',
            params: { idContrato: '@idContract', idNomina: '@idPayroll' },
            isArray: true
        },
        save: { method: 'POST' },
        update: { method: 'PUT', params: { idContrato: '@idContract', idNomina: '@idPayroll' }, isArray: true },
        remove: { method: 'DELETE', params: { idContrato: '@idContract', idNomina: '@idPayroll' } }
    });
});

nominasApp.factory('userService', function($resource) {
    return $resource('http://localhost:8080/SmartServiceWs/rest/users/:login/:password', {}, {
        query: {
            method: 'GET',
            params: { login: '@login', password: '@password' },
            isArray: false
        },
        save: { method: 'POST' },
        update: { method: 'PUT' },
        remove: { method: 'DELETE', params: { idUser: '@idUser' } }
    });
});