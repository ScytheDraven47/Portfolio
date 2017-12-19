/* App definition */
var app = angular.module("regCor", []);
var rawData;
/* Controller */
app.controller("regCorController", ["$scope", function($scope){
	/* Array holding all data [raw, mean, stdDev] from each file */
	$scope.fileData = [];
	
	/* Array holding raw data from an individual file */
	$scope.data = [];
	
	/* Variable that keeps count of files inputted */
	$scope.totalFileNum = 0;
	$scope.number = $scope.totalFileNum;
	$scope.getNumber = function(num){
		return new Array(num);   
	};
	
	/* Function to arrange raw file data (rawData) into a local array (data) */
	$scope.addData = function(data) {
		for( i=0 ; i<data.length ; i++){
			$scope.data.push(parseFloat(data[i]))
		};
	};
	
	$scope.sum = function(num){
		this.num = num;
		for( i=0 ; i<$scope.data.length ; i++){
			this.num += $scope.data[i];
		};
		return this.num;
	};
	
	/* Function that calculates the mean of all data from an array (data) */
	$scope.calcMean = function() {
		var num = 0;
		$scope.mean = $scope.sum(num)/$scope.data.length;
		console.log("Mean is: "+$scope.mean);
		
	};
	
	/* Function that returns the square of any given number */
	$scope.squareFunction = function(numberToSquare){
		numberSquared = Math.pow(numberToSquare,2);
		return numberSquared;
	};
	
	/* Function to calculate the product of any two given numbers */
	$scope.productFunction = function(number1,number2){
		product = (number1 * number2);
		console.log(product);
		return product;
	};

	/* Function that calculates the standard deviation of all data from an array (data) */
	$scope.squaredDifference = [];
	$scope.calcStdDev = function(){
		var num = 0;
		for(var i=0;i<$scope.data.length;i++){
			num = $scope.data[i];
			variance = num - $scope.mean;
			variance = $scope.squareFunction(variance);
			$scope.squaredDifference.push(variance);
		};
		var iteration = 0;
		for(var i=0;i<$scope.squaredDifference.length;i++){
			iteration += parseFloat($scope.squaredDifference[i]);
			// console.log('number ' + i + ': ' + iteration);
		}
		$scope.stdDev = Math.round(Math.sqrt(iteration / $scope.squaredDifference.length));
		console.log("Standard Deviation is: "+$scope.stdDev);
	}; 
	
	/* Function that calculates the square of any number in a given array */
	$scope.numSquare = [];
	$scope.calcSquareNumber = function(){
		for(i=0;i<$scope.data.length;i++){
			thisNumberSquared = $scope.squareFunction($scope.data[i]);
			$scope.numSquare.push(thisNumberSquared);
		};
	};
	
	$scope.calcProductOfXAndY = function(){
		
	};
	
	/* Function that calls other functions to do calculations and print to table.
		Requires addData()*/
	$scope.calculate = function() {
		$scope.calcMean();
		$scope.calcStdDev();
		$scope.calcSquareNumber();
		console.log("All calculations complete.")
	};
	
	/* Function that converts core array into correctly formatted table array (tableFileData) */
	$scope.tableFileData = [];
	$scope.tableRawData = [];
	$scope.tableArrayConversion = function() {
			for(j=0 ; j<$scope.fileData[$scope.totalFileNum].rawData.length ; j++){
				$scope.tableRawData.push($scope.fileData[$scope.totalFileNum].rawData[j]);
				$scope.tableRawData.push($scope.fileData[$scope.totalFileNum].numSquare[j]);
				if($scope.totalFileNum==0){
					$scope.tableFileData.push($scope.tableRawData);
				}else{
					z=$scope.tableFileData[j];
					z.push($scope.tableRawData[0],$scope.tableRawData[1]);
				};
				$scope.tableRawData = [];
			};
	};
	
	/* Function that clears all arrays, except table array (tableFileData) */
	$scope.clearData = function(){
		$scope.data = [];
		$scope.squaredDifference = [];
		$scope.numSquare = [];
		console.log("All data cleared.")
	};
	
	/* Function that sends related file data to core array (fileData).
		Requires calculate(), addDetails() */
	$scope.pushData = function() {
		$scope.fileData.push({
			rawData: $scope.data,
			mean: $scope.mean,
			stdDev: $scope.stdDev,
			numSquare: $scope.numSquare
		});
	};
	
	/* Function that executes all functions, in order */
	$scope.executeAll = function() {
		$scope.addData(rawData);
		$scope.calculate();
		$scope.pushData();
		$scope.tableArrayConversion();
		$scope.clearData();
		$scope.totalFileNum += 1;
		console.log("number of files: "+$scope.totalFileNum);
	};
}]);

/* Functions for loading data from file. 
	Exported to Controller via global variable (rawData) */
var loadedHandler = function(event) {
	"use strict";
	console.log('file has loaded');
	console.log("Numbers from file: \n"+event.target.result);
	var result = event.target.result;
	result = result.split('\n');
	rawData = result;
};
var fileChangedHandler = function(event) {
	var theFile;
	var reader = new FileReader();
	reader.onload = loadedHandler;
	console.log('file has changed');
	// select first element in FileList object
	theFile = event.target.files[0];
	reader.readAsText( theFile );
};