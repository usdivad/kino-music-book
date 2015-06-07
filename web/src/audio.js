// // For testing; uncomment for production
// var audio = (function() {

//GLOB
// var bpm = btom(232);
var bpm = 232;
var v_timesig = 13 * 4; //13 beats * 4 bars
var c_timesig = 24;

//VERSE
var v_piano = new AudioEngine.Loop("mp3/v_piano_loop.mp3", "mp3/v_piano_init.mp3");
var v_backpiano = new AudioEngine.Loop("mp3/v_backpiano_loop.mp3");
var v_drums = new AudioEngine.Loop("mp3/v_drums_loop.mp3");
var v_arr = [v_piano, v_backpiano, v_drums];

//CHORUS
var c_piano = new AudioEngine.Loop("mp3/c_piano_loop.mp3", "mp3/c_piano_init.mp3");
var c_backpiano = new AudioEngine.Loop("mp3/c_backpiano_loop.mp3");
var c_drums = new AudioEngine.Loop("mp3/c_drums_loop.mp3");
var c_arr = [c_piano, c_backpiano, c_drums];

var sprite_gtr = AudioEngine.to_audio("mp3/sprite_gtr.mp3");


//Conductor settings
var loop_arr = v_arr;
var loop_timesig = v_timesig;
var conductor = new AudioEngine.Conductor(bpm, loop_timesig, loop_arr, function() {
    console.log("START");
    // pauseLoops(loop_arr);
    // playLoops(loop_arr);
}, function() {
    console.log("boop");
}, function() {
    console.log("STOP");
    // pauseLoops(loop_arr);
});




//Transition between sections
function toChorus() {
    // pauseLoops(loop_arr);
    // conductor.toNextSection = true;
    // loop_arr = c_arr;
    // loop_timesig = c_timesig;
    conductor.nextPlayers = c_arr;
    conductor.nextTimesig = c_timesig;
    conductor.toNext = true;
    // playLoops(loop_arr);

}

function toVerse() {
    conductor.nextPlayers = v_arr;
    conductor.nextTimesig = v_timesig;
    conductor.toNext = true;
}



// function playLoops(loop_arr) {
//     for (var i=0; i<loop_arr.length; i++) {
//         loop_arr[i].play();
//     }
// }

// function pauseLoops(loop_arr) {
//     for (var i=0; i<loop_arr.length; i++) {
//         loop_arr[i].pause();
//     }
// }

var dbf = function() {
    var sprite = sprite_gtr.slice(250, 500);
    sprite.play();
}

//conductor.setFunctionDownbeat(dbf);

// var v_loop_backpiano = to_loop("mp3/v_backpiano_loop.mp3");
// var v_loop_piano = to_loop("mp3/v_piano_loop.mp3");
// var v_loops = new LoopMaster([v_loop_backpiano, v_loop_piano]);
// var sprite_gtr = to_audio("mp3/sprite_gtr.mp3");
// var v_piano = to_audio("mp3/v_backpiano_loop.mp3");

// //trying out scheduler using loops, sim playing
// var all_loaded = false;
// var scheduler = window.setInterval(function() {
//     v_loops.checkAllLoaded();
//     if (v_loops.all_loaded && sprite_gtr.isLoaded) {
//         metro.start();
//         // v_loops.start();
//         window.clearInterval(scheduler);
//         console.log("let's play");
//     }
//     else {
//         console.log("not yet");
//     }
// }, 500)

// // For testing; uncomment for production
// })();