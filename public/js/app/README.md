#Creating Pages

Place all your code in a [requirejs](http://requirejs.org/) module by calling
[`define`](http://requirejs.org/docs/api.html#defdep).

```javascript
define(['app/app', 'text!templates/example.hbs'], function(App, template) {

});
```

The first argument `['app/app', 'text!templates/example.hbs']` lists the modules
that your code depends on. The first one, `'app/app'`, includes libraries like
jQuery and Backbone. The second argument is the function that you write all your
code in. The function gets called with the dependencies listed in the first
argument.
 
Define a route for your page:

```javascript
define(['app/app', 'text!templates/example.hbs'], function(App, template) {
   App.Router.route("(/)", "home", function() {
   
   })
});
```
 
`App.Router` is an instance of [`Marionette.AppRouter`](http://marionettejs.com/docs/v2.4.1/marionette.approuter.html)
this object also inherits from [`Backbone.Router`](http://backbonejs.org/#Router)

The [`route`](http://backbonejs.org/#Router-route) method takes a path string,
a name string, and a function that builds the page. This example shows the code
for a simple home page.

```javascript
define(['app/app', 'app/top-menu', 'text!templates/home.hbs'], function(App, TopNavView, homeTemplate) {
   App.Router.route("(/)", "home", function() {
      var layout = App.show(new App.StandardLayoutView());
      var mainView = new App.Marionette.ItemView({
         template: App.Handlebars.compile(homeTemplate)
      });
      layout.getRegion('main').show(mainView);
      layout.getRegion('header').show(new TopNavView);
   });
});
```

The home page is built using an instance of `App.StandardLayoutView`. This
extends [Marionette.LayoutView](http://marionettejs.com/docs/v2.4.1/marionette.layoutview.html)
and provides different regions where
[`Marionette.View`](http://marionettejs.com/docs/v2.4.1/marionette.view.html)
objects may be shown. Note: [`Marionette.ItemView`](http://marionettejs.com/docs/v2.4.1/marionette.itemview.html)
extends `Marionette.View` extends [`Backbone.View`](http://backbonejs.org/#View)

Finally, add your script as a dependency to `main.js`:
```javascript
// Start the main app logic.
requirejs(['app/app', 'app/login', 'app/home', 'domReady!'], function(app) {
   app.start({});
});
```

This causes your module to load when you navigate to your page.