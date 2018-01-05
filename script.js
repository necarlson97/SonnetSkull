var recognition = new webkitSpeechRecognition();
recognition.continuous = true;
recognition.start();
recognition.onresult = function(event) {
    var spoken = event.results[event.results.length-1][0].transcript.trim();
    if(spoken == "stop" || spoken == "shut up") {
        responsiveVoice.cancel();
        return;
    }
    output.value = spoken;
    speak();
};

var output;
var sonnets;

window.onload = function() {
    output = document.getElementById('output');

    jQuery.get('sonnets.txt', function(data) {
        sonnets = data.toLowerCase().split(/^[IVCLX]+\.\n/gmi);
    });
    
    video = document.getElementsByTagName("video")[0];
    activateCamera();
}

function speak() {
    var text = output.value;
    console.log("Speaking: "+text);
    var sonnet = getSonnet(text);
    responsiveVoice.speak(sonnet, "UK English Male", {rate: .8, pitch: .5});
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
    responsiveVoice.cancel();
}

var video;

function activateCamera() {
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia || navigator.oGetUserMedia;

    if (navigator.getUserMedia) {       
        navigator.getUserMedia({video: true}, handleVideo, videoError);
    }
}

function handleVideo(stream) {
    video.src = window.URL.createObjectURL(stream);
}

function videoError(e) {
    alert("Error");
    console.log(e);
}

