// Courses from the API
let courseList;
let course;
let numPlayers = 4;

// Data for the scorecard
let tees = ["Pro", "Champion", "Men", "Women"];
let teeType = 0;
let userData = [
    [["PLAYER", 0, 0, 0, 0, 0, 0, 0, 0, 0, "OUT"], [0, 0, 0, 0, 0, 0, 0, 0, 0, "IN", "TOTAL"]],
    [["PLAYER", 0, 0, 0, 0, 0, 0, 0, 0, 0, "OUT"], [0, 0, 0, 0, 0, 0, 0, 0, 0, "IN", "TOTAL"]],
    [["PLAYER", 0, 0, 0, 0, 0, 0, 0, 0, 0, "OUT"], [0, 0, 0, 0, 0, 0, 0, 0, 0, "IN", "TOTAL"]],
    [["PLAYER", 0, 0, 0, 0, 0, 0, 0, 0, 0, "OUT"], [0, 0, 0, 0, 0, 0, 0, 0, 0, "IN", "TOTAL"]]
];
let names = ["", "", "", ""];
let messages = ["", "", "", ""];
let holeData = [["HOLES", 1, 2, 3, 4, 5, 6, 7, 8, 9, "OUT"], [10, 11, 12, 13, 14, 15, 16, 17, 18, "IN", "TOTAL"]];
let parData = [["PAR", 0, 0, 0, 0, 0, 0, 0, 0, 0, "OUT"], [0, 0, 0, 0, 0, 0, 0, 0, 0, "IN", "TOTAL"]];
let yardageData = [["YARDS", 0, 0, 0, 0, 0, 0, 0, 0, 0, "OUT"], [0, 0, 0, 0, 0, 0, 0, 0, 0, "IN", "TOTAL"]];
let handicapData = [["HCP", 0, 0, 0, 0, 0, 0, 0, 0, 0, "OUT"], [0, 0, 0, 0, 0, 0, 0, 0, 0, "IN", "TOTAL"]];

// Courses menu script
let navOpen = false;
let toggleNav = function() {
    if (navOpen) {
        document.getElementById("courses").removeAttribute("style");
        document.getElementById("tees").removeAttribute("style");
        navOpen = false;
    }
    else {
        document.getElementById("courses").style.display = "flex";
        document.getElementById("tees").style.display = "flex";
        navOpen = true;
    }
}


// -----------------------------------------------------
// -----------------------------------------------------
// ---------------------- GUI WORK ---------------------
// -----------------------------------------------------
// -----------------------------------------------------

let checkUsernames = function(plr, str) {
    let okay = true;
    for (let i = 0; i < names.length; i++) {
        if (plr != i && names[i] == str) {
            okay = false;
        }
        else {
            names[plr] = str;
        }
    }
    return okay;
}

let updateScore = function() {
    for (let usr = 0; usr < userData.length; usr++) {
        let totalOut = 0;
        let totalIn = 0;
        let total = 0;
        let done = true;
        for (let i = 1; i < 10; i++) {
            totalOut += userData[usr][0][i];
            if (userData[usr][0][i] == 0) {
                done = false;
            }
        }
        for (let i = 0; i < 9; i++) {
            totalIn += userData[usr][1][i];
            if (userData[usr][1][i] == 0) {
                done = false;
            }
        }
        total = totalOut + totalIn;
        if (done && document.getElementById(`msg${usr}`)) {
            if (total > parData[1][10]) {
                document.getElementById(`msg${usr}`).innerHTML = `${names[usr]}, do better.`;
            }
            else if (total < parData[1][10]) {
                document.getElementById(`msg${usr}`).innerHTML = `${names[usr]}, nice job getting lucky.`;
            }
            else if (total == parData[1][10]) {
                document.getElementById(`msg${usr}`).innerHTML = `${names[usr]}, you are average.`;
            }
        }
        else if (document.getElementById(`msg${usr}`)) {
            document.getElementById(`msg${usr}`).innerHTML = "";
        }
        if (Number.isInteger(total) && Number.isInteger(totalOut) && Number.isInteger(totalIn)) {
            userData[usr][0][10] = totalOut;
            userData[usr][1][9] = totalIn;
            userData[usr][1][10] = total;
        }
        else {
            userData[usr][0][10] = "OUT";
            userData[usr][1][9] = "IN";
            userData[usr][1][10] = "TOTAL";
        }
    }
}

