// // For testing; uncomment for production
// var audio = (function() {

/*
    Global
*/
var mp3dir = "../layers%20Project/stems/"
var current_theme = "diss";

/*
    Disstheme
*/
// Timing, beats, etc.
var disstheme_bpm = "BPM" + 80.75 + " L4";
var disstheme_timesig = 7*4; //7 bars * 4 beats
var disstheme_transition_A1 = 2*4;
var disstheme_transition_A2 = 4*4;
var disstheme_transition_B = 5*4;
var disstheme_transition_C = 0; //has to be the beat where it would have re-looped, and it'll always end at timesig-1
var disstheme_transitionBeats = [disstheme_transition_A1, disstheme_transition_A2, disstheme_transition_B, disstheme_transition_C];

// Loop objects
var disstheme_violin1 = new Kino.Loop(
    mp3dir + "disstheme init violin1.wav",
    mp3dir + "disstheme loop violin1.wav",
    [
        {url: mp3dir + "disstheme tailA violin1.wav", beats: [disstheme_transition_A1, disstheme_transition_A2]},
        {url: mp3dir + "disstheme tailB violin1.wav", beats: [disstheme_transition_B]},
        {url: mp3dir + "disstheme tailC violin1.wav", beats: [disstheme_transition_C]}
    ]
);
var disstheme_violin2 = new Kino.Loop(
    mp3dir + "disstheme init violin2.wav",
    mp3dir + "disstheme loop violin2.wav",
    [
        {url: mp3dir + "disstheme tailA violin2.wav", beats: [disstheme_transition_A1, disstheme_transition_A2]},
        {url: mp3dir + "disstheme tailB violin2.wav", beats: [disstheme_transition_B]},
        {url: mp3dir + "disstheme tailC violin2.wav", beats: [disstheme_transition_C]}
    ]
);
var disstheme_viola = new Kino.Loop(
    mp3dir + "disstheme init viola.wav",
    mp3dir + "disstheme loop viola.wav",
    [
        {url: mp3dir + "disstheme tailA viola.wav", beats: [disstheme_transition_A1, disstheme_transition_A2]},
        {url: mp3dir + "disstheme tailB viola.wav", beats: [disstheme_transition_B]},
        {url: mp3dir + "disstheme tailC viola.wav", beats: [disstheme_transition_C]}
    ], 1
);
var disstheme_cello = new Kino.Loop(
    mp3dir + "disstheme init cello.wav",
    mp3dir + "disstheme loop cello.wav",
    [
        {url: mp3dir + "disstheme tailA cello.wav", beats: [disstheme_transition_A1, disstheme_transition_A2]},
        {url: mp3dir + "disstheme tailB cello.wav", beats: [disstheme_transition_B]},
        {url: mp3dir + "disstheme tailC cello.wav", beats: [disstheme_transition_C]}
    ], 1
);

var disstheme_arr = [disstheme_violin1, disstheme_violin2, disstheme_viola, disstheme_cello];

// Transition function
function toDisstheme() {
    conductor.nextPlayers = disstheme_arr;
    conductor.nextBpm = disstheme_bpm;
    conductor.nextTimesig = disstheme_timesig;
    conductor.nextTransitionBeats = disstheme_transitionBeats;
    conductor.toNext = true;
    // conductor.toTail = true;
    current_theme = "diss";
    conductor.section = "diss";
}

/*
    Kinotheme
*/
var kinotheme_bpm = "BPM" + 170 + " L4";
var kinotheme_timesig = 76;
var kinotheme_transitionBeats = [0,10,20,30,40,50,60,70];

var kinotheme_piano = new Kino.Loop(mp3dir + "kinotheme init piano.wav", mp3dir + "kinotheme loop piano.wav", [{url: mp3dir + "kinotheme tail piano.wav", beats: [0]}]);
var kinotheme_vox = new Kino.Loop(
    mp3dir + "kinotheme vox.wav", mp3dir + "kinotheme vox.wav", [{url: mp3dir + "empty.wav", beats: [0]}],
    0);
var kinotheme_arr = [kinotheme_piano, kinotheme_vox];


//Transition function
function toKinotheme() {
    // pauseLoops(loop_arr);
    // conductor.toNextSection = true;
    // loop_arr = kinotheme_arr;
    // loop_timesig = kinotheme_timesig;

    // kinotheme_vox.mute();
    // kinotheme_vox.off();

    conductor.nextPlayers = kinotheme_arr;
    conductor.nextBpm = kinotheme_bpm;
    conductor.nextTimesig = kinotheme_timesig;
    conductor.nextTransitionBeats = kinotheme_transitionBeats;
    conductor.toNext = true;
    // conductor.toTail = true;

    // playLoops(loop_arr);
    current_theme = "kino";
    conductor.section = "kino";
}

// var sprite_gtr = Kino.to_audio("mp3/sprite_gtr.mp3");


/*
    Conductor settings
*/
var loop_arr = disstheme_arr;
var loop_timesig = disstheme_timesig;

var conductor = new Kino.Conductor(disstheme_bpm, loop_timesig, disstheme_transitionBeats, loop_arr, current_theme, function() {
    console.log("START");
    // pauseLoops(loop_arr);
    // playLoops(loop_arr);
}, function() {
    console.log("boop");
}, function() {
    console.log("STOP");
    // pauseLoops(loop_arr);
});


// // Tests: checkAllLoaded
// var checker = setInterval(function() {
//     conductor.checkAllLoaded();
// }, 100);


/*
    Scroll control!
*/
var scroll = 0;
$(window).scroll(function(event) {
    scroll = $(window).scrollTop();
    console.log ("scroll is " + scroll);
    if (scroll > 1500) {
        if (current_theme != "kino") {
            toKinotheme();
            console.log("-> kino");
        }
    }
    else {
        if (current_theme != "diss") {
            toDisstheme();
            console.log("-> diss");
        }
    }
});

// // For testing; uncomment for production
// })();