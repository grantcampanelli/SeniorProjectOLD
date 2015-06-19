define(['app/app', 'text!templates/histogram.hbs', 'chart'], function(App, template, chart) {
    var GradeSchema = App.Backbone.Model;//.extend({
        //defaults: {
        //    aMin: 90,
        //    bMin: 80,
        //    cMin: 70,
        //    dMin: 60
        //}
    //});
    var GradeArrays = new App.Backbone.Collection([[],[]])
    //})
    var GradeSchemaView = App.Mn.ItemView.extend({
        model: GradeSchema,
        template : App.Handlebars.compile(template),
        ui: {
            "aMin" : '#aMinInput',
            "bMin" : '#bMinInput',
            "cMin" : '#cMinInput',
            "dMin" : '#dMinInput',
            "aOut" : '#aMinOutput',
            "bOut" : '#bMinOutput',
            "cOut" : '#cMinOutput',
            "dOut" : '#dMinOutput'

        },
        modelEvents: {
            "change" : "onShow"
        },
        /**
         * Get the grade schema values from the model and set the
         * corresponding ui elements accordingly.
         *
         * @author Grant Campanelli
         */
        onShow: function() {
            this.ui.aMin.val(this.model.get('aMin'));
            this.ui.bMin.val(this.model.get('bMin'));
            this.ui.cMin.val(this.model.get('cMin'));
            this.ui.dMin.val(this.model.get('dMin'));
            //this.ui.aOut.html(this.model.get('aMin'));
            //this.ui.bOut.html(this.model.get('bMin'));
            //this.ui.cOut.html(this.model.get('cMin'));
            //this.ui.dOut.html(this.model.get('dMin'));
        },
        events: {
            "change @ui.aMin" : "updateAMin",
            "change @ui.bMin" : "updateBMin",
            "change @ui.cMin" : "updateCMin",
            "change @ui.dMin" : "updateDMin"
        },
        /**
         * Update the model after a change has been made.
         *
         * @param modelString The model value to be changed.
         * @param selector The ui element to be changed.
         * @param domEvent The type of DOM event that caused the change.
         * @author Grant Campanelli
         */
        updateModel : function(modelString, selector, domEvent) {
            var arg = {};
            arg[modelString] = this.ui[selector];
            this.model.set(arg);
        },
        /**
         * Initialize the four different update model functions, which
         * correspond to the minimum values in the grade schema.
         *
         * @author Grant Campanelli
         */
        initalize: function() {
            this.updateAMin =  App._.partial(this.updateModel, "aMin");
            this.updateBMin =  App._.partial(this.updateModel, "bMin");
            this.updateCMin =  App._.partial(this.updateModel, "cMin");
            this.updateDMin =  App._.partial(this.updateModel, "dMin");

        }
    });




    App.Router.route(("charts"), "histogram", function() {
        //var layout = App.show(new App.StandardLayoutView());

        App.show(new GradeSchemaView({
            model : new GradeSchema(
                {
                    aMin: 90,
                    bMin: 80,
                    cMin: 70,
                    dMin: 60
                }
            )
        }));
        //layout.getRegion('main').show(new App.Marionette.ItemView({
        //    template: template,
        //    updatePieChart: function() {
        //
        //    }
        //}))
    })
});