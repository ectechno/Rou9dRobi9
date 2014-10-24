var app = angular.module('myApp', []);

app.run(function ($rootScope) {
    $rootScope.name = "Hasith";
});

app.controller('ItemsController', function ($scope, $rootScope, $http) {
    $scope.curruntIndex = 0;

    $rootScope.$on("TIMEOUT", function () {
        $scope.curruntIndex += 1;
    });

    $scope.jumpTo = function (itemIndex) {
        $scope.curruntIndex = itemIndex;
        $rootScope.$broadcast("RESET_TIMER");
    }

    $http({
        method: 'GET',
        //url: 'http://99xt.lk/services/api/Projects',
        url: 'projects.js'
    }).success(function (data, status) {
        $scope.items = data;
        $scope.itemsCol1 = data.slice(0, data.length/2);
        $scope.itemsCol2 = data.slice(data.length / 2);

        $rootScope.$broadcast("RESET_TIMER");
    }).error(function (data, status) {
        console.error("HTTP error : " + status);
    });
});

app.controller('TimerController', function ($scope, $rootScope) {
    $scope.timespan = 120;
    $scope.countdown = $scope.timespan;
    $scope.countdown -= 1;
    $scope.timerPaused = true;

    var beep = (function () {
        var ctx = new (window.audioContext || window.webkitAudioContext);
        return function (duration, type, finishedCallback) {

            duration = +duration;

            // Only 0-4 are valid types.
            type = (type % 5) || 0;

            if (typeof finishedCallback != "function") {
                finishedCallback = function () { };
            }

            var osc = ctx.createOscillator();

            osc.type = type;

            osc.connect(ctx.destination);
            osc.noteOn(0);

            setTimeout(function () {
                osc.noteOff(0);
                finishedCallback();
            }, duration);

        };
    })();
   
    var updateClock = function () {
        $scope.countdown -= 1;
        if ($scope.countdown < 10) {
            beep(50, 3);
        }
        if ($scope.countdown <= 0) {
            $rootScope.$broadcast("TIMEOUT");
            $scope.countdown = $scope.timespan;
        }
    }

    var timer = null;

    $scope.resumeTimer = function () {
        timer = setInterval(function () {
            $scope.$apply(updateClock);
        }, 1000);
        $scope.timerPaused = false;
    }
 
    $scope.pauseTimer = function () {
        clearInterval(timer);
        $scope.timerPaused = true;
    }

    $rootScope.$on("RESET_TIMER", function () {
        $scope.countdown = $scope.timespan;
    });

    
});
