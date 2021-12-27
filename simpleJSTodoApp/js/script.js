let todo = {};
let selectedList = "";
let selectedTask = "";
let allowEditTask = false;

// Useful Functions
let makeId = function() {
    const LENGTH = 64;
    const CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < LENGTH; i++) {
        result += CHARACTERS.charAt(Math.floor(Math.random() * CHARACTERS.length));
    }
    return result;
}
let checkName = function(str) {
    if (str.match(/^[\w]+$/)) {
        return true;
    }
    else {
        return false;
    }
}

// Object Functions
let newList = function(listName) {
    if (listName !== "" && todo[listName] === undefined) {
        todo[listName.toString()] = {};
    }
    saveData();
}
let deleteList = function(listName) {
    if (todo[listName] !== undefined) {
        delete todo[listName];
    }
    saveData();
}
let editList = function(oldListName, newListName) {
    if (newListName !== "" && todo[oldListName] !== undefined && todo[newListName] === undefined) {
        todo[newListName.toString()] = todo[oldListName];
        deleteList(oldListName);
    }
    saveData();
}
let clearList = function() {
    for (let taskId in todo[selectedList]) {
        let prog = todo[selectedList][taskId]["prog"];
        if (prog === "Complete") {
            delete todo[selectedList][taskId];
        }
    }
    saveData();
}
let newTask = function(listName, title, desc, prog) {
    if (todo[listName]){
        let taskId = makeId();
        while (todo[listName][taskId] != undefined) {
            taskId = makeId();
        }
        todo[listName][taskId] = {
            "title": title,
            "desc": desc,
            "prog": prog,
        };
        saveData();
    }
}
let deleteTask = function(listName, taskId) {
    if (todo[listName] !== undefined && todo[listName][taskId] !== undefined) {
        delete todo[listName][taskId];
    }
    saveData();
}
let editTask = function(listName, taskId, title, desc, prog) {
    todo[listName][taskId] = {
        "title": title,
        "desc": desc,
        "prog": prog,
    };
    saveData();
}

// HTML Functions
let createListHTML = function(listName) {
    if (todo[listName]) {
        let listAmount = Object.keys(todo).length;
        let listDiv = `
        <div class="list" id=${listName.toString()}>
            <div class="list-top">
                <h3>${listName}</h3>
                <i class="fas fa-cog" onclick="showEditList(this)"></i>
            </div>
            <div class="task-list">
                <div class="addTask" onclick="showNewTask(this)">
                    Add a task...
                </div>
            </div>
        </div>
        `;
        $(".frame").append(listDiv);
        $(".frame .addList").css("order", listAmount);
    }
}
let createTaskHTML = function(listName, taskId) {
    if (todo[listName] && todo[listName][taskId]) {
        let listSize = Object.keys(todo[listName]).length;
        let taskDiv = `
        <div class="task" id=${taskId.toString()} onclick="showEditTask(this)">
            <div class="task-labels">
                <div class="label"></div>
            </div>
            <div class="task-text"></div>
        </div>
        `;
        $("#" + listName + " .task-list").append(taskDiv);
        $("#" + taskId + " .task-text").html(todo[listName][taskId]["title"]);
        $("#" + taskId + " .label").html(todo[listName][taskId]["prog"]);
        $("#" + taskId + " .label").addClass(todo[listName][taskId]["prog"]);
        $("#" + listName + " .addTask").css("order", listSize);
    }
}
let updateInterface = function() {
    $(".frame").children(".list").remove();
    for (let listName in todo) {
        createListHTML(listName);
        for (let taskId in todo[listName]) {
            createTaskHTML(listName, taskId);
        }
    }
}

