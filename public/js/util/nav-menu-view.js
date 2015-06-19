define(function (require) {
    var Mn = require('backbone.marionette');
    
    return NavMenuView = Mn.CollectionView.extend({
        tagName: 'ul',
        className: 'nav navbar-nav grader-navbar-left',
        getChildView: function(item) {
            return item.get('viewClass');
        }
    });
});