'use strict';

angular.module('wfp')
    .controller('runs', function($scope, $http) {
        
        $scope.processes = [];

        // Al entrar pedir las tareas de este usuario
        $http.get('/runs').then(function(response) {
            // Y meterlas en el $scope
            $scope.processes = response.data;
        });

        $scope.username1 = '';
        $scope.password = '';
        $scope.workflow = '';

        $scope.formSubmit = function(aidi){
            
            var data = {workflow: $scope.workflow};
            console.log($scope.username1);
            console.log($scope.password);
            console.log($scope.workflow);
            console.log("hola");
            //$http.post("/runs", data);
        };

        $scope.setWorkflow = function (id) {
            $scope.workflow = id;
            console.log($scope.workflow);
            //console.log(e.target);
            var data = {workflow: id};
            $http.post("/runs", data);
        };
        
    });