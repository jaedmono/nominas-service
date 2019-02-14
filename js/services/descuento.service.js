nominasApp.factory('descuentoService', function($resource) {
    return $resource('http://localhost:8080/SmartServiceWs/rest/descuento/:id', {}, {
        query: {
            method: 'GET',
            params: { id: '@id', idCompany: '@idCompany' },
            isArray: true
        },
        save: { method: 'POST' },
        update: { method: 'PUT' },
        remove: { method: 'DELETE', params: { id: '@id' } }
    });
});