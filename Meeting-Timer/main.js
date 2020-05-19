var start15 = function () {
    start(15)
}
var start30 = function () {
    start(30)
}
var start60 = function () {
    start(60)
}
var startCustom = function (){
    var isCustom = true;
    var timeInput =  document.getElementById("customTime")
    var customDuration = timeInput.value;

    if (customDuration > 0)
    {
        start(customDuration,getSize(),20,isCustom);
    }
    else
    {
        alert("Enter an integer between 1 and 60")
    }
}
function getSize() {
    return 150;
}

var start = function (duration, size = getSize(), timeIncrementSeconds = 1,isCustom = false) {

    if (!isCustom){
        delayInMinutes = measureStartDelay(duration);
        duration -= delayInMinutes;
    }
    else{
        if (duration > 60){
            alert("Time must be <= 60 minutes")
            return;
        }
    }

    var r = Raphael("holder", size, size),
        R = size/3,
        init = true,
        isStartTimeMeasured = false,
        param = {stroke: "#fff", "stroke-width": 30},
        hash = document.location.hash,
        marksAttr = {fill: hash || "#FFF", stroke: "none"},
        t = 0,
        htmlMinutes = document.getElementById("RemainingTime"),
        htmlMinutesDescription = document.getElementById("RemainingTimeDescription")

    htmlMinutes.style.visibility='visible';
    htmlMinutesDescription.style.visibility='visible';

    // set proportional font size
    var proportionalSize = size/10;
    htmlMinutes.style.fontSize = proportionalSize + "px";
    htmlMinutesDescription.style.fontSize = proportionalSize + "px";

    // Custom Attribute 'arc'
    r.customAttributes.arc = function (value, total, R) {
        var alpha = 360 / total * value,
            a = (90 - alpha) * Math.PI / 180,
            x = size/2 + R * Math.cos(a),
            y = size/2 - R * Math.sin(a),
            path;
        if ((total == value) /*|| (value == 0)*/) {
            path = [["M", size/2, size/2 - R], ["A", R, R, 0, 1, 1, (size/2) - 0.01, size/2 - R]];
        } else {
            path = [["M", size/2, size/2 - R], ["A", R, R, 0, +(alpha > 180), 1, x, y]];
        }
        return {path: path};
    };


// green arc showing full range
var arcWidthScale = size/600
param = {stroke: "#073", "stroke-width": 40*arcWidthScale};
var okPath = r.path().attr(param).attr({arc: [0, duration, R]});

// time arc
param = {stroke: "#0f0", "stroke-width": 20*arcWidthScale};
var timePath = r.path().attr(param).attr({arc: [0, 60, R]});

drawMarks(size*240/600, 60/5); // 5 minute increments

okPath.animate({arc: [duration, duration, size/3]}, 750);

if (duration > 30) {
    // bouncing with duration too high messes up the rendering
    animStyle = "bounce";
}
else {
    animStyle = "elastic";
}

// animate the time arc, then call begin when animation finishes
timePath.animate({arc: [duration, 60, R]}, 5000, animStyle, function () {
        begin();
    });

}

function updateVal(value, total, R, minutesCountdown) {

    if (init) {
        minutesCountdown.animate({arc: [value, total, R]}, 900, ">");
    } else  {
        if (!value || value == total) {
            value = total;
            minutesCountdown.animate({arc: [value, total, R]}, 3750, "bounce", function () {
                minutesCountdown.attr({arc: [0, total, R]});
            });

            minutesCountdown.animate({stroke: "#FFFFFF"}, 1750);
            
        } else {
            minutesCountdown.animate({arc: [value, total, R]}, 750, "elastic");
        }
    }
}

function drawMarks(R, total) {
    var color = "hsb(".concat(Math.round(R) / 200, ", 1, .75)"),
        out = r.set();
    for (var value = 0; value < total; value++) {
        var alpha = 360 / total * value,
            a = (90 - alpha) * Math.PI / 180,
            x = size/2 + R * Math.cos(a),
            y = size/2 - R * Math.sin(a);
        out.push(r.circle(x, y, 2).attr(marksAttr));
    }
    return out;
}

function begin() {
    var d = new Date,
        am = (d.getHours() < 12),
        h = d.getHours() % 12 || 12;

    totalArcSeconds = 60 * 60
    scaleFactor = duration / 60
    totalDurationSeconds =  duration * 60

    if (totalDurationSeconds - t >= 0)
    {
        updateVal((totalDurationSeconds - t)  , 60 * 60, size/3, timePath);
        let remainingMinutes = Math.min(duration,1 + Math.floor((totalDurationSeconds - t)/60));
        htmlMinutes.innerHTML = remainingMinutes;
        htmlMinutesDescription.innerHTML = " min."
    }
    else if (totalDurationSeconds - t < 0)
    {
        htmlMinutes.innerHTML = "[end]";
        htmlMinutesDescription.innerHTML = ""
    }

    t = t + timeIncrementSeconds;

    setTimeout(arguments.callee, 1000);

    init = false;
};


function measureStartDelay(duration) {
    var d = new Date,
    startMin = d.getMinutes() % 30,
    delayInMinutes = 0;

    if (duration == 15)
    {
        startMin = d.getMinutes() % 15;
    }

    if (startMin > 1)
    {
        var startDelay = document.getElementById("startDelayTime");
        startDelay.style.visibility = 'visible';
        startDelay.innerHTML = '[' + startMin + ' late]'

        delayInMinutes = startMin;
    }


    return delayInMinutes;
};
