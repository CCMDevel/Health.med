console.log('module_doctor');

angular.module('module_doctor', [
    'ui.router'
    , 'ui.bootstrap'
    , 'module_config'
    , 'module_basic_filters'
    , 'http_doctor'
    , 'http_patient'
])
.config(function($stateProvider, $urlRouterProvider){
    $stateProvider
        .state('my_patients', {
            url : "/patients",
            templateUrl : "../views/doctor/my_patients/main.html"
        })
        .state('my_patients.list', {
            url : '/list',
            templateUrl : "../views/doctor/my_patients/list.html"
        })
        .state("my_patients.pending", {
            url : '/pending',
            templateUrl : '../views/doctor/my_patients/pending.html'
        })
        .state('my_patients.add', {
            url : '/add',
            templateUrl : "../views/doctor/my_patients/add.html" 
        })
        .state('patient', {
            url : '/patient/:patient_id',
            templateUrl : '../views/doctor/patient/tabs.html',
            controller : "ctrlr_patient_tabs"
        })
        .state('patient.information', {
            url : '/patient/info',
            templateUrl : "../views/doctor/patient/info.html",
            // controller : 'ctrlr_patient_tabs'
        })
        .state('patient.test_results', {
            url : '/patient/test_results',
            templateUrl : "../views/patient/test_results.html",
            controller : 'ctrlr_test_results'
        });

});