let userChanged = function(obj) {
    if (typeof obj == "object" && obj.id) {
        let input = document.getElementById(obj.id);
        let num = Number(input.value);
        let plr = Number(input.id.slice(6,7));
        let slot = Math.abs(Number(input.id.slice(input.id.length - 2, input.id.length)));
        if (input && input.id.slice(input.id.length - 2, input.id.length) == "-0" && Number.isInteger(plr) && checkUsernames(plr, input.value)) {
            input.value = input.value;
        }
        else if (input && input.id.slice(input.id.length - 2, input.id.length) != "-0" && Number.isInteger(num) && Number.isInteger(plr) && input.value > 0) {
            if (Number.isInteger(slot)) {
                if (slot > 9) {
                    userData[plr][1][slot - 10] = num;
                }
                else {
                    userData[plr][0][slot] = num;
                }
            }
            input.value = num;
        }
        else {
            input.value = "";
            if (Number.isInteger(slot)) {
                if (slot > 9) {
                    userData[plr][1][slot - 10] = 0;
                }
                else {
                    userData[plr][0][slot] = 0;
                }
            }
        }
    }
    updateScore();
    for (let i = 0; i < numPlayers; i++) {
        if (document.getElementById(`player${i}out-10`)) {
            document.getElementById(`player${i}out-10`).value = userData[i][0][10];
        }
        if (document.getElementById(`player${i}in-19`)) {
        document.getElementById(`player${i}in-19`).value = userData[i][1][9];
        }
        if (document.getElementById(`player${i}in-20`)) {
        document.getElementById(`player${i}in-20`).value = userData[i][1][10];
        }
    }
}

let rowInsertion = function(row, array) {
    for (let i = 0; i < array.length; ++i) {
        row.innerHTML = row.innerHTML + `<h4 class="row-element light">${array[i]}</h4>`;
    }
}
let userRowInsertion = function(row, array) {
    for (let i = 0; i < array.length; ++i) {
        let num = i;
        if (row.id.slice(row.id.length - 2, row.id.length) == "in") {
            num += 10;
        }
        row.innerHTML = row.innerHTML + `<input type="text" onkeyup="userChanged(this)" id="${row.id}-${num}" class="">`;
        document.getElementById(`${row.id}-${num}`).placeholder = array[i];
        if (document.getElementById(`${row.id}-20`)) {
            document.getElementById(`${row.id}-20`).disabled = true;
        }
        else if (document.getElementById(`${row.id}-19`)) {
            document.getElementById(`${row.id}-19`).disabled = true;
        }
        else if (row.id.slice(row.id.length - 3, row.id.length) == "out" && document.getElementById(`${row.id}-10`)) {
            document.getElementById(`${row.id}-10`).disabled = true;
        }
    }
}

