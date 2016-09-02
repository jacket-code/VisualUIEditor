"use strict";
Editor.polymerElement({
    properties: {
        value: {
            type: Object,
            value: function() {
                return {
                    width: 0,
                    height: 0,
                    isWidthPer:false,
                    isHeightPer:false
                }
            },
            notify: true
        },
        disabled: {
            type: Boolean,
            value: false,
            reflectToAttribute: true
        },
        readonly: {
            type: Boolean,
            value: false,
            reflectToAttribute: true
        }
    }
});