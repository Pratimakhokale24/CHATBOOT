function sendMessage() {
    const userInput = document.getElementById('user-input').value;
    const messageSection = document.getElementById('message-section');

    if (userInput) {
        // Display user message
        const userMessage = document.createElement('div');
        userMessage.textContent = "You: " + userInput;
        messageSection.appendChild(userMessage);

        // Simple bot response
        const botResponse = document.createElement('div');
        const botResponseText = getBotResponse(userInput);
        botResponse.innerHTML = "Bot: " + botResponseText; // Use innerHTML to render the link
        messageSection.appendChild(botResponse);

        // Clear input field
        document.getElementById('user-input').value = '';

        // Scroll to the bottom of the message section
        messageSection.scrollTop = messageSection.scrollHeight;

        // Generate and display quick replies
        generateQuickReplies(userInput);
    }
}

function getBotResponse(input) {
    const lowerInput = input.toLowerCase().replace(/[^\w\s\d]/gi, "");
    console.log(lowerInput);

    // Define a knowledge base as a JavaScript object
    const knowledgeBase = {
        "hello": "Hello! How can I help you?",
        "hi": "Hi there!",
        "hey": "Hey!",
        "how are you": "I'm just a program, but thanks for asking! I'm doing well.",
        "how are u": "I'm just a program, but thanks for asking! I'm doing well.",
        "what is your name": "I'm a simple chatbot created with HTML, CSS, and JavaScript.",
        "whats your name": "I'm a simple chatbot created with HTML, CSS, and JavaScript.",
        "what can you do": "I can answer some basic questions and provide helpful links if I don't know the answer.",
        "what is the capital of france": "The capital of France is Paris.",
        "tell me a joke": "Why don't scientists trust atoms? Because they make up everything!",
        "tell me a funny joke": "Why don't scientists trust atoms? Because they make up everything!",
        "do you know a joke": "Why don't scientists trust atoms? Because they make up everything!",
        "what is the meaning of life": "That's a philosophical question! The meaning of life is often what you make it.",
        "who is the president": "I do not have up-to-date information on political figures.",
        "who is the president of the united states": "I do not have up-to-date information on political figures.",
        "what is the weather like today": "I cannot provide weather information. Please check a reliable weather app or website.",
        "whats the weather like": "I cannot provide weather information. Please check a reliable weather app or website.",
        "what time is it": "I'm sorry, I cannot access real-time information like the current time.",
        "what time it is": "I'm sorry, I cannot access real-time information like the current time.",
        "thank you": "You're welcome!",
        "thanks": "You're welcome!",
        "goodbye": "Goodbye! Have a great day!",
        "bye": "Bye!",
        "what is javascript": "JavaScript is a scripting language used to make websites interactive.",
        "what's javascript": "JavaScript is a scripting language used to make websites interactive.",
        "tell me about javascript": "JavaScript is a scripting language used to make websites interactive.",
        "how does javascript work": "JavaScript is a scripting language used to make websites interactive.",
        "what is html": "HTML (HyperText Markup Language) is the standard markup language for creating web pages.",
         "what is css": "CSS (Cascading Style Sheets) is used to style HTML elements.",
        "how do i center a div with css": "You can center a div using CSS with techniques like Flexbox, Grid, or margin: auto; and text-align: center; for inline elements"
        // Add more questions and answers here!
    };

    // Check if the input matches any key in the knowledge base
    if (knowledgeBase[lowerInput]) {
        return knowledgeBase[lowerInput];
    }

    // More flexible keyword matching
    for (const key in knowledgeBase) {
        if (lowerInput.includes(key)) {
            return knowledgeBase[key];
        }
    }
     //Handling of misspellings.
     if (lowerInput.includes("weather")) {
            return "I cannot provide weather information. Please check a reliable weather app or website.";
        }
        if (lowerInput.includes("time")) {
             return "I'm sorry, I cannot access real-time information like the current time.";
        }

    //Add a search fallback
    const searchTerm = encodeURIComponent(input);
    const searchLink = `https://www.google.com/search?q=${searchTerm}`;
    return `I'm not sure about that.  Maybe you can find the answer <a href="${searchLink}" target="_blank">here</a>.`;
}

// Speech Recognition
const microphoneButton = document.getElementById('microphone-button');
const userInputField = document.getElementById('user-input');
let recognition;
let isListening = false;

