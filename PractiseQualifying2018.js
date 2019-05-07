// score factors
var distanceFactor = 1;
var timeWasteFactor = 1;
var bonusFactor = 1;

var init;
var initRows;
var initColumns;
var initVehicles;
var initRides;
var initBonus;
var initSteps;
var totalRides = {};
var totalCabs = {};
var totalStepsLeft;
var totalStepsDone = 0;
var outputString;
var finalScore = 0;
var rideDone = 0;

var allAns = [];
var openFile = function (event) {
    var input = event.target;
    var reader = new FileReader();
    reader.onload = function () {
        var text = reader.result;
        init = text;
        init = init.split('\n');
        mediator();
    };
    reader.readAsText(input.files[0]);
};
function mediator() {
    for (var i = 0; i <= 10; i++) {
        for (var j = 0; j <= 10 - i; j++) {
            var k = 10 - i - j;

            distanceFactor = i / 10;
            timeWasteFactor = j / 10;
            bonusFactor = k / 10;

            parseInput();
            
        }
    }
}
function parseInput() {

    var temp = init[0].split(" ");

    // CODE START HERE   !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

    initRows = parseInt(temp[0]);
    initColumns = parseInt(temp[1]);
    initVehicles = parseInt(temp[2]);
    initRides = parseInt(temp[3]);
    initBonus = parseInt(temp[4]);
    initSteps = parseInt(temp[5]);
    totalStepsLeft = initSteps;
    totalRides = {};
    for (var i = 0; i < initRides; i++) {
        var temp2 = init[i + 1].split(" ");
        var obj = {
            "startRow": parseInt(temp2[0]),
            "startColumn": parseInt(temp2[1]),
            "endRow": parseInt(temp2[2]),
            "endColumn": parseInt(temp2[3]),
            "start": parseInt(temp2[4]),
            "finish": parseInt(temp2[5])
        };
        totalRides[i] = obj;
    }
    totalCabs = {};
    for (var i = 0; i < initVehicles; i++) {
        var obj = {
            "history": [],
            "row": 0,
            "column": 0,
            "timeLeft": 0,
            "id": i
        };
        totalCabs[i] = obj;
    }

		totalStepsDone = 0;
    finalScore = 0;
		rideDone = 0;
    // var avgDst = avgDistance();
    // console.log("max vanila score: " + avgDst * initRides);
    // console.log("max score with bonus : " + (avgDst * initRides + initBonus * initRides));
    main();

}

function main() {
    /* var avgDst = avgDistance();
        console.log("max vanila score: " +avgDst*initRides);
        console.log("max score with bonus : "+ (avgDst*initRides + initBonus * initRides));
        distanceFactor = avgDst / (avgDst + initBonus + (avgDst / initBonus));
        bonusFactor = initBonus/ (avgDst + initBonus + (avgDst / initBonus));
        timeWasteFactor = (avgDst / initBonus) / (avgDst + initBonus + (avgDst / initBonus)); */
    while (totalStepsDone < initSteps && Object.keys(totalRides).length > 0) {
        /* if(totalStepsDone % 2 == 0)
                  console.log(totalStepsDone); */
        //maxScoreObject = {cabId : {rideId, rideTime}};
        //console.log(totalStepsDone);
        var maxScoreObject = findMaxScore();
        for (var cabId in maxScoreObject) {
            //if (maxScoreObject[cabId].rideId != -1) {
            totalCabs[cabId].history.push(maxScoreObject[cabId].rideId);
            totalCabs[cabId].timeLeft = maxScoreObject[cabId].rideTime;
            totalCabs[cabId].row = maxScoreObject[cabId].endRow;
            totalCabs[cabId].column = maxScoreObject[cabId].endColumn;
            //delete totalRides[maxScoreObject[cabId].rideId];
            //}
        }

        // to find minTime until one of the cab is done droping passenger
        var minTimeLeft;
        var firstLoop = true;
        for (var cabId in totalCabs) {
            if (totalCabs[cabId].timeLeft > 0) {

                if (firstLoop) {
                    minTimeLeft = totalCabs[cabId].timeLeft;
                    firstLoop = false;
                } else {
                    if (totalCabs[cabId].timeLeft < minTimeLeft)
                        minTimeLeft = totalCabs[cabId].timeLeft;
                }
            }
        }
        //if(minTimeLeft <= 0) minTimeLeft++;
        // remove minTimeLeft from all the cab's timeLeft
        for (var cabId in totalCabs) {
            if (totalCabs[cabId].timeLeft > 0)
                totalCabs[cabId].timeLeft -= minTimeLeft;
        }

        totalStepsLeft -= minTimeLeft;
        totalStepsDone += minTimeLeft;
    }

    //createOutput();
    //download(outputString, 'output.txt', 'text/plain');
    console.log("" + distanceFactor + " " + timeWasteFactor + " " + bonusFactor);
    console.log("final score: " + finalScore);
    console.log("total rides given: " + rideDone);
    allAns.push(finalScore);
}

