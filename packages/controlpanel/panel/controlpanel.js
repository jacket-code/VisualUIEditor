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

        var nodes=GetExtllNodeControls();
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

    messages: {
      "ui:has_extnodecontrol_add"(event, name) {
          let nodeControl = GetNodeControl(name);
          this.show_items.push({icon:nodeControl.icon, name:nodeControl.name})

          this.show_items = this.sortItems(this.show_items)
      },
    },

  });

})();
