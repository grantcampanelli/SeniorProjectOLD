
define(function (require) {
    var App = require('app/app');
    var GradeSchema = App.Backbone.Model;
    var GraphModel = App.Course;

    var Backbone = require('util/backbone-helper');
    // var LoadingView = require('util/promise-loading-view');
    // var CourseList = require('course/model/course-list');
    // var CourseListView = require('course/view/course-list-view');
    // var NavCourseFilterView = require('course/nav/filter-list-view');
    // var NavCreateCourseView = require('course/nav/new-course-button-view')
    var Radio = require('backbone.radio');
    var userChannel = require('user/module');
    var pageChannel = Radio.channel('page');
    var courseChannel = Radio.channel('course');
    var Course = require('course/model/course');
    var chartTemplate = require('text!templates/charts.hbs');
    var template1  = require('text!templates/letterGradeGraphics.hbs');
    var template2  = require('text!templates/gradeSchema.hbs');
    var TopNavView  =  require('util/header-nav-view');
    var chart  = require('chart');



    var globalGradeLetterTotals = function () {
        var i = 0;
        var globalTotalGradeArray = new Uint32Array(5);
        var globalGradeArray = model.get('findGraphArray')();
        var globalAMin = model.get('aMin');
        var globalBMin = model.get('bMin');
        var globalCMin = model.get('cMin');
        var globalDMin = model.get('dMin');

        globalGradeArray[0].forEach(function(value) {
            switch (true) {
                case(value >= globalAMin):
                    globalTotalGradeArray[0] += globalGradeArray[1][i];
                    break;
                case(value >= globalBMin):
                    globalTotalGradeArray[1] += globalGradeArray[1][i];
                    break;
                case(value >= globalCMin):
                    globalTotalGradeArray[2] += globalGradeArray[1][i];
                    break;
                case(value >= globalDMin):
                    globalTotalGradeArray[3] += globalGradeArray[1][i];
                    break;
                default:
                    globalTotalGradeArray[4] += globalGradeArray[1][i];
                    break;
            }
            i++;
        });

        return globalTotalGradeArray;
    };

    var LetterGradeGraphView = Mn.ItemView.extend({
        model : GraphModel,
        template : App.Handlebars.compile(template1),
        modelEvents : {
            //"change" : "onShow"
            "change" : "updateGraphs"
        },
        changeSingleBarColor : function(bar, color) {

            this.barChart.datasets[0].bars[bar].fillColor =  color[0];
            this.barChart.datasets[0].bars[bar].strokeColor =  color[1];
            this.barChart.datasets[0].bars[bar].highlightFill = color[2];
            this.barChart.datasets[0].bars[bar].highlightStroke =  color[3];
        },
        updateBarColors : function() {
            var gradesArray = this.model.get('findGraphArray')()[0];
            for(var x = 0; x < gradesArray.length; x++) {
                switch (true) {
                    case(gradesArray[x] >= this.model.get('aMin')):
                        this.changeSingleBarColor(x, model.get('aColor'));
                        break;
                    case(gradesArray[x] >= this.model.get('bMin')):
                        this.changeSingleBarColor(x, model.get('bColor'));
                        break;
                    case(gradesArray[x] >= this.model.get('cMin')):
                        this.changeSingleBarColor(x, model.get('cColor'));
                        break;
                    case(gradesArray[x] >= this.model.get('dMin')):
                        this.changeSingleBarColor(x, model.get('dColor'));
                        break;
                    default:
                        this.changeSingleBarColor(x, model.get('fColor'));
                        break;
                }
            }
            this.barChart.update();
        },
        updateGraphs : function () {
            // update bar chart
            this.updateBarColors();

            // Destroy and recreate pie chart
            this.pieChart.destroy();
            this.pieChart = new Chart(this.pieCtx).Pie(this.createPieData(),null);
        },
        createPieData : function () {
           var data = [
               {
                   value: globalGradeLetterTotals()[0],
                   color: this.model.get('aColor')[0],
                   highlight: this.model.get('aColor')[1],
                   label: "A"
               },
               {
                   value: globalGradeLetterTotals()[1],
                   color: this.model.get('bColor')[0],
                   highlight: this.model.get('bColor')[1],
                   label: "B"
               },
               {
                   value: globalGradeLetterTotals()[2],
                   color: this.model.get('cColor')[0],
                   highlight: this.model.get('cColor')[1],
                   label: "C"
               },
               {
                   value: globalGradeLetterTotals()[3],
                   color:this.model.get('dColor')[0],
                   highlight: this.model.get('dColor')[1],
                   label: "D"
               },
               {
                   value: globalGradeLetterTotals()[4],
                   color: this.model.get('fColor')[0],
                   highlight: this.model.get('fColor')[1],
                   label: "F"
               }

           ];
            return data;
        },
        createBarData : function () {
            var gradeArray = this.model.get('findGraphArray')();
            var barGraphData = {
                labels : gradeArray[0],
                datasets: [
                    {
                        label : "A",
                        fillColor: this.model.get('aColor')[0],
                        strokeColor: this.model.get('aColor')[1],
                        highlightFill: this.model.get('aColor')[2],
                        highlightStroke: this.model.get('aColor')[3],
                        data: gradeArray[1]

                    }
                ]
            };
            return barGraphData;
        },
        //graphTitle: "A",
        onShow : function () {
            if (!this.barCtx || !this.pieCtx) {
                return
            }

            // render pie chart
            this.pieChart = new Chart(this.pieCtx).Pie(this.createPieData(),null);

            // render bar chart
            this.barChart = new Chart(this.barCtx).Bar(this.createBarData(), null);

            // update bar colors
            this.updateBarColors();
            // update bar colors
            this.updateBarColors();


            Course.fetch().then( function() {
                var course = App.UserCourses.at(0)         ;
                console.log(course);
                console.log(course.get('categories'))
                var courseAssignments = course.get('categories').map(function(cat){
                    //console.log(cat);
                    return cat.assignments;
                }).reduce(function(pre, cur){
                    //console.log(pre)
                    pre.push(cur);
                    return pre;
                }, [])     ;
                //console.log(_.flatten(courseAssignments))

                //console.log(course.get('students')[0].grades)
                //course.get('students')[0].grades.push({
                //    assignment : '554a92b5bd9b601a82ace21a',
                //    rawScore : 86
                //});
                //course.get('students')[0].grades.push({
                //    assignment : '554a92b5bd9b601a82ace218',
                //    rawScore : 83
                //});
                //course.save();
                //console.log(App.UserCourses.at(0).get('minA'))
                //console.log(App.UserCourses.at(0).get('minA'))
                ////console.log(App.UserCourses.at(0).get('classCode'));
                //App.UserCourses.at(0).set({
                //    minA : 89
                //});
                //App.UserCourses.at(0).save().then(
                //    console.log(App.UserCourses.at(0))
                //);

            })

            //students(0).grades[0].save();
            //({
            //    id : "testAssignment",
            //    rawScore : "100"
            //});


            //console.log(App.UserCourses.fetch().at(1))

            //console.log(App.UserCourses.fetch());

            //App.$.ajax(
            //    {
            //        method : "GET",
            //        url : '/api/Courses',
            //        async: true,
            //        success : function(data) {
            //            console.log(data);
            //        }
            //    }
            //)
        },
        onAttach : function (){
            this.barCtx = this.$('.barChart')[0].getContext('2d');
            this.pieCtx = this.$('.pieChart')[0].getContext('2d');
        }
    });

    var model = new Backbone.Model({
        findGraphArray : function() {
            return [[50, 55, 60, 65, 68, 70, 71, 75, 78, 79, 80, 83, 88, 89, 90, 91, 94], [1, 2, 3, 1, 2, 1, 1, 2, 3, 4, 1, 2, 3, 4, 1, 3, 4]];
        },
        dColor :  ["rgba(255,0,0,0.5)", "rgba(255,0,0,0.6)", "rgba(255,0,0,0.7)", "rgba(220,220,220,0.7)"],
        fColor :  ["rgba(255,0,0,0.8)", "rgba(255,0,0,0.8)", "rgba(255,0,0,0.9)", "rgba(220,220,220,1)"],
        cColor : ["rgba(255, 165, 0, 0.5)", "rgba(255, 165, 0, 0.8)", "rgba(255, 165, 0, 0.75)", "rgba(255, 165, 0, 1)"],
        bColor :  ["rgba(255, 255, 0,0.5)", "rgba(255, 255, 0,0.8)", "rgba(255, 255, 0,0.75)", "rgba(255, 255, 0,1)"],
        aColor : ["rgba(0,255,0,0.5)", "rgba(0,255,0,0.8)", "rgba(0,255,0,0.75)", "rgba(0,255,0,1)"],
        aMin: 90,
        bMin: 80,
        cMin: 70,
        dMin: 60,
        numGradeLetters: 5,
        totalGradeArray : []
    });

    var GradeSchemaView = Mn.ItemView.extend({
        model: GradeSchema,
        template : App.Handlebars.compile(template2),
        ui: {
            "aMin" : '.aMinInput',
            "bMin" : '.bMinInput',
            "cMin" : '.cMinInput',
            "dMin" : '.dMinInput',
            "aOut" : '.aMinOutput',
            "bOut" : '.bMinOutput',
            "cOut" : '.cMinOutput',
            "dOut" : '.dMinOutput',
            "aOutTotal" : ".aOutTotal",
            "bOutTotal" : ".bOutTotal",
            "cOutTotal" : ".cOutTotal",
            "dOutTotal" : ".dOutTotal",
            "fOutTotal" : ".fOutTotal",
            "newGradeInputs" : ".newGradeInputs"

        },
        modelEvents: {
            "change" : "onShow",
        },
        onShow: function() {
            var totalGrades = globalGradeLetterTotals();
            this.ui.aMin.val(this.model.get('aMin'));
            this.ui.bMin.val(this.model.get('bMin'));
            this.ui.cMin.val(this.model.get('cMin'));
            this.ui.dMin.val(this.model.get('dMin'));

            this.ui.aOutTotal.html(totalGrades[0]);
            this.ui.bOutTotal.html(totalGrades[1]);
            this.ui.cOutTotal.html(totalGrades[2]);
            this.ui.dOutTotal.html(totalGrades[3]);
            this.ui.fOutTotal.html(totalGrades[4]);
            //this.ui.bOut.html(this.model.get('bMin'));
            //this.ui.cOut.html(this.model.get('cMin'));
            //this.ui.dOut.html(this.model.get('dMin'));
        },
        events: {
            "change @ui.aMin" : "updateAMin",
            "change @ui.bMin" : "updateBMin",
            "change @ui.cMin" : "updateCMin",
            "change @ui.dMin" : "updateDMin",
            //"click @ui.newGradeInputs" : "updateOutputs"
            //"change @ui." : "updateOutputs"
        },
        updateModel : function(modelString, selector) {
            var arg = {};
            var input = this.ui[modelString][0].value;
            arg[modelString] = this.ui[selector];
            this.model.set(modelString, parseInt(input));
            //this.model.set(modelString, this.ui.[modelString]);

        },
        initialize: function() {
            this.updateAMin =  App._.partial(this.updateModel, "aMin");
            this.updateBMin =  App._.partial(this.updateModel, "bMin");
            this.updateCMin =  App._.partial(this.updateModel, "cMin");
            this.updateDMin =  App._.partial(this.updateModel, "dMin");
        }

    });


    return Mn.ItemView.extend({
        template : App.Handlebars.compile(chartTemplate),
        regions : {
            graph : ".chartGraphics",
            schema : ".schema"
        },
        onShow: function() {
            this.showChildView('graph', new LetterGradeGraphView());
            this.showChildView('schema', new GradeSchemaView());
        }
    });
    //
    //App.Router.route(("charts"), "chart", function() {
    //    var mainRegion = pageChannel.request('mainRegion');
    //
    //    var graphView = new GraphView();
    //    mainRegion.show(graphView);
    //    graphView.getRegion("graph").show(new LetterGradeGraphView({
    //        model : model
    //    }));
    //    graphView.getRegion("schema").show(new GradeSchemaView({
    //        model : model
    //    }));
    //
    //
    //    //var layout = App.show(new App.StandardLayoutView());
    //    //layout.getRegion("header").show(new TopNavView);
    //    //var graphView = new GraphView();
    //    //layout.getRegion("main").show(graphView);
    //    //graphView.getRegion("graph").show(new LetterGradeGraphView({
    //    //    model : model
    //    //}));
    //    //graphView.getRegion("schema").show(new GradeSchemaView({
    //    //    model : model
    //    //}));
    //
    //})

    //var GraphView = App.Mn.LayoutView.extend({
    //    template : App.Handlebars.compile(chartTemplate),
    //    regions : {
    //        graph : ".chartGraphics",
    //        schema : ".schema"
    //    }
    //});
    //
    //App.Router.route(("charts"), "chart", function() {
    //    var mainRegion = pageChannel.request('mainRegion');
    //
    //    var graphView = new GraphView();
    //    mainRegion.show(graphView);
    //    graphView.getRegion("graph").show(new LetterGradeGraphView({
    //        model : model
    //    }));
    //    graphView.getRegion("schema").show(new GradeSchemaView({
    //        model : model
    //    }));
    //
    //
    //    //var layout = App.show(new App.StandardLayoutView());
    //    //layout.getRegion("header").show(new TopNavView);
    //    //var graphView = new GraphView();
    //    //layout.getRegion("main").show(graphView);
    //    //graphView.getRegion("graph").show(new LetterGradeGraphView({
    //    //    model : model
    //    //}));
    //    //graphView.getRegion("schema").show(new GradeSchemaView({
    //    //    model : model
    //    //}));
    //
    //})
});