#Kino

JavaScript game audio library and accompanying "soundtrack book" for Haruki Murakami's short story of the same name.

The audio engine focuses on the use of a **Conductor**, which has control over individual players that are **Loops**.

#### Conductor
- `bpm` = beats per minute (tempo)
- `timesig` = time signature; currently includes multiple bars, e.g. 4 bars of 13/4 makes a timesig of 13*4=52
- `players` = an array of `Loops`
- `transitionBeats` = beats that are allowed to transition to another section

- `function_downbeat` = function that is called on beat 1 of the bar
- `function_upbeat` = function that is called on every other beat of the bar
- `function_stop` = function that is called when metronome is stopped

- `all_loaded` = whether or not all players' `Loops` have been loaded
- `next{Bpm, Interval...}` = the equivalent vars to be set for the next section
- `metroFunction` = function that defines how the conductor's metronome treats beats
- `metro` = the metronome itself

#### Loop
- `init` = the initial audio (first play)
- `loop` = the looped audio
- `tail` = an array of `{url, audio, beats}` objects:
         e.g. `[{url: 'x.mp3', audio: T("audio"), beats: [10, 18]}]`
    - `audio`: the `T("audio")`
    - `beats`: an array of valid beats for that audio to be played (based on `transitionBeats`)

- `initPlayed` = whether `init` has been played yet
- `tailActivated` = whether `tail` should be played

- `activated` = whether loop is "activated" or not within current cycle (on/off ctrl)
- `url_{init, loop}` = URLs of `init` and `loop` audio files

- `defaultMul` = default amplitude (for beginning of section)
- `mul` = current amplitude

- (mute/unmute is similar to on/off but takes place immediately)

#### Usage
    //Loops
    var kinotheme_bpm = 170;
    var kinotheme_timesig = 76;
    var kinotheme_transitionBeats = [0,10,20,30,40,50,60,70];
    var mp3dir = "";

    var kinotheme_piano = new AudioEngine.Loop(mp3dir + "kinotheme init piano.wav", mp3dir + "kinotheme loop piano.wav", [{url: mp3dir + "kinotheme tail piano.wav", beats: [0]}]);
    var kinotheme_vox = new AudioEngine.Loop(
        mp3dir + "kinotheme vox.wav", mp3dir + "kinotheme vox.wav", [{url: mp3dir + "empty.wav", beats: [0]}],
        0);
    var kinotheme_arr = [kinotheme_piano, kinotheme_vox];

    //Conductor
    var conductor = new AudioEngine.Conductor(kinotheme_bpm, kinotheme_timesig, kinotheme_transitionBeats, loop_arr, function() {
    console.log("START");
    }, function() {
        console.log("boop");
    }, function() {
        console.log("STOP");
    });  