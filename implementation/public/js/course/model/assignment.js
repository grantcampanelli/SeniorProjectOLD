define(function (require) {
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('util/backbone-helper');
    var Hbs = require('handlebars');
    var Mn = require('backbone.marionette');
    var Q = require('q');
    var Radio = require('backbone.radio');
    var courseChannel = Radio.channel('course')
    
    var Assignment = Backbone.Model.extend({
        idAttribute: '_id',
        
    });
    var AssignmentCollection = Backbone.Collection.extend({
        idAttribute: '_id',
        model: Assignment,
        
        initialize: function(options){
            this.url = '/api/assignments?course='+options.path.toString() +'';
        }
    });
    
    courseChannel.reply('assignments', function(course) {
        var url;
        if (!course) {
            url = courseChannel.request('current:course').get('colloquialUrl');
        }
        else {
            url = course.get('colloquialUrl');
        }
        return new AssignmentCollection({path: url})
    })
});