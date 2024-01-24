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

// window.addEventListener('load', function () {

//     if ('speechSynthesis' in window) {
//         if (window.speechSynthesis.speaking) {
//             g_devTricker_isReadingCancelled = true;
//             window.speechSynthesis.cancel();
//             devTricker_stopVibrate();
//             return;
//         }
//     }

//     let readButton = document.getElementById('dev-tricker-speak-button');
//     if (readButton) {
//         readButton.addEventListener('click', devTricker_speakText);
//     }
// });

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

// function devTricker_getBestVoice() {

//     const voices = speechSynthesis.getVoices();

//     if (voices.length == 0) {
//         speechSynthesis.onvoiceschanged = function () {
//             if (!window.voices) {
//                 voices = speechSynthesis.getVoices();
//             }
//         };
//     }

//     let localLanguage = devTricker_detectLocalLanguage();
//     let language = devTricker_detectLanguage();

//     const findVoice2 = (language, namePart) => {
//         return voices.find(voice => voice.lang.replace('_', '-').includes(language) && voice.name.includes(namePart));
//     };

//     const findVoice3 = (language) => {
//         return voices.find(voice => voice.lang.replace('_', '-').includes(language));
//     };

//     //This is used for Microsoft Edge on Windows - Natural voices includes 'Natural' in his names
//     const edgeNaturalLocalVoice = findVoice2(localLanguage, 'Natural');
//     const edgeNaturalVoice = findVoice2(language, 'Natural');

//     //This is used fo Google Chrome on Windows - The more natural voices includes 'Google' in his names. This void take default robotic voice
//     let backup = localLanguage;

//     if (localLanguage == 'en-US') {
//         localLanguage = 'en-GB'; // this voice is more natural
//     }
//     const chromeGoogleLocalVoice = findVoice2(localLanguage, 'Google') || localLanguage.includes('en') ? findVoice2('en-GB', 'Google') : undefined;


//     const chromeGoogleVoice = findVoice2(language, 'Google');
//     localLanguage = backup;

//     //Try get a voice no matter if it is robotic
//     if (localLanguage == 'en-US') {
//         localLanguage = 'en-GB'; // this voice is more natural
//     }
//     const noneAboveLocalVoice = findVoice3(localLanguage) || localLanguage.includes('en') ? findVoice3('en-GB') : undefined;
//     const noneAboveVoice = (language === 'en' ? findVoice3('en-GB') : findVoice3(language)) || findVoice3(language);
//     localLanguage = backup;

//     return edgeNaturalLocalVoice || edgeNaturalVoice || chromeGoogleLocalVoice || chromeGoogleVoice || noneAboveLocalVoice || noneAboveVoice;
// }

// function devTricker_detectLocalLanguage() {
//     const defaultLang = document.documentElement.lang || 'en';
//     const userLang = navigator.language || navigator.userLanguage || defaultLang;

//     return userLang.includes(defaultLang.split('-')[0]) ? userLang : defaultLang;
// }

// function devTricker_detectLanguage() {
//     const defaultLang = document.documentElement.lang || 'en';

//     return defaultLang.split('-')[0]
// }

// function devTricker_getStructuredArticleContent() {

//     const article = document.getElementById('textInput');

//     if (!article) {
//         return 'Article content not found.';
//     }

//     let structuredContent = '';

//     const title = document.querySelector('h1[itemprop="headline"]');
//     // if (title) {
//     //     structuredContent += 'Title: ' + title.innerText + '\n\n';
//     // }

//     // const authorName = document.querySelector('[itemprop="author"]')?.innerText || 'Unknown author';
//     // structuredContent += 'Written by: ' + authorName + '\n\n';

//     const description = document.querySelector('.excerpt');
//     // if (description) {
//     //     structuredContent += 'Description: ' + description.innerText + '\n\n';
//     // }


//     /** experimento */

//     structuredContent += description.innerText + '\n\n';


//     structuredContent += 'This... is the Dev Tricks! And you are listening... ' + title.innerText + '\n\n';

//     // structuredContent += "Are you ready...? Let's get started!" + '\n\n'; 



//     /* --------------*/

//     const addContent = (text) => {
//         structuredContent += text + '\n\n';
//     };

//     Array.from(article.childNodes).forEach(node => {
//         if (node.nodeType === Node.ELEMENT_NODE) {
//             if (node.tagName === 'P' && node !== description) {
//                 addContent(node.innerText);
//             } else if (['H2', 'H3'].includes(node.tagName)) {
//                 addContent(node.innerText.toUpperCase() + ' \n\n');
//             } else if (node.tagName === 'IMG') {
//                 addContent('Image Description: ' + (node.alt || 'No alt text'));
//             } else if (node.tagName === 'PRE') {
//                 let desc = node.previousElementSibling;
//                 if (desc && desc.tagName === 'P') {
//                     addContent('Code Description: ' + desc.innerText);
//                 }
//             }
//         }
//     });

//     return structuredContent.trim();
// }

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



if ('speechSynthesis' in window) {
    speechSynthesis.onvoiceschanged = function () {
        voices = speechSynthesis.getVoices();
        populateVoiceList();
    };
}