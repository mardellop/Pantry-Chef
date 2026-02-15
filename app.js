
﻿// --- Pantry Chef: UI & Logic Engine (v2.0 Prep Edition) ---

let net; // Global placeholder for AI Model (TensorFlow.js)

// --- 1. AutenticaciÃ³n y Flujo de Entrada ---

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
        alert("Por favor, rellena tu correo y contraseÃ±a.");
        return;
    }

    const authScreen = document.getElementById('auth-screen');
    const mainApp = document.getElementById('main-app-content');

    authScreen.classList.add('hidden');

    setTimeout(() => {
        mainApp.classList.add('visible');
    }, 400);
}

// --- 2. NavegaciÃ³n Principal & "Dish" Logic ---

function showScreen(screenId) {
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    const navItems = document.querySelectorAll('.nav-item');
    if (screenId === 'home') navItems[0].classList.add('active');
    if (screenId === 'pantry') navItems[1].classList.add('active');
    if (screenId === 'cart') navItems[2].classList.add('active');
    if (screenId === 'profile' || screenId === 'settings' || screenId === 'profile-edit') navItems[3].classList.add('active');

    document.querySelectorAll('.screen').forEach(screen => screen.classList.remove('active'));
    const target = document.getElementById('screen-' + screenId);
    if (target) {
        target.classList.add('active');
        if (screenId === 'home') simulateSocialUpdates();
    }
}

