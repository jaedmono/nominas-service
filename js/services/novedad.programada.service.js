nominasApp.factory('novedadProgramadaService', function($resource) {
    return $resource('http://localhost:8080/SmartServiceWs/rest/novedadprogramada/:id', {}, {
        query: {
            method: 'GET',
            params: { id: '@id', idCompany: '@idCompany', estado: '@estado' },
            isArray: true
        },
        save: { method: 'POST' },
        update: { method: 'PUT' },
        remove: { method: 'DELETE', params: { id: '@id' } }
    });
});