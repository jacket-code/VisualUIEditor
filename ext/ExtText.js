
let ExtText = {};

ExtText.name = "UIText";
ExtText.icon = "res/control/Label.png";
ExtText.tag = 2;

ExtText.GenEmptyNode = function() {
    return new ccui.Text();
};

ExtText.GenNodeByData = function(data, parent) {

};

ExtText.SetNodePropByData = function(node, data, parent) {

};

ExtText.ExportNodeData = function(node) {

};

function ExportData(node) {
    this._node = node;
}

ExportData.prototype = {
    __displayName__: "Text",
    __type__: "ccui.Text",

    get string() {
        return {
            path: "string",
            type: "text",
            name: "String",
            attrs: {
            },
            value: this._node.string,
        };
    },

    get fontName() {
        return {
            path: "fontName",
            type: "string",
            name: "fontName",
            attrs: {
            },
            value: this._node.fontName,
        };
    },

    get fontSize() {
        return {
            path: "fontSize",
            type: "number",
            name: "fontSize",
            attrs: {
                expand: true,
                step: 1,
                precision: 0,
                min: 0,
                max: 72,
            },
            value: this._node.fontSize,
        };
    },

    get horizontalAlign() {
        return {
            path: "textAlign",
            type: "select",
            name: "HorAlign",
            attrs: {
                selects: {
                    0: "LEFT",
                    1: "CENTER",
                    2: "RIGHT",
                }
            },
            value: this._node.textAlign,
        };
    },

    get verticalAlign() {
        return {
            path: "verticalAlign",
            type: "select",
            name: "VerAlign",
            attrs: {
                selects: {
                    0: "TOP",
                    1: "CENTER",
                    2: "BOTTOM",
                }
            },
            value: this._node.verticalAlign,
        };
    },

    get outlineSize() {
        return {
            path: "outlineSize",
            type: "number",
            name: "outlineSize",
            attrs: {
            },
            value: this._node.outlineSize,
        };
    },

    get strokeStyle() {
        return {
            path: "strokeStyle",
            type: "color",
            name: "StrokeStyle",
            attrs: {
            },
            value: {
                r: this._node.strokeStyle.r,
                g: this._node.strokeStyle.g,
                b: this._node.strokeStyle.b,
                a: this._node.strokeStyle.a
            }
        };
    },

    get boundingWidth() {
        return {
            path: "boundingWidth",
            type: "number",
            name: "boundingWidth",
            attrs: {},
            value: this._node.boundingWidth,
        };
    },

    get boundingHeight() {
        return {
            path: "boundingHeight",
            type: "number",
            name: "boundingHeight",
            attrs: {},
            value: this._node.boundingHeight,
        };
    },

    get __props__() {
        return [
            this.string,
            this.fontName,
            this.fontSize,
            this.horizontalAlign,
            this.verticalAlign,
            this.outlineSize,
            this.strokeStyle,
            this.boundingWidth,
            this.boundingHeight,
        ];
    }
}

ExtText.ExportData = ExportData;

ExtText.PropComps = function() {
    let node = [ new WidgetData(this._node) ];
    node.push(new ExportData());
    return node;
};

module.exports = ExtText;

RegisterExtNodeControl(ExtText.name, ExtText);