function rideTime(cabId, rideId) {
    var AtoB = Math.abs(totalCabs[cabId].row - totalRides[rideId].startRow) + Math.abs(totalCabs[cabId].column - totalRides[rideId].startColumn);
    var BtoC = Math.abs(totalRides[rideId].endRow - totalRides[rideId].startRow) + Math.abs(totalRides[rideId].endColumn - totalRides[rideId].startColumn);
    var timeCabWillReachLocation = totalStepsDone + AtoB;
    var timeToWait = (totalRides[rideId].start - timeCabWillReachLocation) > 0 ? (totalRides[rideId].start - timeCabWillReachLocation) : 0;
    return AtoB + BtoC + timeToWait;
}

function findScore(cabId, rideId) {
    var AtoB = Math.abs(totalCabs[cabId].row - totalRides[rideId].startRow) + Math.abs(totalCabs[cabId].column - totalRides[rideId].startColumn);
    var distance = Math.abs(totalRides[rideId].endRow - totalRides[rideId].startRow) + Math.abs(totalRides[rideId].endColumn - totalRides[rideId].startColumn);
    var timeCabWillReachLocation = initSteps - totalStepsLeft - 1 + AtoB;
    var timeToWait = (totalRides[rideId].start - timeCabWillReachLocation) > 0 ? (totalRides[rideId].start - timeCabWillReachLocation) : 0;
    var timeWasted = AtoB + timeToWait;
    var bonus = totalRides[rideId].start - timeCabWillReachLocation >= 0 ? initBonus : 0;

    return distance * distanceFactor - timeWasted * timeWasteFactor + bonus * bonusFactor;
}
function findRealScore(cabId, rideId) {
    var AtoB = Math.abs(totalCabs[cabId].row - totalRides[rideId].startRow) + Math.abs(totalCabs[cabId].column - totalRides[rideId].startColumn);
    var distance = Math.abs(totalRides[rideId].endRow - totalRides[rideId].startRow) + Math.abs(totalRides[rideId].endColumn - totalRides[rideId].startColumn);
    var timeCabWillReachLocation = initSteps - totalStepsLeft - 1 + AtoB;
    var timeToWait = (totalRides[rideId].start - timeCabWillReachLocation) > 0 ? (totalRides[rideId].start - timeCabWillReachLocation) : 0;
    var timeWasted = AtoB + timeToWait;
    var bonus = totalRides[rideId].start - timeCabWillReachLocation >= 0 ? initBonus : 0;

    return distance + bonus;
}

function createOutput() {
    outputString = "";
    for (var cabId in totalCabs) {
        cabId = parseInt(cabId);
        outputString += totalCabs[cabId].history.length;
        totalCabs[cabId].history.forEach(element => {
            outputString += " " + element;
        });
        outputString += "\n";
    }
}
function download(data, filename, type) {
    var file = new Blob([data], { type: type });
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var a = document.createElement("a"),
            url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function () {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    }
}


function findMaxScore() {
    var freeCabIds = [];
    //var availPassengers;
    var totalScore; // by passenger id

    // Find zero timeleft cabs
    for (var cabId in totalCabs) {
        cabId = parseInt(cabId)
        if (totalCabs[cabId].timeLeft == 0) {
            freeCabIds.push(cabId);
        }
    }

    var mixedArray = []
    for (var cabId of freeCabIds) {
        //var cabScores = [];
        cabId = parseInt(cabId);
        for (var passId in totalRides) {
            passId = parseInt(passId);
            if (rideTime(cabId, passId) < totalStepsLeft) {
                var rideObj = {
                    "cabId": cabId,
                    "rideId": passId,
                    "rideTime": rideTime(cabId, passId),
                    "score": findScore(cabId, passId),
                    "realScore": findRealScore(cabId, passId),
                    "endRow": totalRides[passId].endRow,
                    "endColumn": totalRides[passId].endColumn
                };
                mixedArray.push(rideObj);
            }

        }
        //totalScore[cabId] = cabScores; 
    }
    //console.log("start sort");
    mixedArray.sort(function (a, b) {
        var y = a.score; var x = b.score;
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
    //console.log("end sort");
    var outputObject = {};
    for (var obj of mixedArray) {
        if (freeCabIds.length == 0) break;
        if (totalRides[obj.rideId] != undefined && freeCabIds.indexOf(obj.cabId) > -1) {
            finalScore += obj.realScore;
            //console.log(finalScore);

            outputObject[obj.cabId] = { rideId: obj.rideId, rideTime: obj.rideTime, endRow: obj.endRow, endColumn: obj.endColumn };
            freeCabIds.splice(freeCabIds.indexOf(obj.cabId), 1);
            delete totalRides[obj.rideId];
            rideDone++;
        }
    }
    //console.log(rideDone);
    //    if(freeCabIds.length != 0){
    //    		for(var cabId of freeCabIds){
    //       	outputObject[carId] = { "cabId" : cabId,
    //                         "rideId" : -1,
    //                         "rideTime" : -1,
    //                         "score" : 0,
    //                         "realScore": 0,
    //                         "endRow": totalCabs[cabId].row,
    //                         "endColumn": totalCabs[cabId].column
    //                       }
    //       }
    //    }
    return outputObject;
}

function avgDistance() {
    var totalDist = 0;
    for (var rideId in totalRides) {
        var distance = Math.abs(totalRides[rideId].endRow - totalRides[rideId].startRow) + Math.abs(totalRides[rideId].endColumn - totalRides[rideId].startColumn);
        totalDist += distance;
    }
    return totalDist / initRides;
}