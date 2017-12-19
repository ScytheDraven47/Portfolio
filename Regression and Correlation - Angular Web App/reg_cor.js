/* App definition */
var app = angular.module("regCor", []);
var rawData;
/* Controller */
app.controller("regCorController", ["$scope", function($scope){
	/* Array holding all data [data, mean, stdDev, sqData] from each individual file */
	$scope.fileData = [];
	
	/* Array holding each line of data from all files for table */
	$scope.tableFileData = [];
	
	/* Array holding results from Regression and Correlation calculation */
	$scope.regCorResults = [];
	
	/* Array holding the products from each line of two files */
	$scope.products = [];
	
	/* Array holding all sum information */
	$scope.sums = [];
	
	/* Temporary array holding raw data from an individual file */
	$scope.data = [];
	
	/* Temporary array holding squared numbers from an array */
	$scope.sqData = [];
	
	/* Variable that keeps count of files used */
	$scope.totalFileNum = 0;
	$scope.number = $scope.totalFileNum;
	$scope.getNumber = function(num){
		return new Array(num);   
	};
	
	/* Function to push a global array's data (rawData) into a local array ($scope.data) */
	$scope.addData = function(data){
		for(var i=0 ; i<data.length ; i++){
			$scope.data.push(parseFloat(data[i]))
		};
		var num = 0;
		$scope.sums.push($scope.calcSum($scope.data,num));
	};
	
	/* Function to calculate the sum of an array */
	$scope.calcSum = function(array){
		var num = 0;
		for(var i=0 ; i<array.length ; i++){
			num += array[i];
		};
		return num;
	};
	
	/* Function to calculate the mean of all data from an array */
	$scope.calcMean = function(array){
		var num = 0;
		var mean = $scope.calcSum(array,num)/array.length;
		return mean;
	};
	
	/* Function to calculate the square a number */
	$scope.calcSquare = function(num){
		var sqNum = Math.pow(num,2);
		return sqNum;
	};
	
	/* Function to calculate the product of two numbers */
	$scope.calcProduct = function(num1,num2){
		var product = num1*num2;
		return product;
	};
	
	/* Function to calculate the standard deviation of all data from an array */
	$scope.calcStdDev = function(array,mean){
		var sqDif = [];
		var num = 0;
		for(var i=0 ; i<array.length ; i++){
			num = array[i];
			variance = num - mean;
			variance = $scope.calcSquare(variance);
			sqDif.push(variance);
		};
		var iteration = 0;
		for(var i=0 ; i<sqDif.length ; i++){
			iteration += parseFloat(sqDif[i]);
		};
		var stdDev = Math.round(Math.sqrt(iteration/sqDif.length));
		return stdDev;
	};
	
	/* Function to square all data in an array */
	$scope.arraySquare = function(arrayIn,arrayOut){
		for(var i=0 ; i<arrayIn.length ; i++){
			thisNumSq = $scope.calcSquare(arrayIn[i]);
			arrayOut.push(thisNumSq);
		};
	};
	
	/* Function to calculate the product of numbers in two arrays */
	$scope.arrayProduct = function(length,array1,array2,arrayOut){
		for(var i=0 ; i<length ; i++){
			numX = array1[i];
			numY = array2[i];
			product = $scope.calcProduct(numX,numY);
			arrayOut.push(product);
		};
	};
	
	/* Function to take all data in an array and subtract the mean from it */
	$scope.arraySubMean = function(arrayIn,arrayOut){
		for(var i=0 ; i<arrayIn.length ; i++){
			newData = arrayIn[i]-$scope.calcMean(arrayIn);
			arrayOut.push(newData);
		};
	};
	
	/* Function to calculate regression and correlation !!BEN'S WAY (wikipedia) */
	$scope.calcRegCor = function(arrayX,arrayY,Xk){
		var n = arrayX.length;
		var arrayXm = [];
		var arrayYm = [];
		var arrayXmYm = [];
		var arrayXmsq = [];
		var arrayYmsq = [];
		$scope.arraySubMean(arrayX,arrayXm);
		$scope.arraySubMean(arrayY,arrayYm);
		$scope.arrayProduct(n,arrayXm,arrayYm,arrayXmYm);
		$scope.arraySquare(arrayXm,arrayXmsq);
		$scope.arraySquare(arrayYm,arrayYmsq);
		var topHalf = $scope.calcSum(arrayXmYm);
		var btmHalf = $scope.calcSum(arrayXmsq);
		// Beta 1
		var beta1 = topHalf/btmHalf;
		// Beta 0
		var beta0 = $scope.calcMean(arrayY)-(beta1*$scope.calcMean(arrayX));
		// Rxy (topHalf stays same)
		btmHalf = Math.sqrt($scope.calcSum(arrayXmsq)*$scope.calcSum(arrayYmsq))
		var Rxy = topHalf/btmHalf;
		var Rsq = $scope.calcSquare(Rxy);
		// Yk
		console.log(Xk);
		var Yk = beta0 + (beta1*parseFloat(Xk));
		// Results
		console.log("Beta 1: "+beta1);
		console.log("Beta 0: "+beta0);
		console.log("Rxy: "+Rxy);
		console.log("R^2: "+Rsq);
		console.log("Yk: "+Yk);
		$scope.regCorResults.push({
			Xk: Xk,
			beta1: beta1,
			beta0: beta0,
			Rxy: Rxy,
			Rsq: Rsq,
			Yk: Yk
		});
	};
	
	/* Function to calculate regression !!JOEY'S WAY (from assignment?)
	$scope.calcRegTwo = function(arrayX,arrayY){
		// Beta 1
		var n = arrayX.length;
		var arrayXY = [];
		var arrayXsq = [];
		$scope.arrayProduct(n,arrayX,arrayY,arrayXY);
		$scope.arraySquare(arrayX,arrayXsq);
		var topLeft = n*$scope.calcSum(arrayXY);
		var topRight = $scope.calcSum(arrayX)*$scope.calcSum(arrayY);
		var btmLeft = n*$scope.calcSum(arrayXsq);
		var btmRight = $scope.calcSquare($scope.calcSum(arrayX));
		var beta1 = (topLeft-topRight)/(btmLeft-btmRight);
		// Beta 0
		var beta0 = ($scope.calcSum(arrayY)-(beta1*$scope.calcSum(arrayX)))/n;
	}; */
	
	/* Function to add calculated numbers to array */
	$scope.pushData = function(array){
		var mean = $scope.calcMean($scope.data);
		array.push({
			rawData: $scope.data,
			mean: mean,
			stdDev: $scope.calcStdDev($scope.data,mean),
			sqData: $scope.sqData,
			products: $scope.products
		});
	};
	
	/* Function that converts core array into correctly formatted table array */
	$scope.tableArrayConversion = function(arrayIn,arrayOut,fileNum) {
		var tableRawData = [];
		for(j=0 ; j<arrayIn[fileNum].rawData.length ; j++){
			tableRawData.push(arrayIn[fileNum].rawData[j]);
			tableRawData.push(arrayIn[fileNum].sqData[j]);
			if(fileNum>=1){
				tableRawData.push(arrayIn[fileNum].products[j]);
			};
			if(fileNum==0){
				arrayOut.push(tableRawData);
			}else{
				arrayOut[j].push(tableRawData[0],tableRawData[1],tableRawData[2]);
			};
			tableRawData = [];
		};
	};
	
	/* Function for button click */
	$scope.executeAll = function(){
		$scope.altTotalFileNum = $scope.totalFileNum + 1;
		$scope.addData(rawData);
		$scope.arraySquare($scope.data,$scope.sqData);
		$scope.sums.push($scope.calcSum($scope.sqData));
		$scope.pushData($scope.fileData);
		if($scope.altTotalFileNum >= 2){
			$scope.arrayProduct($scope.tableFileData.length,$scope.fileData[0].rawData,$scope.fileData[1].rawData,$scope.products);
			$scope.sums.push($scope.calcSum($scope.products));
			$scope.calcRegCor($scope.fileData[0].rawData,$scope.fileData[1].rawData,document.getElementById("Xk").value)
		};
		$scope.tableArrayConversion($scope.fileData,$scope.tableFileData,$scope.totalFileNum);
		//Reset temp arrays
		$scope.data = [];
		$scope.sqData = [];
		$scope.totalFileNum += 1;
		
	};
}]);

/* Functions for loading data from file. 
	Exported to Controller via global variable (rawData) */
var loadedHandler = function(event) {
	"use strict";
	console.log('file has loaded');
	//console.log("Numbers from file: \n"+event.target.result);
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