"use strict";
Editor.polymerElement({
    behaviors: [Editor.UI.PolymerFocusable, Polymer.IronButtonState],
    listeners: {
        focus: "_onFocus",
        blur: "_onBlur",
        click: "_onEndEditing"
    },
    properties: {
        nofocus: {
            type: Boolean,
            value: false,
            notify: true,
            reflectToAttribute: true
        }
    },
    ready: function() {
        this.noNavigate = this.nofocus, this._initFocusable(this)
    },
    _onEndEditing: function() {
        var t = this;
        this.async(function() {
            t.fire("end-editing")
        }, 1)
    }
});