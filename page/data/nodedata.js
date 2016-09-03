
function NodeData(node) {
    this._node = node;
}

function SpriteData(node) {
    this._node = node;
}

function LabelData(node) {
    this._node = node;
}

function WidgetData(node) {
    this._node = node;
}

function SliderData(node) {
    this._node = node;
}

function InputData(node) {
    this._node = node;
}

function Scale9Data(node) {
    this._node = node;
}

function ButtonData(node) {
    this._node = node;
}

function CheckBoxData(node) {
    this._node = node;
}

function LayoutData(node) {
    this._node = node;
}

function TouchData(node) {
    this._node = node;
}

function LabelAtlasData(node) {
    this._node = node;
}

function FixNodeHor(node, step) {
    node.x += step;
    if(node.left) {
        node.left += step; 
    }
    if(node.right) {
        node.right -= step;
    } 
}

function FixNodeVer(node, step) {
    node.y += step;
    if(node.top) {
        node.top -= step; 
    }
    if(node.bottom) {
        node.right += step;
    }
}

function NodePropChange(node, prop, newValue) {
    if(prop == "x") {
        let step = newValue - node[prop];
        FixNodeHor(node, step);
    } else if(prop == "y") {
        let step = newValue - node[prop];
        FixNodeVer(node, step);
    } else if(prop == "touchEnabled") {
        node._touchEnabled = newValue;
    } else {
        node[prop] = newValue;
    }

    
}

function AddPropChange(node, uuid, newValue) {
    //delete
    if(!newValue || Object.keys(newValue).length == 0) {
        let childNode = cocosGetItemByUUID(node, uuid);
        if(childNode) {
            childNode.removeFromParent(true);
            Editor.Ipc.sendToAll("ui:scene_items_change", {});
        }
    } else {
        let subNode = cocosGenNodeByData(newValue, node);
        if(subNode) {
            node.addChild(subNode);
            Editor.Ipc.sendToAll("ui:scene_item_add", {uuid:uuid});
        }
    }
}

function setSizeChange(node, prop, newValue) {
    if(prop == "width") {
        let setFn = node.setPreferredSize ? node.setPreferredSize : node.setContentSize;
        let perfer = node.setPreferredSize;
        setFn.call(node, cc.size(newValue, node.height));    
    } else {
        let setFn = node.setPreferredSize ? node.setPreferredSize : node.setContentSize;
        setFn.call(node, cc.size(node.width, newValue));    
    }
}

