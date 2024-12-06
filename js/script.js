// Add smooth scrolling for navigation links
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        targetSection.scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Add a simple welcome message to console
document.addEventListener('DOMContentLoaded', () => {
    console.log('Welcome to My Website!');
    
    // Add a class to sections when they come into view
    const sections = document.querySelectorAll('section');
    
    const observerOptions = {
        threshold: 0.2
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        observer.observe(section);
    });
});

class PuzzleGame {
    constructor() {
        this.currentLevel = 3;
        this.maxLevel = 7;
        this.grid = [];
        this.emptyCell = { row: 0, col: 0 };
        this.currentStep = 1;
        this.initializeGame();
    }

    initializeGame() {
        document.getElementById('guide-modal').classList.add('show');
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.getElementById('next-step').addEventListener('click', () => {
            this.nextStep();
        });

        document.getElementById('prev-step').addEventListener('click', () => {
            this.prevStep();
        });

        document.getElementById('claim-prize').addEventListener('click', () => {
            navigator.clipboard.writeText('0x1234...5678');
            document.getElementById('claim-prize').textContent = 'Copied!';
        });
    }

    nextStep() {
        if (this.currentStep < 4) {
            document.querySelector(`[data-step="${this.currentStep}"]`).style.display = 'none';
            this.currentStep++;
            document.querySelector(`[data-step="${this.currentStep}"]`).style.display = 'block';
            
            // Update dots
            document.querySelectorAll('.dot').forEach((dot, index) => {
                dot.classList.toggle('active', index === this.currentStep - 1);
            });
            
            // Show/hide navigation buttons
            document.getElementById('prev-step').style.display = 'block';
            if (this.currentStep === 4) {
                document.getElementById('next-step').textContent = 'Start Playing!';
            }
        } else {
            document.getElementById('guide-modal').classList.remove('show');
            this.createPuzzle();
        }
    }

    prevStep() {
        if (this.currentStep > 1) {
            document.querySelector(`[data-step="${this.currentStep}"]`).style.display = 'none';
            this.currentStep--;
            document.querySelector(`[data-step="${this.currentStep}"]`).style.display = 'block';
            
            // Update dots
            document.querySelectorAll('.dot').forEach((dot, index) => {
                dot.classList.toggle('active', index === this.currentStep - 1);
            });
            
            // Show/hide navigation buttons
            document.getElementById('prev-step').style.display = this.currentStep > 1 ? 'block' : 'none';
            document.getElementById('next-step').textContent = 'Next';
        }
    }

    createPuzzle() {
        const puzzleGrid = document.getElementById('puzzle-grid');
        puzzleGrid.style.gridTemplateColumns = `repeat(${this.currentLevel}, 1fr)`;
        puzzleGrid.innerHTML = '';

        // Create shuffled numbers array
        let numbers = Array.from({length: this.currentLevel * this.currentLevel - 1}, (_, i) => i + 1);
        numbers.push('');
        this.shuffleArray(numbers);

        // Create grid
        numbers.forEach((num, index) => {
            const tile = document.createElement('div');
            tile.className = `puzzle-tile ${num === '' ? 'empty' : ''}`;
            tile.textContent = num;
            tile.addEventListener('click', () => this.handleTileClick(index));
            puzzleGrid.appendChild(tile);
        });

        document.getElementById('current-level').textContent = `${this.currentLevel}x${this.currentLevel}`;
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    handleTileClick(index) {
        const size = this.currentLevel;
        const row = Math.floor(index / size);
        const col = index % size;
        
        // Find empty cell
        const tiles = document.querySelectorAll('.puzzle-tile');
        const emptyIndex = Array.from(tiles).findIndex(tile => tile.textContent === '');
        const emptyRow = Math.floor(emptyIndex / size);
        const emptyCol = emptyIndex % size;

        // Check if move is valid
        if (this.isValidMove(row, col, emptyRow, emptyCol)) {
            // Swap tiles
            const clickedTile = tiles[index];
            const emptyTile = tiles[emptyIndex];
            const temp = clickedTile.textContent;
            clickedTile.textContent = '';
            emptyTile.textContent = temp;
            clickedTile.classList.add('empty');
            emptyTile.classList.remove('empty');

            // Check if puzzle is solved
            if (this.checkWin()) {
                this.handleWin();
            }
        }
    }

    isValidMove(row, col, emptyRow, emptyCol) {
        return (
            (Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
            (Math.abs(col - emptyCol) === 1 && row === emptyRow)
        );
    }

    checkWin() {
        const tiles = document.querySelectorAll('.puzzle-tile');
        const values = Array.from(tiles).map(tile => tile.textContent);
        const solution = Array.from({length: this.currentLevel * this.currentLevel - 1}, (_, i) => (i + 1).toString());
        solution.push('');
        
        return values.every((value, index) => value === solution[index]);
    }

    handleWin() {
        if (this.currentLevel === this.maxLevel) {
            document.getElementById('game-complete-modal').classList.add('show');
        } else {
            document.getElementById('level-complete-modal').classList.add('show');
        }
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PuzzleGame();
}); 