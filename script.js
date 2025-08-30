// Typing Tutor Application
class TypingTutor {
    constructor() {
        this.currentText = '';
        this.currentIndex = 0;
        this.startTime = null;
        this.endTime = null;
        this.isTestActive = false;
        this.errors = 0;
        this.correctChars = 0;
        this.timerInterval = null;
        this.currentDifficulty = 'medium';
        
        // Text passages for different difficulty levels
        this.textPassages = {
            easy: [
                "The cat sat on the mat. It was a big cat with soft fur. The cat liked to play with a ball.",
                "I like to eat cake. The cake is sweet and good. My mom makes the best cake in town.",
                "The sun is hot today. We can go to the park. There are many trees in the park.",
                "Dogs are good pets. They like to run and play. My dog has a red ball to play with.",
                "Books are fun to read. I have many books at home. Reading helps me learn new things."
            ],
            medium: [
                "Technology has revolutionized the way we communicate and work. From smartphones to laptops, digital devices have become essential tools in our daily lives. The internet connects people across the globe instantly.",
                "Climate change is one of the most pressing issues of our time. Rising temperatures, melting ice caps, and extreme weather events are clear indicators that immediate action is needed to protect our planet.",
                "Education plays a crucial role in shaping individuals and society. Quality education empowers people with knowledge, critical thinking skills, and the ability to make informed decisions about their future.",
                "The art of cooking combines creativity with science. Understanding ingredients, temperatures, and timing allows chefs to create delicious meals that bring people together around the dinner table.",
                "Space exploration has captured human imagination for decades. From the first moon landing to Mars rovers, our quest to understand the universe continues to push the boundaries of science and technology."
            ],
            hard: [
                "Quantum mechanics represents one of the most counterintuitive yet successful theories in physics. The principle of superposition suggests that particles can exist in multiple states simultaneously until observed, challenging our classical understanding of reality and determinism.",
                "Artificial intelligence and machine learning algorithms are transforming industries at an unprecedented pace. Neural networks, deep learning architectures, and natural language processing capabilities are enabling computers to perform tasks previously thought impossible.",
                "Cryptocurrency and blockchain technology have introduced decentralized financial systems that operate independently of traditional banking institutions. Smart contracts, consensus mechanisms, and cryptographic security protocols form the foundation of this revolutionary ecosystem.",
                "Bioengineering and genetic modification techniques are opening new frontiers in medicine and agriculture. CRISPR-Cas9 gene editing, synthetic biology, and personalized medicine approaches promise to address previously incurable diseases and global food security challenges.",
                "Philosophical debates surrounding consciousness, free will, and the nature of existence have persisted throughout human history. Contemporary neuroscience and cognitive psychology continue to explore these fundamental questions about the human experience and our place in the universe."
            ]
        };
        
        this.initializeElements();
        this.bindEvents();
        this.addTooltips();
        this.loadHighScores();
    }
    
    initializeElements() {
        // Page elements
        this.homePage = document.getElementById('homePage');
        this.typingTest = document.getElementById('typingTest');
        this.results = document.getElementById('results');
        
        // Control elements
        this.startBtn = document.getElementById('startBtn');
        this.backBtn = document.getElementById('backBtn');
        this.restartBtn = document.getElementById('restartBtn');
        this.homeBtn = document.getElementById('homeBtn');
        this.difficultySelect = document.getElementById('difficulty');
        
        // Test elements
        this.textDisplay = document.getElementById('textDisplay');
        this.typingInput = document.getElementById('typingInput');
        this.progressFill = document.getElementById('progressFill');
        
        // Info display elements
        this.currentDifficultySpan = document.getElementById('currentDifficulty');
        this.timer = document.getElementById('timer');
        this.liveWpm = document.getElementById('liveWpm');
        this.liveAccuracy = document.getElementById('liveAccuracy');
        
        // Results elements
        this.finalWpm = document.getElementById('finalWpm');
        this.finalAccuracy = document.getElementById('finalAccuracy');
        this.finalTime = document.getElementById('finalTime');
        this.finalErrors = document.getElementById('finalErrors');
        this.newRecord = document.getElementById('newRecord');
        
        // High score elements
        this.easyBest = document.getElementById('easyBest');
        this.mediumBest = document.getElementById('mediumBest');
        this.hardBest = document.getElementById('hardBest');
    }
    
