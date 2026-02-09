function showScreen(screenId) {
    // Update nav icons
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });

    // Set active nav item based on screen
    const navItems = document.querySelectorAll('.nav-item');
    if (screenId === 'home') navItems[0].classList.add('active');
    if (screenId === 'pantry') navItems[1].classList.add('active');
    if (screenId === 'cart') navItems[2].classList.add('active');

    // Show screen
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById('screen-' + screenId).classList.add('active');
}

function openRecipe(title) {
    document.getElementById('recipe-title').innerText = title;
    showScreen('recipe');

    // Simulate interactive elements
    startTimer();
}

function startTimer() {
    let timeLeft = 480; // 8 minutes
    const timerDisplay = document.getElementById('main-timer');

    if (window.recipeInterval) clearInterval(window.recipeInterval);

    const interval = setInterval(() => {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        if (timerDisplay) timerDisplay.innerText = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

        if (timeLeft <= 0) {
            clearInterval(interval);
            alert("¡Hora de comer! 🍝");
        }
        timeLeft--;
    }, 1000);

    // Clean up interval when switching screens
    window.recipeInterval = interval;
}

// Interactivity for pantry items
document.querySelectorAll('.pantry-item').forEach(item => {
    item.addEventListener('click', () => {
        item.style.transform = 'scale(0.95)';
        setTimeout(() => {
            item.style.transform = 'scale(1)';
            const name = item.querySelector('.name').innerText;
            console.log(`Seleccionado: ${name}`);
        }, 100);
    });
});

// Mocking the AI "Generation" feel
function simulateAIGeneration() {
    const header = document.querySelector('.header h1');
    if (!header) return;
    const originalText = header.innerText;
    header.innerText = "IA analizando despensa...";
    header.style.opacity = '0.5';

    setTimeout(() => {
        header.innerText = originalText;
        header.style.opacity = '1';
    }, 1500);
}

// Initial Animation & Scanner Logic
document.addEventListener('DOMContentLoaded', () => {
    simulateAIGeneration();

    const scanner = document.getElementById('ticket-scanner');
    if (scanner) {
        scanner.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                const header = document.querySelector('#screen-pantry .header h1');
                const pantryItems = document.getElementById('pantry-items');

                if (header) header.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Procesando Ticket...';

                setTimeout(() => {
                    if (header) header.innerText = "Tu Despensa";

                    // Simulate adding items
                    if (pantryItems) {
                        const newItem = document.createElement('div');
                        newItem.className = 'pantry-item';
                        newItem.style.background = 'rgba(91, 192, 142, 0.2)';
                        newItem.innerHTML = `
                            <span class="icon">🧀</span>
                            <span class="name">Queso Edam</span>
                            <span class="days">Agregado hoy</span>
                        `;
                        pantryItems.prepend(newItem);
                    }

                    alert("¡Escaneo completado! 🧾\nSe ha añadido: Queso Edam, Pechuga de Pollo.");
                }, 2500);
            }
        });
    }
});
