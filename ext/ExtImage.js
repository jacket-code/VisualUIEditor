
let ExtImage = {};

ExtImage.name = "UIImage";
ExtImage.icon = "res/control/Sprite.png";
ExtImage.tag = 3;

ExtImage.GenEmptyNode = function() {
    let defRes = "res/default/Sprite.png";
    let node = new ccui.ImageView(defRes);
    node._spriteFrame = defRes;
    node._className = ExtImage.name;
    return node;
};

ExtImage.GenNodeByData = function(data, parent) {
    return this.GenEmptyNode();
};

ExtImage.SetNodePropByData = function(node, data, parent) {
    if(data.spriteFrame && getFullPathForName(data.spriteFrame)) {
        let fullpath = getFullPathForName(data.spriteFrame);
        cc.textureCache.addImage(fullpath, function(){
            let anchor = node.getAnchorPoint();
            node.loadTexture(fullpath);
            node.setAnchorPoint(anchor);
            node._spriteFrame = data.spriteFrame;
        })
    }
};

ExtImage.ExportNodeData = function(node, data) {
    node._spriteFrame && (data["spriteFrame"] = node._spriteFrame);
};

ExtImage.SetPropChange = function(node, path, value) {
    if(path == "spriteFrame") {
        SetSpriteFrame(node, path, value, "res/default/Sprite.png", node.loadTexture);
    }
};

function ImageData(node) {
    this._node = node;
}

ImageData.prototype = {
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

ExtImage.ImageData = ImageData;

ExtImage.PropComps = function(node) {
    let datas = [ new WidgetData(node) ];
    datas.push(new ImageData(node));
    return datas;
};

module.exports = ExtImage;

RegisterExtNodeControl(ExtImage.name, ExtImage);
