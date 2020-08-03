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
    if(!(window.playPos < window.nBeat)) {
        window.playPos = 0;
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
        if(window.playPos == 0) {
            table.rows[i].cells[window.nBeat - 1].classList.remove("playing");
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
        for(var j = 0; j < window.nBeat; j++) {
            table.rows[i].cells[j].classList.remove("playing");
        }
    }
}

function stop() {
    clearInterval(window.musicInt);
    window.playing = false;
    window.playPos = 0;
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

async function loadSound() {
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
        for(j = 0; j < window.nBeat; j++) {
            if(document.getElementById("soundGrid").rows[i].cells[j].classList.toggle('active')) {
                soundArray[i][j] = 0;
            }
            else {
                soundArray[i][j] = 1;
            }
        }
    }
    // console.log(recName);
    if (recName == '') {
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
        var res = await fetch('/load', options);
        if (res.status == 201) {
            document.getElementById("recordingNotAdded").style.display = 'block';
            document.getElementById("recordingAdded").style.display = 'none';
        }
        else if (res.status == 200) {
            document.getElementById("recordingNotAdded").style.display = 'none';
            document.getElementById("recordingAdded").style.display = 'block';
        }
    }
    addItem(recName);
    // playlist()
} 

function addItem(value){
    var ul = document.getElementById("dynamic-list");
    // var candidate = document.getElementById("candidate");
    var li = document.createElement("li");
    var link = document.createElement("a");
    link.setAttribute('href', '');
    link.setAttribute('id',value);
    link.appendChild(document.createTextNode(value));
    li.appendChild(link);
    ul.appendChild(li);
}

async function playlist() {
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
    if (res.status == 200) {
        var result = await res.json();
        for (i=0 ; i < Object.keys(result).length ; i++) {
            addItem(result[i].recName);
        }
    }
    else if (res.status == 201) {
        console.log("Error : No playlist found.");
        document.getElementById("playlistError").style.display = 'block';
    }
    else {
        console.log("Error");
    }
    document.getElementById("playlist").disabled = true;
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

function buildTable() {
    var table = document.getElementById("soundGrid");
    window.nInst = 2;
    window.nBeat = 16;
    window.BPM = 120;
    window.playPos = 0;
    window.instrs = ['Kick', 'Ride'];
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
}

function addColumns() {
    var table = document.getElementById("soundGrid");
    var cntr = 3;
    for (i = 0; i < table.rows.length; i++) {
        for(var j = 0; j < 4; j++) {
            table.rows[i].insertCell(-1);
            if(cntr == 3) {
                table.rows[i].cells[window.nBeat + j].classList.add('downBeat');
                cntr = 0;
            }
            else {
                cntr++;
            }
            table.rows[i].cells[window.nBeat + j].addEventListener("click", function() {
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