// Mock Database for Recipes (would be an API in prod)
const recipesDB = {
    'Pasta con setas y salvia': {
        image: 'https://images.unsplash.com/photo-1473093226795-af9932fe5856?auto=format&fit=crop&w=800&q=80',
        authorImg: 'https://i.pravatar.cc/150?u=carlos',
        time: 12, // minutes
        ingredients: ['200g Pasta', '100g Setas', 'Hojas de salvia', 'Aceite de oliva', 'Ajo'],
        utensils: ['Olla grande', 'Sartén', 'Escurridor'],
        steps: ['Hervir agua y cocer pasta durante 10 min.', 'Saltear setas con ajo y salvia.', 'Mezclar la pasta con las setas.', 'Servir caliente.']
    },
    'Pasta PrimavIA': { // Fallback for differing names
        image: 'https://images.unsplash.com/photo-1473093226795-af9932fe5856?auto=format&fit=crop&w=800&q=80',
        authorImg: 'https://i.pravatar.cc/150?u=carlos',
        time: 12,
        ingredients: ['200g Pasta', 'Verduras Varias', 'Aceite', 'Queso'],
        utensils: ['Olla', 'Sartén'],
        steps: ['Cocer pasta.', 'Saltear verduras.', 'Mezclar todo.']
    },
    'Vegan Bowl': {
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
        authorImg: 'https://i.pravatar.cc/150?u=ana',
        time: 20,
        ingredients: ['Tofu marinado', 'Huevos de codorniz', 'Edamame', 'Tomates cherry', 'Maíz dulce', 'Pepino', 'Lechuga', 'Cebollino fresco'],
        utensils: ['Bol', 'Cuchillo'],
        steps: ['Pon una capa generosa de lechuga en el fondo del bowl.', 'Imagina que el bowl es un reloj. Ve colocando cada ingrediente en su "franja": el maíz a las 3, el pepino a las 5, los tomates a las 9 y el edamame a las 11.', 'Coloca el tofu justo en el medio.', 'Añade los huevos a un lado y espolvorea cebollino picado y, si tienes, unas semillas de sésamo negro por encima.']
    },
    'Tostada de aguacate': {
        image: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?auto=format&fit=crop&w=800&q=80',
        authorImg: 'https://i.pravatar.cc/150?u=marta',
        time: 10,
        ingredients: ['Pan integral', '1 Aguacate', 'Semillas', 'Limón', 'Sal al gusto', 'Pimienta al gusto'],
        utensils: ['Tostadora', 'Cuchillo'],
        steps: ['Tostar el pan.', 'Chafar el aguacate con limón.', 'Untar y decorar.']
    },
    'Buddha Bowl': {
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
        authorImg: 'https://i.pravatar.cc/150?u=green',
        time: 25,
        ingredients: ['1 Aguacate', 'Garbanzos', 'Boniato', 'Rábano', 'Tomates cherry', 'Pimiento amarillo', 'Col lombarda'],
        utensils: ['Cuchillo', 'Bol grande'],
        steps: ['Pon una base generosa de lechuga rizada y brotes tiernos.', 'Coloca el aguacate en el centro-inferior.', 'Ve distribuyendo los ingredientes por secciones, dejando los tomates en rama arriba.', 'Añade los garbanzos en el centro.']
    },
    'Espaguetis con salsa pomodoro': {
        image: 'https://images.unsplash.com/photo-1551892374-ecf8754cf8b0?auto=format&fit=crop&w=800&q=80',
        authorImg: 'https://i.pravatar.cc/150?u=veggie',
        time: 15,
        ingredients: ['Espaguetis (preferiblemente de sésamo o de grano duro)', 'Tomates maduros', '1 diente de ajo', 'Aceite de oliva virgen extra', 'Sal', 'Albahaca fresca', 'Queso parmesano o pecorino rallado (opcional)'],
        utensils: ['Olla grande', 'Sartén amplia', 'Colador'],
        steps: ['En la sartén, calienta un buen chorro de aceite de oliva y añade el tomate triturado o troceado y deja que se cocine a fuego lento unos 15-20 minutos hasta que la salsa espese y cambie a un rojo más intenso. Añade la sal y la albahaca al final.', 'Mientras cuece los espaguetis en agua hirviendo con sal. Sácalos 1 minuto antes de lo que diga el paquete. Antes de escurrir, guarda una taza del agua de la cocción.', 'Echa los espaguetis directamente a la sartén con la salsa. Añade un chorrito del agua de cocción que guardaste. Remueve con energía a fuego fuerte durante 1 minuto.']
    },
    'Freakshake de chocolate': {
        image: 'https://images.unsplash.com/photo-1577805947697-89e18249d767?auto=format&fit=crop&w=800&q=80',
        authorImg: 'https://i.pravatar.cc/150?u=sweet',
        time: 5,
        ingredients: ['Leche', '3 bolas de helado de chocolate', 'Sirope de chocolate', 'Chocolate fundido o Nutella (para decorar)', 'Nata montada (opcional)', '1 Barrita de chocolate (opcional)', 'Cacao en polvo'],
        utensils: ['Batidora', 'Tarro de cristal'],
        steps: ['Funde un poco de chocolate. Con una cuchara, deja que caiga por el borde interior y exterior del tarro. Mételo en la nevera un par de minutos para que el chocolate se asiente y no se escurra del todo al echar el batido.', 'Pon en la batidora el helado, la leche y un chorrito de sirope. Bate a máxima potencia, lo ideal es que quede espeso, tipo "smoothie".', 'Saca el vaso de la nevera y vierte el batido con cuidado. Deja un dedo de espacio arriba para la nata.', 'Pon una montaña generosa de nata montada. Clava la barrita de chocolate de forma diagonal. Para el toque final, coge un colador pequeño con cacao en polvo y golpéalo suavemente sobre el batido para que caiga esa "lluvia" de chocolate.']
    },
    'Sopa de Lentejas': {
        image: 'https://images.unsplash.com/photo-1547592166-23acbe346499?auto=format&fit=crop&w=800&q=80',
        authorImg: 'https://i.pravatar.cc/150?u=comfort',
        time: 45,
        ingredients: ['Lentejas', 'Zanahoria', 'Cebolla', 'Caldo de Verduras', 'Laurel'],
        utensils: ['Olla Express', 'Cuchara'],
        steps: ['SofreÃ­r verduras.', 'AÃ±adir lentejas y caldo.', 'Cocer 30 min.']
    }
};

let currentRecipeTime = 0;
let timerInterval;

