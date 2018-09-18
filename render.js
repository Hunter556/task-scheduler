const ipcRenderer = require('electron').ipcRenderer;
var task;

function sendForm(event) {
    if (event.keyCode == 13) {
        task = document.getElementById("input").value;
        ipcRenderer.send('task-submission', task);
    }

}

function clearTasks(event) {
    event.preventDefault();
    var list = document.getElementById("tasks");
    ipcRenderer.send('clear-all-tasks');
    list.innerHTML = '';

}
document.addEventListener('DOMContentLoaded', function () {
    ipcRenderer.send('load-all-tasks');
}, false);


function addElementToList(id, task) {
    var node = document.createElement("li");
    var textnode = document.createTextNode(task);
    node.id = id;
    node.appendChild(textnode);
    var list = document.getElementById("tasks");
    list.appendChild(node);
    node.onclick = 
    function removeItem(e) {
      
      e.target.parentElement.removeChild(e.target);
      ipcRenderer.send('delete-task', id);  
    }
    

}

ipcRenderer.on('reply-on-load', (event, reply) => {
    for (i = 0; i < reply.length; i++) {
        var task = reply[i].task;
        var id = reply[i].id;
        addElementToList(id, task);
    }
});
ipcRenderer.on('reply-on-add', (event, id) => {

    addElementToList(id, task);


});