NodeData.prototype = {
    get uuid() {
        return this._node.uuid;
    },
    get position() {
        let t = typeof this._node.x;
        return {
            path: "position",
            type: "vec2",
            name: "Position",
            attrs: {
                step: 5,
                precision: 0,
                min: -1000,
                max: 10000,
            },
            value: {
                x: this._node.getPositionX(),
                y: this._node.getPositionY(),
            }
        }
    },

    get rotation() {
        return {
            path: "rotation",
            type: "Number",
            name: "Rotation",
            attrs: {
                expand: true,
                step: 5,
                precision: 0,
                min: 0,
                max: 360,
            },
            value: this._node.getRotation()
        }
    },

    get scale() {
        return {
            path: "scale",
            type: "vec2",
            name: "Scale",
            attrs: {
                step: 0.2,
                precision: 2,
                min: -100,
                max: 100,
            },
            value: {
                x: this._node.getScaleX(),
                y: this._node.getScaleY(),
            }
        }
    },

    get anchor() {
        return {
            path: "anchor",
            type: "vec2",
            name: "Anchor",
            attrs: {
                step: 0.1,
                precision: 2,
                min: 0,
                max: 1,
            },
            value: {
                x: this._node.anchorX,
                y: this._node.anchorY,
            }
        }
    },

    get size() {
        let parent = this._node.getParent();
        let heightPer = 100;
        let widthPer = 100;
        if(parent && parent.width) {
            widthPer = this._node.width / parent.width * 100;
        }
        if(parent && parent.height) {
            heightPer = this._node.height / parent.height * 100;
        }
        return {
            path: "size",
            type: "size",
            name: "Size",
            attrs: {
                hasParent : parent != null,
                min: 0,
                step: 5,
                precision: 0,
            },
            value: {
                isWidthPer: this._node.isWidthPer,
                width: this._node.width,
                widthPer: widthPer,
                isHeightPer: this._node.isHeightPer,
                height: this._node.height,
                heightPer: heightPer,
            }
        }
    },

    get tag() {
        return {
            path: "tag",
            type: "string",
            name: "Tag",
            attrs: {},
            value: this._node._name,
        }
    },

    get opacity() {
        return {
            path: "opacity",
            type: "Number",
            name: "Opacity",
            attrs: {
                expand: true,
                step: 5,
                precision: 0,
                min: 0,
                max: 255,
            },
            value: this._node.opacity
        }
    },

    get skew() {
        return {
            path: "skew",
            type: "vec2",
            name: "Skew",
            attrs: {
                step: 5,
                precision: 0,
                min: 0,
                max: 360,
            },
            value: {
                x: this._node.skewX,
                y: this._node.skewY,
            }
        }
    },

    get color() {
        return {
            path: "color",
            type: "color",
            name: "Color",
            attrs: {},
            value: {
                r: this._node.color.r,
                g: this._node.color.g,
                b: this._node.color.b,
                a: this._node.color.a
            }
        }
    },

    get visible() {
        return {
            path: "visible",
            type: "check",
            name: "visible",
            attrs: {},
            value: this._node.isVisible(),
        }
    },

    get __comps__() {
        let node = [ new WidgetData(this._node) ];
        if(this._node._className == "Node") {
        } else if(this._node._className == "Sprite") {
            node.push(new SpriteData(this._node));
        } else if(this._node._className == "LabelTTF") {
            node.push(new LabelData(this._node));
        } else if(this._node._className == "Slider") {
            node.push(new TouchData(this._node));
            node.push(new SliderData(this._node));
        } else if(this._node._className == "Input") {
            node.push(new TouchData(this._node));
            node.push(new InputData(this._node));
        } else if(this._node._className == "Scale9") {
            node.push(new Scale9Data(this._node));
        } else if(this._node._className == "Button") {
            node.push(new TouchData(this._node));
            node.push(new ButtonData(this._node));
        } else if(this._node._className == "CheckBox") {
            node.push(new TouchData(this._node));
            node.push(new CheckBoxData(this._node));
        } else if(this._node._className == "Layout") {
            node.push(new LayoutData(this._node));
        } else if(this._node._className == "LabelAtlas") {
            node.push(new LabelAtlasData(this._node));
        } else {
        }
        
        return node;
    },

    setSpriteFrame(path, value, defRes, fn) {
        let url = getFullPathForName(value);
        let exist = checkTextureExist(url);
        value = exist ? value : defRes;
        let newPath = "_" + path;
        this._node[newPath] = value;
        fn.call(this._node, getFullPathForName(value));
    },

    setAttrib(path, value) {
        if(path == "tag") {
            addNodeCommand(this._node, "_name", this._node._name, value);
            this._node._name = value;
        } else if(path == "position.x") {
            addNodeCommand(this._node, "x", this._node.x, parseFloat(value.toFixed(0)));
            this._node.x = parseFloat(value.toFixed(0)) ;
            this._node.left = null;
            this._node.right = null;
        } else if(path == "position.y") {
            addNodeCommand(this._node, "y", this._node.y, value);
            this._node.y = value;
            this._node.top = null;
            this._node.bottom = null;
        } else if(path == "rotation") {
            addNodeCommand(this._node, "rotation", this._node.rotation, value);
            this._node.rotation = value;
        } else if(path == "scale.x") {
            addNodeCommand(this._node, "scaleX", this._node.scaleX, value);
            this._node.scaleX = value;
        } else if(path == "scale.y") {
            addNodeCommand(this._node, "scaleY", this._node.scaleY, value);
            this._node.scaleY = value;
        } else if(path == "anchor.x") {
            addNodeCommand(this._node, "anchorX", this._node.anchorX, value);
            this._node.anchorX = value;
        } else if(path == "anchor.y") {
            addNodeCommand(this._node, "anchorY", this._node.anchorY, value);
            this._node.anchorY = value;
        } else if(path == "skew.x") {
            addNodeCommand(this._node, "skewX", this._node.skewX, value);
            this._node.skewX = value;
        } else if(path == "skew.y") {
            addNodeCommand(this._node, "skewY", this._node.skewY, value);
            this._node.skewY = value;
        } else if(path == "size.width") {
            addNodeCommand(this._node, "width", this._node.width, value, setSizeChange);
            setSizeChange(this._node, "width", value);
        } else if(path == "size.height") {
            addNodeCommand(this._node, "height", this._node.height, value, setSizeChange);
            setSizeChange(this._node, "height", value);
        } else if(path == "opacity") {
            addNodeCommand(this._node, "opacity", this._node.opacity, value);
            this._node.opacity = value;
        } else if(path == "color") {
            addNodeCommand(this._node, "color", this._node.color, new cc.Color(value.r, value.g, value.b, value.a));
            this._node.color = new cc.Color(value.r, value.g, value.b, value.a);
        } else if(path == "size.isWidthPer") {
            addNodeCommand(this._node, "isWidthPer", this._node.isWidthPer, !this._node.isWidthPer);
            this._node.isWidthPer = !this._node.isWidthPer;
        } else if(path == "size.isHeightPer") {
            addNodeCommand(this._node, "isHeightPer", this._node.isHeightPer, !this._node.isHeightPer);
            this._node.isHeightPer = !this._node.isHeightPer;
        } else if(path == "size.widthPer") {
            let parent = this._node.getParent();
            if(parent && parent.width) {
                let val = value * parent.width / 100;
                val = parseFloat(val.toFixed(0));
                addNodeCommand(this._node, "width", this._node.width, val, setSizeChange);
                setSizeChange(this._node, "width", val);
            }
        } else if(path == "size.heightPer") {
            let parent = this._node.getParent();
            if(parent && parent.height) {
                let val = value * parent.height / 100;
                val = parseFloat(val.toFixed(0));
                addNodeCommand(this._node, "height", this._node.height, val, setSizeChange);
                setSizeChange(this._node, "height", val);
            }
        } else if(path == "relativePosition.checkTop") {
            if(!value) {
                this._node.top = null;
            }
        } else if(path == "relativePosition.checkLeft") {
            if(!value) {
                this._node.left = null;
            }
        } else if(path == "relativePosition.checkRight") {
            if(!value) {
                this._node.right = null;
            }
        } else if(path == "relativePosition.checkBottom") {
            if(!value) {
                this._node.bottom = null;
            }
        }
         else if(path == "relativePosition.top") {
            value = parseFloat(value);
            let parent = this._node.getParent();
            if(parent && parent.height) {
                addNodeCommand(this._node, "y", this._node.y, parent.height - value);
                this._node.y = parent.height - value;
                this._node.top = value;
            }
        } else if(path == "relativePosition.bottom") {
            value = parseFloat(value);
            addNodeCommand(this._node, "y", this._node.y, value);
            this._node.y = value;
            this._node.bottom = value;
        } else if(path == "relativePosition.left") {
            value = parseFloat(value);
            addNodeCommand(this._node, "x", this._node.x, value);
            this._node.x = value;
            this._node.left = value;
        } else if(path == "relativePosition.right") {
            value = parseFloat(value);
            let parent = this._node.getParent();
            if(parent && parent.width) {
                addNodeCommand(this._node, "x", this._node.x, parent.width - value);
                this._node.x = parent.width - value;
                this._node.right = value;
            }
        } else if(path == "visible") {
            addNodeCommand(this._node, "visible", this._node.visible, value);
            this._node.visible = value;
        } else if(path == "touchEnabled") {
            addNodeCommand(this._node, "touchEnabled", this._node._touchEnabled, value);
            this._node._touchEnabled = value;
        } else if(path == "touchListener") {
            addNodeCommand(this._node, "touchListener", this._node.touchListener, value);
            this._node.touchListener = value;
        } else if(this._node._className == "LabelTTF") {
            if(path == "string") {
                this._node.string = value;
            } else if(path == "textAlign") {
                this._node.textAlign = parseFloat(value);
            } else if(path == "verticalAlign") {
                this._node.verticalAlign = parseFloat(value);
            } else if(path == "fontSize") {
                this._node.fontSize = value;
            } else if(path == "fontName") {
                this._node.fontName = fontName;
            } else if(path == "fillStyle") {
                this._node.fillStyle = new cc.Color(value.r, value.g, value.b, value.a);
            } else if(path == "strokeStyle") {
                this._node.strokeStyle = new cc.Color(value.r, value.g, value.b, value.a);
            } else if(path == "lineWidth") {
                this._node.lineWidth = value;
            } else if(path == "shadowOffsetX") {
                this._node.shadowOffsetX = value;
            } else if(path == "shadowOffsetY") {
                this._node.shadowOffsetY = value;
            } else if(path == "shadowOpacity") {
                this._node.shadowOpacity = value;
            } else if(path == "shadowBlur") {
                this._node.shadowBlur = value;
            } else {
                return;
            }
        } else if(this._node._className == "Sprite") {
            let value1 = value;
            if(path == "srcBlendFactor") {
                this._node.setBlendFunc(parseInt(value), this._node.getBlendFunc().dst);
            } else if(path == "dstBlendFactor") {
                this._node.setBlendFunc(this._node.getBlendFunc().src, parseInt(value));
            } else if(path == "spriteFrame") {
                this.setSpriteFrame(path, value, "res/default/Sprite.png", this._node.initWithFile);
            }
        } else if(this._node._className == "Scale9") {
            if(path == "spriteFrame") {
                this._node._scale9Image = null;
                this.setSpriteFrame(path, value, "res/default/Scale9.png", this._node.initWithFile);
            } else {
                this._node[path] = value;
            }
        } else if(this._node._className == "Slider") {
            if(path == "totalLength") {
                this._node.totalLength = parseFloat(value);
            } else if(path == "percent") {
                this._node.percent = parseFloat(value);
            } else if(path == "mode") {
                this._node.mode = parseInt(value);
            } else if(path == "barBg") {
                this.setSpriteFrame(path, value, "res/default/SliderBack.png", this._node.loadBarTexture);
            } else if(path == "barProgress") {
                this.setSpriteFrame(path, value, "res/default/SliderBar.png", this._node.loadProgressBarTexture);
            } else if(path == "barNormalBall") {
                this.setSpriteFrame(path, value, "res/default/SliderNodeNormal.png", this._node.loadSlidBallTextureNormal);
            } else if(path == "barSelectBall") {
                this.setSpriteFrame(path, value, "res/default/SliderNodeSelect.png", this._node.loadSlidBallTexturePressed);
            } else if(path == "barDisableBall") {
                this.setSpriteFrame(path, value, "res/default/SliderNodeDisable.png", this._node.loadSlidBallTextureDisabled);
            } 
        } else if(this._node._className == "Input") {
            if(path == "fontColor") {
                this._node.fontColor = new cc.Color(value.r, value.g, value.b, value.a);
            } else if(path == "placeholderFontColor") {
                this._node.placeholderFontColor = new cc.Color(value.r, value.g, value.b, value.a);
            } else if(path == "spriteBg") {
                this.setSpriteFrame(path, value, "res/default/shurukuang.png", (value) => {
                    this._node.initWithBackgroundSprite(new cc.Scale9Sprite(value));
                });
            } else {
                this._node[path] = value;
            }
        } else if(this._node._className == "Button") {
            if(path == "isScale9Enabled") {
                this._node.setScale9Enabled(value);
            } else if(path == "bgNormal") {
                this.setSpriteFrame(path, value, "res/default/ButtonNormal.png", this._node.loadTextureNormal);
            } else if(path == "bgSelect") {
                this.setSpriteFrame(path, value, "res/default/ButtonSelect.png", this._node.loadTexturePressed);
            } else if(path == "bgDisable") {
                this.setSpriteFrame(path, value, "res/default/ButtonDisable.png", this._node.loadTextureDisabled);
            } else if(path == "titleText") {
                this._node.setTitleText(value);
            } else if(path == "fontName") {
                this._node.setTitleFontName(value);
            } else if(path == "fontSize") {
                this._node.setTitleFontSize(value);
            } else if(path == "fontColor") {
                this._node.setTitleColor(new cc.Color(value.r, value.g, value.b, value.a));
            } else {
                this._node[path] = value;
            }
        } else if(this._node._className == "CheckBox") {
            if(path == "back") {
                this.setSpriteFrame(path, value, "res/default/CheckBoxNormal.png", this._node.loadTextureBackGround);
            } else if(path == "backSelect") {
                this.setSpriteFrame(path, value, "res/default/CheckBoxSelect.png", this._node.loadTextureBackGroundSelected);
            } else if(path == "active") {
                this.setSpriteFrame(path, value, "res/default/CheckBoxNodeNormal.png", this._node.loadTextureFrontCross);
            } else if(path == "backDisable") {
                this.setSpriteFrame(path, value, "res/default/CheckBoxDisable.png", this._node.loadTextureBackGroundDisabled);
            } else if(path == "activeDisable") {
                this.setSpriteFrame(path, value, "res/default/CheckBoxNodeDisable.png", this._node.loadTextureFrontCrossDisabled);
            } else if(path == "select") {
                this._node.setSelected(value);
            }
        } else if(this._node._className == "Layout") {
            if(path == "spriteFrame") {
                this.setSpriteFrame(path, value, "", this._node.setBackGroundImage);
            } else if(path == "bkScaleEnable") {
                this._node.setBackGroundImageScale9Enabled(value);
            } else if(path == "colorType") {
                this._node.setBackGroundColorType(parseInt(value));
            } else if(path == "bkColor") {
                this._node.setBackGroundColor(value);
            } else if(path == "bkStartColor") {
                this._node.setBackGroundColor(value, this._node.getBackGroundEndColor());
            } else if(path == "bkEndColor") {
                this._node.setBackGroundColor(this._node.getBackGroundStartColor(), value);
            } else if(path == "layoutType") {
                this._node.setLayoutType(parseInt(value));
            } else if(path == "clippingEnabled") {
                this._node.setClippingEnabled(value);
            } else if(path == "clippingType") {
                this._node.setClippingType(parseInt(value));
            }
        } else if(this._node._className == "LabelAtlas") {
            let node = this._node;
            let parent = node.getParent();
            let data = cocosExportNodeData(this._node, {uuid:true});
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

            let self = this;
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
                self._node = newNode;
            });
            
        } else {
            return;
        }

        if(this._node._className == "Scene") {
            Editor.Ipc.sendToAll("ui:scene_prop_change", {});
        }
        
        Editor.Ipc.sendToAll("ui:has_item_change", {uuid:this._node.uuid});
        
    },
}

