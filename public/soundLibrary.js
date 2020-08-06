function playMusic(soundName) {
    var sound = new Howl({
        src: [`sounds/${soundName}.wav`],
    });
    sound.play();
}

function togglePlay() {
    if(window.playing) return;
    window.playing = true;
    var bps = window.BPM / 60;
    var freq = 1 / bps;
    window.musicInt = setInterval(play, freq*250);
}

function play() {
    var table = document.getElementById("soundGrid");
    if(!(window.playPos <= window.nBeat)) {
        window.playPos = 1;
    }
    for(var i = 0; i < window.nInst; i++) {
        if(table.rows[i].cells[playPos].classList.contains('active')) {
            playMusic(window.instrs[i]);
        }
    }
    updatePlayCol();
    window.playPos++;
}

function updatePlayCol() {
    var table = document.getElementById("soundGrid");
    for(var i = 0; i < table.rows.length; i++) {
        if(window.playPos == 1) {
            table.rows[i].cells[window.nBeat].classList.remove("playing");
        }
        else {
            table.rows[i].cells[window.playPos - 1].classList.remove("playing");
        }
    }
    for(var i = 0; i < table.rows.length; i++) {
        table.rows[i].cells[window.playPos].classList.add("playing");
    }
}

function clearPlayCol() {
    var table = document.getElementById("soundGrid");
    for(var i = 0; i < window.nInst; i++) {
        for(var j = 1; j <= window.nBeat; j++) {
            table.rows[i].cells[j].classList.remove("playing");
        }
    }
}

function stop() {
    clearInterval(window.musicInt);
    window.playing = false;
    window.playPos = 1;
    clearPlayCol();
}

function pause() {
    clearInterval(window.musicInt);
    window.playing = false;
}

function bpmDown() {
    if(window.BPM <= 40) return;
    var bpmTag = document.getElementById("bpm");
    window.BPM -= 5;
    bpmTag.innerHTML = window.BPM;
    if(window.playing) {
        pause();
        togglePlay();
    }
}

function bpmUp() {
    if(window.BPM >= 220) return;
    var bpmTag = document.getElementById("bpm");
    window.BPM += 5;
    bpmTag.innerHTML = window.BPM;
    if(window.playing) {
        pause();
        togglePlay();
    }
}

