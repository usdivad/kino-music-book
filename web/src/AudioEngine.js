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
ae.Conductor = function(bpm, timesig, downbeats, players, function_downbeat, function_upbeat, function_stop) {
    var conductor = this;
    this.bpm = bpm;
    this.interval = "BPM" + this.bpm + " L4";
    this.timesig = timesig;
    this.players = players;
    this.downbeats = downbeats;
    console.log(this.bpm);
    
    this.toNext = false;
    this.nextBpm = this.bpm
    this.nextInterval = this.interval;
    this.nextTimesig = this.timesig;
    this.nextDownbeats = this.downbeats;
    this.nextPlayers = this.players;

    // this.toNextSection = false;

    //functions
    this.function_stop = function_stop;
    this.function_downbeat = function_downbeat;
    this.function_upbeat = function_upbeat;

    //metro construct (use "conductor" not "this" to point at Conductor)
    // var timesig = this.timesig;
    this.metro = T("interval", {interval: conductor.interval}, function(count) {
        var beat = count % conductor.timesig;
        if (beat == 0) {
            conductor.function_downbeat();
            conductor.playPlayers();
        }
        else if (downbeats.indexOf(beat) >= 0) {
            if (conductor.toNext) {
                //stop current
                conductor.pausePlayers();
                conductor.toggleTail(true);
                conductor.playPlayers();

                //set next
                conductor.bpm = conductor.nextBpm;
                conductor.interval = "BPM" + conductor.bpm + " L4";
                conductor.timesig = conductor.nextTimesig;
                conductor.downbeats = conductor.nextDownbeats;
                conductor.players = conductor.nextPlayers;

                //reset globs
                conductor.metro.count = 0; //hacky
                conductor.toNext = false;
                console.log("transitioned toNext");

                //play new
                conductor.playPlayers();
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
    });
}

ae.Conductor.prototype.start = function() {
    // this.playPlayers();
    this.metro.start();
}
ae.Conductor.prototype.stop = function() {
    this.pausePlayers();
    this.metro.stop();
    this.function_stop();
}

ae.Conductor.prototype.playPlayers = function() {
    for (var i=0; i<this.players.length; i++) {
        this.players[i].play();
    }
}

ae.Conductor.prototype.pausePlayers = function() {
    for (var i=0; i<this.players.length; i++) {
        this.players[i].pause();
    }
}

ae.Conductor.prototype.toggleTail = function(tf) {
    for (var i=0; i<this.players.length; i++) {
        this.players[i].playTail = tf;
    }
}

ae.Conductor.prototype.setTimesig = function(timesig) {

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

//Constructor
ae.LoopMaster = function(loops) {
    this.loops = loops;
    this.master = T("+", loops);
    this.all_loaded = false;
}

//Start and set all loop offsets to 0
ae.LoopMaster.prototype.start = function() {
    this.checkAllLoaded();
    if (this.all_loaded) {
        for (var i=0; i<this.loops.length; i++) {
            var loop = this.loops[i];
            loop.currentTime = 0;
        }
        this.master.play();
    }
    else {
        console.log("loops not yet all loaded; try again later~");
    }
}

//Stop and set all loop offsets to 0
ae.LoopMaster.prototype.stop = function() {
    this.master.pause();
    for (var i=0; i<this.loops.length; i++) {
        var loop = this.loops[i];
        loop.currentTime = 0;
    }
}

//Check if all tracks are loaded
ae.LoopMaster.prototype.checkAllLoaded = function() {
    if (this.all_loaded) {
        return true;
    }
    else {
        var all_loaded = true;
        for (var i=0; i<this.loops.length; i++) {
            var loop = this.loops[i];
            if (!loop.isLoaded) {
                console.log(loop);
                all_loaded = false;
                break;
            }
        }
        this.all_loaded = all_loaded;
        return all_loaded;
    }
}

/*
    Loop object.

    Either constructed with an init sound + loop or just loop.
    Note that the loop audio may have a tail as well

    Vars:
    - loop = the looped audio
    - init = the initial audio (first play)
    - initPlayed = whether init has been played yet
    - activated = whether loop is "activated" or not within current cycle (on/off ctrl)

    - mute/unmute is similar to on/off but takes place immediately
*/
ae.Loop = function(init, loop, tail) {
    this.init = ae.to_audio(init);    
    this.loop = ae.to_audio(loop);
    this.tail = ae.to_audio(tail);
    this.initPlayed = false;
    this.playTail = false;
    this.activated = true;
    this.url_init = init;
    this.url_loop = loop;
    this.url_tail = tail;
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
ae.Loop.prototype.play = function() {
    if (!this.activated) {
        return;
    }
    if (this.playTail) {
        this.tail.play();
        this.tail.bang();
        console.log("playing tail: " + this.url_tail);
        this.activated = false;
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
    this.initPlayed = false;
}

//Reset; prepare for next play session
ae.Loop.prototype.reset = function() {
    this.loop.currentTime = 0;
    this.init.currentTime = 0;
    this.initPlayed = false;
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
}
ae.Loop.prototype.mute = function() {
    this.setMul(0);
}

ae.Loop.prototype.unmute = function() {
    this.setMul(1);
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