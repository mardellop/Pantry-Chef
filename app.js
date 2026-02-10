// --- Pantry Chef: UI & Logic Engine (v2.0 Prep Edition) ---

let net; // Global placeholder for AI Model (TensorFlow.js)

// --- 1. Autenticación y Flujo de Entrada ---

function showLoginForm() {
    const actions = document.getElementById('auth-actions');
    const fields = document.getElementById('auth-fields');

    actions.style.display = 'none';
    fields.style.display = 'flex';
    setTimeout(() => {
        fields.style.opacity = '1';
    }, 10);
}

function resetAuth() {
    const actions = document.getElementById('auth-actions');
    const fields = document.getElementById('auth-fields');

    fields.style.opacity = '0';
    setTimeout(() => {
        fields.style.display = 'none';
        actions.style.display = 'flex';
    }, 400);
}

function handleAuth() {
    const email = document.getElementById('user-email').value;
    const pass = document.getElementById('user-pass').value;

    if (!email || !pass) {
        alert("Por favor, rellena tu correo y contraseña.");
        return;
    }

    const authScreen = document.getElementById('auth-screen');
    const mainApp = document.getElementById('main-app-content');

    authScreen.classList.add('hidden');

    setTimeout(() => {
        mainApp.classList.add('visible');
    }, 400);
}

// --- 2. Navegación Principal & "Dish" Logic ---

function showScreen(screenId) {
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    const navItems = document.querySelectorAll('.nav-item');
    if (screenId === 'home') navItems[0].classList.add('active');
    if (screenId === 'pantry') navItems[1].classList.add('active');
    if (screenId === 'cart') navItems[2].classList.add('active');
    if (screenId === 'profile') navItems[3].classList.add('active');

    document.querySelectorAll('.screen').forEach(screen => screen.classList.remove('active'));
    const target = document.getElementById('screen-' + screenId);
    if (target) {
        target.classList.add('active');
        if (screenId === 'home') simulateSocialUpdates();
    }
}

function openRecipeDetail(title, author, difficulty) {
    const playerTitle = document.getElementById('player-title');
    const playerAuthor = document.getElementById('player-author');
    if (playerTitle) playerTitle.innerText = title;
    if (playerAuthor) playerAuthor.innerText = author;

    showScreen('recipe');
    resetStepper();
}

function syncWithPantry() {
    alert("🔄 Sincronizando con 'La Despensa'...\n\nHecho: Se han eliminado de la lista 2 artículos que ya tienes. Se han actualizado las cantidades necesarias para tus recetas de la semana.");
}

function calculateOptimizedRoute() {
    const overlay = document.getElementById('route-overlay');
    if (overlay) {
        overlay.style.display = 'flex';
        console.log("Calculando ruta de mínima huella de carbono...");
    }
}

function closeRoute() {
    const overlay = document.getElementById('route-overlay');
    if (overlay) overlay.style.display = 'none';
}

function openStore(name) {
    alert(`🏪 Abriendo Marketplace de ${name}...\n\nAquí puedes ver el pasillo exacto de cada producto para ahorrar tiempo.`);
}

function openChallenge(name) {
    alert(`🏆 Reto Sostenible Activado: ${name}\n\nDescripción: Cocina una receta usando solo ingredientes "urgentes" de tu despensa para ganar insignias y reducir tu huella.`);
}

let currentStep = 1;
function nextStep() {
    if (currentStep < 5) {
        currentStep++;
        updateStepper();
    } else {
        alert("🎉 ¡Plato completado! Has ahorrado 0.4kg de CO2. ¡Comparte tu logro!");
    }
}

function updateStepper() {
    const stepNum = document.querySelector('.step-num');
    const stepDesc = document.getElementById('step-desc');
    const progress = document.querySelector('.progress-bar');

    const steps = [
        "Hierve 2L de agua con sal. La IA detectará el hervor.",
        "Añade la pasta y activa el temporizador sincronizado (8min).",
        "Saltea los ingredientes rescatados en una sartén con AOVE.",
        "Escurre la pasta y mézclala con la base IA-PrimavIA.",
        "Emplata y decora con albahaca fresca. ¡Listo!"
    ];

    if (stepNum) stepNum.innerText = `PASO ${currentStep} DE 5`;
    if (stepDesc) stepDesc.innerText = steps[currentStep - 1];
    if (progress) progress.style.width = `${(currentStep / 5) * 100}%`;
}