function sharekey(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
/*
async function shareSound() {
    // TO DO: play added sound
    var name = sessionStorage.getItem("name");
    var code = sharekey(10);
    var recName = document.getElementById('candidate').value;
    var instruments = window.instrs;
    var noInstr = window.nInst;
    var beats = window.nBeat;
    var bpmRate = window.BPM;
    var soundArray = new Array(window.nInst);

    for (k = 0; k < window.nInst; k++) {
        soundArray[k] = new Array(window.nBeat);
    }

    for (i = 0; i < window.nInst; i++) {
        for (j = 1; j <= window.nBeat; j++) {
            if (document.getElementById("soundGrid").rows[i].cells[j].classList.contains('active')) {
                soundArray[i][j - 1] = 1;
            }
            else {
                soundArray[i][j - 1] = 0;
            }
        }
    }
    if (recName == '') {
        document.getElementById("playlistError").style.display = 'none';
        document.getElementById("recordingNotAdded").style.display = 'none';
        document.getElementById("recordingAdded").style.display = 'none';
        document.getElementById("recNameError").style.display = 'display';
    }
    else {
        var data = { name, recName, soundArray, instruments, noInstr, beats, bpmRate, code }
        var options = {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        }
        var res = await fetch('/save', options);
        if (res.status == 201) {
            document.getElementById("recordingNotAdded").style.display = 'block';
            document.getElementById("recordingAdded").style.display = 'none';
            document.getElementById("playlistError").style.display = 'none';
            document.getElementById("recNameError").style.display = 'none';
        }
        else if (res.status == 200) {
            document.getElementById("recordingNotAdded").style.display = 'none';
            document.getElementById("recordingAdded").style.display = 'block';
            document.getElementById("playlistError").style.display = 'none';
            document.getElementById("recNameError").style.display = 'none';
        }
    }
    sessionStorage.setItem('codeid', code); 
    addItem();
    sendmessage();
}
*/

async function saveSound() {
    // TO DO: Added in a feature for updating
    var code = sharekey(10);

    if (document.getElementById('candidate').value == '' || document.getElementById('candidate').value == null || document.getElementById('candidate').value == 'null') {
        document.getElementById('recNameError').style.display = 'block';
        return;
    }



    var name = sessionStorage.getItem("name");

    if (document.getElementById('candidate').value == '' || (sessionStorage.getItem('recName') != null && sessionStorage.getItem('recName') != 'null')) {
        recName = sessionStorage.getItem("recName");
    }
    else {
        var recName = document.getElementById('candidate').value;
    }
    document.getElementById('candidate').value = null;
    var instruments = window.instrs;
    var noInstr = window.nInst;
    var beats = window.nBeat;
    var bpmRate = window.BPM;
    var soundArray = new Array(window.nInst);

    // Before saving, check if something of the same name already exists
    var data = { name, recName };
    var options = {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    };

    res = await fetch('/checkname', options);

    if (res.status == 202) {
        //Go here if you want to update the thing
        code = sessionStorage.getItem('codeid'); //needs to be replaced

        for (k = 0; k < window.nInst; k++) {
            soundArray[k] = new Array(window.nBeat);
        }

        for (i = 0; i < window.nInst; i++) {
            for (j = 1; j <= window.nBeat; j++) {
                if (document.getElementById("soundGrid").rows[i].cells[j].classList.contains('active')) {
                    soundArray[i][j - 1] = 1;
                }
                else {
                    soundArray[i][j - 1] = 0;
                }
            }
        }
        if (recName == '') {
            document.getElementById("playlistError").style.display = 'none';
            document.getElementById("recordingNotAdded").style.display = 'none';
            document.getElementById("recordingAdded").style.display = 'none';
            document.getElementById("recNameError").style.display = 'display';
        }
        else {
            document.getElementById("updated").innerHTML = sessionStorage.getItem('recName') + " has been updated.";
            document.getElementById("updated").style.display = 'block';
            var data = { name, recName, soundArray, instruments, noInstr, beats, bpmRate, code }
            var options = {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                }
            }
            var res = await fetch('/update', options);

        }
        return;

    }

    //If you made it here, then no name already exists

    //On the EXTREMELY RARE CHANCE of two codes being the same, just in case i am checking here:
    var data = { code };
    var options = {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    };

    var res = await fetch('/codecheck', options);

    if (res.status == 202) {
        //The Code already exists for another music file
        code = sharekey(10);
    }


    for (k = 0; k < window.nInst; k++) {
        soundArray[k] = new Array(window.nBeat);
    }

    for (i = 0; i < window.nInst; i++) {
        for (j = 1; j <= window.nBeat; j++) {
            if (document.getElementById("soundGrid").rows[i].cells[j].classList.contains('active')) {
                soundArray[i][j - 1] = 1;
            }
            else {
                soundArray[i][j - 1] = 0;
            }
        }
    }
    if (recName == '') {
        document.getElementById("playlistError").style.display = 'none';
        document.getElementById("recordingNotAdded").style.display = 'none';
        document.getElementById("recordingAdded").style.display = 'none';
        document.getElementById("recNameError").style.display = 'display';
    }
    else {
        var data = { name, recName, soundArray, instruments, noInstr, beats, bpmRate, code}
        var options = {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        }
        var res = await fetch('/save', options);
        if (res.status == 201) {
            document.getElementById("recordingNotAdded").style.display = 'block';
            document.getElementById("recordingAdded").style.display = 'none';
            document.getElementById("playlistError").style.display = 'none';
            document.getElementById("recNameError").style.display = 'none';
        }
        else if (res.status == 200) {
            document.getElementById("recordingNotAdded").style.display = 'none';
            document.getElementById("recordingAdded").style.display = 'block';
            document.getElementById("playlistError").style.display = 'none';
            document.getElementById("recNameError").style.display = 'none';
        }
    }
    sessionStorage.setItem('codeid', code);
    addItem();
}
/*
async function saveSound() {
    // TO DO: play added sound
    var name = sessionStorage.getItem("name");
    var recName = document.getElementById('candidate').value;
    var instruments = window.instrs;
    var noInstr = window.nInst;
    var beats = window.nBeat;
    var bpmRate = window.BPM;
    var soundArray = new Array(window.nInst);

    for(k = 0; k < window.nInst; k++) {
        soundArray[k] = new Array(window.nBeat);
    }

    for(i = 0; i < window.nInst; i++) {
        for(j = 1; j <= window.nBeat; j++) {
            if(document.getElementById("soundGrid").rows[i].cells[j].classList.contains('active')) {
                soundArray[i][j-1] = 1;
            }
            else {
                soundArray[i][j-1] = 0;
            }
        }
    }
    if (recName == '') {
        document.getElementById("playlistError").style.display = 'none';
        document.getElementById("recordingNotAdded").style.display = 'none';
        document.getElementById("recordingAdded").style.display = 'none';
        document.getElementById("recNameError").style.display = 'display';
    }
    else {
        var data = {name, recName, soundArray, instruments, noInstr, beats, bpmRate}
        var options = {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        }
        var res = await fetch('/save', options);
        if (res.status == 201) {
            document.getElementById("recordingNotAdded").style.display = 'block';
            document.getElementById("recordingAdded").style.display = 'none';
            document.getElementById("playlistError").style.display = 'none';
            document.getElementById("recNameError").style.display = 'none';
        }
        else if (res.status == 200) {
            document.getElementById("recordingNotAdded").style.display = 'none';
            document.getElementById("recordingAdded").style.display = 'block';
            document.getElementById("playlistError").style.display = 'none';
            document.getElementById("recNameError").style.display = 'none';
        }
    }
    addItem();
}
*/
async function addItem(){
    var name = sessionStorage.getItem("name");
    var data = {name}
    var options = {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    }
    var res = await fetch('/displayPlaylist', options);
    var ul = document.getElementById("dynamic-list");
    ul.innerHTML = "";
    if (res.status == 200) {
        var result = await res.json();
        for (i=0 ; i < Object.keys(result).length ; i++) {
            var li = document.createElement("li");
            var link = document.createElement("button");
            //link.addEventListener('click', loadSound(result[i].recName));
            link.setAttribute('id',result[i].recName);
            link.addEventListener('click', function() {
                var id = this.innerHTML;
                loadSound(id);
            });
            link.setAttribute('id',result[i].recName);
            link.appendChild(document.createTextNode(result[i].recName));
            li.appendChild(link);
            ul.appendChild(li);
        }
        document.getElementById("dynamic-list").style.display = "block";
    }
    else if (res.status == 201) {
        console.log("Error : No playlist found.");
        document.getElementById("playlistError").style.display = 'block';
        document.getElementById("recordingNotAdded").style.display = 'none';
        document.getElementById("recordingAdded").style.display = 'none';
        document.getElementById("recNameError").style.display = 'none';
    }
    else {
        console.log("Error");
    }
}


