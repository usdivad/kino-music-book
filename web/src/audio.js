// // For testing; uncomment for production
// var audio = (function() {

//GLOB
// var bpm = btom(232);
var disstheme_bpm = 80.75;
var disstheme_timesig = 4*4; //4 beats * 4 bars
var kinotheme_bpm = 170;
var kinotheme_timesig = 76;
var mp3dir = "../layers%20Project/stems/"

//DISSTHEME_STRINGS
var disstheme_violin1 = new AudioEngine.Loop(mp3dir + "disstheme_strings head violin1.wav", mp3dir + "disstheme_strings loop violin1.wav", mp3dir + "disstheme_strings tail violin1.wav");
var disstheme_violin2 = new AudioEngine.Loop(mp3dir + "disstheme_strings head violin2.wav", mp3dir + "disstheme_strings loop violin2.wav", mp3dir + "disstheme_strings tail violin2.wav");
var disstheme_viola = new AudioEngine.Loop(mp3dir + "disstheme_strings head viola.wav", mp3dir + "disstheme_strings loop viola.wav", mp3dir + "disstheme_strings tail viola.wav");
var disstheme_cello = new AudioEngine.Loop(mp3dir + "disstheme_strings head cello.wav", mp3dir + "disstheme_strings loop cello.wav", mp3dir + "disstheme_strings tail cello.wav");

var disstheme_arr = [disstheme_violin1, disstheme_violin2, disstheme_viola, disstheme_cello];

//KINOTHEME
var kinotheme_piano = new AudioEngine.Loop(mp3dir + "kinotheme head piano.wav", mp3dir + "kinotheme loop piano.wav", mp3dir + "kinotheme tail piano.wav");
var kinotheme_vox = new AudioEngine.Loop(mp3dir + "kinotheme head vox.wav");
var kinotheme_arr = [kinotheme_piano, kinotheme_vox];

// var sprite_gtr = AudioEngine.to_audio("mp3/sprite_gtr.mp3");


//Conductor settings
var loop_arr = disstheme_arr;
var loop_timesig = disstheme_timesig;

var conductor = new AudioEngine.Conductor(disstheme_bpm, loop_timesig, loop_arr, function() {
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
function toKinotheme() {
    // pauseLoops(loop_arr);
    // conductor.toNextSection = true;
    // loop_arr = kinotheme_arr;
    // loop_timesig = kinotheme_timesig;
    conductor.nextPlayers = kinotheme_arr;
    conductor.nextTimesig = kinotheme_timesig;
    conductor.toNext = true;
    // playLoops(loop_arr);

}

function toDisstheme() {
    conductor.nextPlayers = disstheme_arr;
    conductor.nextTimesig = disstheme_timesig;
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

// var dbf = function() {
//     var sprite = sprite_gtr.slice(250, 500);
//     sprite.play();
// }

//conductor.setFunctionDownbeat(dbf);

// var disstheme_loop_backpiano = to_loop("mp3/disstheme_backpiano_loop.mp3");
// var disstheme_loop_piano = to_loop("mp3/disstheme_piano_loop.mp3");
// var disstheme_loops = new LoopMaster([disstheme_loop_backpiano, disstheme_loop_piano]);
// var sprite_gtr = to_audio("mp3/sprite_gtr.mp3");
// var disstheme_piano = to_audio("mp3/disstheme_backpiano_loop.mp3");

// //trying out scheduler using loops, sim playing
// var all_loaded = false;
// var scheduler = window.setInterval(function() {
//     disstheme_loops.checkAllLoaded();
//     if (disstheme_loops.all_loaded && sprite_gtr.isLoaded) {
//         metro.start();
//         // disstheme_loops.start();
//         window.clearInterval(scheduler);
//         console.log("let's play");
//     }
//     else {
//         console.log("not yet");
//     }
// }, 500)

// // For testing; uncomment for production
// })();