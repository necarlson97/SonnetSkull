var synth = window.speechSynthesis;
var voice;
var name = "Samantha";
var utter = new SpeechSynthesisUtterance();

var recognition = new webkitSpeechRecognition();
recognition.continuous = true;
recognition.onresult = function(event) {
    var spoken = event.results[event.results.length-1][0].transcript.trim();
    if(spoken == "stop" || spoken == "shut up") {
        synth.cancel();
        return;
    }
    output.textContent = spoken;
    utter.text = getSonnet(spoken);
    synth.speak(utter);
};

var output;
var sonnets;

window.onload = function() {
    output = document.getElementById('output');

    jQuery.get('sonnets.txt', function(data) {
        sonnets = data.toLowerCase().split(/^[IVCLX]+\.\n/gmi);
    });
}

synth.onvoiceschanged = function() {
    var voices = synth.getVoices();
    voice = voices.find(v => v.name == name);
    
    console.log(voices);

    utter.voice = voice;
    utter.rate = .8;
    utter.pitch = .5;
    
    recognition.start();
}

function getSonnet(s) {
    s = s.toLowerCase();
    var split = s.split(' ');
    var keyword = split[split.length-1];
    
    if(keyword == "to") keyword = "two";
    
    if(keyword.match(/\d+/))
       return getSonnetInt(parseInt(keyword));
    
    var max = 0;
    var maxI = -1;
    for(var i=0; i<sonnets.length; i++) {
        var count = (sonnets[i].match(new RegExp(keyword,"g")) || []).length;
        if(count > max) {
            max = count;
            maxI = i;
        }
    }
    if(maxI == -1) return "No sonnet contains "+keyword;
    return sonnets[maxI];
}

function getSonnetInt(i) {
    if(i > 0 && i < sonnets.length)
        return sonnets[i];
    return "No sonnet number "+i;
}

function stop() {
    recognition.stop();
    synth.cancel();
}