async function loadSound(recName) {
    var name = sessionStorage.getItem("name");
    var data = {name, recName};
    var options = {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    }
    //console.log("first");
    var res = await fetch('/load', options);
    //console.log("first12");
    var result = await res.json();
    window.nInst = result.noInstr;
    window.nBeat = result.beats;
    window.bpm = result.bpmRate;
    window.instrs = result.instruments;
    soundArray = result.soundArray;
    console.log(soundArray);
    sessionStorage.setItem('codeid', result.code);
    sessionStorage.setItem('recName', result.recName);
    buildTable();
    for(i = 0; i < window.nInst; i++) {
        for(j = 0; j <= window.nBeat; j++) {
            if(soundArray[i][j] == 1) {
                document.getElementById("soundGrid").rows[i].cells[j+1].classList.add('active');
            }
        }
    }
}

async function loadshareable(recName) {
    var code = document.getElementById('friendid').value;
    var data = {code};
    var options = {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    }
    //console.log("first");
    var res = await fetch('/idload', options);
    //console.log("first12");
    var result = await res.json();
    window.nInst = result.noInstr;
    window.nBeat = result.beats;
    window.bpm = result.bpmRate;
    window.instrs = result.instruments;
    soundArray = result.soundArray;
    console.log(soundArray);
    buildTable();
    for (i = 0; i < window.nInst; i++) {
        for (j = 0; j <= window.nBeat; j++) {
            if (soundArray[i][j] == 1) {
                document.getElementById("soundGrid").rows[i].cells[j + 1].classList.add('active');
            }
        }
    }
}

async function playlist() {
    if(document.getElementById("dynamic-list").style.display == "block") {
        document.getElementById("dynamic-list").style.display = "none";
        return;
    }
    else {
        addItem();
        document.getElementById("dynamic-list").style.display = "block";
    }
}


// async function addSound() {
//     var soundInput = document.getElementById('addSound');
//     var file = soundInput.files[0];
//     var name = "harmonica";
//     var owner = sessionStorage.getItem("name");
//     var data = {name, owner};
//     var options = {
//         method: 'POST',
//         body: JSON.stringify(data),
//         headers: {
//             'Content-Type': 'application/json'
//         }
//     };
//     var res = await fetch('/addSound', options);
//     var data = await res.json();
//     var fName = data._id.concat('.mp3');
//     fPath = "sound/".concat("users".concat("/".concat(fName)));
//     alert(fPath);
//     options = {
//         method: 'POST',
//         body: file
//     };
//     var res = await fetch('/writeSound', options);
// }

