nominasApp.factory('contratosService', function($resource) {
    return $resource('http://localhost:8080/SmartServiceWs/rest/contrato/:idEmpresa/:estado', {}, {
        query: {
            method: 'GET',
            params: { idEmpresa: '@idEmpresa', estado: '@estado' },
            isArray: true
        },
        save: { method: 'POST' },
        update: { method: 'PUT' },
        remove: { method: 'DELETE', params: { idEmpresa: '@idEmpresa' } }
    });
});