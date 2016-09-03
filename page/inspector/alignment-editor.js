"use strict";
Editor.polymerElement({
    properties: {
        value: {
            type: Object,
            value: {},
            notify: true
        }
    },

    ready: function () {
        this._isReady = true;
    },

    _is: function(t) {
        return !!t
    },
    _onTopChecked: function(t, e) {
        if(!this._isReady) {
            return;
        }
        if(e.value == true) {
            this.set("value.isAlignVerticalCenter", false)
            this.$.top_input.confirm();
        }
    },
    _onLeftChecked: function(t, e) {
        if(!this._isReady) {
            return;
        }
        if(e.value == true) {
            this.set("value.isAlignHorizontalCenter", false)
            this.$.left_input.confirm();
        }
    },
    _onRightChecked: function(t, e) {
        if(!this._isReady) {
            return;
        }
        if(e.value == true) {
            this.set("value.isAlignHorizontalCenter", false)
            this.$.right_input.confirm();
        }
    },
    _onBottomChecked: function(t, e) {
        if(!this._isReady) {
            return;
        }
        if(e.value == true) {
            this.set("value.isAlignVerticalCenter", false)
            this.$.bottom_input.confirm();
        }
    },
    _onHorizontalCenterChecked: function(t, e) {
        if(!this._isReady) {
            return;
        }
        if(e.value) {
            this.set("value.isAlignLeft", false);
            this.set("value.isAlignRight", false);
            this.$.horizontal_input.confirm();
        }
    },
    _onVerticalCenterChecked: function(t, e) {
        if(!this._isReady) {
            return;
        }
        if(e.value) {
            this.set("value.isAlignTop", false);
            this.set("value.isAlignBottom", false);
            this.$.vertical_input.confirm();
        }
    }
});