define(function (require) {
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('util/backbone-helper');
    var Hbs = require('handlebars');
    var Mn = require('backbone.marionette');
    var Radio = require('backbone.radio');
    var courseChannel = Radio.channel('course');
    
    var StudentRecord = Backbone.Model.extend({
        idAttribute: '_id',
        urlRoot: '/api/students',
        
        defaults: {
            grades: ''
        },
        
        initialize: function(options) {
            if (!this.isNew())
                this.url = this.urlRoot + '/' + this.get('_id');
            else
                this.url = this.urlRoot;
        },
        
        getGrade: function(aId) {
            var map = this.getGradeMap();
            var value = map[aId];
            if (_.isFinite(Number(value)))
                return Number(value);
            else
                return 0;
        },
        
        setGrade: function(aId, rawScore) {
            var map = this.getGradeMap();
            map[aId] = rawScore;
            var str = '';
            
            for(aId in map) {
                str = str + ',' + aId +':'+ map[aId];
            }
            if (str.charAt(0) == ',')
                str = str.substring(1);
            console.log('setting grades: ' + str)
            window.s = this;
            var self = this;
            this.save({grades: str},{silent: true}).then(function(){
                return self.fetch();
            });
        },
        
        getGradeMap: function() {
            var map = {};
            var grades = this.get('grades') || '';
            var gradeArray = grades.split(',');
            gradeArray.forEach(function(gradeData) {
                var parts = gradeData.split(':');
                if (parts.length > 1){
                    map[parts[0]] = parts[1];
                }
            });
            return map;
        },
        
    })
    
    var StudentCollection = Backbone.Collection.extend({
        model: StudentRecord,
        comparator: 'last',
        initialize: function(options){
            this.url = '/api/students?course='+options.path.toString() +'';
        }
    });
    
    courseChannel.reply('students', function(course) {
        var url;
        if (!course) {
            url = courseChannel.request('current:course').get('colloquialUrl');
        }
        else {
            url = course.get('colloquialUrl');
        }
        return new StudentCollection({path: url});
    })
    
    return StudentRecord;
})