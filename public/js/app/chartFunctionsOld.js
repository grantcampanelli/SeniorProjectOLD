var grades = [50, 55, 60, 65, 68, 70, 71, 75, 78, 79, 80, 83, 88, 89, 90, 91, 94];
var numGrades = [1, 2, 3, 1, 2, 1, 1, 2, 3, 4, 1, 2, 3, 4, 1, 3, 4];
var gradeArray = [[50, 55, 60, 65, 68, 70, 71, 75, 78, 79, 80, 83, 88, 89, 90, 91, 94], [1, 2, 3, 1, 2, 1, 1, 2, 3, 4, 1, 2, 3, 4, 1, 3, 4]];
//var grades = [50, 55, 60]

var aMin = 90;
var bMin = 80;
var cMin = 70;
var dMin = 60;

var changeBarColor = function(chartIn, barStart, barEnd, color) {
    i = barStart;
    for(; i <= barEnd; i++) {
        chartIn.datasets[0].bars[i].fillColor =  color[0];
        chartIn.datasets[0].bars[i].strokeColor =  color[1];
        chartIn.datasets[0].bars[i].highlightFill = color[2];
        chartIn.datasets[0].bars[i].highlightStroke =  color[3];
    }
    chartIn.update();
};


var changeSingleBarColor = function(chartIn, bar, color) {

    chartIn.datasets[0].bars[bar].fillColor =  color[0];
    chartIn.datasets[0].bars[bar].strokeColor =  color[1];
    chartIn.datasets[0].bars[bar].highlightFill = color[2];
    chartIn.datasets[0].bars[bar].highlightStroke =  color[3];

    chartIn.update();
};


// Colors

var lightred =  ["rgba(255,0,0,0.5)", "rgba(255,0,0,0.6)", "rgba(255,0,0,0.7)", "rgba(220,220,220,0.7)"];
var darkred =  ["rgba(255,0,0,0.8)", "rgba(255,0,0,0.8)", "rgba(255,0,0,0.9)", "rgba(220,220,220,1)"];
var orange = ["rgba(255, 165, 0, 0.5)", "rgba(255, 165, 0, 0.8)", "rgba(255, 165, 0, 0.75)", "rgba(255, 165, 0, 1)"];
var yellow =  ["rgba(255, 255, 0,0.5)", "rgba(255, 255, 0,0.8)", "rgba(255, 255, 0,0.75)", "rgba(255, 255, 0,1)"];
var green = ["rgba(0,255,0,0.5)", "rgba(0,255,0,0.8)", "rgba(0,255,0,0.75)", "rgba(0,255,0,1)"];


var ctx = document.getElementById("myChart").getContext("2d");

var histogramValueByGradeFunction = function() {
    var initNum = 0, i = 0;
    var histogramValues = new Array(5);

    while(initNum < 5)
        histogramValues[initNum++] = 0;

    grades.forEach(function(value) {

        switch (true) {
            case(value >= aMin):
                histogramValues[0] += gradeArray[1][i];
                break;
            case(value >= bMin):
                histogramValues[1] += gradeArray[1][i];
                break;
            case(value >= cMin):
                histogramValues[2] += gradeArray[1][i];
                break;
            case(value >= dMin):
                histogramValues[3] += gradeArray[1][i];
                break;
            default:
                histogramValues[4] += gradeArray[1][i];
                break;
        }
        i++;
    });
    return histogramValues;
}

var histogramValueByGrade = histogramValueByGradeFunction();

var data = {
    labels: gradeArray[0],
    datasets: [
        {
            label: "My First dataset",
            fillColor: green[0],
            strokeColor: green[1],
            highlightFill: green[2],
            highlightStroke: green[3],
            data: gradeArray[1]
        }
    ]
};


var myBarChart = new Chart(ctx).Bar(data, {
    scaleShowGridLines : false,
    barStrokeWidth: 1
});

// Change Bar Colors





var aColor = green;
var bColor = yellow;
var cColor = orange;
var dColor = lightred;
var fColor = darkred;

var checkBarChartColors = function (gradesArray){
    for(x = 0; x < gradesArray.length; x++) {
        switch (true) {
            case(gradesArray[x] >= aMin):
                changeSingleBarColor(myBarChart, x, aColor);
                break;
            case(gradesArray[x] >= bMin):
                changeSingleBarColor(myBarChart, x, bColor);
                break;
            case(gradesArray[x] >= cMin):
                changeSingleBarColor(myBarChart, x, cColor);
                break;
            case(gradesArray[x] >= dMin):
                changeSingleBarColor(myBarChart, x, dColor);
                break;
            default:
                changeSingleBarColor(myBarChart, x, fColor);
                break;
        }
    }
}
checkBarChartColors(grades);