let resetScorecard = function() {
    let cardOut = document.getElementById("out");
    let cardIn = document.getElementById("in");
    document.getElementById("title").innerHTML = course["name"] + ` (${tees[teeType]})`;

    document.getElementById("out").innerHTML = "";
    document.getElementById("in").innerHTML = "";

    document.getElementById("out").innerHTML = document.getElementById("out").innerHTML + `<div id="holesOut" class="row"></div>`;
    rowInsertion(document.getElementById("holesOut"), holeData[0]);
    document.getElementById("in").innerHTML = document.getElementById("in").innerHTML + `<div id="holesIn" class="row"></div>`;
    rowInsertion(document.getElementById("holesIn"), holeData[1]);

    for (let i = 0; i < userData.length; i++) {
        document.getElementById("out").innerHTML = document.getElementById("out").innerHTML + `<div id="player${i}out" class="row"></div>`;
        userRowInsertion(document.getElementById(`player${i}out`), userData[i][0]);
        document.getElementById("in").innerHTML = document.getElementById("in").innerHTML + `<div id="player${i}in" class="row"></div>`;
        userRowInsertion(document.getElementById(`player${i}in`), userData[i][1]);
    }

    document.getElementById("out").innerHTML = document.getElementById("out").innerHTML + `<div id="parOut" class="row"></div>`;
    rowInsertion(document.getElementById("parOut"), parData[0]);
    document.getElementById("in").innerHTML = document.getElementById("in").innerHTML + `<div id="parIn" class="row"></div>`;
    rowInsertion(document.getElementById("parIn"), parData[1]);

    document.getElementById("out").innerHTML = document.getElementById("out").innerHTML + `<div id="yardsOut" class="row"></div>`;
    rowInsertion(document.getElementById("yardsOut"), yardageData[0]);
    document.getElementById("in").innerHTML = document.getElementById("in").innerHTML + `<div id="yardsIn" class="row"></div>`;
    rowInsertion(document.getElementById("yardsIn"), yardageData[1]);

    document.getElementById("out").innerHTML = document.getElementById("out").innerHTML + `<div id="hcpOut" class="row"></div>`;
    rowInsertion(document.getElementById("hcpOut"), handicapData[0]);
    document.getElementById("in").innerHTML = document.getElementById("in").innerHTML + `<div id="hcpIn" class="row"></div>`;
    rowInsertion(document.getElementById("hcpIn"), handicapData[1]);
}



let createData = function() {
    if (course.id == "19002" && teeType >= 3) {
        teeType = 1;
    }
    parData = [["PAR", 0, 0, 0, 0, 0, 0, 0, 0, 0, "OUT"], [0, 0, 0, 0, 0, 0, 0, 0, 0, "IN", "TOTAL"]];
    yardageData = [["YARDS", 0, 0, 0, 0, 0, 0, 0, 0, 0, "OUT"], [0, 0, 0, 0, 0, 0, 0, 0, 0, "IN", "TOTAL"]];
    handicapData = [["HCP", 0, 0, 0, 0, 0, 0, 0, 0, 0, "OUT"], [0, 0, 0, 0, 0, 0, 0, 0, 0, "IN", "TOTAL"]];
    let parTotal = [0, 0, 0];
    let yardageTotal = [0, 0, 0];
    let handicapTotal = [0, 0, 0];
    for (let i = 0; i < course["holes"].length / 2; i++) {
        parData[0][i + 1] = course["holes"][i]["teeBoxes"][teeType]["par"];
        parTotal[0] += course["holes"][i]["teeBoxes"][teeType]["par"];
        yardageData[0][i + 1] = course["holes"][i]["teeBoxes"][teeType]["yards"];
        yardageTotal[0] += course["holes"][i]["teeBoxes"][teeType]["yards"];
        handicapData[0][i + 1] = course["holes"][i]["teeBoxes"][teeType]["hcp"];
        handicapTotal[0] += course["holes"][i]["teeBoxes"][teeType]["hcp"];
    }
    parData[0][10] = parTotal[0];
    yardageData[0][10] = yardageTotal[0];
    handicapData[0][10] = handicapTotal[0];
    for (let i = 0; i < course["holes"].length / 2; i++) {
        parData[1][i] = course["holes"][i + course["holes"].length / 2]["teeBoxes"][teeType]["par"];
        parTotal[1] += course["holes"][i + course["holes"].length / 2]["teeBoxes"][teeType]["par"];
        yardageData[1][i] = course["holes"][i + course["holes"].length / 2]["teeBoxes"][teeType]["yards"];
        yardageTotal[1] += course["holes"][i + course["holes"].length / 2]["teeBoxes"][teeType]["yards"];
        handicapData[1][i] = course["holes"][i + course["holes"].length / 2]["teeBoxes"][teeType]["hcp"];
        handicapTotal[1] += course["holes"][i + course["holes"].length / 2]["teeBoxes"][teeType]["hcp"];
    }
    parData[1][9] = parTotal[1];
    yardageData[1][9] = yardageTotal[1];
    handicapData[1][9] = handicapTotal[1];
    parTotal[2] = parTotal[1] + parTotal[0];
    yardageTotal[2] = yardageTotal[1] + yardageTotal[0];
    handicapTotal[2] = handicapTotal[1] + handicapTotal[0];
    parData[1][10] = parTotal[2];
    yardageData[1][10] = yardageTotal[2];
    handicapData[1][10] = handicapTotal[2];
}
// -----------------------------------------------------
// -----------------------------------------------------
// -------------- COURSE WORK FROM THE API -------------
// -----------------------------------------------------
// -----------------------------------------------------

