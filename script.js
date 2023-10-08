
// Function to retrieve a random word.
async function getRandomWord() {
    const response = await fetch("https://random-word-bit.vercel.app/word");
    const newWord = JSON.parse(await response.text());
    return newWord[0].word.toLowerCase();
}

// Update the timer display with the remaining time.
function updateTimer(time) {
    const minutes = Math.floor(time / 60).toString().padStart(2, '0');
    const seconds = (time % 60).toString().padStart(2, '0');
    document.getElementById('timer').textContent = `${minutes}:${seconds}`;
}

// Start the typing challenge.
async function startChallenge() {
    // Disable the start button.
    document.getElementById('startButton').disabled = true;

    // Get the initial word.
    let randomWord = await getRandomWord();
    document.getElementById('word').textContent = randomWord;

    // Start the timer.
    let remainingTime = 60;
    let timer = setInterval(() => {
        remainingTime--;
        updateTimer(remainingTime);
        if (remainingTime <= 0) {
            clearInterval(timer);
            endChallenge();
        }
    }, 1000);

    // Initialize the results.
    let numWords = 0;
    let numChars = 0;

    // Check the user input.
    document.getElementById('input').addEventListener('input', async () => {
        let input = document.getElementById('input').value;
        let lastChar = input[input.length - 1];
        if (lastChar === ' ') {
            input = input.trim();
            if (input === randomWord) {
                numWords++;
                numChars += input.length;
                document.getElementById('input').value = '';
                randomWord = await getRandomWord(); // await here to get the new word
                document.getElementById('word').textContent = randomWord;
            }
        }
    });

    // End the typing challenge.
    function endChallenge() {
        // Calculate the words per minute and characters per minute.
        const input = document.getElementById('input').value;
        const words = input.split(' ').filter(newWord => newWord.length > 0);
        numWords += words.length;
        numChars += input.length;
        const wordsPerMinute = Math.round(numWords / 1);
        const charsPerMinute = Math.round(numChars / 1);

        // Display the results.
        const results = `You typed ${numWords} words and ${numChars} characters in 1 minute.`;
        document.getElementById('results').textContent = results;

        // Enable the start button.
        document.getElementById('startButton').disabled = false;

        // Reset the input and the results.
        document.getElementById('input').value = '';
        numWords = 0;
        numChars = 0;
    }
}

// Attach the startChallenge function to the start button.
document.getElementById('startButton').addEventListener('click', startChallenge);