function init() {
    window.nInst = 2;
    window.nBeat = 16;
    window.BPM = 120;
    window.playPos = 1;
    window.instrs = ['Kick', 'HiHat'];
}

function buildTable() {
  //find where is the table
    var table = document.getElementById("soundGrid");
    table.innerHTML = "";
    cntr = 3;
    for(i = 0; i < window.nInst; i++) {
        table.insertRow();
        for(j = 0; j < window.nBeat; j++) {
            table.rows[i].insertCell();
            if(cntr == 3) {
                table.rows[i].cells[j].classList.add('downBeat');
                cntr = 0;
            }
            else {
                cntr++;
            }
            table.rows[i].cells[j].addEventListener("click", function() {
                this.classList.toggle('active');
            });
        }
        var instName = table.rows[i].insertCell(0);
        instName.style.backgroundColor = "GhostWhite";
        instName.innerHTML = getImg(window.instrs[i]);
    }
}

function createInstrument(soundName) {
    var table = document.getElementById("soundGrid");
    //TODO: Add instrument selection panel.
    window.nInst++;
    window.instrs.push(`${soundName}`);
    table.insertRow(-1);
    var cntr = 3;
    var i = window.nInst - 1;
    for(j = 0; j < window.nBeat; j++) {
        table.rows[i].insertCell(-1);
        if(cntr == 3) {
            table.rows[i].cells[j].classList.add('downBeat');
            cntr = 0;
        }
        else {
            cntr++;
        }
        table.rows[i].cells[j].addEventListener("click", function() {
            this.classList.toggle('active');
        });
    }
    var instName = table.rows[i].insertCell(0);
    instName.style.backgroundColor = "GhostWhite";
    instName.innerHTML = getImg(soundName);
}

function getImg(soundName) {
    if(soundName == 'Kick'){
        return "<img src=\"stylesheets/instIcon/kick.png\" width=\"35px\" height=\"35px\">";
      }
      else if (soundName == 'Ride'){
        return "<img src=\"stylesheets/instIcon/ride2.png\" width=\"35px\" height=\"35px\">";
      }
      else if(soundName == 'Crash'){
        return "<img src=\"stylesheets/instIcon/crash.png\" width=\"35px\" height=\"35px\">";
      }
      else if(soundName == 'HiHat'){
        return "<img src=\"stylesheets/instIcon/ride.png\" width=\"35px\" height=\"35px\">";
      }
      else if(soundName == 'OpenHat'){
        return "<img src=\"stylesheets/instIcon/openHat.png\" width=\"35px\" height=\"35px\">";
      }
      else if(soundName == 'Sdst'){
        return "<img src=\"stylesheets/instIcon/sdst.png\" width=\"35px\" height=\"35px\">";
      }
      else if(soundName == 'Snare'){
        return "<img src=\"stylesheets/instIcon/snare.png\" width=\"35px\" height=\"35px\">";
      }
      else if(soundName == 'Tom1'){
        return "<img src=\"stylesheets/instIcon/tom1.png\" width=\"35px\" height=\"35px\">";
      }
      else {
        return "<img src=\"stylesheets/instIcon/tom2.png\" width=\"35px\" height=\"35px\">";
      }
}

function addColumns() {
    var table = document.getElementById("soundGrid");
    var cntr = 3;
    for (i = 0; i < table.rows.length; i++) {
        for(var j = 0; j < 4; j++) {
            table.rows[i].insertCell(-1);
            if(cntr == 3) {
                table.rows[i].cells[window.nBeat + j + 1].classList.add('downBeat');
                cntr = 0;
            }
            else {
                cntr++;
            }
            table.rows[i].cells[window.nBeat + j + 1].addEventListener("click", function() {
                this.classList.toggle('active');
            });
        }
    }
    window.nBeat += 4;
}

function deleterow() {
    var table = document.getElementById("soundGrid");
    window.instrs.pop();
    window.nInst--;
    table.deleteRow(-1);
}

function deleteColumn() {
    var table = document.getElementById("soundGrid");
    for (i = 0; i < table.rows.length; i++) {
        for(var j = 0; j < 4; j++) {
            table.rows[i].deleteCell(-1);
        }
    }
    window.nBeat -= 4;
}

// function displayTitle(){
//   if(document.getElementById("displayN").style.display == "block"){
//     document.getElementById("displayN").style.display = "none";
//   }
//   else {
//     document.getElementById("displayN").style.display == "block";
//   }
// }
