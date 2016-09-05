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


    ready: function () {
        let show_items = [];
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