BlendData = {
    0     : "ZERO",
    1     : "ONE",
    770   : "SRC_ALPHA",
    776   : "SRC_ALPHA_SATURATE",
    768   : "SRC_COLOR",
    772   : "DST_ALPHA",
    774   : "DST_COLOR",
    771   : "ONE_MINUS_SRC_ALPHA",
    769   : "ONE_MINUS_SRC_COLOR",
    773   : "ONE_MINUS_DST_ALPHA",
    775   : "ONE_MINUS_DST_COLOR",
    32770 : "ONE_MINUS_CONSTANT_ALPHA",
    32772 : "ONE_MINUS_CONSTANT_ALPHA",
}

SpriteData.prototype = {
    __editor__ : {
        "inspector": "cc.Sprite",
    },
    __displayName__: "Sprite",

    __type__: "cc.Sprite",

    get srcBlendFactor() {
        let factor = this._node.getBlendFunc().src;
        return {
            path: "srcBlendFactor",
            type: "select",
            name: "SrcBlendFactor",
            attrs: {
                selects: BlendData,
            },
            value: this._node.getBlendFunc().src,
        };
    },

    get dstBlendFactor() {
        let factor = this._node.getBlendFunc().dst;
        return {
            path: "dstBlendFactor",
            type: "select",
            name: "DstBlendFactor",
            attrs: {
                selects: BlendData,
            },
            value: this._node.getBlendFunc().dst,
        };
    },

    get spriteFrame() {
        return this._node._spriteFrame;
    },

    set spriteFrame(value) {

    },

}