// Check if the Web Speech API is supported
if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    // Use the correct SpeechRecognition object, depending on the browser
    recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';


    recognition.onstart = () => {
        isListening = true;
        microphoneButton.textContent = 'Listening...';
    };

    recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
                finalTranscript += event.results[i][0].transcript;
            } else {
                interimTranscript += event.results[i][0].transcript;
            }
        }

        userInputField.value += finalTranscript;
    };

    recognition.onend = () => {
        isListening = false;
        microphoneButton.textContent = 'Record';
    };

  recognition.onerror = (event) => {
    console.error('Speech recognition error:', event.error);
    microphoneButton.textContent = 'Record';
    isListening = false;

    let errorMessage = 'Speech recognition error.';

    switch (event.error) {
        case 'no-speech':
            errorMessage = 'No speech was detected. Please try again.';
            break;
        case 'audio-capture':
            errorMessage = 'Could not capture audio. Please check your microphone.';
            break;
        case 'not-allowed':
            errorMessage = 'Speech recognition is not allowed. Please check your browser permissions.';
            break;
        case 'service-not-allowed':
            errorMessage = 'The speech recognition service is not allowed. Please check your browser configuration.';
            break;
        case 'language-not-supported':
            errorMessage = 'The selected language is not supported. Please choose a different language.';
            break;
        default:
            errorMessage = 'An unknown error occurred during speech recognition.';
    }

        alert(errorMessage + " See console for details.");
};

    microphoneButton.addEventListener('click', () => {
        if (isListening) {
            recognition.stop();
        } else {
            try {
                recognition.start();
            } catch (error) {
                console.error("Error starting speech recognition:", error);
                alert("Could not start speech recognition. Please check console.");
                microphoneButton.disabled = true; // Disable the button if start consistently fails
                microphoneButton.textContent = 'Speech Recognition Error';

            }

        }
    });
} else {
    microphoneButton.disabled = true;
    microphoneButton.textContent = 'Speech Recognition Not Supported';
    alert('Web Speech API is not supported in this browser. Try Chrome.');
}

// Quick Replies
function generateQuickReplies(userInput) {
    const quickRepliesSection = document.getElementById('quick-replies');
    quickRepliesSection.innerHTML = ''; // Clear existing replies

    let replies = [];

    if (userInput.toLowerCase().includes("hello")) {
        replies = ["How are you?", "What can you do?", "Tell me a joke."];
    } else if (userInput.toLowerCase().includes("how are you")) {
        replies = ["I'm fine, thanks!", "What's new?", "What can you do for me?"];
    } else if (userInput.toLowerCase().includes("javascript")) {
        replies = ["What is Javascript?", "How do I use Javascript?", "Tell me more about Javascript"];
    }
    else {
        replies = ["Tell me more.", "I don't understand.", "Can you repeat that?"];
    }

    replies.forEach(reply => {
        const button = document.createElement('button');
        button.textContent = reply;
        button.addEventListener('click', () => {
            document.getElementById('user-input').value = reply;
            sendMessage(); // Simulate sending the quick reply
        });
        quickRepliesSection.appendChild(button);
    });
}

// Emoji Picker
const emojiButton = document.getElementById('emoji-button');
const emojiPicker = document.getElementById('emoji-picker');
const userInput = document.getElementById('user-input');

const emojis = ["😀", "😂", "😊", "🤔", "👍", "👎", "❤️", "🎉", "🍕", "🚀"];

function populateEmojiPicker() {
    emojis.forEach(emoji => {
        const button = document.createElement('button');
        button.textContent = emoji;
        button.addEventListener('click', () => {
            userInput.value += emoji;
            emojiPicker.style.display = 'none';
        });
        emojiPicker.appendChild(button);
    });
}

emojiButton.addEventListener('click', () => {
    emojiPicker.style.display = emojiPicker.style.display === 'block' ? 'none' : 'block';
});

populateEmojiPicker();

// Attachment Functionality (Dummy)
document.getElementById('attachment-button').addEventListener('click', () => {
    alert('Attachment functionality is not fully implemented in this example.');
    // In a real application, you would trigger the file input here.
    document.getElementById('attachment-input').click(); //Programmatically click the hidden input
});

//To handle file selection:
document.getElementById('attachment-input').addEventListener('change', function() {
   if (this.files && this.files[0]) {
        //Handle the file upload process here (e.g., display filename, upload to server)
        alert("Selected file: " + this.files[0].name);
   }
});
