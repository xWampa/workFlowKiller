'use strict';

angular.module('wfp')
    .controller('runs', function($scope, $http) {
        
        $scope.processes = [];

        // Al entrar pedir los procesos de este usuario
        $http.get('/runs').then(function(response) {
            // Y meterlas en el $scope
            $scope.processes = response.data;
            
        });

        
        $scope.formSubmit = function() {
            console.log($scope.processes);
            //$scope.processes.row.id
            //var data = { userID: , state: "2" };
            //console.log(data)
            //$http.post("/runs", data)
        };

    });