    bindEvents() {
        this.startBtn.addEventListener('click', () => this.startTest());
        this.backBtn.addEventListener('click', () => this.goHome());
        this.restartBtn.addEventListener('click', () => this.restartTest());
        this.homeBtn.addEventListener('click', () => this.goHome());
        
        this.typingInput.addEventListener('input', (e) => this.handleTyping(e));
        this.typingInput.addEventListener('keydown', (e) => this.handleKeyDown(e));
        
        this.difficultySelect.addEventListener('change', (e) => {
            this.currentDifficulty = e.target.value;
        });
        
        // Add hover effects for tip cards
        document.querySelectorAll('.tip-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-2px) scale(1.02)';
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
            });
        });
    }
    
    
    addTooltips() {
        // Add helpful tooltips to various elements
        const tooltips = {
            'difficulty': 'Choose your challenge level',
            'startBtn': 'Press Enter or click to begin',
            'backBtn': 'Press Escape to return home',
            'typingInput': 'Type the text above exactly as shown'
        };
        
        Object.entries(tooltips).forEach(([id, text]) => {
            const element = document.getElementById(id);
            if (element) {
                element.title = text;
            }
        });
    }
    
    startTest() {
        this.currentDifficulty = this.difficultySelect.value;
        this.currentText = this.getRandomText(this.currentDifficulty);
        this.resetTestState();
        
        this.homePage.style.display = 'none';
        this.typingTest.style.display = 'block';
        this.results.style.display = 'none';
        
        this.currentDifficultySpan.textContent = this.currentDifficulty.charAt(0).toUpperCase() + this.currentDifficulty.slice(1);
        this.displayText();
        this.updateMotivationalBanner();
        this.typingInput.focus();
    }
    
    getRandomText(difficulty) {
        const passages = this.textPassages[difficulty];
        return passages[Math.floor(Math.random() * passages.length)];
    }
    
    resetTestState() {
        this.currentIndex = 0;
        this.startTime = null;
        this.endTime = null;
        this.isTestActive = false;
        this.errors = 0;
        this.correctChars = 0;
        this.typingInput.value = '';
        
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
        
        this.timer.textContent = '0s';
        this.liveWpm.textContent = '0';
        this.liveAccuracy.textContent = '100%';
        this.progressFill.style.width = '0%';
    }
    
    displayText() {
        this.textDisplay.innerHTML = '';
        
        for (let i = 0; i < this.currentText.length; i++) {
            const span = document.createElement('span');
            span.textContent = this.currentText[i];
            span.className = 'char';
            
            if (i === 0) {
                span.classList.add('current');
            }
            
            this.textDisplay.appendChild(span);
        }
    }
    
    handleKeyDown(e) {
        // Prevent default behavior for certain keys
        if (e.key === 'Tab' || e.key === 'Enter') {
            e.preventDefault();
        }
    }
    
    handleTyping(e) {
        if (!this.isTestActive) {
            this.startTimer();
            this.isTestActive = true;
        }
        
        const typedText = e.target.value;
        const chars = this.textDisplay.querySelectorAll('.char');
        
        // Reset all character classes
        chars.forEach((char, index) => {
            char.className = 'char';
            
            if (index < typedText.length) {
                if (typedText[index] === this.currentText[index]) {
                    char.classList.add('correct');
                } else {
                    char.classList.add('incorrect');
                }
            } else if (index === typedText.length) {
                char.classList.add('current');
            }
        });
        
        this.currentIndex = typedText.length;
        this.updateProgress();
        this.updateLiveStats();
        
        // Check if test is complete
        if (typedText.length === this.currentText.length) {
            this.endTest();
        }
    }
    
    startTimer() {
        this.startTime = new Date();
        
        this.timerInterval = setInterval(() => {
            const elapsed = Math.floor((new Date() - this.startTime) / 1000);
            this.timer.textContent = elapsed + 's';
        }, 1000);
    }
    
    updateProgress() {
        const progress = (this.currentIndex / this.currentText.length) * 100;
        this.progressFill.style.width = progress + '%';
    }
    
    updateLiveStats() {
        if (!this.startTime) return;
        
        const typedText = this.typingInput.value;
        let correctChars = 0;
        let totalErrors = 0;
        
        for (let i = 0; i < typedText.length; i++) {
            if (typedText[i] === this.currentText[i]) {
                correctChars++;
            } else {
                totalErrors++;
            }
        }
        
        const elapsed = (new Date() - this.startTime) / 1000;
        const minutes = elapsed / 60;
        
        // Calculate WPM (assuming average word length of 5 characters)
        const wpm = minutes > 0 ? Math.round((correctChars / 5) / minutes) : 0;
        
        // Calculate accuracy
        const accuracy = typedText.length > 0 ? Math.round((correctChars / typedText.length) * 100) : 100;
        
        this.liveWpm.textContent = wpm;
        this.liveAccuracy.textContent = accuracy + '%';
    }
    
    endTest() {
        this.endTime = new Date();
        this.isTestActive = false;
        
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
        
        this.calculateFinalResults();
        this.showResults();
    }
    
    calculateFinalResults() {
        const typedText = this.typingInput.value;
        const totalTime = (this.endTime - this.startTime) / 1000;
        const minutes = totalTime / 60;
        
        let correctChars = 0;
        let errors = 0;
        
        for (let i = 0; i < typedText.length; i++) {
            if (typedText[i] === this.currentText[i]) {
                correctChars++;
            } else {
                errors++;
            }
        }
        
        // Calculate final metrics
        const wpm = minutes > 0 ? Math.round((correctChars / 5) / minutes) : 0;
        const accuracy = Math.round((correctChars / this.currentText.length) * 100);
        
        this.finalResults = {
            wpm: wpm,
            accuracy: accuracy,
            time: Math.round(totalTime),
            errors: errors,
            difficulty: this.currentDifficulty
        };
    }
    
    showResults() {
        this.typingTest.style.display = 'none';
        this.results.style.display = 'block';
        
        // Display results
        this.finalWpm.textContent = this.finalResults.wpm;
        this.finalAccuracy.textContent = this.finalResults.accuracy + '%';
        this.finalTime.textContent = this.finalResults.time + 's';
        this.finalErrors.textContent = this.finalResults.errors;
        
        // Check and save high score
        const isNewRecord = this.checkAndSaveHighScore();
        this.newRecord.style.display = isNewRecord ? 'block' : 'none';
        
        // Generate performance tips
        this.generatePerformanceTips();
        
        // Update high scores display
        this.loadHighScores();
    }
    
    checkAndSaveHighScore() {
        const currentBest = this.getHighScore(this.currentDifficulty);
        const isNewRecord = this.finalResults.wpm > currentBest;
        
        if (isNewRecord) {
            this.saveHighScore(this.currentDifficulty, this.finalResults.wpm);
        }
        
        return isNewRecord;
    }
    
    getHighScore(difficulty) {
        return parseInt(localStorage.getItem(`typingTutor_${difficulty}_best`) || '0');
    }
    
    saveHighScore(difficulty, wpm) {
        localStorage.setItem(`typingTutor_${difficulty}_best`, wpm.toString());
    }
    
    loadHighScores() {
        const easyBest = this.getHighScore('easy');
        const mediumBest = this.getHighScore('medium');
        const hardBest = this.getHighScore('hard');
        
        this.easyBest.textContent = easyBest > 0 ? easyBest + ' WPM' : '-- WPM';
        this.mediumBest.textContent = mediumBest > 0 ? mediumBest + ' WPM' : '-- WPM';
        this.hardBest.textContent = hardBest > 0 ? hardBest + ' WPM' : '-- WPM';
    }
    
    restartTest() {
        this.startTest();
    }
    
    generatePerformanceTips() {
        const tipsContainer = document.getElementById('tipsContainer');
        const tips = [];
        
        // Generate tips based on performance
        if (this.finalResults.wpm < 20) {
            tips.push({ icon: 'fas fa-hand-paper', text: 'Practice finger placement on the home row keys (ASDF - JKL;)' });
            tips.push({ icon: 'fas fa-clock', text: 'Start with accuracy - speed will naturally follow' });
        } else if (this.finalResults.wpm < 40) {
            tips.push({ icon: 'fas fa-eye', text: 'Try to look at the screen instead of your keyboard' });
            tips.push({ icon: 'fas fa-dumbbell', text: 'Practice typing common letter combinations' });
        } else if (this.finalResults.wpm < 60) {
            tips.push({ icon: 'fas fa-rocket', text: 'Great progress! Focus on maintaining accuracy at higher speeds' });
            tips.push({ icon: 'fas fa-brain', text: 'Practice typing full words instead of individual letters' });
        } else {
            tips.push({ icon: 'fas fa-trophy', text: 'Excellent speed! You\'re in the top tier of typists' });
            tips.push({ icon: 'fas fa-target', text: 'Challenge yourself with harder difficulty levels' });
        }
        
        if (this.finalResults.accuracy < 85) {
            tips.push({ icon: 'fas fa-bullseye', text: 'Focus on accuracy - slow down and type correctly' });
            tips.push({ icon: 'fas fa-pause', text: 'Take breaks to avoid fatigue and maintain precision' });
        } else if (this.finalResults.accuracy < 95) {
            tips.push({ icon: 'fas fa-check-circle', text: 'Good accuracy! Keep practicing to reach 95%+' });
        }
        
        if (this.finalResults.errors > 10) {
            tips.push({ icon: 'fas fa-exclamation-triangle', text: 'Try to catch mistakes as you type them' });
        }
        
        // Always include motivational tips
        const motivationalTips = [
            { icon: 'fas fa-calendar-alt', text: 'Practice 15-20 minutes daily for best results' },
            { icon: 'fas fa-heart', text: 'Stay relaxed and maintain good posture while typing' },
            { icon: 'fas fa-chart-line', text: 'Track your progress over time to see improvement' }
        ];
        
        tips.push(motivationalTips[Math.floor(Math.random() * motivationalTips.length)]);
        
        // Display tips
        tipsContainer.innerHTML = '';
        tips.forEach(tip => {
            const tipElement = document.createElement('div');
            tipElement.className = 'performance-tip';
            tipElement.innerHTML = `
                <i class="${tip.icon}"></i>
                <span>${tip.text}</span>
            `;
            tipsContainer.appendChild(tipElement);
        });
    }
    
    goHome() {
        this.homePage.style.display = 'block';
        this.typingTest.style.display = 'none';
        this.results.style.display = 'none';
        
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
        
        this.resetTestState();
        this.updateMotivationalBanner();
    }
    
    updateMotivationalBanner() {
        const motivationText = document.querySelector('.motivation-text');
        const messages = [
            'Stay focused! Every keystroke makes you better.',
            'You\'ve got this! Consistency is key to improvement.',
            'Take your time - accuracy leads to speed.',
            'Great job practicing! Your skills are improving.',
            'Focus on the rhythm - find your typing flow.',
            'Remember: look at the screen, not your hands!',
            'Each practice session makes you stronger.',
            'Believe in yourself - you\'re becoming a typing master!'
        ];
        
        if (motivationText) {
            motivationText.textContent = messages[Math.floor(Math.random() * messages.length)];
        }
    }
    
    // Add keyboard shortcuts
    handleKeyboardShortcuts(e) {
        // Escape key to go home
        if (e.key === 'Escape') {
            if (this.typingTest.style.display !== 'none' || this.results.style.display !== 'none') {
                this.goHome();
            }
        }
        
        // Enter key to start test from home page
        if (e.key === 'Enter' && this.homePage.style.display !== 'none') {
            this.startTest();
        }
        
        // Ctrl+R to restart test
        if (e.ctrlKey && e.key === 'r' && this.results.style.display !== 'none') {
            e.preventDefault();
            this.restartTest();
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const typingTutor = new TypingTutor();
    
    // Add global keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        typingTutor.handleKeyboardShortcuts(e);
    });
});

// Add some utility functions for enhanced user experience
document.addEventListener('keydown', (e) => {
    // Prevent accidental page refresh during typing
    if (e.key === 'F5' || (e.ctrlKey && e.key === 'r')) {
        const typingInput = document.getElementById('typingInput');
        if (document.activeElement === typingInput && typingInput.value.length > 0) {
            e.preventDefault();
            const confirmRefresh = confirm('Are you sure you want to refresh? Your current progress will be lost.');
            if (confirmRefresh) {
                location.reload();
            }
        }
    }
});

// Add visibility change handler to pause timer when tab is not active
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Tab is not visible - could pause timer here if needed
        console.log('Tab hidden - typing test paused');
    } else {
        // Tab is visible again
        console.log('Tab visible - typing test resumed');
    }
});
