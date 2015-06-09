var AudioEngine = (function(ae) {
/*
    Conductor object. A glorified Metronome.

    Vars:
    - bpm = beats per minute (tempo)
    - timesig = time signature; currently includes multiple bars, e.g. 4 bars of 13/4 makes a timesig of 13*4=52
    - players = an array of loops
    - function_downbeat = function that is called on beat 1 of the bar
    - function_upbeat = function that is called on every other beat of the bar
    - function_stop = function that is called when metronome is stopped
*/

//Constructor
ae.Conductor = function(bpm, timesig, transitionBeats, players, function_downbeat, function_upbeat, function_stop) {
    var conductor = this;
    this.bpm = bpm;
    this.interval = "BPM" + this.bpm + " L4";
    this.timesig = timesig;
    this.players = players;
    this.transitionBeats = transitionBeats;
    this.all_loaded = false;
    console.log(this.bpm);
    
    this.toNext = false;
    this.nextBpm = this.bpm
    this.nextInterval = this.interval;
    this.nextTimesig = this.timesig;
    this.nextTransitionBeats = this.transitionBeats;
    this.nextPlayers = this.players;

    // this.toNextSection = false;

    //functions
    this.function_stop = function_stop;
    this.function_downbeat = function_downbeat;
    this.function_upbeat = function_upbeat;

    //metro construct (use "conductor" not "this" to point at Conductor)
    // var timesig = this.timesig;
    // this.metro = T("interval", {interval: conductor.interval}, function(count) {
    this.metroFunction = function(count) {
        var beat = count % conductor.timesig;
        if (beat == 0) {
            conductor.function_downbeat();
            conductor.playPlayers(beat);
        }
        else if (conductor.transitionBeats.indexOf(beat) >= 0) {
            console.log(beat + " is a transition beat in " + conductor.transitionBeats.toString());
            if (conductor.toNext) {
                //stop current
                // conductor.fadeOutPlayers(0.1, 100);
                conductor.pausePlayers();
                conductor.toggleTail(true);
                conductor.playPlayers(beat);
                conductor.metro.stop();

                //set next
                conductor.bpm = conductor.nextBpm;
                conductor.interval = "BPM" + conductor.bpm + " L4";
                conductor.metro = T("interval", {interval:conductor.interval}, conductor.metroFunction);
                conductor.timesig = conductor.nextTimesig;
                conductor.transitionBeats = conductor.nextTransitionBeats;
                conductor.players = conductor.nextPlayers;

                //reset globs
                conductor.metro.count = 0; //hacky
                conductor.toNext = false;
                console.log("transitioned toNext");
                conductor.resetPlayers();

                //play new
                conductor.metro.start();
                // conductor.playPlayers();
            }
            // conductor.playPlayers();
            // conductor.function_downbeat();
            // console.log("beep");
        }
        else {
            conductor.function_upbeat();
            // console.log("boop");
        }
        console.log(beat);
    // });
    };

    this.metro = T("interval", {interval: conductor.interval}, this.metroFunction);
}

ae.Conductor.prototype.start = function() {
    // this.playPlayers();
    this.checkAllLoaded();
    if (this.all_loaded) {
        this.metro.start();
    }
    else {
        console.log("loops not yet all loaded; try again later~");
    }
}
ae.Conductor.prototype.stop = function() {
    this.pausePlayers();
    this.metro.stop();
    this.function_stop();
}

ae.Conductor.prototype.playPlayers = function(beat) {
    for (var i=0; i<this.players.length; i++) {
        this.players[i].play(beat);
    }
}

ae.Conductor.prototype.pausePlayers = function() {
    for (var i=0; i<this.players.length; i++) {
        this.players[i].pause();
        // this.players[i].fadeOut(0.1, 100, true);
    }
}

ae.Conductor.prototype.resetPlayers = function() {
    for (var i=0; i<this.players.length; i++) {
        this.players[i].reset();
    }
}

ae.Conductor.prototype.fadeOutPlayers = function(step, interval) {
    for (var i=0; i<this.players.length; i++) {
        this.players[i].fadeOut(step, interval);
    }
}

ae.Conductor.prototype.toggleTail = function(tf) {
    for (var i=0; i<this.players.length; i++) {
        this.players[i].playTail = tf;
    }
}

ae.Conductor.prototype.setTimesig = function(timesig) {

}

ae.Conductor.prototype.checkAllLoaded = function() {
    if (this.all_loaded) {
        return true;
    }
    else {
        var all_loaded = true;
        for (var i=0; i<this.players.length; i++) {
            var loop = this.players[i];
            if (loop.init.isLoaded && loop.loop.isLoaded) {
                for (var i=0; i<loop.tail.length; i++) {
                    if (!(loop.tail[i].audio && loop.tail[i].audio.isLoaded)) {
                        console.log("haven't loaded " + loop.tail[i].url);
                        all_loaded = false;
                        return all_loaded;
                    }
                }
            }
            else {
                console.log("haven't loaded either " + loop.url_init + " or " + loop.url_loop);
                all_loaded = false;
                return all_loaded;
            }
        }
        this.all_loaded = all_loaded;
        return all_loaded;
    }
}


// Conductor.prototype.setFunctionDownbeat = function(fn) {
//     this.function_downbeat = fn;

//     var function_downbeat = this.function_downbeat;
//     var function_upbeat = this.function_upbeat;
//     var function_stop = this.function_stop;
//     var timesig = this.timesig;

//     console.log("resetting metro");
//     function_stop();
//     this.metro.stop();
//     this.metro = T("interval", {interval: this.interval}, function(count) {
//         if (count % timesig == 0) {
//             function_downbeat();
//             // console.log("zero");
//         }
//         else {
//             function_upbeat();
//         }
//         console.log(count % timesig);
//     });
//     this.metro.start();
// }

/*
    LoopMaster object handles synchronization of loops for a section
    (the loops themselves exist outside of the LoopMaster object)
*/

// //Constructor
// ae.LoopMaster = function(loops) {
//     this.loops = loops;
//     this.master = T("+", loops);
//     this.all_loaded = false;
// }

// //Start and set all loop offsets to 0
// ae.LoopMaster.prototype.start = function() {
//     this.checkAllLoaded();
//     if (this.all_loaded) {
//         for (var i=0; i<this.loops.length; i++) {
//             var loop = this.loops[i];
//             loop.currentTime = 0;
//         }
//         this.master.play();
//     }
//     else {
//         console.log("loops not yet all loaded; try again later~");
//     }
// }

// //Stop and set all loop offsets to 0
// ae.LoopMaster.prototype.stop = function() {
//     this.master.pause();
//     for (var i=0; i<this.loops.length; i++) {
//         var loop = this.loops[i];
//         loop.currentTime = 0;
//     }
// }

// //Check if all tracks are loaded
// ae.LoopMaster.prototype.checkAllLoaded = function() {
//     if (this.all_loaded) {
//         return true;
//     }
//     else {
//         var all_loaded = true;
//         for (var i=0; i<this.loops.length; i++) {
//             var loop = this.loops[i];
//             if (!loop.isLoaded) {
//                 console.log(loop);
//                 all_loaded = false;
//                 break;
//             }
//         }
//         this.all_loaded = all_loaded;
//         return all_loaded;
//     }
// }

/*
    Loop object.

    Either constructed with an init sound + loop or just loop.
    Note that the loop audio may have a tail as well

    Vars:
    - init = the initial audio (first play)
    - loop = the looped audio
    - tail = an array of {url, audio, beats} objects:
        - audio: the T("audio")
        - beats: an array of valid beats for that audio to be played (based on transitionBeats)
    - initPlayed = whether init has been played yet
    - activated = whether loop is "activated" or not within current cycle (on/off ctrl)

    - mute/unmute is similar to on/off but takes place immediately
*/
ae.Loop = function(init, loop, tail) {
    this.init = ae.to_audio(init);    
    this.loop = ae.to_audio(loop);
    // this.tail = ae.to_audio(tail);
    this.tail = tail;
    for (var i=0; i<this.tail.length; i++) {
        this.tail[i].audio = ae.to_audio(tail[i].url);
    }

    this.initPlayed = false;
    this.playTail = false;
    this.activated = true;
    this.url_init = init;
    this.url_loop = loop;
    // this.url_tail = tail;
    this.mul = 1;
    // this.loopPlaying = false;

    // //safeguard; use loop as init if no init available
    // if (init == undefined) {
    //     this.init = this.loop;
    //     this.url_init = loop;
    // }
    // else {
    //     this.init = ae.to_audio(init);
    // }
}

//Play/pause
ae.Loop.prototype.play = function(beat) {
    if (!this.activated) {
        return;
    }
    if (this.playTail) {
        // this.tail.play();
        // this.tail.bang();

        // Determine which tail sample to play
        for (var i=0; i<this.tail.length; i++) {
            tail = this.tail[i];
            if (tail.beats.indexOf(beat) >= 0) {
                tail.audio.play();
                tail.audio.bang();
                console.log("playing tail: " + tail.url + " on beat " + beat);
                return;
            }
        }
        console.log("invalid beat " + beat);

        // this.activated = false;
    }
    else if (this.initPlayed) {
        //this.init.pause();
        //this.init.currentTime = 0;
        this.loop.play();
        this.loop.bang();
        console.log("playing loop: " + this.url_loop);
    }
    else {
        this.init.play();
        this.init.bang();
        this.initPlayed = true;
        console.log("playing init: " + this.url_init);
    }
}

ae.Loop.prototype.pause = function() {
    this.loop.pause();
    this.init.pause();
    for (var i=0; i<this.tail.length; i++) {
        this.tail[i].audio.pause();
    }
    this.initPlayed = false;
}

//Reset; prepare for next play session
ae.Loop.prototype.reset = function() {
    this.loop.currentTime = 0;
    this.init.currentTime = 0;
    for (var i=0; i<this.tail.length; i++) {
        this.tail[i].audio.currentTime = 0;
    }
    this.initPlayed = false;
    this.playTail = false;
    this.on();
    this.unmute();
}

//On/off
ae.Loop.prototype.on = function() {
    this.activated = true;
}
ae.Loop.prototype.off = function() {
    this.activated = false;
}

//Volume control
ae.Loop.prototype.setMul = function(mul) {
    this.loop.mul = mul;
    this.init.mul = mul;
    for (var i=0; i<this.tail.length; i++) {
        this.tail[i].audio.mul = mul;
    }
    this.mul = mul;
}
ae.Loop.prototype.mute = function() {
    // var table = [1, [0, 1500]];
    // var env = T("env", {table: table});
    // this.setMul(env);

    this.setMul(0);
}

ae.Loop.prototype.unmute = function() {
    // this.setMul([0, [1, 1500]]);

    this.setMul(1);
}

ae.Loop.prototype.fadeOut = function(step, interval) {
    var loop = this;
    var timer = setInterval(function() {
        if (loop.mul <= 0) {
            clearInterval(timer);
            console.log("fadeOut done");
            // if (pause) {
            //     loop.pause();
            // }
        }
        else {
            loop.setMul(loop.mul);
            loop.mul -= step;
        }
        console.log(loop.mul);
    }, interval);
}

ae.Loop.prototype.fadeIn = function(step, interval) {
    var loop = this;
    var timer = setInterval(function() {
        if (loop.mul >= 1) {
            clearInterval(timer);
            console.log("fadeIn done");
        }
        else {
            loop.setMul(loop.mul);
            loop.mul += step;
        }
        console.log(loop.mul);
    }, interval);
}

/*
    Audio wrapping; converts audio from URLs to T("audio") objects
*/

//Regular audio
ae.to_audio = function(url) {
    return T("audio").loadthis(url, function() {
        console.log("Done loading " + url);
    }, function() {
        console.log("Failed to load " + url);
    });
}

//Loop
ae.to_loop = function(url) {
    return T("audio", {loop: true}).loadthis(url, function() {
        console.log("Done loading " + url);
    }, function() {
        console.log("Failed to load " + url);
    });
}


/**
    Helper functions
**/

//BPM to milliseconds
ae.btom = function(bpm) {
    // return Math.round(((60/bpm)*1000)*100000) / 100000;
    return (((60/bpm)*1000)*100000) / 100000;
}

return ae;

}(AudioEngine || {}));