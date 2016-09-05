(() => {
  'use strict';

  var Fs = require('fire-fs');

  var dragIdName = "NodeMoveUUID";
  
  Editor.polymerPanel('controlpanel', {
    properties: {
        show_items: {
            type: Array,
            value: function () { return []; },
        }
    },

    

    addFunc: function(data) {

    },

    _getItems: function() {
        return this.show_items;
    },

    ready: function () {
        let show_items = [
            {icon:"res/control/Node.png", name:"Node", tag: 0},
            {icon:"res/control/Sprite.png", name:"Sprite", tag: 1},
            {icon:"res/control/Label.png", name:"LabelTTF", tag: 2},
            {icon:"res/control/Label.png", name:"LabelAtlas", tag: 3},
            {icon:"res/control/Scale9.png", name:"Scale9", tag: 4},
            {icon:"res/control/Input.png", name:"Input", tag: 5},
            {icon:"res/control/SliderBar.png", name:"Slider", tag: 6},
            {icon:"res/control/Button.png", name:"Button", tag: 7},
            {icon:"res/control/CheckBox.png", name:"CheckBox", tag: 8},
            {icon:"res/control/CheckBox.png", name:"ListView", tag: 9},
        ];

        var nodes=GetAllNodeControls();
        for (name in nodes)
        {
            let node = nodes[name]
            show_items.push({icon:node.icon, name:node.name, tag:node.tag});
        }

        this.show_items = this.sortItems(show_items);
    },

    sortItems: function(items) {
        items.sort(function(a,b){
            return (a.tag - b.tag)
        });
        return items;
    },

    dragStart: function(ev) {
        ev.stopPropagation();
        ev.dataTransfer.dropEffect = 'move';
        ev.dataTransfer.setData(dragIdName,ev.target._uuid);
        ev.target.style.opacity = "0.4";
    },
    dragEnd: function(ev) {
        ev.preventDefault();
        ev.target.style.opacity = "1";
    },
    dragEnter: function(ev) {
        ev.preventDefault();
        ev.stopPropagation();
        
        ev.target.style.background = 'blue';
        ev.dataTransfer.effectAllowed = "all";
        ev.dataTransfer.dropEffect = "all"; // drop it like it's hot
    },
    dragOver: function(ev) {
        ev.dataTransfer.effectAllowed = "all";
        ev.dataTransfer.dropEffect = "all"; // drop it like it's hot
        ev.preventDefault();
        ev.stopPropagation();

        var rect = ev.currentTarget.getBoundingClientRect();
        if (ev.clientY - rect.top < rect.height / 4) {
            ev.target.style.background = "red";
            this._curOpMode = "top";
        } else if(rect.bottom - ev.clientY < rect.height / 4) {
            ev.target.style.background = "yellow";
            this._curOpMode = "bottom";
        } else {
            ev.target.style.background = "blue";
            this._curOpMode = "center";
        }

        var data = ev.dataTransfer.getData(dragIdName);
    },
    dragLeave: function(ev) {
        ev.preventDefault();
        ev.stopPropagation();
        ev.target.style.removeProperty("background");
    },
    dragDrop: function(ev) {
        ev.preventDefault();
        ev.stopPropagation();
        ev.target.style.removeProperty("background");
        
        var data = ev.dataTransfer.getData(dragIdName);
        
        var item = this.$.tree.getItemById(data);
        if (item === null || item == undefined) {
            return;
        }
        this.tryChangeItemPosition(item, ev.currentTarget);
    },
    tryChangeItemPosition: function(sourceItem, parentItem) {
        if (Editor.UI.PolymerUtils.isSelfOrAncient(parentItem, sourceItem)) {
            return;
        }
        if (this._curOpMode == "top") {
            this.$.tree.setItemBefore(sourceItem, parentItem);
        } else if(this._curOpMode == "bottom") {
            this.$.tree.setItemAfter(sourceItem, parentItem);
        } else {
            this.$.tree.setItemParent(sourceItem, parentItem);
        }
    },  
    newEntry: function (entry) {
      var item = document.createElement('td-tree-item');
      item.draggable = true;
      item['ondragstart'] = this.dragStart.bind(this);
      item['ondragend'] = this.dragEnd.bind(this);
      item['ondragenter'] = this.dragEnter.bind(this);
      item['ondragover'] = this.dragOver.bind(this);
      item['ondragleave'] = this.dragLeave.bind(this);
      item['ondrop'] = this.dragDrop.bind(this);
      item.name = entry.name;
      item.path = entry.path;
      return item;
    },

    messages: {
      "ui:has_extnodecontrol_add"(event, name) {
          let nodeControl = GetNodeControl(name);
          this.show_items.push({icon:nodeControl.icon, name:nodeControl.name})
      },
    },

  });

})();
