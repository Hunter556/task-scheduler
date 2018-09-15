var {
    app,
    BrowserWindow,
    ipcMain
} = require('electron')
var url = require('url')
var path = require('path')

var win



function createWindow() {
    win = new BrowserWindow({
        width: 800,
        height: 600
    })
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }))
    win.setMenu(null);
    win.setResizable(false);


}

function connectionTodataBase() {

    var mysql = require('mysql');

    var con = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: ""
    });

    con.connect(function (err) {
        if (err) throw err;
        con.query("CREATE DATABASE IF NOT EXISTS mydb", function (err, result) {
            if (err) throw err;
        });
    });

    con.changeUser({
        database: "mydb"
    }, function (err) {
        if (err) {
            console.log('error in changing database', err);
            return;
        }
    });
    return con;
}

function selectTasks(con, callback) {
    con.query("SELECT id, task FROM tasks", function (err, result, fields) {
        if (err) throw err;
        return callback(result);
    });

}

function clearTable(con) {
    con.query("TRUNCATE TABLE TASKS", (error, result) => {
        if (error) throw error;
    });
}
function deleteTask(con, id){
    con.query("DELETE FROM TASKS WHERE id = ?", id);
}

function tableCreation(con) {
    con.query("CREATE TABLE IF NOT EXISTS tasks (id INTEGER AUTO_INCREMENT PRIMARY KEY, task varchar(255))", (error, result) => {
        if (error) throw error;
    });
}

function insertTask(task, con, callback) {
    sql = "INSERT INTO tasks (task) VALUES (?)";
    con.query(sql, [task], (error, result) => {
        if (error) throw error;
        return callback(result.insertId);
    });
}


ipcMain.on('task-submission', (event, name) => {

    con = connectionTodataBase();
    tableCreation(con);
    insertTask(name, con, (id) => {
        event.sender.send('reply-on-add', id);
    
    });

});

ipcMain.on('load-all-tasks', (event) =>{
    con = connectionTodataBase();
    selectTasks(con, function (response) {
        event.sender.send('reply-on-load', response);
    });
});
ipcMain.on('clear-all-tasks', (event, result) => {
    con = connectionTodataBase();
    clearTable(con);
});

ipcMain.on('delete-task', (event, id) =>{
    con = connectionTodataBase();
    deleteTask(con,id);
})

app.on('ready', createWindow)