// Working with the interface...
let unshowNewList = function() {
    $(".overlay").css("display", "none");
    $(".overlay .modul-newList").css("display", "none");
}
let showNewList = function() {
    $(".overlay").css("display", "flex");
    $(".overlay .modul-newList").css("display", "block");
    $(".overlay .modul-newList .listName").val("");
}
let onNewList = function() {
    let listName = $(".overlay .modul-newList .listName").val();
    if (listName !== "" && todo[listName] === undefined && checkName(listName)) {
        newList(listName);
        unshowNewList();
    }
}
let unshowEditList = function() {
    $(".overlay").css("display", "none");
    $(".overlay .modul-editList").css("display", "none");
    selectedList = "";
}
let showEditList = function(htmlDiv) {
    let listName = $(htmlDiv).parent().parent().attr("id");
    $(".overlay").css("display", "flex");
    $(".overlay .modul-editList").css("display", "block");
    $(".overlay .modul-editList .listName").val(listName);
    $(".overlay .modul-editList .clearText").val("");
    $(".overlay .modul-editList .deleteText").val("");
    selectedList = listName.toString();
}
let onEditList = function() {
    let newListName = $(".overlay .modul-editList .listName").val().toString();
    if (newListName !== "" && todo[newListName] === undefined) {
        editList(selectedList, newListName);
        unshowEditList();
    }
}
let onClearList = function() {
    let clearText = $(".overlay .modul-editList .clearText").val().toString();
    if (clearText === "CLEAR") {
        clearList();
        unshowEditList();
    }
}
let onDeleteList = function() {
    let deleteText = $(".overlay .modul-editList .deleteText").val().toString();
    if (deleteText === "DELETE" && todo[selectedList]) {
        deleteList(selectedList);
        unshowEditList();
    }
}
let unshowNewTask = function() {
    $(".overlay").css("display", "none");
    $(".overlay .modul-newTask").css("display", "none");
    selectedList = "";
}
let showNewTask = function(htmlDiv) {
    let listName = $(htmlDiv).parent().parent().attr("id");
    $(".overlay").css("display", "flex");
    $(".overlay .modul-newTask").css("display", "block");
    $(".overlay .modul-newTask .taskTitle").val("");
    $(".overlay .modul-newTask .taskDesc").val("");
    $(".overlay .modul-newTask .taskProg").val("Incomplete");
    selectedList = listName;
}
let onNewTask = function() {
    let taskTitle = $(".overlay .modul-newTask .taskTitle").val().toString();
    if (taskTitle !== "" && selectedList !== "") {
        let taskDesc = $(".overlay .modul-newTask .taskDesc").val().toString();
        let taskProg = $(".overlay .modul-newTask .taskProg").val().toString();
        newTask(selectedList.toString(), taskTitle, taskDesc, taskProg);
        unshowNewTask();
    }
}
let unshowEditTask = function() {
    $(".overlay").css("display", "none");
    $(".overlay .modul-editTask").css("display", "none");
    allowEditTask = false;
    selectedList = "";
    selectedTask = "";
}
let showEditTask = function(htmlDiv) {
    let taskId = $(htmlDiv).attr('id');
    let listName = $(htmlDiv).parent().parent().attr("id");
    if (todo[listName] && todo[listName][taskId]) {
        $(".overlay").css("display", "flex");
        $(".overlay .modul-editTask").css("display", "block");
        $(".overlay .modul-editTask .taskTitle").val(todo[listName][taskId]["title"].toString());
        $(".overlay .modul-editTask .taskDesc").val(todo[listName][taskId]["desc"].toString());
        $(".overlay .modul-editTask .taskProg").val(todo[listName][taskId]["prog"].toString());
        $(".overlay .modul-editTask .deleteText").val("");
        allowEditTask = false;
        $(".overlay .modul-editTask .toggle_display").css("display", "none");
        $(".overlay .modul-editTask .toggle_disabled").attr("disabled", true);
        selectedList = listName;
        selectedTask = taskId;
    }
}
let toggleEditTask = function() {
    allowEditTask = !allowEditTask;
    if (allowEditTask) {
        $(".overlay .modul-editTask .toggle_display").css("display", "inline-block");
        $(".overlay .modul-editTask .toggle_disabled").removeAttr("disabled");
    }
    else {
        $(".overlay .modul-editTask .toggle_display").css("display", "none");
        $(".overlay .modul-editTask .toggle_disabled").attr("disabled", true);
    }
}
let onEditTask = function() {
    let taskTitle = $(".overlay .modul-editTask .taskTitle").val().toString();
    if (taskTitle !== "" && selectedList !== "" && selectedTask !== "" && todo[selectedList] && todo[selectedList][selectedTask]) {
        let taskDesc = $(".overlay .modul-editTask .taskDesc").val().toString();
        let taskProg = $(".overlay .modul-editTask .taskProg").val().toString();
        editTask(selectedList.toString(), selectedTask.toString(), taskTitle, taskDesc, taskProg);
        unshowEditTask();
    }
}
let onDeleteTask = function() {
    let deleteText = $(".overlay .modul-editTask .deleteText").val().toString();
    if (deleteText === "DELETE" && selectedList !== "" && selectedTask !== "" && todo[selectedList] && todo[selectedList][selectedTask]) {
        deleteTask(selectedList, selectedTask);
        unshowEditTask();
    }
}

// Save/Load Data
// Local Storage Functions
let saveData = function() {
    let todoJSON = JSON.stringify(todo);
    localStorage.data = todoJSON;
    updateInterface();
}
let loadData = function() {
    if (localStorage.data) {
        todo = JSON.parse(localStorage.data);
    }
    updateInterface();
}

loadData();