WidgetData.prototype = {
    __editor__ : {
        "inspector": "cc.Widget",
    },
    __displayName__: "Widget",
    __type__: "cc.Widget",

    get isRelativePos() {
        return {
            path: "isRelativePos",
            type: "check",
            name: "RelativePos",
            attrs: {},
            value: this._node.isRelativePos || false,
        };
    },


    get folded() {
        return !(this._node.left || this._node.top || this._node.right || this._node.bottom);
    },

    get relativePosition() {

        let parent = this._node.getParent();
        let left = this._node.x;
        let right = 0;
        let top = 0;
        let bottom = this._node.y
        if(parent) {
            right = parent.width - this._node.x;
            top = parent.height - this._node.y;
        }
        return {
            path: "relativePosition",
            type: "vec2",
            name: "relativePosition",
            attrs: {
                step: 5,
                precision: 0,
            },
            value: {
                isAlignLeft: "number" == typeof this._node.left,
                isAlignTop: "number" == typeof this._node.top,
                isAlignRight: "number" == typeof this._node.right,
                isAlignBottom: "number" == typeof this._node.bottom,
                left:this._node.left || left,
                top:this._node.top || top,
                right:this._node.right || right,
                bottom:this._node.bottom || bottom,
            }
        }
    },
}


LabelData.prototype = {
    __editor__ : {
        "inspector": "cc.Label",
    },
    __displayName__: "Label",
    __type__: "cc.Label",

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

    get fillStyle() {
        return {
            path: "fillStyle",
            type: "color",
            name: "FillStyle",
            attrs: {
            },
            value: {
                r: this._node.fillStyle.r,
                g: this._node.fillStyle.g,
                b: this._node.fillStyle.b,
                a: this._node.fillStyle.a
            }
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

    get lineWidth() {
        return {
            path: "lineWidth",
            type: "number",
            name: "LineWidth",
            attrs: {
                expand: true,
                step: 1,
                precision: 0,
                min: 0,
                max: 72,
            },
            value: this._node.lineWidth,
        };
    },

    get shadowOffsetX() {
        return {
            path: "shadowOffsetX",
            type: "number",
            name: "ShadowOffsetX",
            attrs: {
                expand: true,
                step: 0.1,
                precision: 1,
                min: 0,
                max: 72,
            },
            value: this._node.shadowOffsetX,
        };
    },

    get shadowOffsetY() {
        return {
            path: "shadowOffsetY",
            type: "number",
            name: "shadowOffsetY",
            attrs: {
                expand: true,
                step: 0.1,
                precision: 1,
                min: 0,
                max: 72,
            },
            value: this._node.shadowOffsetY,
        };
    },

    get shadowOpacity() {
        return {
            path: "shadowOpacity",
            type: "number",
            name: "shadowOpacity",
            attrs: {
                expand: true,
                step: 5,
                precision: 0,
                min: 0,
                max: 255,
            },
            value: this._node.shadowOpacity,
        };
    },

    get shadowBlur() {
        return {
            path: "shadowBlur",
            type: "number",
            name: "shadowBlur",
            attrs: {
                expand: true,
                step: 0.1,
                precision: 1,
                min: 0,
                max: 72,
            },
            value: this._node.shadowBlur,
        };
    },
}

SliderData.prototype = {
    __editor__ : {
        "inspector1": "cc.Slider",
    },
    __displayName__: "Slider",
    __type__: "cc.Slider",

    get totalLength() {
        return {
            path: "totalLength",
            type: "number",
            name: "TotalLength",
            attrs: {
            },
            value: this._node.totalLength,
        };
    },

    get percent() {
        return {
            path: "percent",
            type: "slider",
            name: "percent",
            attrs: {
                expand: true,
                step: 0.1,
                precision: 1,
                min: 0,
                max: 100,
            },
            value: this._node.percent,
        };
    },


    get mode() {
        return {
            path: "mode",
            type: "select",
            name: "mode",
            attrs: {
                selects: {
                    0: "HORIZONTAL",
                    1: "VERTICAL",
                    2: "FILLED",
                }
            },
            value: this._node.mode || 0,
        };
    },

    get barBg() {
        return {
            path: "barBg",
            type: "fire-asset",
            name: "barBg",
            attrs: {
            },
            value: this._node._barBg,
        };
    },

    get barProgress() {
        return {
            path: "barProgress",
            type: "fire-asset",
            name: "barProgress",
            attrs: {
            },
            value: this._node._barProgress,
        };
    },

    get barNormalBall() {
        return {
            path: "barNormalBall",
            type: "fire-asset",
            name: "barNormalBall",
            attrs: {
            },
            value: this._node._barNormalBall,
        };
    },

    get barSelectBall() {
        return {
            path: "barSelectBall",
            type: "fire-asset",
            name: "barSelectBall",
            attrs: {
            },
            value: this._node._barSelectBall,
        };
    },

    get barDisableBall() {
        return {
            path: "barDisableBall",
            type: "fire-asset",
            name: "barDisableBall",
            attrs: {
            },
            value: this._node._barDisableBall,
        };
    },

    get __props__() {
        return [
            // this.totalLength,
            this.percent,
            // this.mode,
            this.barBg,
            this.barProgress,
            this.barNormalBall,
            this.barSelectBall,
            this.barDisableBall,
        ];
    }
}

InputData.prototype = {
    __editor__ : {
        "inspector1": "cc.Input",
    },
    __displayName__: "Input",
    __type__: "cc.Input",

    get spriteBg() {
        return {
            path: "spriteBg",
            type: "fire-asset",
            name: "spriteBg",
            attrs: {
            },
            value: this._node._spriteBg,
        };
    },

    set spriteBg(value) {

    },

    get string() {
        return {
            path: "string",
            type: "string",
            name: "string",
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
            value: this._node._edFontName,
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
            value: this._node._edFontSize,
        };
    },

    get fontColor() {
        return {
            path: "fontColor",
            type: "color",
            name: "fontColor",
            attrs: {
            },
            value: this._node._textColor,
        };
    },

    get maxLength() {
        return {
            path: "maxLength",
            type: "number",
            name: "maxLength",
            attrs: {
                expand: true,
                step: 1,
                precision: 0,
                min: 0,
            },
            value: this._node.maxLength,
        };
    },

    get placeHolderString() {
        return {
            path: "placeHolder",
            type: "string",
            name: "placeHolder",
            attrs: {
            },
            value: this._node.placeHolder,
        };
    },

    get placeHolderFontName() {
        return {
            path: "placeholderFontName",
            type: "string",
            name: "placeHolderFontName",
            attrs: {
            },
            value: this._node._placeholderFontName,
        };
    },

    get placeHolderFontSize() {       
        return {
            path: "placeholderFontSize",
            type: "number",
            name: "placeHolderFontSize",
            attrs: {
                expand: true,
                step: 1,
                precision: 0,
                min: 0,
                max: 72,
            },
            value: this._node._placeholderFontSize,
        };
    },

    get placeHolderFontColor() {
        return {
            path: "placeholderFontColor",
            type: "color",
            name: "placeholderFontColor",
            attrs: {
            },
            value: this._node._placeholderColor || cc.Color.BLACK,
        };
    },

    get inputFlag() {
        return {
            path: "inputFlag",
            type: "select",
            name: "inputFlag",
            attrs: {
                selects: {
                    0: "PASSWORD",
                    1: "SENSITIVE",
                    2: "INITIAL_CAPS_WORD",
                    3: "INITIAL_CAPS_SENTENCE",
                    4: "INITIAL_CAPS_ALL_CHARACTERS",
                }
            },
            value: this._node._editBoxInputFlag,
        };
    },

    get inputMode() {
        return {
            path: "inputMode",
            type: "select",
            name: "inputMode",
            attrs: {
                selects: {
                    0: "ANY",
                    1: "EMAIL_ADDR",
                    2: "NUMERIC",
                    3: "PHONE_NUMBER",
                    4: "URL",
                    5: "DECIMAL",
                    6: "SINGLE_LINE",
                }
            },
            value: this._node._editBoxInputMode,
        };
    },

    get returnType() {
        return {
            path: "returnType",
            type: "select",
            name: "returnType",
            attrs: {
                selects: {
                    0: "DEFAULT",
                    1: "DONE",
                    2: "SEND",
                    3: "SEARCH",
                    4: "GO",
                }
            },
            value: this._node._keyboardReturnType,
        };
    },


    get __props__() {
        return [
            this.spriteBg,
            this.string,
            this.fontName,
            this.fontSize,
            this.fontColor,
            this.inputFlag,
            this.inputMode,
            this.returnType,
            this.maxLength,
            this.placeHolderString,
            this.placeHolderFontName,
            this.placeHolderFontSize,
            this.placeHolderFontColor,
        ];
    }
    
};


Scale9Data.prototype = {
    __editor__ : {
        "inspector": "cc.Scale9",
    },
    __displayName__: "Scale9",

    __type__: "cc.Scale9",

    get spriteFrame() {
        return this._node._spriteFrame;
    },

    set spriteFrame(value) {

    },

    get insetLeft() {
        return {
            path: "insetLeft",
            type: "number",
            name: "insetLeft",
            attrs: {
                expand: true,
                step: 1,
                precision: 0,
                min: 0,
            },
            value: this._node.insetLeft,
        };
    },

    get insetTop() {
        return {
            path: "insetTop",
            type: "number",
            name: "insetTop",
            attrs: {
                expand: true,
                step: 1,
                precision: 0,
                min: 0,
            },
            value: this._node.insetTop,
        };
    },

    get insetRight() {
        return {
            path: "insetRight",
            type: "number",
            name: "insetRight",
            attrs: {
                expand: true,
                step: 1,
                precision: 0,
                min: 0,
            },
            value: this._node.insetRight,
        };
    },

    get insetBottom() {
        return {
            path: "insetBottom",
            type: "number",
            name: "insetBottom",
            attrs: {
                expand: true,
                step: 1,
                precision: 0,
                min: 0,
            },
            value: this._node.insetBottom,
        };
    },
};


ButtonData.prototype = {
    __editor__ : {
        "inspector1": "cc.Button",
    },
    __displayName__: "Button",
    __type__: "cc.Button",

    get isScale9Enabled() {
        return {
            path: "isScale9Enabled",
            type: "check",
            name: "isScale9Enabled",
            attrs: {
            },
            value: this._node.isScale9Enabled(),
        };
    },

    get bgNormal() {
        return {
            path: "bgNormal",
            type: "fire-asset",
            name: "bgNormal",
            attrs: {
            },
            value: this._node._bgNormal,
        };
    },

    get bgSelect() {
        return {
            path: "bgSelect",
            type: "fire-asset",
            name: "bgSelect",
            attrs: {
            },
            value: this._node._bgSelect,
        };
    },

    get bgDisable() {
        return {
            path: "bgDisable",
            type: "fire-asset",
            name: "bgDisable",
            attrs: {
            },
            value: this._node._bgDisable,
        };
    },

    get titleText() {
        return {
            path: "titleText",
            type: "string",
            name: "titleText",
            attrs: {
            },
            value: this._node.getTitleText(),
        };
    },

    get fontName() {
        return {
            path: "fontName",
            type: "string",
            name: "fontName",
            attrs: {
            },
            value: this._node.getTitleFontName(),
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
            value: this._node.getTitleFontSize(),
        };
    },

    get fontColor() {
        return {
            path: "fontColor",
            type: "color",
            name: "fontColor",
            attrs: {
            },
            value: this._node.getTitleColor(),
        };
    },

    get __props__() {
        return [
            this.isScale9Enabled,
            this.bgNormal,
            this.bgSelect,
            this.bgDisable,
            this.titleText,
            this.fontName,
            this.fontSize,
            this.fontColor,
        ];
    }
    
};





CheckBoxData.prototype = {
    __editor__ : {
        "inspector1": "cc.CheckBox",
    },
    __displayName__: "CheckBox",
    __type__: "cc.CheckBox",

    get back() {
        return {
            path: "back",
            type: "fire-asset",
            name: "back",
            attrs: {
            },
            value: this._node._back,
        };
    },

    get backSelect() {
        return {
            path: "backSelect",
            type: "fire-asset",
            name: "backSelect",
            attrs: {
            },
            value: this._node._backSelect,
        };
    },

    get active() {
        return {
            path: "active",
            type: "fire-asset",
            name: "active",
            attrs: {
            },
            value: this._node._active,
        };
    },

    get backDisable() {
        return {
            path: "backDisable",
            type: "fire-asset",
            name: "backDisable",
            attrs: {
            },
            value: this._node._backDisable,
        };
    },

    get activeDisable() {
        return {
            path: "activeDisable",
            type: "fire-asset",
            name: "activeDisable",
            attrs: {
            },
            value: this._node._activeDisable,
        };
    },

    get select() {
        return {
            path: "select",
            type: "check",
            name: "select",
            attrs: {
            },
            value: this._node.isSelected(),
        };
    },

//    get enable() {
//         return {
//             path: "enable",
//             type: "check",
//             name: "enable",
//             attrs: {
//             },
//             value: this._node.isTouchEnabled(),
//         };
//     },


    get __props__() {
        return [
            this.back,
            this.backSelect,
            this.active,
            this.backDisable,
            this.activeDisable,
            this.select,
            // this.enable,
        ];
    }
    
};

TouchData.prototype = {
    __editor__ : {
        "inspector1": "cc.Touch",
    },
    __displayName__: "Touch",
    __type__: "cc.Touch",

    get touchEnabled() {
        return {
            path: "touchEnabled",
            type: "check",
            name: "touchEnabled",
            attrs: {
            },
            value: this._node._touchEnabled,
        };
    },

    get touchListener() {

        return {
            path: "touchListener",
            type: "string",
            name: "touchListener",
            attrs: {
            },
            value: this._node.touchListener,
        };
    },

    get __props__() {
        return [
            this.touchEnabled,
            this.touchListener,
        ];
    }
    
};

LabelAtlasData.prototype = {
    __editor__ : {
        "inspector1": "cc.LabelAtlasData",
    },
    __displayName__: "LabelAtlasData",
    __type__: "cc.LabelAtlasData",

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
    
};


LayoutData.prototype = {
    __editor__ : {
        "inspector": "cc.Layout",
    },
    __displayName__: "Layout",

    __type__: "cc.Layout",

    get spriteFrame() {
        return this._node._backGroundImageFileName;
    },

    set spriteFrame(value) {

    },

    get bkScaleEnable() {
        return {
            path: "bkScaleEnable",
            type: "check",
            name: "bkScaleEnable",
            attrs: {
            },
            value: this._node.isBackGroundImageScale9Enabled(),
        };
    },

    get colorType() {
        return {
            path: "colorType",
            type: "select",
            name: "colorType",
            attrs: {
                selects: {
                    0: "BG_COLOR_NONE",
                    1: "BG_COLOR_SOLID",
                    2: "BG_COLOR_GRADIENT",
                }
            },
            value: this._node.getBackGroundColorType(),
        };
    },

    get bkColor() {
        return {
            path: "bkColor",
            type: "color",
            name: "bkColor",
            attrs: {
            },
            value: this._node.getBackGroundColor(),
        };
    },

    get bkStartColor() {
        return {
            path: "bkStartColor",
            type: "color",
            name: "bkStartColor",
            attrs: {
            },
            value: this._node.getBackGroundStartColor(),
        };
    },

    get bkEndColor() {
        return {
            path: "bkEndColor",
            type: "color",
            name: "bkEndColor",
            attrs: {
            },
            value: this._node.getBackGroundEndColor(),
        };
    },

    get layoutType() {
        return {
            path: "layoutType",
            type: "select",
            name: "layoutType",
            attrs: {
                selects: {
                    0: "ABSOLUTE",
                    1: "LINEAR_VERTICAL",
                    2: "LINEAR_HORIZONTAL",
                    3: "RELATIVE",
                }
            },
            value: this._node.layoutType,
        };
    },

    get clippingEnabled() {
        return {
            path: "clippingEnabled",
            type: "check",
            name: "clippingEnabled",
            attrs: {
            },
            value: this._node.clippingEnabled,
        };
    },

    get clippingType() {
        return {
            path: "clippingType",
            type: "select",
            name: "clippingType",
            attrs: {
                selects: {
                    0: "CLIPPING_STENCIL",
                    1: "CLIPPING_SCISSOR",
                }
            },
            value: this._node.clippingType,
        };
    },



    
}