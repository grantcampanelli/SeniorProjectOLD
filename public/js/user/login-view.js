/**  @author Michael Murphy */
define(function (require) {
    var $ = require('jquery');
    var _ = require('underscore');
    var Backbone = require('util/backbone-helper');
    var Hbs = require('handlebars');
    var Mn = require('backbone.marionette');
    var PopupView = require('util/popup-view');
    var Q = require('q');
    var Radio = require('backbone.radio');
    
    var loginTemplate = require('text!templates/login.hbs');
    var alertTemplate = require('text!ctemplates/alert-block.hbs');
    
    var userChannel = Radio.channel('user');
    
    return Mn.ItemView.extend({
      tagName: 'div',
      className: 'login modal-dialog  modal-sm',
      template: Hbs.compile(loginTemplate),
      alertTemplate: Hbs.compile(alertTemplate),
      
      ui: {
         username: "input.username",
         password: "input.password",
         error: "div.error",
         button: ".submit"
      },
      
      events: {
         "click .submit": "doLogin",
         "change @ui.username": "updateUser",
         "change @ui.password": "updatePass"
      },
      
      modelEvents: {
         "change": "onShow"
      },
      
      popup: {
         modal: true,
         focus: "input.username"
      },
      
      initialize: function(options) {
         if (!this.model) {
            this.model = userChannel.request('session');
         }
      },
      
      doLogin: function(domEvent) {
         this.ui.button.button('loading')
         domEvent.preventDefault();
         this.model.login();
          this.removeModal();

      },

        removeModal : function() {
            this.destroy();
            $( 'body' ).removeClass( "modal-open" );
            $('.modal-backdrop').remove()
        },
      updateUser: function() {
         var input = this.ui.username.val();
         this.model.set({"username": input});
      },
      
      updatePass: function() {
         var input = this.ui.password.val();
         this.model.set({"password": input});
      },
      
      onShow: function() {
         this.ui.username.val(this.model.get('username'));
         this.ui.password.val(this.model.get('password'));
         if (this.model.get('message')) {
            this.ui.error.html(this.alertTemplate(this.model.attributes));
         }
         this.ui.button.button('reset');
         this.focus();
      },
      
      onShownModal: function() {
         this.focus();
      },
      
      focus: function() {
         if (!this.ui.username.val()) {
            this.ui.username.focus();
         }
         else {
            this.ui.password.focus();
         }
      }
   });
   
   
});

