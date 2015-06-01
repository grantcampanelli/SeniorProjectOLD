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
    
    var GradebookView = Mn.ItemView.extend({
        template: Hbs.compile(template),
        
        events: {
            "click td.grade": "editGrade"
        },
        
        ui: {
            thead: "table.gradebook > thead",
            tbody: "table.gradebook > tbody",
            tfoot: "table.gradebook > tfoot",
            shead: "table.gradebook-students > thead",
            sbody: "table.gradebook-students > tbody",
            sfoot: "table.gradebook-students > tfoot",
        },
        
        modelEvents: {
            'sort': 'onShow',
            'change': 'onShow',
            'open': 'onOpen',
            'sync': 'onShow',
            'change:students.grades': 'onShow'
        },
        
        initialize: function(){
            this.listenTo(this.model.students, 'add remove update reset sort sync', this.onShow.bind(this));
        },
        
        editGrade: function(e) {
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

                this.getCurrentRawScore(aId, sId).then(function(val) {
                    elm.empty();
                    elm.html("<input type='number' value='"+val+"'/>");
                    elm.attr('data-aId', aId);
                    elm.attr('data-sId', sId);
                    elm.find('input').focus();
                    elm.find('input').select();
                }).done()
                
            }
        },
        
        saveRawScoreInput: function() {
            var deferred = Q.defer();
            var self = this;
            var elm = $(this.input);
            var rawScore = elm.find('input').val() || "0";
            var aId = elm.attr('data-aId');
            var sId = elm.attr('data-sId');
            console.log(rawScore)
            var model = this.model;
            setTimeout(function() {
                doRender()
                try {
                    var studentCollection = self.model.students;
                    var student = studentCollection.findWhere({id: sId})
                    console.log('logging current student', sId);
                    console.log(student);
                    student.setGrade(aId, rawScore);
                    student.save();
                    console.log('savinging student');
                    // var grades = student.get('grades');
                    // console.log('logging grades collection')
                    // console.log(grades)
                    // var item = grades.findWhere({assignment: aId});
                    
                    // item.model.once('change', doSave);
                    // item.setGrade(aId, rawScore);
                    // item.off('change', doSave);
                    deferred.resolve(true);

                    function doSave() {
                        console.log('here');
                        elm.html("<span>"+rawScore+"</span>");
                        deferred.resolve(self.model.save().then(function(data) {
                            console.log(data);
                            return doRender();
                            deferred.resolve(true);
                        }));
                    }
                    
                }
                catch(e) {
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
            setTimeout(function() {
                try {
                    var students = self.model.students
                    console.log('logging student collection')
                    console.log(students);
                    var student = students.findWhere({id: sId})
                    console.log('logging current student', sId);
                    console.log(student);
                    var grades = student.get('grades');
                    console.log('logging grades collection')
                    console.log(grades)
                    var item = grades.findWhere({assignment: aId});
                    console.log('logging assignment grade')
                    console.log(item)
                    var value = item.get('rawScore') || "0"
                    console.log('logging value of raw score');
                    console.log(value);
                    console.log('resolving promise');
                    deferred.resolve(value);
                }
                catch(e) {
                    deferred.resolve("0");
                }
            }, 1);
            
            return deferred.promise;
        },
        
        onOpen: function() {
            console.log('course opened', this.model.cid);
            this.onShow();
        },
        
        onShow: function() {
            console.log('onShow  gradebook');
            var self = this;
            var ui = this.ui;
            var categoriesCollection = this.model.categories;
            var layout = adapter.calculateTableHeaderLayout();
            var headerHeight = layout.length;
            var studentCollection = this.model.students;
            var students = studentCollection.map(function(student) {
                //var user = student.get('user').find(_.identity);
                var last = student.get('last');
                var first = student.get('first');
                var name = last+', '+first;
                var id = student.id;
                return {
                    name: name,
                    id: id,
                    student: student
                }
            });

            var assignments = this.model.assignments;
            var header = createHeader();
            var body = createBody();
            var tableRowHeaders = createRowHeaders();

            ui.thead.empty();
            ui.shead.empty();
            ui.tbody.empty();
            ui.sbody.empty();
            
            ui.thead.get(0).appendChild(header);
            ui.tbody.get(0).appendChild(body);
            ui.shead.get(0).appendChild(createRowHeadersColHeader());
            ui.sbody.get(0).appendChild(createRowHeaders());

            function createHeader() {
                var docfrag = window.document.createDocumentFragment();
                _.each(layout, function(row) {
                    var tr = window.document.createElement("tr");
                    _.each(row, function(cell) {
                        var td = window.document.createElement("th");
                        
                        if (cell.style === "blank") {
                            td = window.document.createElement("td");
                        }
                        else {
                            td.appendChild(document.createTextNode(cell.name));
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
                var studentRows = _.map(students, function(student) {
                    var grades = [];
                    for(var i = 0; i < assignments.size(); ++i) {
                        
                        var grade = student.student.getGrade(assignments.at(i).id);
                        
                            
                        grades.push({
                            colspan: 1,
                            rowspan: 1,
                            style: "grade",
                            value: grade,
                            gradeEmpty: !_.isFinite(grade),
                            aId: assignments.at(i).id,
                            sId: student.student.id
                        });
                    }

                    return grades;
                });
                
                _.each(studentRows,function(row) {
                    var tr = window.document.createElement("tr");
                    _.each(row, function(cell) {
                        var td = window.document.createElement("td");
                        
                        if (cell.style == "grade") {
     
                            var text = document.createTextNode(cell.value);
                            if(cell.gradeEmpty) {
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
                    name:"_"
                }
                var tr = window.document.createElement("tr");
                var th = window.document.createElement("th");
                th.appendChild(document.createTextNode(row.name));
                th.setAttribute("class", row.style);
                th.setAttribute("colspan", row.colspan);
                th.setAttribute("rowspan", row.rowspan);
                tr.appendChild(th);
                docfrag.appendChild(tr);
                while(--headerHeight) {
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
                var arr = assignments.map(function(cid){
                    return window.regestery._byId[cid];
                });
                var studentRows = _.map(students, function(student) {
                    return studentCell = {
                        name: student.name || "",
                        rowspan: 1,
                        colspan: 1,
                        style: "studentRowHeader"
                    }
                })
                _.each(studentRows,function(row) {
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
                
        }
    });
    
    courseRadioChannel.reply('view:gradebook', function(course) {
        if (!course) {
            console.log('here')
            course = courseRadioChannel.request('current:course');
        }
        return new GradebookView({
            model: course
        });
    });
    
    
});