function openRecipeDetail(title, author, difficulty) {
    const data = recipesDB[title] || recipesDB['Pasta PrimavIA']; // Fallback

    // Populate Data
    document.getElementById('detail-title').innerText = title;

    // Simplified Meta: Difficulty and Time (Author removed)
    const diffEl = document.getElementById('detail-difficulty');
    const timeEl = document.getElementById('detail-time');

    if (diffEl) diffEl.innerHTML = `<i class="fas fa-signal"></i> ${difficulty}`;
    if (timeEl) timeEl.innerHTML = `<i class="fas fa-fire"></i> ${data.time} min`;

    document.getElementById('detail-image').src = data.image;
    // No longer setting author img/name

    // List Generation Helper
    const createList = (items, elementId) => {
        const list = document.getElementById(elementId);
        if (list) {
            list.innerHTML = '';
            items.forEach(item => {
                const li = document.createElement('li');
                li.innerHTML = `<i class="fas fa-check-circle"></i> ${item}`; // Added Icon
                list.appendChild(li);
            });
        }
    };

    createList(data.ingredients, 'detail-ingredients');
    createList(data.utensils, 'detail-utensils');

    // Steps
    const stepsDiv = document.getElementById('detail-steps');
    if (stepsDiv) {
        stepsDiv.innerHTML = '';
        data.steps.forEach((step, index) => {
            const p = document.createElement('p');
            p.innerHTML = `<strong>${index + 1}.</strong> ${step}`;
            stepsDiv.appendChild(p);
        });
    }

    // Reset UI State
    const timer = document.getElementById('cooking-timer');
    if (timer) timer.style.display = 'none';

    const btn = document.getElementById('btn-prepare-now');
    if (btn) {
        btn.style.display = 'flex';
        btn.innerText = 'PREPARAR AHORA';
        btn.classList.add('btn-cook-now');
    }

    currentRecipeTime = data.time; // Store for timer
    showScreen('recipe');
}