function resetStepper() {
    currentStep = 1;
    updateStepper();
}

function simulateSocialUpdates() {
    console.log("Actualizando feed social con métricas dinámicas...");
}

// --- 3. Lógica de "La Despensa" (Smart Prep) ---

function toggleItem(element) {
    element.classList.toggle('active');
    // Actualizar dinámicamente el mensaje de recetas disponibles
    const activeCount = document.querySelectorAll('.smart-item.active').length;
    console.log(`Ingredientes activos para cocinar: ${activeCount}`);
}

function toggleFABMenu() {
    const menu = document.getElementById('scanner-menu');
    const fab = document.querySelector('.fab-scanner');
    const backdrop = document.getElementById('fab-overlay');

    if (menu.style.display === 'flex') {
        menu.style.display = 'none';
        fab.classList.remove('active');
        if (backdrop) backdrop.classList.remove('active');
    } else {
        menu.style.display = 'flex';
        fab.classList.add('active');
        if (backdrop) backdrop.classList.add('active');
    }
}

function simulateVoiceInput() {
    toggleFABMenu();
    const voiceInput = prompt("Dile a Pantry Chef qué has comprado (ej: 'He comprado 2 kilos de manzanas y un cartón de leche'):");
    if (voiceInput) {
        alert("Procesando nota de voz con NLP... 🎙️\n\nIdentificado: Manzanas (14 días), Leche (7 días).");
        addPantryItem("Manzanas", "🍎", "14d");
        addPantryItem("Leche", "🥛", "7d");
        updateEcoScore(0.5); // Feedback de ahorro
    }
}

async function generateSmartRecipe() {
    const activeItems = Array.from(document.querySelectorAll('.smart-item.active')).map(el => {
        return {
            name: el.querySelector('.name').innerText,
            isUrgent: el.querySelector('.expiry-tag').classList.contains('urgent')
        };
    });

    if (activeItems.length === 0) {
        alert("¡Eh, Chef! Selecciona al menos un ingrediente para hacer magia. ✨");
        return;
    }

    // Lógica del algoritmo: Priorizar urgentes
    const urgentItems = activeItems.filter(item => item.isUrgent);

    const btn = document.querySelector('.btn-cook-now');
    const originalContent = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Razonando Maridajes...';
    btn.disabled = true;

    setTimeout(() => {
        btn.innerHTML = originalContent;
        btn.disabled = false;

        let message = `Algoritmo Cook Now ha generado una receta:\n\n`;
        if (urgentItems.length > 0) {
            message += `🔥 PRIORIDAD: Usando ${urgentItems.map(i => i.name).join(' y ')} para evitar desperdicio.\n`;
        }
        message += `Receta Sugerida: Strogonoff Express de ${activeItems[0].name}.\n\n¡Sigue trabajando por un planeta sin desperdicio! 🌍`;

        alert(message);
        updateEcoScore(0.2);
    }, 1500);
}

function updateEcoScore(kg) {
    const scoreEl = document.getElementById('eco-score');
    if (scoreEl) {
        let current = parseFloat(scoreEl.innerText);
        scoreEl.innerText = (current + kg).toFixed(1) + 'kg';
    }
}

// --- 4. Visión Artificial Refinada ---

async function loadAI() {
    try {
        net = await mobilenet.load({ version: 2, alpha: 1.0 });
        console.log("IA Lista.");
    } catch (e) {
        console.error('Error IA:', e);
    }
}

async function handleScan(type, file) {
    toggleFABMenu();
    const overlay = document.getElementById('scan-overlay');
    const preview = document.getElementById('scanned-preview');
    const t1 = document.getElementById('thought-1');
    const t2 = document.getElementById('thought-2');
    const t3 = document.getElementById('thought-3');

    overlay.style.display = 'flex';
    t1.innerText = "Iniciante entrada multimodal...";
    t2.innerText = ""; t3.innerText = "";

    const reader = new FileReader();
    reader.onload = async (e) => {
        const imageData = e.target.result;
        preview.src = imageData;

        if (!net) await loadAI();
        const img = new Image();
        img.src = imageData;
        img.onload = async () => {
            const predictions = await net.classify(img);
            const rawLabel = predictions[0].className.toLowerCase();

            setTimeout(() => {
                t1.innerHTML = `<i class="fas fa-check"></i> Visión Computacional: ${type === 'ticket' ? 'Texto' : 'Objeto'} detectado`;
                t2.innerText = "Razonando: Aplicando base de datos de caducidad para " + rawLabel.split(',')[0];

                setTimeout(() => {
                    const name = rawLabel.split(',')[0].toUpperCase();
                    t3.innerHTML = `Identificado: <b>${name}</b> | Caducidad Est: 5 días`;

                    setTimeout(() => {
                        overlay.style.display = 'none';
                        addPantryItem(name, "📦", "5d");
                        updateEcoScore(0.1);
                    }, 2000);
                }, 1500);
            }, 1000);
        };
    };
    reader.readAsDataURL(file);
}

