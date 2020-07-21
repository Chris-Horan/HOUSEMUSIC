function playMusic(soundName) {
    var sound = new Howl({
        src: [`sounds/${soundName}.wav`],
    });
    sound.play();
}

function pauseMusic(){
    sound.pause();
}

function togglePlay() {
    if(window.playing) return;
    window.playing = true;
    var bpm = 120;
    var bps = bpm / 60;
    var freq = 1 / bps;
    var table = document.getElementById("soundGrid");
    window.musicInt = setInterval(play, freq*1000);
}

function play() {
    playMusic('Kick');
}

function pause() {
    clearInterval(window.musicInt);
    window.playing = false;
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