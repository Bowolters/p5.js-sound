define(function (require) {
  'use strict';

  var p5sound = require('master');
  require('sndcore');
  require('polysynth');

  /**
    *  An AudioVoice is used as a single voice for sound synthesis.
    *  The PolySynth class holds an array of AudioVoice, and deals
    *  with voices allocations, with setting notes to be played, and
    *  parameters to be set. 
    *
    *  @class p5.PolySynth
    *  @constructor
    *  @param {Number} [num]    Number of voices used by the polyphonic
    *                           synthetiser.
    *                              
    *  @param {Number} [synthVoice]   A monophonic synth voice inheriting
    *                                 the AudioVoice class.
    *  @example 
    *  <div><code>
    *   var psynthDetune; 
    *   
    *   function setup() {
    *   
    *     frameRate(25);
    *   
    *     // create a polyphonic synth with 15 voices.
    *     // this synth will use the DetuneOsc synth definition below
    *     psynthDetune = new p5.PolySynth(15,DetunedOsc); 
    *     
    *   }
    *   
    *   function draw() {
    *     background(0);
    *     fill(255);  
    *     textAlign(CENTER,CENTER);
    *     text("Click Me !",width/2,height/2);
    *   }
    *   
    *   function mousePressed(){
    *     // play a note when mouse is pressed
    *     var note = int(map(mouseX,0,width,60,84)); // a midi note mapped to x-axis
    *     var length = map(mouseY,0,300,0,5); // a note length parameter mapped to y-axis.
    *   
    *     psynthDetune.setADSR(0.021,0.025,length,0.025);
    *     // set the detune parameters randomely
    *     var d = int(random(1,12));
    *     psynthDetune.setParams({detune: d });
    *     // set the note to be played
    *     psynthDetune.setNote(note);
    *     psynthDetune.play(); // play it !
    *   }
    *   
    *   
    *   // A typical synth class which inherits from AudioVoice class
    *   function DetunedOsc(){
    *   
    *     p5.AudioVoice.call(this);
    *     this.osctype = 'sine';
    *     this.detune = 5;
    *   
    *     this.oscOne = new p5.Oscillator(midiToFreq(this.note),this.osctype); 
    *     this.oscTwo = new p5.Oscillator(midiToFreq(this.note)-this.detune,this.osctype);
    *     this.oscOne.disconnect();
    *     this.oscTwo.disconnect();
    *     this.oscOne.start();
    *     this.oscTwo.start();
    *     this.oscOne.connect(this.synthOut);
    *     this.oscTwo.connect(this.synthOut);
    *   
    *     this.setNote = function(note){
    *         this.oscOne.freq(midiToFreq(note));
    *         this.oscTwo.freq(midiToFreq(note)-this.detune);   
    *     }
    *   
    *     this.setParams = function(params){
    *         this.detune = params.detune;
    *     }
    *   }
    *   
    *   DetunedOsc.prototype = Object.create(p5.AudioVoice.prototype); 
    *   DetunedOsc.prototype.constructor = DetunedOsc;
    *   
    * </code></div>
    **/
p5.PolySynth = function(num,synthVoice){
  this.voices = [];
  this.num_voices = num;
  this.poly_counter=0;

  for (var i = 0 ; i < this.num_voices ; i++){
       this.voices.push(new synthVoice());
  }
}

/**
   *  Play a note.
   *  
   *  @method  play
   *  @param  {Number} [secondsFromNow]  time from now (in seconds) at which to play
   *  @param  {Number} [sustainTime] time to sustain before releasing the envelope
   */
p5.PolySynth.prototype.play = function (secondsFromNow, susTime){
    this.voices[this.poly_counter].play(secondsFromNow, susTime);
    this.poly_counter += 1;
    this.poly_counter = this.poly_counter % this.num_voices;
}


/**
   *  Set values like a traditional
   *  <a href="https://en.wikipedia.org/wiki/Synthesizer#/media/File:ADSR_parameter.svg">
   *  ADSR envelope
   *  </a>.
   *  
   *  @method  setADSR
   *  @param {Number} attackTime    Time (in seconds before envelope
   *                                reaches Attack Level
   *  @param {Number} [decayTime]    Time (in seconds) before envelope
   *                                reaches Decay/Sustain Level
   *  @param {Number} [susRatio]    Ratio between attackLevel and releaseLevel, on a scale from 0 to 1,
   *                                where 1.0 = attackLevel, 0.0 = releaseLevel.
   *                                The susRatio determines the decayLevel and the level at which the
   *                                sustain portion of the envelope will sustain.
   *                                For example, if attackLevel is 0.4, releaseLevel is 0,
   *                                and susAmt is 0.5, the decayLevel would be 0.2. If attackLevel is
   *                                increased to 1.0 (using <code>setRange</code>),
   *                                then decayLevel would increase proportionally, to become 0.5.
   *  @param {Number} [releaseTime]   Time in seconds from now (defaults to 0)
   **/
p5.PolySynth.prototype.setADSR = function (a,d,s,r){
  for (var i = 0 ; i < this.num_voices ; i++){
   this.voices[this.poly_counter].setADSR(a,d,s,r);
  }
}

/**
   *  Set the note to be played.
   *  This method can be overriden when creating custom synth.
   *  
   *  @method  setNote
   *  @param  {Number} Midi note to be played (from 0 to 127).
   * 
   */
p5.PolySynth.prototype.setNote = function (note){
  for (var i = 0 ; i < this.num_voices ; i++){
   this.voices[this.poly_counter].setNote(note);
  }
}


/**
   *  Set cutoms parameters to a specific synth implementation 
   *  with the help of JavaScript Object Notation (JSON).
   *  
   *  @method  setParams
   *  @param   JSON object  
   * 
   *  For instance to set the detune parameter of a synth, call :
   *  setParams({detune: 15 });
   *
   */  
p5.PolySynth.prototype.setParams = function (params){
  for (var i = 0 ; i < this.num_voices ; i++){
    this.voices[this.poly_counter].setParams(params);
  }
}

});