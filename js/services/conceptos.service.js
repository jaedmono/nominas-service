nominasApp.factory('conceptosService', function($resource) {
    return $resource('http://localhost:8080/SmartServiceWs/rest/concepto/:id', {}, {
        query: {
            method: 'GET',
            params: { id: '@id', relacionadoCon: '@relacionadoCon' },
            isArray: true
        },
        save: { method: 'POST' },
        update: { method: 'PUT' },
        remove: { method: 'DELETE', params: { id: '@id' } }
    });
});