function startCooking() {
    const btn = document.getElementById('btn-prepare-now');

    // UI Updates
    btn.disabled = true;
    btn.style.background = '#333'; // Change color to indicate "active"
    btn.innerHTML = `<i class="fas fa-hourglass-half fa-spin"></i> COCINANDO...`;

    let timeLeft = currentRecipeTime * 60; // Seconds

    // Update function
    const updateTimer = () => {
        const min = Math.floor(timeLeft / 60);
        const sec = timeLeft % 60;
        const timeString = `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;

        btn.innerHTML = `<i class="fas fa-clock"></i> ${timeString} RESTANTES`;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            btn.style.background = 'var(--primary)';
            btn.innerHTML = `<i class="fas fa-check"></i> Â¡LISTO!`;
            btn.disabled = false;
            alert("â° Â¡Tiempo terminado! Â¡A disfrutar!");
        }
        timeLeft--;
    };

    updateTimer(); // Immediate run
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 1000);
}

function syncWithPantry() {
    alert("ðŸ”„ Sincronizando con 'La Despensa'...\n\nHecho: Se han eliminado de la lista 2 artÃ­culos que ya tienes. Se han actualizado las cantidades necesarias para tus recetas de la semana.");
}

function calculateOptimizedRoute() {
    const overlay = document.getElementById('route-overlay');
    if (overlay) {
        overlay.style.display = 'flex';
        console.log("Calculando ruta de mÃ­nima huella de carbono...");
    }
}

function closeRoute() {
    const overlay = document.getElementById('route-overlay');
    if (overlay) overlay.style.display = 'none';
}

function openStore(name) {
    alert(`ðŸª Abriendo Marketplace de ${name}...\n\nAquÃ­ puedes ver el pasillo exacto de cada producto para ahorrar tiempo.`);
}

function openChallenge(name) {
    const modal = document.getElementById('challenge-modal');
    const title = document.getElementById('ch-title');
    const desc = document.getElementById('ch-desc');
    const emoji = document.getElementById('ch-emoji');
    const tag = document.getElementById('ch-tag');

    if (name === 'Zero Waste Week') {
        title.innerText = "Zero Waste Week";
        desc.innerText = "Utiliza todos los ingredientes a punto de caducar de tu despensa esta semana. ¡Reduce el desperdicio al mínimo!";
        emoji.innerText = "📉";
        tag.innerText = "RETO SEMANAL";
    } else if (name === 'Pantry Party') {
        title.innerText = "Pantry Party";
        desc.innerText = "¡Cocina con amigos! Comparte una receta usando solo ingredientes básicos y gana puntos de comunidad dobles.";
        emoji.innerText = "🥳";
        tag.innerText = "EVENTO ESPECIAL";
    }

    modal.style.display = 'flex';
}

function closeChallenge() {
    document.getElementById('challenge-modal').style.display = 'none';
}

function acceptChallenge() {
    alert("Reto aceptado");
    closeChallenge();
}

let currentStep = 1;
function nextStep() {
    if (currentStep < 5) {
        currentStep++;
        updateStepper();
    } else {
        alert("ðŸŽ‰ Â¡Plato completado! Has ahorrado 0.4kg de CO2. Â¡Comparte tu logro!");
    }
}

function updateStepper() {
    const stepNum = document.querySelector('.step-num');
    const stepDesc = document.getElementById('step-desc');
    const progress = document.querySelector('.progress-bar');

    const steps = [
        "Hierve 2L de agua con sal. La IA detectarÃ¡ el hervor.",
        "AÃ±ade la pasta y activa el temporizador sincronizado (8min).",
        "Saltea los ingredientes rescatados en una sartén con AOVE.",
        "Escurre la pasta y mÃ©zclala con la base IA-PrimavIA.",
        "Emplata y decora con albahaca fresca. Â¡Listo!"
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
    console.log("Actualizando feed social con mÃ©tricas dinÃ¡micas...");
}

// --- 3. LÃ³gica de "La Despensa" (Smart Prep) ---

function toggleItem(element) {
    element.classList.toggle('active');
    // Actualizar dinÃ¡micamente el mensaje de recetas disponibles
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
    const voiceInput = prompt("Dile a Pantry Chef quÃ© has comprado (ej: 'He comprado 2 kilos de manzanas y un cartÃ³n de leche'):");
    if (voiceInput) {
        alert("Procesando nota de voz con NLP... ðŸŽ™ï¸\n\nIdentificado: Manzanas (14 dÃ­as), Leche (7 dÃ­as).");
        addPantryItem("Manzanas", "ðŸŽ", "14d");
        addPantryItem("Leche", "ðŸ¥›", "7d");
        updateEcoScore(0.5); // Feedback de ahorro
    }
}

async function generateSmartRecipe() {
    const activeItems = Array.from(document.querySelectorAll('.smart-item.active')).map(el => {
        return {
            name: el.querySelector('.name').innerText,
            icon: el.querySelector('.icon').innerText,
            isUrgent: el.querySelector('.expiry-tag').classList.contains('urgent')
        };
    });

    if (activeItems.length === 0) {
        alert("Â¡Eh, Chef! Selecciona al menos un ingrediente para hacer magia. âœ¨");
        return;
    }

    const overlay = document.getElementById('scan-overlay');
    const t1 = document.getElementById('thought-1');
    const t2 = document.getElementById('thought-2');
    const t3 = document.getElementById('thought-3');
    const status = document.getElementById('scanning-status');
    const preview = document.getElementById('scanned-preview');

    if (preview) preview.style.display = 'none';
    if (overlay) overlay.style.display = 'flex';

    status.innerText = "RAZONAMIENTO IA";
    t1.innerHTML = `<i class="fas fa-microchip"></i> Analizando combinaciones para: ${activeItems.map(i => i.name).join(', ')}`;
    t2.innerText = "";
    t3.innerText = "";

    setTimeout(() => {
        t2.innerHTML = `<i class="fas fa-magic"></i> Optimizando recetas para reducir desperdicio...`;
        setTimeout(() => {
            const urgentNames = activeItems.filter(i => i.isUrgent).map(i => i.name);
            t3.innerHTML = `¡RECETA GENERADA! Prioridad: ${urgentNames.length > 0 ? urgentNames[0] : activeItems[0].name}`;

            setTimeout(() => {
                if (overlay) overlay.style.display = 'none';
                if (preview) preview.style.display = 'block'; // Reset for future scans

                // Intelligence for dynamic naming
                const mainIng = activeItems[0].name;
                const recipeTitle = `Receta con ${mainIng}`;

                // Inject new recipe into DB
                recipesDB[recipeTitle] = {
                    image: 'magic_recipe.jpg',
                    authorImg: 'https://i.pravatar.cc/150?u=aichef',
                    time: 20,
                    ingredients: activeItems.map(i => `${i.icon} ${i.name}`).concat(['Salsa de la casa', 'Especias']),
                    utensils: ['Wok o sartén grande', 'Cuchara de madera', 'Bol'],
                    steps: [
                        `Prepara tu área de trabajo y lava los ingredientes: ${activeItems.map(i => i.name).join(', ')}.`,
                        `Saltea el pollo a fuego alto con un chorrito de aceite hasta que esté dorado.`,
                        `Incorpora el resto de ingredientes uno a uno.`,
                        `Añade la salsa de la casa y deja que reduzca 2 minutos.`,
                        `Sirve inmediatamente y disfruta.`
                    ]
                };

                // Show the beautiful detail view
                openRecipeDetail(recipeTitle, 'Chef IA Antigravity', 'Intermedio');
                updateEcoScore(0.5); // Bonus for magic cooking
            }, 1200);
        }, 1500);
    }, 1200);
}

function updateEcoScore(kg) {
    const scoreEl = document.getElementById('eco-score');
    if (scoreEl) {
        let current = parseFloat(scoreEl.innerText);
        scoreEl.innerText = (current + kg).toFixed(1) + 'kg';
    }
}

// --- 4. VisiÃ³n Artificial Refinada ---

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
                t1.innerHTML = `<i class="fas fa-check"></i> VisiÃ³n Computacional: ${type === 'ticket' ? 'Texto' : 'Objeto'} detectado`;
                t2.innerText = "Razonando: Aplicando base de datos de caducidad para " + rawLabel.split(',')[0];

                setTimeout(() => {
                    const name = rawLabel.split(',')[0].toUpperCase();
                    t3.innerHTML = `Identificado: <b>${name}</b> | Caducidad Est: 5 dÃ­as`;

                    setTimeout(() => {
                        overlay.style.display = 'none';
                        addPantryItem(name, "ðŸ“¦", "5d");
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

// --- 5. InicializaciÃ³n ---

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

function filterRecipes(type, element) {
    // Update active pill
    if (element) {
        document.querySelectorAll('.filter-pills .pill').forEach(p => p.classList.remove('active'));
        element.classList.add('active');
    }

    const cards = document.querySelectorAll('.social-feed .dish-card');

    cards.forEach(card => {
        let show = true;

        // Parse Time (assuming format "12 min")
        const timeEl = card.querySelector('.dish-meta span:nth-child(2)');
        let time = 0;
        if (timeEl) {
            time = parseInt(timeEl.innerText);
        }

        // Parse Eco (assuming format "-0.4kg CO2")
        const ecoEl = card.querySelector('.eco-impact-tag');
        let eco = 100; // default high so it doesn't pass check if missing
        if (ecoEl) {
            const text = ecoEl.innerText;
            const numericPart = text.match(/-?[\d\.]+/);
            if (numericPart) {
                eco = Math.abs(parseFloat(numericPart[0]));
            }
        }

        if (type === 'fast') {
            if (time >= 15) show = false; // STICTLY LESS than 15 min
        } else if (type === 'medium') {
            if (time < 20) show = false; // 20 min OR MORE (includes 20, 30, 45...)
        } else if (type === 'eco') {
            if (eco > 0.5) show = false; // "Eco" < 0.5kg impact
        }
        // type 'all' just keeps show = true

        if (show) {
            card.style.display = 'block';
            keyFrameFadeIn(card);
        } else {
            card.style.display = 'none';
        }
    });

    console.log(`Filtered recipes by: ${type}`);
}

function keyFrameFadeIn(element) {
    element.style.opacity = '0';
    element.style.animation = 'none';
    element.offsetHeight; /* trigger reflow */
    element.style.animation = 'fadeIn 0.5s forwards';
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
            alert(`ðŸŽŠ Â¡SUBIDA DE NIVEL! Ahora eres Chef Nivel ${level + 1}. Tu compromiso con el planeta es imparable.`);
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
    if (confirm("Â¿EstÃ¡s seguro de que quieres cerrar sesiÃ³n?")) {
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

    alert("âœ¨ Perfil actualizado correctamente.");
    showScreen('profile');
}



// --- 8. SMART CART & COOKING MODE LOGIC ---

function switchCartTab(tab) {
    const shopContent = document.getElementById('cart-content-shop');
    const cookContent = document.getElementById('cart-content-cook');
    const tabs = document.querySelectorAll('.cart-tab');

    tabs.forEach(t => t.classList.remove('active'));

    shopContent.style.opacity = '0';
    cookContent.style.opacity = '0';

    setTimeout(() => {
        if (tab === 'shop') {
            shopContent.style.display = 'block';
            cookContent.style.display = 'none';
            tabs[0].classList.add('active');
            setTimeout(() => { shopContent.style.opacity = '1'; }, 50);
        } else {
            shopContent.style.display = 'none';
            cookContent.style.display = 'block';
            tabs[1].classList.add('active');
            setTimeout(() => { cookContent.style.opacity = '1'; }, 50);
        }
    }, 200);
}

let cmCurrentStep = 1;
let cmTimerInterval = null;
let activeCookingRecipe = ''; // Tracking the current active recipe

function openCookingMode(recipeTitle) {
    const overlay = document.getElementById('cooking-mode-overlay');
    const data = recipesDB[recipeTitle] || recipesDB['Pasta con setas y salvia'];

    if (!data) return;

    activeCookingRecipe = recipeTitle;
    cmCurrentStep = 1;
    updateCMStep(data);
    overlay.style.display = 'flex';

    startCMTimer(300);
}

function closeCookingMode() {
    document.getElementById('cooking-mode-overlay').style.display = 'none';
    if (cmTimerInterval) clearInterval(cmTimerInterval);
}

function updateCMStep(data) {
    const stepNum = document.getElementById('cm-step-num');
    const stepTitle = document.getElementById('cm-step-title');
    const stepDesc = document.getElementById('cm-step-desc');

    const steps = data.steps;
    stepNum.innerText = 'PASO ' + cmCurrentStep + ' DE ' + steps.length;

    stepTitle.innerText = steps[cmCurrentStep - 1];
    stepDesc.innerText = 'Asistencia en tiempo real activada. La IA estÃ¡ monitoreando tus gestos para guiarte manos libres.';
}

function changeStep(delta) {
    const data = recipesDB[activeCookingRecipe] || recipesDB['Pasta con setas y salvia'];

    cmCurrentStep += delta;
    if (cmCurrentStep < 1) cmCurrentStep = 1;
    if (cmCurrentStep > data.steps.length) cmCurrentStep = data.steps.length;

    updateCMStep(data);
}

function startCMTimer(seconds) {
    if (cmTimerInterval) clearInterval(cmTimerInterval);

    let timeLeft = seconds;
    const timerVal = document.getElementById('cm-timer-val');

    cmTimerInterval = setInterval(() => {
        const mins = Math.floor(timeLeft / 60);
        const secs = timeLeft % 60;
        timerVal.innerText = (mins < 10 ? '0' : '') + mins + ':' + (secs < 10 ? '0' : '') + secs;

        if (timeLeft <= 0) {
            clearInterval(cmTimerInterval);
            alert('â° Â¡Tiempo del paso terminado!');
        }
        timeLeft--;
    }, 1000);
}


// --- 9. REAL-TIME CLOCK LOGIC (Madrid Time) ---

function updateClock() {
    const timeElement = document.getElementById("current-time");
    if (!timeElement) return;

    // Use Madrid timezone as requested
    const madridTime = new Date().toLocaleTimeString("es-ES", {
        timeZone: "Europe/Madrid",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
    });

    timeElement.innerText = madridTime;
}

// Start the clock and update periodically
setInterval(updateClock, 1000);
updateClock();