let addCourses = function() {
    for (let i = 0; i < courseList.length; i++) {
        let courseButton = `
        <button id=${courseList[i]["id"]} onclick="clickCourse(this)">${courseList[i]["name"]}</button>
        `;
        document.getElementById("courses").innerHTML = document.getElementById("courses").innerHTML + courseButton;
    }
    for (let i = 0; i < tees.length; i++) {
        let teeButton = `
        <button id=${i} onclick="clickTee(this)">${tees[i]}</button>
        `;
        document.getElementById("tees").innerHTML = document.getElementById("tees").innerHTML + teeButton;
    }
}
let clickCourse = function(obj) {
    if (typeof obj == "object" && obj.id) {
        changeCourse(obj.id);
    }
}
let clickTee = function(obj) {
    if (typeof obj == "object" && obj.id) {
        teeType = obj.id;
        if (course.id == "19002") {
            teeType = Math.abs(teeType - 1);
        }
        changeCourse(course["id"]);
    }
}
let changeCourse = function(id) {
    let coursePromise = new Promise(function(resolve, reject) {
        let request = new XMLHttpRequest();
        request.onreadystatechange = function() {
            if (request.readyState == 4 && request.status == 200) {
                resolve(JSON.parse(request.responseText));
            }
        }
        request.open("GET", "https://golf-courses-api.herokuapp.com/courses/" + id, true);
        request.send();
    });
    coursePromise.then(function(newCourse) {
        if (newCourse["data"]) {
            course = newCourse["data"];
            userData = [
                [["PLAYER", 0, 0, 0, 0, 0, 0, 0, 0, 0, "OUT"], [0, 0, 0, 0, 0, 0, 0, 0, 0, "IN", "TOTAL"]],
                [["PLAYER", 0, 0, 0, 0, 0, 0, 0, 0, 0, "OUT"], [0, 0, 0, 0, 0, 0, 0, 0, 0, "IN", "TOTAL"]],
                [["PLAYER", 0, 0, 0, 0, 0, 0, 0, 0, 0, "OUT"], [0, 0, 0, 0, 0, 0, 0, 0, 0, "IN", "TOTAL"]],
                [["PLAYER", 0, 0, 0, 0, 0, 0, 0, 0, 0, "OUT"], [0, 0, 0, 0, 0, 0, 0, 0, 0, "IN", "TOTAL"]]
            ];
            createData();
            resetScorecard();
        }
    });
}
let begin = function() {
    let courseListPromise = new Promise(function(resolve, reject) {
        let request = new XMLHttpRequest();
        request.onreadystatechange = function() {
            if (request.readyState == 4 && request.status == 200) {
                resolve(JSON.parse(request.responseText));
            }
        };
        request.open("GET", "https://golf-courses-api.herokuapp.com/courses", true);
        request.setRequestHeader("ContentType", "application/json")
        request.send();
    });
    courseListPromise.then(function(newCourseList) {
        if (newCourseList["courses"]) {
            courseList = newCourseList["courses"];
            changeCourse(courseList[0]["id"]);
            addCourses();
        }
    });
}

begin();