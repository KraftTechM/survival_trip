// State variables
let allNodes = [];
let currentQuestions = [];
let currentIndex = 0;
let score = 0;
let reviewData = [];

// Elements
const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultsScreen = document.getElementById('results-screen');
const startBtn = document.getElementById('start-btn');
const quitBtn = document.getElementById('quit-btn');
const nextBtn = document.getElementById('next-btn');
const restartBtn = document.getElementById('restart-btn');
const nodeTitle = document.getElementById('node-title');
const progressFill = document.getElementById('progress-fill');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const feedbackContainer = document.getElementById('feedback-container');
const scoreSummary = document.getElementById('score-summary');
const reviewList = document.getElementById('review-list');

// Initialize app
async function init() {
    try {
        const response = await fetch('./questions.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        allNodes = data.nodes;
        console.log("Successfully loaded:", allNodes.length, "nodes.");
        
        // Hide loading text if we had one
        startBtn.disabled = false;
        startBtn.textContent = "Start Training";
    } catch (error) {
        console.error("Fetch error:", error);
        alert(`Could not load questions.json. Error: ${error.message}`);
        startBtn.textContent = "Error loading data";
    }
}

function showScreen(screen) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    screen.classList.add('active');
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function startQuiz() {
    if (allNodes.length === 0) {
        alert("Questions not loaded yet. Please wait or refresh.");
        return;
    }

    currentQuestions = [];
    
    // Pick 2 random questions from each of the 10 nodes = 20 total questions per game
    allNodes.forEach(node => {
        let shuffledNodeQuestions = shuffleArray([...node.questions]);
        let selectedQuestions = shuffledNodeQuestions.slice(0, 2); 
        
        selectedQuestions.forEach(q => {
            currentQuestions.push({ ...q, nodeTitle: node.title });
        });
    });

    // Shuffle the final combined list so nodes are mixed
    currentQuestions = shuffleArray(currentQuestions);
    
    currentIndex = 0;
    score = 0;
    reviewData = [];
    showScreen(quizScreen);
    renderQuestion();
}

function renderQuestion() {
    if (currentIndex >= currentQuestions.length) {
        endQuiz();
        return;
    }

    const q = currentQuestions[currentIndex];
    nodeTitle.textContent = q.nodeTitle;
    progressFill.style.width = `${((currentIndex) / currentQuestions.length) * 100}%`;

    questionText.textContent = q.question;
    optionsContainer.innerHTML = '';
    feedbackContainer.classList.add('hidden');
    nextBtn.classList.add('hidden');

    const optionsWithIndices = q.options.map((opt, i) => ({ text: opt, index: i }));
    const shuffledOptions = shuffleArray([...optionsWithIndices]);

    shuffledOptions.forEach(opt => {
        const btn = document.createElement('button');
        btn.textContent = opt.text;
        btn.onclick = () => selectAnswer(opt.index, q);
        optionsContainer.appendChild(btn);
    });
}

function selectAnswer(selectedIndex, q) {
    const buttons = optionsContainer.querySelectorAll('button');
    buttons.forEach(btn => btn.disabled = true);

    const isCorrect = selectedIndex === q.correct;
    if (isCorrect) {
        score++;
        buttons.forEach(b => {
            if(b.textContent === q.options[selectedIndex]) b.classList.add('correct');
        });
    } else {
        buttons.forEach(b => {
            if(b.textContent === q.options[selectedIndex]) b.classList.add('wrong');
            if(b.textContent === q.options[q.correct]) b.classList.add('correct');
        });

        reviewData.push({
            question: q.question,
            yourAnswer: q.options[selectedIndex],
            correctAnswer: q.options[q.correct],
            source: q.source,
            explanation: q.explanation
        });
    }

    feedbackContainer.classList.remove('hidden');
    let feedbackHtml = `<strong>${isCorrect ? 'Correct!' : 'Incorrect.'}</strong><br>`;
    feedbackHtml += `${q.explanation}<br>`;
    if (!isCorrect && q.source) {
        feedbackHtml += `<a href="${q.source}" target="_blank" rel="noopener">View Source</a>`;
    }
    feedbackContainer.innerHTML = feedbackHtml;

    nextBtn.classList.remove('hidden');
    nextBtn.onclick = () => {
        currentIndex++;
        renderQuestion();
    };
}

function endQuiz() {
    progressFill.style.width = '100%';
    showScreen(resultsScreen);
    const total = currentIndex; 
    const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

    scoreSummary.textContent = `You scored ${score} out of ${total} (${percentage}%).`;

    reviewList.innerHTML = '';
    if (reviewData.length === 0) {
        reviewList.innerHTML = '<p>Perfect! No incorrect answers to review.</p>';
    } else {
        reviewData.forEach(item => {
            const div = document.createElement('div');
            div.className = 'review-item';
            div.innerHTML = `
                <strong>Q: ${item.question}</strong><br>
                Your answer: <em>${item.yourAnswer}</em><br>
                Correct answer: <strong>${item.correctAnswer}</strong><br>
                ${item.explanation}<br>
                ${item.source ? `<a href="${item.source}" target="_blank" rel="noopener">Source</a>` : 'General survival guidance'}
            `;
            reviewList.appendChild(div);
        });
    }
}

// Event listeners
startBtn.onclick = startQuiz;
quitBtn.onclick = endQuiz;
restartBtn.onclick = () => showScreen(startScreen);

// Boot up
init();