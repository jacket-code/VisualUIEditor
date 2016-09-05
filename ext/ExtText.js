
let ExtText = {};

ExtText.name = "UIText";
ExtText.icon = "res/control/Label.png";
ExtText.tag = 2;

ExtText.GenEmptyNode = function() {
    let node = new ccui.Text("VisualUI", "Arial", 24);
    node._className = "UIText";
    return node;
};

ExtText.GenNodeByData = function(data, parent) {
    return this.GenEmptyNode();
};

ExtText.SetNodePropByData = function(node, data, parent) {
    data.string && (node.string = data.string);
    data.textAlign && (node.textAlign = data.textAlign);
    data.verticalAlign && (node.verticalAlign = data.verticalAlign);
    data.fontSize && (node.fontSize = data.fontSize);
    data.fontName && (node.fontName = data.fontName);
    if(covertToColor(data.outlineColor)) {
        node.outlineColor = covertToColor(data.outlineColor);
        node.outlineSize = data.outlineSize || 0;
        node.enableOutline(node.outlineColor, node.outlineSize);
    }
    data.boundingWidth && (node.boundingWidth = data.boundingWidth);
    data.boundingHeight && (node.boundingHeight = data.boundingHeight);
};

ExtText.ExportNodeData = function(node, data) {
    data["string"] = node.string;
    node.textAlign != cc.TEXT_ALIGNMENT_LEFT && (data["textAlign"] = node.textAlign);
    node.verticalAlign != cc.VERTICAL_TEXT_ALIGNMENT_TOP && (data["verticalAlign"] = node.verticalAlign);
    data["fontSize"] = node.fontSize;
    node.fontName.length > 0 && (data["fontName"] = node.fontName);
    if(node.outlineColor && !cc.colorEqual(node.outlineColor, cc.color.WHITE)) {
        data["outlineColor"] = [node.outlineColor.r, node.outlineColor.g, node.outlineColor.b, node.outlineColor.a];
    }
    node.outlineSize > 0 && (data["outlineSize"] = node.outlineSize);
    node.boundingWidth > 0 && (data["boundingWidth"] = node.boundingWidth);
    node.boundingHeight > 0 && (data["boundingHeight"] = node.boundingHeight);
};

ExtText.SetPropChange = function(node, path, value) {
    if(path == "string") {
       node.string = value;
    } else if(path == "textAlign") {
        node.textAlign = parseFloat(value);
    } else if(path == "verticalAlign") {
        node.verticalAlign = parseFloat(value);
    } else if(path == "fontSize") {
        node.fontSize = value;
    } else if(path == "fontName") {
        node.fontName = fontName;
    } else if(path == "outlineColor") {
        node.outlineColor = new cc.Color(value.r, value.g, value.b, value.a);
        node.enableShadow(node.outlineColor, node.outlineSize || 0)
    } else if(path == "outlineSize") {
        node.outlineSize = value;
        if(node.outlineSize == 0) {
            node.disableEffect();
            node.outlineColor = null;
        } else {
            node.outlineColor = node.outlineColor || cc.color.WHITE;
            node.enableShadow(node.outlineColor, node.outlineSize || 0);
        }
    } else if(path == "boundingWidth") {
        node.boundingWidth = value;
    } else if(path == "boundingHeight") {
        node.boundingHeight = value;
    } else {
        return;
    }
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

    get outlineColor() {
        let color = this._node.outlineColor || cc.color.WHITE
        return {
            path: "outlineColor",
            type: "color",
            name: "outlineColor",
            attrs: {
            },
            value: {
                r: color.r,
                g: color.g,
                b: color.b,
                a: color.a
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
            this.outlineColor,
            this.boundingWidth,
            this.boundingHeight,
        ];
    }
}

ExtText.ExportData = ExportData;

ExtText.PropComps = function(node) {
    let datas = [ new WidgetData(node) ];
    datas.push(new ExportData(node));
    return datas;
};

module.exports = ExtText;

RegisterExtNodeControl(ExtText.name, ExtText);
