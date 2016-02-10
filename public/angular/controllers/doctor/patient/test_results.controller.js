angular.module('module_doctor').controller('ctrlr_test_results'
, function($scope, $state, $stateParams, $uibModal, httpPatient){
	
	$scope.model = {};
    $scope.model.patient = {};
    $scope.model.test_result = {};

    $scope.view = {};
    $scope.view.isDoctor = true;
    $scope.view.showNewTestResult = false;

    // chart models
    $scope.model.data = [[],[],[],[],[]];
    $scope.labels = [];
    $scope.series = ['Red Blood Cell Count', 'Hemoglobin', 'Hemotocrit', 'White Blood Cell Count', 'Platelet'];
    
    var patient_id = $stateParams.patient_id;

    // start: should be the same as patient/test_results.controller.js
    var setupTestResults = function(test_results){
        $scope.model.patient.test_results = test_results;
        for(var i = 0; i < $scope.model.patient.test_results.length; i++){
            $scope.labels[i] = $scope.model.patient.test_results[i].date;
            $scope.model.data[0][i] = $scope.model.patient.test_results[i].red_blood_cell_count;
            $scope.model.data[1][i] = $scope.model.patient.test_results[i].hemoglobin;
            $scope.model.data[2][i] = $scope.model.patient.test_results[i].hemotocrit;
            $scope.model.data[3][i] = $scope.model.patient.test_results[i].white_blood_cell_count;
            $scope.model.data[4][i] = $scope.model.patient.test_results[i].platelet_count;
        };
    };

    $scope.colours = [{ // red blood cell
        fillColor: 'rgba(0,0,0,0)',
        strokeColor: 'rgba(255,0,0,1)',
        pointColor: 'rgba(255,0,0,1)',
        pointStrokeColor: 'rgba(255, 127, 127, 1)',
        pointHighlightFill: 'rgba(255, 127, 127, 1)',
        pointHighlightStroke: 'rgba(255, 237, 127, 1)'
    }, { // hemoglobin
        fillColor: 'rgba(77,83,96,0.2)',
        strokeColor: 'rgba(77,83,96,1)',
        pointColor: 'rgba(77,83,96,1)',
        pointStrokeColor: '#fff',
        pointHighlightFill: '#fff',
        pointHighlightStroke: 'rgba(77,83,96,1)'
    }];
    // end: same

	var getTestResults = function(){
        console.log("getTestResults( " + patient_id + " )");
        httpPatient.test_results.get(patient_id).success(function(test_results){
            console.log('httpPatient.test_results.get -> success');
            console.log(JSON.stringify(test_results));
            setupTestResults(test_results);
        }).error(function(err){
            console.log("httpPatient.test_results.get -> error");
            console.log(JSON.stringify(err));
        });
    };

    // same as in patient/test_results.controller.js
    $scope.view.getChartClass = function(){
        return "col-sm-8";
    }

    $scope.view.toggleNewTestResult = function(){
        $scope.view.showNewTestResult = !$scope.view.showNewTestResult;
    }

    $scope.addTestResult = function(test_result){
        httpPatient.test_results.post(patient_id, test_result).success(function(res){
            console.log('httpPatient.test_result.post -> success');
            getTestResults();
        }).error(function(err){
            console.log('httpPatient.test_result.post -> success');
            
        });
    };

    getTestResults();
});