const ipcRenderer = require('electron').ipcRenderer;
var task;

function sendForm(event) {

    event.preventDefault();
    task = document.getElementById("task").value;
    if (task === ''){
        alert("Task must not be empty");
    }
    else {
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
    var button = document.createElement("button");
    var buttontext = document.createTextNode("del");
    var textnode = document.createTextNode(task);

    node.id = id;
    
    node.appendChild(textnode);
    button.appendChild(buttontext);
    node.appendChild(button);
    var list =  document.getElementById("tasks");
    list.appendChild(node);
    button.addEventListener('click', function(){
        ipcRenderer.send('delete-task', id);
        list.removeChild(document.getElementById(node.id));

    }, false);
}

function removeElementFromList(){
    
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