function addPantryItem(name, icon, days) {
    const pantryGrid = document.getElementById('pantry-items');
    const item = document.createElement('div');
    item.className = 'smart-item active pantry-item-new';
    item.onclick = function () { toggleItem(this); };
    item.innerHTML = `
        <span class="icon">${icon}</span>
        <span class="name">${name}</span>
        <span class="expiry-tag">${days}</span>
    `;
    pantryGrid.prepend(item);
}

// --- 5. Inicialización ---

function startClock() {
    const timeDisplay = document.getElementById('current-time');
    function update() {
        const now = new Date();
        const hrs = String(now.getHours()).padStart(2, '0');
        const min = String(now.getMinutes()).padStart(2, '0');
        if (timeDisplay) timeDisplay.innerText = `${hrs}:${min}`;
    }
    update();
    setInterval(update, 60000);
}

document.addEventListener('DOMContentLoaded', () => {
    startClock();
    loadAI();

    const ticketS = document.getElementById('ticket-scanner');
    const foodS = document.getElementById('food-scanner');

    if (ticketS) ticketS.addEventListener('change', (e) => {
        if (e.target.files.length > 0) handleScan('ticket', e.target.files[0]);
    });

    if (foodS) foodS.addEventListener('change', (e) => {
        if (e.target.files.length > 0) handleScan('food', e.target.files[0]);
    });
});

function addXP(amount) {
    const xpBar = document.querySelector('.xp-bar-progress');
    const xpText = document.querySelector('.xp-text');
    const levelBadge = document.getElementById('chef-level');

    if (xpBar && xpText && levelBadge) {
        let currentWidth = parseFloat(xpBar.style.width) || 65;
        let newWidth = currentWidth + (amount / 40); // Ajuste de sensibilidad

        let currentXPText = xpText.innerText.split(' / ')[0].replace('.', '');
        let currentXP = parseInt(currentXPText) || 1250;
        let finalXP = currentXP + amount;

        if (newWidth >= 100) {
            newWidth = 10; // Reset para el siguiente nivel
            let level = parseInt(levelBadge.innerText.match(/\d+/)[0]);
            levelBadge.innerText = `Chef Nivel ${level + 1}`;
            finalXP = 200;
            alert(`🎊 ¡SUBIDA DE NIVEL! Ahora eres Chef Nivel ${level + 1}. Tu compromiso con el planeta es imparable.`);
        }

        xpBar.style.width = newWidth + '%';
        xpText.innerText = `${finalXP.toLocaleString('de-DE')} / 2.000 XP`;
    }
}

function toggleDarkMode() {
    const phoneFrame = document.querySelector('.phone-frame');
    if (phoneFrame) {
        phoneFrame.classList.toggle('dark-mode');
        const isDark = phoneFrame.classList.contains('dark-mode');
        console.log(`Modo Oscuro ${isDark ? 'Activado' : 'Desactivado'}`);
    }
}

function handleLogout() {
    if (confirm("¿Estás seguro de que quieres cerrar sesión?")) {
        document.getElementById('main-app-content').classList.remove('visible');
        setTimeout(() => {
            document.getElementById('auth-screen').classList.remove('hidden');
            document.getElementById('auth-fields').style.display = 'none';
            document.getElementById('auth-actions').style.display = 'flex';
            showScreen('home'); // Reset navigation for next login
        }, 500);
    }
}

function saveProfile() {
    const newName = document.getElementById('edit-name-val').value;
    const newBio = document.getElementById('edit-bio-val').value;

    // Actualizar elementos en la pantalla de Perfil
    const profileName = document.querySelector('#screen-profile h1');
    const profileBio = document.querySelector('#screen-profile p');

    if (profileName) profileName.innerText = newName;
    if (profileBio) profileBio.innerText = newBio;

    alert("✨ Perfil actualizado correctamente.");
    showScreen('profile');
}

