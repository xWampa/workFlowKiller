'use strict';

angular.module('wfp')
    .controller('procs', function($scope, $http) {
        
        $scope.processes = [];

        // Al entrar pedir las tareas de este usuario
        $http.get('/procs').then(function(response) {
            // Y meterlas en el $scope
            $scope.processes = response.data;
        });
        
        
    });