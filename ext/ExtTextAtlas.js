
let ExtTextAtlas = {};

ExtTextAtlas.name = "UITextAtlas";
ExtTextAtlas.icon = "res/control/Label.png";
ExtTextAtlas.tag = 2;
ExtTextAtlas.defRes = "res/default/AltasNum.png";
ExtTextAtlas.defStr = "453224679";

ExtTextAtlas.GenEmptyNode = function() {
    let node = new ccui.TextAtlas("453224679", ExtTextAtlas.defRes, 20, 27, "0");
    node._charMapFile = ExtTextAtlas.defRes;
    node._className = ExtTextAtlas.name;
    return node;
};

ExtTextAtlas.GenNodeByData = function(data, parent) {
    return this.GenEmptyNode();
};

ExtTextAtlas.ResetPropByData = function(control, data, parent) {
    let node = control._node;
    parent = parent || node.getParent();
    let old_data = cocosExportNodeData(node, {uuid:true});

    let fullpath = getFullPathForName(data.charMapFile);
    cc.textureCache.addImage(fullpath, function(atlas){
        let size = atlas.getContentSize();
        if(data.itemWidth > size.width || data.itemHeight > size.height) {
            data.itemWidth = size.width / 10;
            data.itemHeight = size.height;
        }
        let newNode = cocosGenNodeByData(data, parent);
        node.removeFromParent();
        parent.addChild(newNode);
        control._node = newNode;
    });
};

ExtTextAtlas.SetNodePropByData = function(node, data, parent) {
    ExtTextAtlas.ResetPropByData({_node:node}, data, parent);
};

ExtTextAtlas.ExportNodeData = function(node, data) {
    if(node._charMapFile) {
        node._string && (data["string"] = node._string);
        data["charMapFile"] = node._charMapFile;
        data["itemWidth"] = node._itemWidth || 0;
        data["itemHeight"] = node._itemHeight || 0;
        data["mapStartChar"] = node._mapStartChar || "0";
    }
};

ExtTextAtlas.SetPropChange = function(control, path, value) {
    let data = {};
    if(path == "string") {
        data.string = value
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
            value: this._node._string,
        };
    },

    get charMapFile() {
        return {
            path: "charMapFile",
            type: "fire-asset",
            name: "charMapFile",
            attrs: {
            },
            value: this._node._charMapFile,
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
    datas.push(new ExtTextAtlas.ExportData(node));
    return datas;
};

module.exports = ExtTextAtlas;

RegisterExtNodeControl(ExtTextAtlas.name, ExtTextAtlas);
