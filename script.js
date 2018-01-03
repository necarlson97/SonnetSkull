var recognition = new webkitSpeechRecognition();
recognition.continuous = true;
recognition.start();
recognition.onresult = function(event) {
    var spoken = event.results[event.results.length-1][0].transcript.trim();
    if(spoken == "stop" || spoken == "shut up") {
        responsiveVoice.cancel();
        return;
    }
    output.textContent = spoken;
    var text = getSonnet(spoken);
    console.log(text);
    responsiveVoice.speak(text, "UK English Male", {rate: .8, pitch: .5});
};

var output;
var sonnets;

window.onload = function() {
    output = document.getElementById('output');

    jQuery.get('sonnets.txt', function(data) {
        sonnets = data.toLowerCase().split(/^[IVCLX]+\.\n/gmi);
    });
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

