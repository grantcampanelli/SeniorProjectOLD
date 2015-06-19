// /**
//  * A Marionette region for pop-ups. We can call the show method of this region
//  * to display a pop-up on screen.
//  */
// define(function (require) {
//     var $ = require('jquery');
//     var _ = require('underscore');
//     var Backbone = require('util/backbone-helper');
//     var Mn = Backbone.Marionette;
//     require('jquery.magnific-popup');
    

//     return Mn.Region.extend({
//         el: "#popup",
//         allowMissingEl: false,
//         isVisible: false,
         
//         initialize: function () {
//             var self = this;
//             this.defaultPopupArgs = {
//                 items: {
//                     src: self.el
//                 },
//                 type: 'inline',
//                 callbacks: {
//                     open: function() {
//                         self.isVisible = true;
//                     },
//                     close: function() {
//                         self.isVisible = false;
//                     }
//                 }
//             }
//             this.classAttr = this.$el.attr("class").concat(" ");
//             $(window).on("resize", this.onResize.bind(this));
//         },
        
//         positionPopup: function() {
//             this.$el.position({
//                 of: window
//             });
//         },
        
//         onShow: function(view) {
//             var popupArg = _.extend({}, this.defaultPopupArgs, view.popup);
//             this.$el.attr("class", this.classAttr + view.className);
//             $.magnificPopup.open(popupArg);
//             this.positionPopup();
//         },
        
//         onResize: function() {
//             if (this.isVisible) {
//                 this.positionPopup();
//             }
//         },
        
//         onBeforeEmpty: function() {
//             $.magnificPopup.close();
//         },
        
//         close: function() {
//             this.empty();
//         }
//     });
// });