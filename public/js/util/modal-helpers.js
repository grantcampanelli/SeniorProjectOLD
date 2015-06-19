define(function(require) {
    var Radio = require('backbone.radio');
    var userChannel = Radio.channel('user');
    var pageChannel = Radio.channel('page');

    return function ModalHelpers() {
        this.ensureLoginThenShowModal = function(view) {
            var self = this
            userChannel.request('user').then(function() {
                self.showModal(view);
            });
        }

        this.showModal = function(view) {
            pageChannel.request('modalRegion').show(view);
        }
    }
});