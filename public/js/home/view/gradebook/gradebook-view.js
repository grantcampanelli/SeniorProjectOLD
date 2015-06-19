/**
 * The boilerplate for an AMD module.
 * @author Michael Murphy
 */
define(function (require) {
    var $ = require('jquery');
    var _ = require('underscore');
    var Q = require('q');
    var Backbone = require('util/backbone-helper');
    var Radio = require('backbone.radio');
    var Mn = require('backbone.marionette');
    var Hbs = require('handlebars');
    var template = require('text!course/view/gradebook/gradebookView.hbs');
    var adapter = require('course/view/gradebook/gradebook-adapter');
    var courseRadioChannel = Radio.channel('course');
    var chart = require('chart');


    var GradebookView = Mn.ItemView.extend({
        template: Hbs.compile(template),

        events: {
            "click td.grade": "editGrade",
            "click th": "setSortColumn",
            'change @ui.aMin': 'updateMinimumA',
            'change @ui.bMin': 'updateMinimumB',
            'change @ui.cMin': 'updateMinimumC',
            'change @ui.dMin': 'updateMinimumD',
            'keydown ': 'onKeyDown'
        },

        ui: {
            shead: "table.gradebook-students > thead",
            sbody: "table.gradebook-students > tbody",
            sfoot: "table.gradebook-students > tfoot",

            thead: "table.gradebook > thead",
            tbody: "table.gradebook > tbody",
            tfoot: "table.gradebook > tfoot",

            ehead: "table.gradebook-summary > thead",
            ebody: "table.gradebook-summary > tbody",
            efoot: "table.gradebook-summary > tfoot",

            barChartCanvas: ".bar-chart-canvas",
            'aMin': '#grade-scheme-min-a',
            'bMin': '#grade-scheme-min-b',
            'cMin': '#grade-scheme-min-c',
            'dMin': '#grade-scheme-min-d',
        },

        modelEvents: {
            'sort': 'updateGradeBook',
            'change': 'updateGradeBook',
            'open': 'onOpen',
            'sync': 'updateGradeBook',
            'change:students.grades': 'updateGradeBook'
        },

        //onShow : function() {
        //    this.initialGradeMinimums();
        //},

        initialize: function () {
            this.isSortUp = false;
            this.course = courseRadioChannel.request('current:course');
            this.listenTo(this.model.students, 'add remove update reset sort sync', this.onShow.bind(this));
            this.listenTo(this.model.assignments, 'add remove update reset sort sync', this.onShow.bind(this));
            this.listenTo(this.model.categories, 'add remove update reset sort sync', this.onShow.bind(this));
            this.listenTo(this.course, 'add remove update reset sort sync', this.onShow.bind(this));

            var lightRed = ["rgba(255,0,0,0.5)", "rgba(255,0,0,0.6)", "rgba(255,0,0,0.7)", "rgba(220,220,220,0.7)"];
            var darkRed = ["rgba(255,0,0,0.8)", "rgba(255,0,0,0.8)", "rgba(255,0,0,0.9)", "rgba(220,220,220,1)"];
            var orange = ["rgba(255, 165, 0, 0.5)", "rgba(255, 165, 0, 0.8)", "rgba(255, 165, 0, 0.75)", "rgba(255, 165, 0, 1)"];
            var yellow = ["rgba(255, 255, 0,0.5)", "rgba(255, 255, 0,0.8)", "rgba(255, 255, 0,0.75)", "rgba(255, 255, 0,1)"];
            var green = ["rgba(0,255,0,0.5)", "rgba(0,255,0,0.8)", "rgba(0,255,0,0.75)", "rgba(0,255,0,1)"];
            this.model.set('aColor', green);
            this.model.set('bColor', yellow);
            this.model.set('cColor', orange);
            this.model.set('dColor', lightRed)
            this.model.set('fColor', darkRed)
            //console.log("grant === ");
            //console.log(this.model)
        },

        onKeyDown: function (event) {
            if (event.keyCode === 13) {
                this.editGrade(event);
            }
            console.log('here');
            console.log(event)
        },


        editGrade: function (e) {
            e.preventDefault();
            if (this.input) {
                this.saveRawScoreInput();
                this.input = null;
            }
            else {
                this.input = e.currentTarget;
                var elm = $(e.currentTarget);
                var aId = elm.attr('data-aId');
                var sId = elm.attr('data-sId');

                this.getCurrentRawScore(aId, sId).then(function (val) {
                    elm.empty();
                    elm.html("<input type='number' value='" + val + "'/>");
                    elm.attr('data-aId', aId);
                    elm.attr('data-sId', sId);
                    elm.find('input').focus();
                    elm.find('input').select();
                }).done()

            }
        },

        setSortColumn: function (e) {

            e.preventDefault();
            var elm = $(e.currentTarget);
            var self = this
            if (elm.attr('data-aid')) {
                var aId = elm.attr('data-aid');
                self.assignmentSortId = aId;
                self.categorySortId = false;
                self.model.students.comparator = assignmentSorter(aId);
                self.model.students.sort();
            }
            else if (elm.attr('data-cat-id')) {
                var catId = elm.attr('data-cat-id');
                self.categorySortId = catId;
                self.assignmentSortId = false;
                self.model.students.comparator = catagorySorter(catId);
                this.isSortCol = function (obj) {
                }
            }
            self.model.students.sort();


            function assignmentSorter(aId) {
                if (this.sortKey !== aId) {
                    this.sortKey = aId;
                    self.isSortUp = false;
                    return function gradeSort(student) {
                        return Number(student.getGrade(aId));
                    }

                }
                else {
                    this.sortKey = "-" + aId
                    self.isSortUp = true;
                    return function reverseGradeSort(student) {
                        return -1 * Number(student.getGrade(aId));
                    }

                }

            }

            function catagorySorter(catId) {
                var categoryScore;
                var category = self.model.categories.get(catId);
                //console.log(category)
                //console.log('here')
                if (this.sortKey !== catId) {
                    this.sortKey = catId;
                    self.isSortUp = false;
                    //console.log('normal order')
                    return function categorySort(student) {
                        console.log('in col sort fun', self);
                        categoryScore = self.model.calculateCategoryGrade(category, student)
                        return Number(categoryScore)
                    }
                    seld.isSortUp = false;
                }
                else {
                    //console.log('showing reverse order')
                    self.isSortUp = true;
                    return function reversecategorySort(student) {
                        categoryScore = self.model.calculateCategoryGrade(category, student)
                        //console.log(categoryScore);
                        return -1 * Number(categoryScore)
                    }
                }
            }
        },

        saveRawScoreInput: function () {
            var deferred = Q.defer();
            var self = this;
            var elm = $(this.input);
            var rawScore = elm.find('input').val() || "0";
            var aId = elm.attr('data-aId');
            var sId = elm.attr('data-sId');
            //console.log(rawScore)
            var model = this.model;
            setTimeout(function () {
                doRender()
                try {
                    var studentCollection = self.model.students;
                    var student = studentCollection.get(sId)
                    //console.log('logging current student', sId);
                    //console.log(student);
                    student.setGrade(aId, rawScore);
                    student.save();
                    //console.log('savinging student');
                    // var grades = student.get('grades');
                    // console.log('logging grades collection')
                    // console.log(grades)
                    // var item = grades.findWhere({assignment: aId});

                    // item.model.once('change', doSave);
                    // item.setGrade(aId, rawScore);
                    // item.off('change', doSave);
                    deferred.resolve(true);

                    function doSave() {
                        //console.log('here');
                        elm.html("<span>" + rawScore + "</span>");
                        deferred.resolve(self.model.save().then(function (data) {
                            //console.log(data);
                            return doRender();
                            deferred.resolve(true);
                        }));
                    }

                }
                catch (e) {
                    deferred.reject(e);
                }
            }, 1);

            function doRender() {
                elm.empty();
                elm.html(rawScore);
                elm.attr('data-aId', aId);
                elm.attr('data-sId', sId);
            }

            return deferred.promise;
        },

        getCurrentRawScore: function (aId, sId) {
            var deferred = Q.defer();
            var self = this;
            setTimeout(function () {
                try {
                    var students = self.model.students;
                    //console.log('logging student collection')
                    //console.log(students);
                    var student = students.get(sId)
                    // console.log('logging current student', sId);
                    // console.log(student);
                    // var grades = student.get('grades');
                    // console.log('logging grades collection')
                    // console.log(grades)
                    // var item = student.getGrade(aId);
                    // console.log('logging assignment grade')
                    // console.log(item)
                    // var value = item.get('rawScore') || "0"
                    // console.log('logging value of raw score');
                    // console.log(value);
                    //console.log('resolving promise');
                    deferred.resolve(student.getGrade(aId));
                }
                catch (e) {
                    deferred.resolve("0");
                }
            }, 1);

            return deferred.promise;
        },

        onOpen: function () {
            //console.log('course opened', this.model.cid);
            this.onShow();
        },

        onShow: function () {
            this.updateGradeBook();
            //this.initialGradeMinimums();
            this.initializeCharts();
        },
        updateGradeBook: function () {
            var self = this;
            var ui = this.ui;
            var categoriesCollection = this.model.categories;
            var layout = adapter.calculateTableHeaderLayout();
            var headerHeight = layout.length;
            var studentCollection = this.model.students;
            var students = studentCollection.map(function (student) {
                //var user = student.get('user').find(_.identity);
                var last = student.get('last');
                var first = student.get('first');
                var name = last + ', ' + first;
                var id = student.id;
                return {
                    name: name,
                    id: id,
                    student: student
                }
            });

            var assignmentOrder = [];
            var assignments = this.model.assignments;
            var header = createHeader();
            _.each(this.model.categories.tree(), orderAssignments);
            //console.log('assignment order: ', assignmentOrder);
            var body = createBody();
            var tableRowHeaders = createRowHeaders();

            ui.shead.empty();
            ui.thead.empty();
            ui.ehead.empty();

            ui.sbody.empty();
            ui.tbody.empty();
            ui.ebody.empty();

            ui.thead.get(0).appendChild(header);
            ui.tbody.get(0).appendChild(body);
            ui.shead.get(0).appendChild(createRowHeadersColHeader());
            ui.sbody.get(0).appendChild(createRowHeaders());
            var headerHeight = layout.length;
            ui.ehead.get(0).appendChild(createRowHeadersColHeader());
            ui.ebody.get(0).appendChild(createRowSummaries());

            function orderAssignments(cat) {
                _.each(cat.tree(), orderAssignments);
                _.each(cat.getAssignmentsArray(), function (a) {
                    // console.log(a);
                    assignmentOrder.push(a)
                });
            }

            function sortIcon(isUp) {
                var i = window.document.createElement("i");
                if (isUp)
                    i.setAttribute("class", 'fa fa-sort-asc');
                else
                    i.setAttribute("class", 'fa fa-sort-desc');

                return i;
            }

            function createHeader() {
                var docfrag = window.document.createDocumentFragment();
                _.each(layout, function (row) {
                    var tr = window.document.createElement("tr");
                    _.each(row, function (cell) {
                        var td = window.document.createElement("th");

                        if (cell.style === "blank") {
                            td = window.document.createElement("td");
                        }
                        else {
                            td.appendChild(document.createTextNode(cell.name + " "));
                        }
                        if (cell.style === "assignment") {
                            //assignmentOrder.push(cell.id);
                            td.setAttribute('data-aid', cell.id);
                            if (self.assignmentSortId === cell.id) {
                                td.appendChild(sortIcon(self.isSortUp));
                            }
                        }
                        if (cell.id) {
                            td.setAttribute('data-cat-id', cell.id);
                            if (self.categorySortId === cell.id) {
                                td.appendChild(sortIcon(self.isSortUp));
                            }
                        }
                        td.setAttribute("colspan", cell.colspan);
                        td.setAttribute("rowspan", cell.rowspan);
                        var styles = [""]
                        td.setAttribute("class", cell.style + " text-nowrap col-md-" + cell.colspan);

                        tr.appendChild(td);
                    });

                    docfrag.appendChild(tr);
                });
                return docfrag;
            }

            function createBody() {
                var docfrag = window.document.createDocumentFragment();
                var studentRows = _.map(students, function (student) {
                    var grades = [];
                    for (var i = 0; i < assignmentOrder.length; ++i) {

                        var grade = student.student.getGrade(assignmentOrder[i]);
                        grades.push({
                            colspan: 1,
                            rowspan: 1,
                            style: "grade",
                            value: grade,
                            gradeEmpty: !_.isFinite(grade),
                            aId: assignmentOrder[i],
                            sId: student.student.id
                        });
                    }

                    return grades;
                });

                _.each(studentRows, function (row) {
                    var tr = window.document.createElement("tr");
                    _.each(row, function (cell) {
                        var td = window.document.createElement("td");

                        if (cell.style == "grade") {

                            var text = document.createTextNode(cell.value);
                            if (cell.gradeEmpty) {
                                var s = window.document.createElement("span");
                                s.appendChild(text);
                                td.appendChild(s);
                            }
                            else {
                                td.appendChild(text);

                            }
                            td.setAttribute("class", cell.style);
                            td.setAttribute("data-aId", cell.aId);
                            td.setAttribute("data-sId", cell.sId);

                        }
                        else {
                            return
                            td = window.document.createElement("th");
                            td.appendChild(document.createTextNode(cell.name));
                            td.setAttribute("class", cell.style + " ");
                        }
                        td.setAttribute("colspan", cell.colspan);
                        td.setAttribute("rowspan", cell.rowspan);


                        tr.appendChild(td);
                    });

                    docfrag.appendChild(tr);
                })

                return docfrag;
            }

            function createRowHeadersColHeader() {
                var docfrag = window.document.createDocumentFragment();
                var row = {
                    rowspan: 1,
                    colspan: 1,
                    style: "blank",
                    name: "_"
                }
                var tr = window.document.createElement("tr");
                var th = window.document.createElement("th");
                th.appendChild(document.createTextNode(row.name));
                th.setAttribute("class", row.style);
                th.setAttribute("colspan", row.colspan);
                th.setAttribute("rowspan", row.rowspan);
                tr.appendChild(th);
                docfrag.appendChild(tr);
                while (--headerHeight) {
                    var tr = window.document.createElement("tr");
                    var th = window.document.createElement("th");
                    if (headerHeight === 1) {
                        th.setAttribute("style", "border-bottom: 2px solid #ddd");
                    }
                    th.setAttribute("class", row.style);
                    th.appendChild(document.createTextNode(row.name));
                    tr.appendChild(th);

                    docfrag.appendChild(tr);
                }
                return docfrag;
            }

            function createRowHeaders() {
                var docfrag = window.document.createDocumentFragment();
                var arr = assignments.map(function (cid) {
                    return window.regestery._byId[cid];
                });
                var studentRows = _.map(students, function (student) {
                    return studentCell = {
                        name: student.name || "",
                        rowspan: 1,
                        colspan: 1,
                        style: "studentRowHeader"
                    }
                })
                _.each(studentRows, function (row) {
                    var tr = window.document.createElement("tr");
                    var td = window.document.createElement("th");
                    td.appendChild(document.createTextNode(row.name));
                    td.setAttribute("class", row.style + " ");
                    td.setAttribute("colspan", 1);
                    td.setAttribute("rowspan", row.rowspan);
                    tr.appendChild(td);
                    docfrag.appendChild(tr);
                });
                return docfrag;
            }

            function createRowSummaries() {
                var students = studentCollection;
                //var course = courseRadioChannel.request('current:course');
                //var self = this;
                var docfrag = window.document.createDocumentFragment();
                for (var i = 0; i < students.size(); ++i) {
                    //console.log('hello...')
                    var student = students.at(i);

                    // console.log(self.model);
                    var totalGrade = self.model.calculateGrade(student);
                    // console.log(totalGrade);
                    totalGrade = Math.round(totalGrade * 100) / 100;
                    //console.log(self.course);
                    var letterGrade = self.model.getLetterGrade(totalGrade, self.course);
                    var tr = window.document.createElement("tr");
                    var td = window.document.createElement("th");
                    var tdLetterGrade = window.document.createElement("th");

                    td.appendChild(document.createTextNode(totalGrade));
                    td.setAttribute("class", "total");
                    td.setAttribute("colspan", 1);
                    td.setAttribute("rowspan", 1);
                    tr.appendChild(td);

                    tdLetterGrade.appendChild(document.createTextNode(letterGrade));
                    tdLetterGrade.setAttribute("class", "letter-grade");
                    tdLetterGrade.setAttribute("colspan", 1);
                    tdLetterGrade.setAttribute("rowspan", 1);
                    tr.appendChild(tdLetterGrade);
                    docfrag.appendChild(tr);
                }
                return docfrag;
            }

        },

        ///////////
        ///////////  GRANT BARCHART FUNCTIONALITY
        ///////////

        onAttach: function () {
            this.barCtx = this.$('.bar-chart-canvas')[0].getContext('2d');
            this.pieCtx = this.$('.pie-chart-canvas')[0].getContext('2d');
        },

        initializeCharts: function () {
            if (this.pieChart || this.barChart)
                console.log("pieChart and barChart are there")
            else {
                this.initialGradeMinimums();
                this.createCharts();
            }


        },

        createCharts: function () {
            var self = this;
            if (!this.barCtx || !this.pieCtx) {
                return;
            }
            var students = this.model.students;
            var totalGrade, student, totalGrades = [], individualGrades = [];
            for (var i = 0; i < students.size(); ++i) {
                student = students.at(i);
                totalGrade = self.model.calculateGrade(student);
                totalGrade = Math.round(totalGrade);
                totalGrades.push(totalGrade);
                if (!individualGrades[totalGrade])
                    individualGrades[totalGrade] = 1;
                else
                    individualGrades[totalGrade]++;
            }
            this.totalGrades = totalGrades;
            this.individualGrades = individualGrades;
            //var barGraphData = ;


            //console.log('letterGrades', this.letterGradesStats)

            // render bar chart
            this.barChart = new Chart(this.barCtx).Bar(this.createBarData(), null);

            // render pie chart
            //console.log("pie chart data" , this.pieChart.data)
            this.pieChart = new Chart(this.pieCtx).Pie(this.createPieData(), null);

            this.updateBarColors();

            // update bar colors
            //this.updateBarColors();


        },

        createGradeArray: function () {
            var aL = [], aR = [];
            var individualGrades = this.individualGrades;
            for (var i = 0; i <= 100; i++) {
                if (individualGrades[i]) {
                    aL.push(i)
                    aR.push(individualGrades[i])
                }

            }
            return [aL, aR];
        },

        createBarData: function () {
            //console.log("CreateBarData");
            var self = this;

            //var gradeArray = arrayForGraph;

            var arrayForGraph = this.createGradeArray();

            //console.log('color', self.model.categories);
            var barGraphData = {
                labels: arrayForGraph[0],
                datasets: [
                    {
                        label: "A",
                        fillColor: this.model.get('aColor')[0],
                        strokeColor: this.model.get('aColor')[1],
                        highlightFill: this.model.get('aColor')[2],
                        highlightStroke: this.model.get('aColor')[3],
                        data: arrayForGraph[1]


                    }
                ]
            };
            //console.log(barGraphData);
            return barGraphData;
            // return;

        },

        calculateLetterGradeStats: function () {
            var letterGrades = [], i;
            var totalGrades = this.totalGrades;
            var course = this.model;
            //console.log(course)
            var minA = course.get('minA');
            var minB = course.get('minB');
            var minC = course.get('minC');
            var minD = course.get('minD');

            letterGrades.a = 0;
            letterGrades.b = 0;
            letterGrades.c = 0;
            letterGrades.d = 0;
            letterGrades.f = 0;


            for (i = 0; i < totalGrades.length; i++) {
                if (totalGrades[i] >= minA) {
                    letterGrades.a++;
                }
                else if (totalGrades[i] >= minB) {
                    letterGrades.b++;
                }
                else if (totalGrades[i] >= minC) {
                    letterGrades.c++;
                }
                else if (totalGrades[i] >= minD) {
                    letterGrades.d++;
                }
                else {
                    letterGrades.f++;
                }
            }


            //console.log(letterGrades);
            return letterGrades;
        },

        changeSingleBarColor: function (bar, color) {

            this.barChart.datasets[0].bars[bar].fillColor = color[0];
            this.barChart.datasets[0].bars[bar].strokeColor = color[1];
            this.barChart.datasets[0].bars[bar].highlightFill = color[2];
            this.barChart.datasets[0].bars[bar].highlightStroke = color[3];
        },
        updateBarColors: function () {
            var gradesArray = this.createGradeArray()[0];
            var course = this.model;
            var lightRed = ["rgba(255,0,0,0.5)", "rgba(255,0,0,0.6)", "rgba(255,0,0,0.7)", "rgba(220,220,220,0.7)"];
            var darkRed = ["rgba(255,0,0,0.8)", "rgba(255,0,0,0.8)", "rgba(255,0,0,0.9)", "rgba(220,220,220,1)"];
            var orange = ["rgba(255, 165, 0, 0.5)", "rgba(255, 165, 0, 0.8)", "rgba(255, 165, 0, 0.75)", "rgba(255, 165, 0, 1)"];
            var yellow = ["rgba(255, 255, 0,0.5)", "rgba(255, 255, 0,0.8)", "rgba(255, 255, 0,0.75)", "rgba(255, 255, 0,1)"];
            var green = ["rgba(0,255,0,0.5)", "rgba(0,255,0,0.8)", "rgba(0,255,0,0.75)", "rgba(0,255,0,1)"];
            for (var x = 0; x < gradesArray.length; x++) {
                if (gradesArray[x] >= course.get('minA'))
                    this.changeSingleBarColor(x, green);
                else if (gradesArray[x] >= course.get('minB'))
                    this.changeSingleBarColor(x, yellow);
                else if (gradesArray[x] >= course.get('minC'))
                    this.changeSingleBarColor(x, orange);
                else if (gradesArray[x] >= course.get('minD'))
                    this.changeSingleBarColor(x, lightRed);
                else
                    this.changeSingleBarColor(x, darkRed);
            }

            this.barChart.update();
        },

        ////// PIE CHART
        createPieData: function () {
            var letterGrades = this.calculateLetterGradeStats(this.totalGrades);
            //var letterGrades = this.letterGradesStats;// = this.calculateLetterGradeStats(this.totalGrades);
            //console.log("made it to createPieData")
            var course = this.model;
            var data = [
                {
                    value: letterGrades.a,
                    color: course.get('aColor')[0],
                    highlight: course.get('aColor')[1],
                    label: "A"
                },
                {
                    value: letterGrades.b,
                    color: course.get('bColor')[0],
                    highlight: course.get('bColor')[1],
                    label: "B"
                },
                {
                    value: letterGrades.c,
                    color: course.get('cColor')[0],
                    highlight: course.get('cColor')[1],
                    label: "C"
                },
                {
                    value: letterGrades.d,
                    color: course.get('dColor')[0],
                    highlight: course.get('dColor')[1],
                    label: "D"
                },
                {
                    value: letterGrades.f,
                    color: course.get('fColor')[0],
                    highlight: course.get('fColor')[1],
                    label: "F"
                }

            ];
            return data;
        },

        initialGradeMinimums: function () {
            var course = this.model;
            var ui = this.ui;

            if (!ui.aMin.val()) {
                ui.aMin.val(course.get('minA'));
                ui.bMin.val(course.get('minB'));
                ui.cMin.val(course.get('minC'));
                ui.dMin.val(course.get('minD'));
            }
        },

        updateMinimumA: function () {
            var newAMin = this.ui.aMin.val();
            var self = this;
            if (newAMin <= this.ui.bMin.val()) {
                console.log('A Minimum cannot be lower than B Minimum')
                this.ui.aMin.val(this.model.get('minA'))
                return;
            }

            this.model.set('minA', parseInt(newAMin))
            self.model.save().then(self.updateCharts())
            //self.updatePieChart();
            //this.model.set('minA', newAMin).then(this.model.save());
            this.ui.aMin.val(newAMin);
            //this.model.save();
        },
        updateMinimumB: function () {
            var newBMin = this.ui.bMin.val();
            var self = this;
            if (newBMin <= this.ui.cMin.val()) {
                console.log('B Minimum cannot be lower than C Minimum')
                this.ui.bMin.val(this.model.get('minB'))
                return;
            }
            if (newBMin >= this.ui.aMin.val()) {
                console.log('B Minimum cannot be higher than A Minimum')
                this.ui.bMin.val(this.model.get('minB'))
                return;
            }

            this.model.set('minB', parseInt(newBMin))
            self.model.save().then(self.updateCharts());
            //self.updatePieChart();
            //this.model.set('minB', newBMin).then(this.model.save());
            this.ui.bMin.val(newBMin);
            //this.model.save();
        },
        updateMinimumC: function () {
            var newCMin = this.ui.cMin.val();
            var self = this;
            if (newCMin <= this.ui.dMin.val()) {
                console.log('C Minimum cannot be lower than D Minimum')
                this.ui.cMin.val(this.model.get('minC'))
                return;
            }
            if (newCMin >= this.ui.bMin.val()) {
                console.log('C Minimum cannot be higher than B Minimum')
                this.ui.cMin.val(this.model.get('minC'))
                return;
            }

            this.model.set('minC', parseInt(newCMin))
            self.model.save().then(self.updateCharts());
            //self.updatePieChart();
            //this.model.set('minC', newCMin).then(this.model.save());
            this.ui.cMin.val(newCMin);

        },
        updateMinimumD: function () {
            var newDMin = this.ui.dMin.val();
            var self = this;
            if (newDMin >= this.ui.cMin.val()) {
                console.log('D Minimum cannot be higher than C Minimum')
                this.ui.dMin.val(this.model.get('minD'))
                return;
            }

            this.model.set('minD', parseInt(newDMin))
            self.model.save().then(self.updateCharts());


            this.ui.dMin.val(newDMin);

            //this.model.save();
        },

        updateCharts: function () {
            this.pieChart.destroy();
            //this.pieCtx = this.$('.pie-chart-canvas')[0].getContext('2d');
            //var ctx = document.getElementById("myChartLine").getContext("2d");
            // myLineChart = new Chart(ctx).Line(data, options);
            this.pieChart = new Chart(this.pieCtx).Pie(this.createPieData(), null);

            this.updateBarColors();
            //this.barChart.destroy();
            // render bar chart
            //this.barChart = new Chart(this.barCtx).Bar(this.createBarData(), null);
        }


    });


    courseRadioChannel.reply('view:gradebook', function (course) {
        if (!course) {
            course = courseRadioChannel.request('current:course');
        }
        return new GradebookView({
            model: course
        });
    });


});