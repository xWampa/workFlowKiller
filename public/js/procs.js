'use strict';

angular.module('wfp')
    .controller('procs', function($scope, $http) {
        
        $scope.processes = [];

        // Al entrar pedir los procesos de este usuario
        $http.get('/procs').then(function(response) {
            // Y meterlas en el $scope
            $scope.processes = response.data;
        });
        
        
    });