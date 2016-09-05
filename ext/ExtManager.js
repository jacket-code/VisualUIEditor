

let allExtNodeControls = {};

function RegisterExtNodeControl(name, nodeControl) {
    allExtNodeControls[name] = nodeControl;
    //TODO check
    Editor.Ipc.sendToAll('ui:has_extnodecontrol_add', name);
}

function GetNodeControl(name) {
    return allExtNodeControls[name];
}

function GetAllNodeControls() {
    return allExtNodeControls;
}