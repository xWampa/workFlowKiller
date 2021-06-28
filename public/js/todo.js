'use strict';

angular.module('wfp')
    .controller('todo', function($scope, $http) {

        $scope.ok = '';
        $scope.tasks = [];

        // Al entrar pedir las tareas de este usuario
        $http.get('/todo').then(function(response) {
            // Y meterlas en el $scope
            $scope.tasks = response.data;
        });


        $scope.terminarTarea = function(id, notas, horas) {

            console.log(id);
            console.log(notas);
            console.log(horas);

            var data = {
                usertaskID: id,
                notes: notas,
                horas: horas
            };

            $http.post("/tasks", data);
        }



    });