/***********************************************************************************************
 * Code snippet adapted from DevTricker project by Alexandre Tavares                           *
 * Project link: https://github.com/dev-tricks-xyz/devtricker24-html-template                  *
 **********************************************************************************************/

/***********************************************************************************************
 * Part of the code inspired by Mozilla                                                        *
 * Mozilla website: https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis/getVoices *
 **********************************************************************************************/

/***********************************************************************************************
 * Developed by Alexandre Tavares                                                              *
 * Visit: https://dev-tricks.xyz                                                               *
 **********************************************************************************************/


let g_devTricker_currentPartIndex = 0;
let g_devTricker_isReadingCancelled = false;

let voices;

function devTricker_vibrate() {
    iconWaves = document.getElementById('dev-tricker-belt-of-utilities-soundwave');
    iconWaves.classList.add('vibrating');
}

function devTricker_stopVibrate() {
    iconWaves = document.getElementById('dev-tricker-belt-of-utilities-soundwave');
    iconWaves.classList.remove('vibrating');
}

function devTricker_splitTextIntoSentences(text, maxLength) {
    const paragraphs = text.split('\n\n');
    const parts = [];

    paragraphs.forEach(paragraph => {
        if (paragraph.length <= maxLength) {
            parts.push(paragraph);
        } else {
            let currentPart = '';
            let sentences = paragraph.match(/[^\.!\?]+[\.!\?]+|\S+/g) || [];

            for (let i = 0; i < sentences.length; i++) {
                let sentence = sentences[i];
                if (currentPart.length + sentence.length > maxLength) {
                    if (currentPart.length === 0) {
                        parts.push(sentence);
                        continue;
                    } else {
                        parts.push(currentPart);
                        currentPart = '';
                    }
                }
                currentPart += (currentPart.length > 0 ? ' ' : '') + sentence;
            }

            if (currentPart.length > 0) {
                parts.push(currentPart);
            }
        }
    });

    return parts;
}

function devTricker_speakText() {
    if ('speechSynthesis' in window) {
        if (window.speechSynthesis.speaking) {
            g_devTricker_isReadingCancelled = true;
            window.speechSynthesis.cancel();
            devTricker_stopVibrate();
            return;
        }

        const utteranceParts = devTricker_splitTextIntoSentences(devTricker_getStructuredArticleContent(), 230);

        const bestVoice = devTricker_getBestVoice();

        if (!bestVoice) {
            alert("Your browser does not have the voice pack to read this content.");
            return;
        }

        devTricker_speakPart(utteranceParts, bestVoice);

    } else {
        alert("Your browser does not support speech synthesis.");
    }
}

function get_the_Text() {
    return document.getElementById("textInput").value;
}

function selectedVoice() {

    let selectElement = document.getElementById("voiceSelect");
    let voiceChosen = selectElement.value;

    let voice = voices.find(v => v.name === voiceChosen);

    if (!voice) {
        console.log('Erro ao carregar voz');
    }

    return voice;


}

function readAloud() {

    let text = get_the_Text();
    let voice = selectedVoice();

    readInParts(text, voice);
}


function readInParts(text, voice) {

    let parts = devTricker_splitTextIntoSentences(text);

     devTricker_speakPart(parts, voice);    
}

// document.getElementById("playButton").addEventListener("click", function() {


//         });

/****** OPA  */

function populateVoiceList() {

    voices = speechSynthesis.getVoices();

    for (let i = 0; i < voices.length; i++) {
        const option = document.createElement("option");
        option.textContent = `${voices[i].name}`;

        // if (voices[i].default) {
        //     option.textContent += " — DEFAULT";
        // }

        option.setAttribute("data-lang", voices[i].lang);
        option.setAttribute("data-name", voices[i].name);
        document.getElementById("voiceSelect").appendChild(option);
    }
}


// if (
//     typeof speechSynthesis !== "undefined" &&
//     speechSynthesis.onvoiceschanged !== undefined
// ) {
//     // speechSynthesis.onvoiceschanged = populateVoiceList;
// }



function devTricker_speakPart(utteranceParts, bestVoice) {

    if (g_devTricker_currentPartIndex >= utteranceParts.length || g_devTricker_isReadingCancelled) {
        g_devTricker_currentPartIndex = 0;
        g_devTricker_isReadingCancelled = false;
        return;
    }

    const utterance = new SpeechSynthesisUtterance(utteranceParts[g_devTricker_currentPartIndex]);
    utterance.volume = 1;
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.voice = bestVoice;

    utterance.onend = function () {
        g_devTricker_currentPartIndex++;
        devTricker_speakPart(utteranceParts, bestVoice);
    };

    speechSynthesis.speak(utterance);
}



// if ('speechSynthesis' in window) {
//     speechSynthesis.onvoiceschanged = function () {
//         voices = speechSynthesis.getVoices();
//         populateVoiceList();


        
//     };
// }


if (
    typeof speechSynthesis !== "undefined" &&
    speechSynthesis.onvoiceschanged !== undefined
  ) {
    speechSynthesis.onvoiceschanged = populateVoiceList;
  }
  



