/** @author Michael Murphy */
define(function (require) {
   var $ = require('jquery');
   var _ = require('underscore');
   var Backbone = require('util/backbone-helper');
   var Q = require('q');
   
   return Backbone.Model.extend({
      SESSION_STORE_KEY: 'session',
      idAttribute: "_id",
      defaults: {
         logout: true,
         login: false,
         message: '',
         user: null,
         username: '',
         password: ''
      },
      
      initialize: function() {
         this.loginSuccessCallbackFunc = this.loginAjaxSuccess.bind(this);
         this.logoutSuccessCallbackFunc = this.logoutAjaxSuccess.bind(this);
         this.fetch();
      },
      
      loginAjaxSuccess: function(res, status, jqXHR) {
         if (res.login) {
            delete res.user.password;
            this.set(res);
            this.afterLogin();
         }
         else {
            this.fetch();
            this.set(res);
         }
      },
      
      logoutAjaxSuccess: function(res, status, jqXHR) {
         if (res.logout) {
            this.afterLogout();
         }
      },
      
      createPayload: function() {
         var self = this;
         return {
            username: self.get('username'),
            password: self.get('password')
         };
      },
      
      login: function() {
         var payload = this.createPayload();
         var successCallbackFunc = this.loginSuccessCallbackFunc;
         
         this.set({password:'', message: ''});
         
         return Q($.ajax({
            url: '/api/login',
            data: payload,
            method: 'POST',
            headers: {
               Accept : "application/json; q=1"
            },
            success: successCallbackFunc
         }));
      },
      
      logout: function(credentialsArg) {
         var credentials = credentialsArg || {};
         var successCallbackFunc = this.logoutSuccessCallbackFunc;
         
         this.set(credentials);
         
         return Q($.ajax({
            url: '/api/logout',
            method: 'GET',
            success: successCallbackFunc
         }));
      },
      
      afterLogin: function () {
         this.save();
         this.trigger('login', this.get('user'));
      },
      
      afterLogout: function () {
         this.reset();
         this.trigger('logout');
      },
      
      isAuthenticated: function() {
         return this.get('login');
      },
      
      reset: function() {
         sessionStorage.removeItem(this.SESSION_STORE_KEY);
         this.clear();
         this.set(this.defaults);
      },
      
      save: function(attr, ops) {
         var data = _.clone(this.attributes);
         if (_.isObject(attr)) {
            _.extend(data, attr);
            if (ops && !ops.wait) {
               this.set(attr);
            }
         }
         data = JSON.stringify(data);
         if (ops && ops.wait) {
            sessionStorage.setItem(this.SESSION_STORE_KEY, data);
            this.set(attr);
         }
         else {
            sessionStorage.setItem(this.SESSION_STORE_KEY, data);
         }
      },
      
      fetch: function() {
         this.set(JSON.parse(sessionStorage.getItem(this.SESSION_STORE_KEY)));
      }
   });
});
