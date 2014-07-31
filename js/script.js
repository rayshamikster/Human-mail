var blurApplier;
var strikeApplier;

window.onload = function() {
    rangy.init();
    blurApplier = rangy.createCssClassApplier("blur", {
        normalize: true
    });
    strikeApplier = rangy.createCssClassApplier("linethrough", {
        normalize: true
    });
}

if (!('webkitSpeechRecognition' in window)) {
    alert('Web speech API is not supported in this browser');
} 
else {
    var recognizing;
    var recognition = new webkitSpeechRecognition();
    var final_transcript = '';
    var divContent = ''; //Saves a local copy of final transcript which is editable. 
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-IN';
    reset();
    recognition.onend = reset;

    var fontSizeVal = 14;

    recognition.onresult = function(event) {
        var interim_transcript = '';
        for (var i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                divContent += event.results[i][0].transcript;
            } else {
                interim_transcript += event.results[i][0].transcript;
            }
        }
        final_span.innerHTML = divContent;
        interim_span.innerHTML = interim_transcript;
        letter_text.value = final_span.innerHTML;
        console.log("INTERIM: " + interim_transcript);
        console.log("FINAL: " + final_transcript);
    }

    function reset() {
        recognizing = false;
        button.innerHTML = "Speak";
    }

    function toggleStartStop() {
        if (recognizing) {
            recognition.stop();
            reset();
        } 
        else {
            recognition.start();
            recognizing = true;
            button.innerHTML = "Stop";
            final_span.innerHTML = divContent;
            interim_span.innerHTML = "";
        }
    }


    function increaseTextSize() {
        if (fontSizeVal < 30) {
            fontSizeVal += 4;
            interim_span.style.fontSize = fontSizeVal + "pt";
            final_span.style.fontSize = fontSizeVal + "pt";
            letter_text.style.fontSize = fontSizeVal + "pt";
        } 
        else {
            return;
        }

    }

    function decreaseTextSize() {
        if (fontSizeVal > 10) {
            fontSizeVal -= 2;
            interim_span.style.fontSize = fontSizeVal + "pt";
            final_span.style.fontSize = fontSizeVal + "pt";
            letter_text.style.fontSize = fontSizeVal + "pt";
        } 
        else {
            return;
        }

    }

    function deleteInterim() {
        var words = divContent.split(" ");
        words.splice(words.length - 1, 1);
        divContent = words.join(" ");
        final_span.innerHTML = divContent;
    }

    function editText() {
        edit_box.classList.remove('hidden');
        edit_box.focus();
        edit_box.select();
        var minH = content_box.offsetHeight;
        console.log("Content box: "+ minH);
        letter_text.setAttribute("style","min-height:"+minH+"px");
        console.log("Edit box: "+ letter_text.offsetHeight)
    }

    function editDone() {
        divContent = letter_text.value;
        final_span.innerHTML = divContent;
        edit_box.classList.add('hidden');
    }

    function createEmail() {
        var n = letter_text.value.indexOf('\n');
        if (n < 0 || n >= 80) {
            n = 40 + letter_text.value.substring(40).indexOf(' ');
        }
        var subject = encodeURI(letter_text.value.substring(0, n));
        var body = subject + encodeURI(letter_text.value.substring(n + 1));
        window.location.href = 'mailto:?subject=' + subject + '&body=' + body + '&attachment= "mic.gif"';
    }
}

content_box.addEventListener('click', editText);