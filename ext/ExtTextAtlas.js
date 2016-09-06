
let ExtTextAtlas = {};

ExtTextAtlas.name = "UITextAtlas";
ExtTextAtlas.icon = "res/control/Label.png";
ExtTextAtlas.tag = 2;
ExtTextAtlas.defRes = "res/default/AltasNum.png";
ExtTextAtlas.defStr = "453224679";

ExtTextAtlas.GenEmptyNode = function() {
    let node = new ccui.TextAtlas("453224679", ExtTextAtlas.defRes, 20, 27, "0");
    node._className = ExtTextAtlas.name;
    return node;
};

ExtTextAtlas.GenNodeByData = function(data, parent) {
    let node = new ccui.TextAtlas(data.string, data.charMapFile, data.itemWidth, data.itemHeight, data.mapStartChar);
    node._className = ExtTextAtlas.name;
    return node;
};

ExtTextAtlas.ResetPropByData = function(control, data, parent) {
    if(data.ignoreSetProp) {
        return;
    }
    let node = control._node;
    parent = parent || node.getParent();

    let fullpath = getFullPathForName(data.charMapFile);
    cc.textureCache.addImage(fullpath, function(atlas){
        let size = node.getContentSize();
        if(atlas) {
            size = cc.size(atlas.width, atlas.height);
        }
        if(data.itemWidth > size.width || data.itemHeight > size.height) {
            data.itemWidth = size.width / 10;
            data.itemHeight = size.height;
        }
        data.ignoreSetProp = true;
        let newNode = cocosGenNodeByData(data, parent);
        node.removeFromParent();
        node.ignoreAddToParent = true;
        parent.addChild(newNode);
        control._node = newNode;
    });
};

ExtTextAtlas.SetNodePropByData = function(node, data, parent) {
    ExtTextAtlas.ResetPropByData({_node:node}, data, parent);
};

ExtTextAtlas.ExportNodeData = function(node, data) {
    if(node._charMapFileName) {
        node._stringValue && (data["string"] = node._stringValue);
        data["charMapFile"] = node._charMapFileName;
        data["itemWidth"] = node._itemWidth || 0;
        data["itemHeight"] = node._itemHeight || 0;
        data["mapStartChar"] = node._mapStartChar || "0";
    }
};

ExtTextAtlas.SetPropChange = function(control, path, value) {
    let data = cocosExportNodeData(control._node, {uuid: true});
    if(path == "string") {
        data.string = value;
    } else if(path == "charMapFile") {
        data.charMapFile = value;
    } else if(path == "itemWidth") {
        data.itemWidth = value;
    } else if(path == "itemHeight") {
        data.itemHeight = value;
    } else if(path == "mapStartChar") {
        data.mapStartChar = value;
    }
    ExtTextAtlas.ResetPropByData(control, data);
};

ExtTextAtlas.ExportData = function(node) {
    this._node = node;
}

ExtTextAtlas.ExportData.prototype = {
    __displayName__: "TextAtlas",
    __type__: "ccui.TextAtlas",

    get string() {
        return {
            path: "string",
            type: "string",
            name: "string",
            attrs: {
            },
            value: this._node._stringValue,
        };
    },

    get charMapFile() {
        return {
            path: "charMapFile",
            type: "fire-asset",
            name: "charMapFile",
            attrs: {
            },
            value: this._node._charMapFileName,
        };
    },

    get itemWidth() {
        return {
            path: "itemWidth",
            type: "number",
            name: "itemWidth",
            attrs: {
            },
            value: this._node._itemWidth,
        };
    },


    get itemHeight() {
        return {
            path: "itemHeight",
            type: "number",
            name: "itemHeight",
            attrs: {
            },
            value: this._node._itemHeight,
        };
    },


    get mapStartChar() {
        return {
            path: "mapStartChar",
            type: "string",
            name: "mapStartChar",
            attrs: {
            },
            value: this._node._mapStartChar,
        };
    },


    get __props__() {
        return [
            this.string,
            this.charMapFile,
            this.itemWidth,
            this.itemHeight,
            this.mapStartChar,
        ];
    }
}

ExtTextAtlas.PropComps = function(node) {
    let datas = [ new WidgetData(node) ];
    datas.push(new TouchData(node));
    datas.push(new ExtTextAtlas.ExportData(node));
    return datas;
};

module.exports = ExtTextAtlas;

RegisterExtNodeControl(ExtTextAtlas.name, ExtTextAtlas);
