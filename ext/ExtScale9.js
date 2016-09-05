
let ExtScale9 = {};

ExtScale9.name = "UIScale9";
ExtScale9.icon = "res/control/Scale9.png";
ExtScale9.tag = 4;
ExtScale9.defRes = "res/default/Scale9.png";

ExtScale9.GenEmptyNode = function() {
    node = new cc.Scale9Sprite(ExtScale9.defRes);
    node._spriteFrame = ExtScale9.defRes;
    node._className = ExtScale9.name;
    return node;
};

ExtScale9.GenNodeByData = function(data, parent) {
    return this.GenEmptyNode();
};

ExtScale9.SetScale9Sprite = function(node, spriteFrame) {
    if(spriteFrame && getFullPathForName(spriteFrame)) {
        let fullpath = getFullPathForName(spriteFrame);
        cc.textureCache.addImage(fullpath, function(){
            let size = node.getContentSize();
            let anchor = node.getAnchorPoint();
            node.initWithFile(fullpath);
            node.setAnchorPoint(anchor);
            node._spriteFrame = spriteFrame;

            if(!cc.sizeEqualToSize(size, cc.size(0, 0))) {
                node.setPreferredSize(size);
            }

            data.insetLeft && (node.insetLeft = data.insetLeft);
            data.insetTop && (node.insetTop = data.insetTop);
            data.insetRight && (node.insetRight = data.insetRight);
            data.insetBottom && (node.insetBottom = data.insetBottom);
        });
    }
}

ExtScale9.SetNodePropByData = function(node, data, parent) {
    ExtScale9.SetScale9Sprite(node, data.spriteFrame);
};

ExtScale9.ExportNodeData = function(node, data) {
    node._spriteFrame && (data["spriteFrame"] = node._spriteFrame);

    node.insetLeft && (data.insetLeft = node.insetLeft);
    node.insetTop && (data.insetTop = node.insetTop);
    node.insetRight && (data.insetRight = node.insetRight);
    node.insetBottom && (data.insetBottom = node.insetBottom);
};

ExtScale9.SetPropChange = function(control, path, value) {
    if(path == "spriteFrame") {
        ExtScale9.SetScale9Sprite(control._node, value);
    } else {
        control._node[path] = value;
    }
};

function Scale9Data(node) {
    this._node = node;
}

Scale9Data.prototype = {
    __displayName__: "Image",
    __type__: "ccui.ImageView",

    get spriteFrame() {
        return {
            path: "spriteFrame",
            type: "fire-asset",
            name: "spriteFrame",
            attrs: {
            },
            value: this._node._spriteFrame,
        };
    },

    get __props__() {
        return [
            this.spriteFrame,
        ];
    }
}

ExtScale9.Scale9Data = Scale9Data;

ExtScale9.PropComps = function(node) {
    let datas = [ new WidgetData(node) ];
    datas.push(new Scale9Data(node));
    return datas;
};

module.exports = ExtScale9;

RegisterExtNodeControl(ExtScale9.name, ExtScale9);
