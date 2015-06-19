define(function (require) {
    var $ = require('jquery');
    var _ = require('underscore');
    var Q = require('q');
    var Backbone = require('util/backbone-helper');
    var Mn = Backbone.Marionette;
    
    /**
     * Application code should extend this to create a pop up view. This is a
     * marionette view.
     */
    return Mn.ItemView.extend({
        popup: {
            enableEscapeKey: true,
            focus: "",
            closeOnContentClick: false,
            closeOnBgClick: true,
            closeBtnInside: true,
            showCloseBtn: true,
            modal: false,
            alignTop: false,
            fixedContentPos: "auto",
            index: null,
            fixedBgPos: "auto",
            overflowY: "auto",
            removalDelay: 0
        }
    });
});