var numGradeLetters  = 5;

// function to get number of grades in grade range for pie chart
var pieValueByGradeFunction = function(gradesArray) {
    var initNum = 0, i = 0;
    var pieValues = new Array(5);

    while(initNum < numGradeLetters)
        pieValues[initNum++] = 0;

    gradesArray.forEach(function(value) {

        switch (true) {
            case(value >= aMin):
                pieValues[0] += gradeArray[1][i];
                break;
            case(value >= bMin):
                pieValues[1] += gradeArray[1][i];
                break;
            case(value >= cMin):
                pieValues[2] += gradeArray[1][i];
                break;
            case(value >= dMin):
                pieValues[3] += gradeArray[1][i];
                break;
            default:
                pieValues[4] += gradeArray[1][i];
                break;
        }
        i++;
    });
    return pieValues;
}

var pieValueByGrade = pieValueByGradeFunction(grades);

var pieChart = document.getElementById("piChart").getContext("2d");
var pieData = [
    {
        value: pieValueByGrade[0],
        color: aColor[0],
        highlight: aColor[1],
        label: "A"
    },
    {
        value: pieValueByGrade[1],
        color: bColor[0],
        highlight: bColor[1],
        label: "B"
    },
    {
        value: pieValueByGrade[2],
        color: cColor[0],
        highlight: cColor[1],
        label: "C"
    },
    {
        value: pieValueByGrade[3],
        color:dColor[0],
        highlight: dColor[1],
        label: "D"
    },
    {
        value: pieValueByGrade[4],
        color: fColor[0],
        highlight: fColor[1],
        label: "F"
    }

]


var myPieChart = new Chart(pieChart).Pie(pieData,null);

function updatePieData() {
    updatePieDataIncrement = 0;
    pieValueByGrade = pieValueByGradeFunction(grades);
    for(;updatePieDataIncrement < 5; updatePieDataIncrement++) {
        myPieChart.segments[updatePieDataIncrement].value = pieValueByGrade[updatePieDataIncrement];
    }
}



function updatePieChart() {
    pieValueByGrade = pieValueByGradeFunction(grades);
    updatePieData();
    myPieChart.update();
    //myPieChart = new Chart(pieChart).Pie(pieData,null);
}

function updateBarChart() {
    checkBarChartColors(grades);
    myBarChart.update();
}

function updateTotalGrades() {
    $('#aOutTotal').html(myPieChart.segments[0].value);
    $('#bOutTotal').html(myPieChart.segments[1].value);
    $('#cOutTotal').html(myPieChart.segments[2].value);
    $('#dOutTotal').html(myPieChart.segments[3].value);
    $('#fOutTotal').html(myPieChart.segments[4].value);
    //$('#bOutTotal').html(histogramValueByGrade[1]);
    //$('#cOutTotal').html(histogramValueByGrade[2]);
    //$('#dOutTotal').html(histogramValueByGrade[3]);
    //$('#fOutTotal').html(histogramValueByGrade[4]);


}

function updateGradeMins(){
    $('#aMinInput').val(aMin);
    $('#bMinInput').val(bMin);
    $('#cMinInput').val(cMin);
    $('#dMinInput').val(dMin);
}

$(document).ready(function () {
    // update minimum values at load
    updateGradeMins();
    updateTotalGrades();
    $('#dataArrayValues').append(gradeArray[0].join(","));
    $('#dataArrayQuantity').append(gradeArray[1].join(","));


    // set grade mins submit function
    $('#setGradeMins').on('submit', function(e) {
        //do not refresh page
        e.preventDefault();

        // update mins
        aMin = $('#aMinInput').val();
        bMin = $('#bMinInput').val();
        cMin = $('#cMinInput').val();
        dMin = $('#dMinInput').val();
        updateGradeMins();


        $.ajax({
            url : $(this).attr('action') || window.location.pathname,
            type: "GET",
            data: $(this).serialize(),
            success: function (data) {
                updatePieChart();
                updateBarChart();
                updateTotalGrades();
            },
            error: function (jXHR, textStatus, errorThrown) {
                alert(errorThrown);
            }
        });
    });
});