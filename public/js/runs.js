'use strict';

angular.module('wfp')
    .controller('runs', function($scope, $http,UserData) {
        
        $scope.formSubmit = function() {
            console.log(scope.processes);
            

        
        };
        
        $scope.processes = [];

        // Al entrar pedir los procesos de este usuario
        $http.get('/runs').then(function(response) {
            // Y meterlas en el $scope
            $scope.processes = response.data;
            
        });

        $scope.setWorkflow = function (id) {
            $scope.workflow = id;
            console.log($scope.workflow);
            //console.log(e.target);
            var data = {workflow: id};
            $http.post("/runs", data);
        };
        
    });