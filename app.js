// --- Pantry Chef: UI & Logic Engine (v2.0 Prep Edition) ---

let net; // Global placeholder for AI Model (TensorFlow.js)

// --- 1. AutenticaciÃ³n y Flujo de Entrada ---

function showLoginForm() {
    SoundEngine.click();
    const actions = document.getElementById('auth-actions');
    const fields = document.getElementById('auth-fields');

    actions.style.display = 'none';
    fields.style.display = 'flex';
    setTimeout(() => {
        fields.style.opacity = '1';
    }, 10);
}

function resetAuth() {
    SoundEngine.back();
    const actions = document.getElementById('auth-actions');
    const fields = document.getElementById('auth-fields');

    fields.style.opacity = '0';
    setTimeout(() => {
        fields.style.display = 'none';
        actions.style.display = 'flex';
    }, 400);
}

function handleAuth() {
    startTaylorSwiftSong();
    const email = document.getElementById('user-email').value;
    const pass = document.getElementById('user-pass').value;

    if (!email || !pass) {
        alert("Por favor, rellena tu correo y contraseÃ±a.");
        return;
    }

    const authScreen = document.getElementById('auth-screen');
    const mainApp = document.getElementById('main-app-content');
    const phoneFrame = document.querySelector('.phone-frame');

    SoundEngine.welcome();
    authScreen.classList.add('hidden');

    setTimeout(() => {
        phoneFrame.classList.add('in-app');
        mainApp.style.display = 'flex';
        setTimeout(() => mainApp.classList.add('visible'), 50);
        setTimeout(() => startTaylorSwiftSong(), 800);
    }, 400);
}

// --- 2. NavegaciÃ³n Principal & "Dish" Logic ---

// Consolidated showScreen logic moved to section 12 to avoid duplication conflicts.

function showHeatNotification() {
    const notif = document.getElementById('ios-notification');
    const title = document.getElementById('ios-notif-title');
    const msg = document.getElementById('ios-notif-msg');
    const icon = document.querySelector('.ios-notif-icon');
    
    if (!notif) return;

    // Set content for hot day
    title.innerText = "¡Qué calor hace hoy! ☀️";
    msg.innerHTML = "Ideal para un <b>Salmorejo Cordobés</b> fresquito. Haz clic para ver la receta.";
    
    // Add image if it doesn't exist
    let notifImg = notif.querySelector('.ios-notif-img');
    if (!notifImg) {
        notifImg = document.createElement('img');
        notifImg.className = 'ios-notif-img';
        notif.querySelector('.ios-notif-body').appendChild(notifImg);
    }
    notifImg.src = 'salmorejo-cordobes.png';
    notifImg.style.display = 'block';

    // Forced styles to ensure visibility (bypassing potentially broken CSS)
    notif.style.zIndex = '100000';
    notif.style.position = 'absolute';
    notif.style.left = '50%';
    notif.style.transform = 'translateX(-50%)';
    notif.style.top = '40px';
    notif.style.opacity = '1';
    notif.style.display = 'block';

    // Show notification (class still added for transitions)
    notif.classList.add('show');
    
    // Play notification sound
    SoundEngine.ding();

    // Set click handler to open recipe in new window
    notif.onclick = (e) => {
        e.stopPropagation();
        console.log("Notificación pinchada, abriendo salmorejo.html");
        window.location.href = 'salmorejo.html';
        notif.classList.remove('show');
    };

    // Auto hide after 8 seconds
    setTimeout(() => {
        notif.classList.remove('show');
        notif.style.top = '-300px';
        notif.style.opacity = '0';
    }, 8000);
}

// Mock Database for Recipes (would be an API in prod)
const recipesDB = {
    'Pasta con setas y salvia': {
        image: 'https://images.unsplash.com/photo-1473093226795-af9932fe5856?auto=format&fit=crop&w=800&q=80',
        authorImg: 'https://i.pravatar.cc/150?u=carlos',
        time: 12, // minutes
        ingredients: ['200g Pasta', '100g Setas', 'Hojas de salvia', 'Aceite de oliva', 'Ajo'],
        utensils: ['Olla grande', 'SartÃ©n', 'Escurridor'],
        steps: ['Hervir agua y cocer pasta hasta que esté perfectamente al dente.', 'Saltear setas carnosas con ajo y salvia hasta sentir su sabor profundo y umami y el aroma herbáceo.', 'Mezclar la pasta con las setas, permitiendo que el calor libere todo el perfume de la salvia en una textura sedosa.', 'Servir caliente y disfrutar del contraste de sabores.']
    },
    'Pasta PrimavIA': { // Fallback for differing names
        image: 'https://images.unsplash.com/photo-1473093226795-af9932fe5856?auto=format&fit=crop&w=800&q=80',
        authorImg: 'https://i.pravatar.cc/150?u=carlos',
        time: 12,
        ingredients: ['200g Pasta', 'Verduras Varias', 'Aceite', 'Queso'],
        utensils: ['Olla', 'SartÃ©n'],
        steps: ['Cocer la pasta al dente para una mordida perfecta.', 'Saltear las verduras frescas hasta que estén ligeramente crujientes, con un chorrito de aceite que realce su sabor natural.', 'Mezclar todo y servir con un toque de queso inhalando su fragancia salada y disfrutando de su textura fundente.']
    },
    'Vegan Bowl': {
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
        authorImg: 'https://i.pravatar.cc/150?u=ana',
        time: 20,
        ingredients: ['Tofu marinado', 'Huevos de codorniz', 'Edamame', 'Tomates cherry', 'MaÃ­z dulce', 'Pepino', 'Lechuga', 'Cebollino fresco'],
        utensils: ['Bol', 'Cuchillo'],
        steps: ['Pon una base de lechuga refrescante en el fondo del bowl.', 'Ve colocando cada ingrediente disfrutando de la textura firme y sabor terroso del tofu marinado.', 'AÃ±ade el resto de vegetales para un festín de frescor crujiente.', 'Espolvorea cebollino picado, soltando su aroma punzante y sabor vibrante al cortarlo.']
    },
    'Tostada de aguacate': {
        image: 'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?auto=format&fit=crop&w=800&q=80',
        authorImg: 'https://i.pravatar.cc/150?u=marta',
        time: 10,
        ingredients: ['Pan integral', '1 Aguacate', 'Semillas', 'LimÃ³n', 'Sal al gusto', 'Pimienta al gusto'],
        utensils: ['Tostadora', 'Cuchillo'],
        steps: ['Tuesta el pan hasta lograr un contraste crujiente e irresistible.', 'Chafar el aguacate con limón para liberar su cremosidad refrescante y frescura cítrica.', 'Untar generosamente y decorar con semillas para un toque extra de textura.']
    },
    'Buddha Bowl': {
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
        authorImg: 'https://i.pravatar.cc/150?u=green',
        time: 25,
        ingredients: ['1 Aguacate', 'Garbanzos', 'Boniato', 'RÃ¡bano', 'Tomates cherry', 'Pimiento amarillo', 'Col lombarda'],
        utensils: ['Cuchillo', 'Bol grande'],
        steps: ['Pon una base de brotes tiernos y refrescantes.', 'Corta el aguacate sintiendo su textura cremosa y suave sabor.', 'Siente el contraste crujiente de los garbanzos tostados al añadirlos al bowl.', 'La mezcla de texturas, de lo tierno a lo crocante, será un festival para tu paladar.']
    },
    'Espaguetis con salsa pomodoro': {
        image: 'https://images.unsplash.com/photo-1551892374-ecf8754cf8b0?auto=format&fit=crop&w=800&q=80',
        authorImg: 'https://i.pravatar.cc/150?u=veggie',
        time: 15,
        ingredients: ['Espaguetis (preferiblemente de sÃ©samo o de grano duro)', 'Tomates maduros', '1 diente de ajo', 'Aceite de oliva virgen extra', 'Sal', 'Albahaca fresca', 'Queso parmesano o pecorino rallado (opcional)'],
        utensils: ['Olla grande', 'SartÃ©n amplia', 'Colador'],
        steps: ['Prepara una salsa pomodoro de sabor dulce y ácido con una textura aterciopelada que acaricie la pasta.', 'Cocer los espaguetis al dente para mantener esa firmeza característica y una mordida perfecta.', 'Mantequillar con el agua de cocción para una terminación cremosa, brillante y fundente.']
    },
    'Freakshake de chocolate': {
        image: 'https://images.unsplash.com/photo-1577805947697-89e18249d767?auto=format&fit=crop&w=800&q=80',
        authorImg: 'https://i.pravatar.cc/150?u=sweet',
        time: 5,
        ingredients: ['Leche', '3 bolas de helado de chocolate', 'Sirope de chocolate', 'Chocolate fundido o Nutella (para decorar)', 'Nata montada (opcional)', '1 Barrita de chocolate (opcional)', 'Cacao en polvo'],
        utensils: ['Batidora', 'Tarro de cristal'],
        steps: ['Funde chocolate para una textura líquida y pecaminosa.', 'Bate hasta conseguir un batido denso, cremoso y de dulzor intenso.', 'La nata montada aporta una ligereza aérea en contraste con el chocolate fundido.', 'El cacao en polvo añade un toque final de amargor sofisticado.']
    },
    'Sopa de Lentejas': {
        image: 'https://images.unsplash.com/photo-1547592166-23acbe346499?auto=format&fit=crop&w=800&q=80',
        authorImg: 'https://i.pravatar.cc/150?u=comfort',
        time: 45,
        ingredients: ['Lentejas', 'Zanahoria', 'Cebolla', 'Caldo de Verduras', 'Laurel'],
        utensils: ['Olla Express', 'Cuchara'],
        steps: ['Sofreír verduras para una base de sabor profundo y textura suave.', 'Cocer las lentejas hasta que estén tiernas y la sopa tenga una consistencia reconfortante y espesa.', 'El laurel infunde un sabor amaderado sutil que completa este plato hogareño de sabor intenso.']
    }
};

let currentRecipeTime = 0;
let timerInterval;

function openRecipeDetail(title, author, difficulty) {
    SoundEngine.confirm();
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
    
    // Start relaxing cooking music (Zen Mode)
    setTimeout(() => {
        SoundEngine.startZen();
    }, 500);
}

function startCooking() {
    SoundEngine.confirm();
    
    // Haptic Feedback for starting the cooking timer
    if ('vibrate' in navigator) {
        navigator.vibrate([40, 60, 40]); // Stronger double pulse for starting the action
    }

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
    alert("ð Sincronizando con 'La Despensa'...\n\nHecho: Se han eliminado de la lista 2 artÃ­culos que ya tienes. Se han actualizado las cantidades necesarias para tus recetas de la semana.");
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
    alert(`ðª Abriendo Marketplace de ${name}...\n\nAquÃ­ puedes ver el pasillo exacto de cada producto para ahorrar tiempo.`);
}

function openChallenge(name) {
    SoundEngine.click();
    
    if (name === 'Zero to Hero') {
        window.location.href = 'challenge-hero.html';
        return;
    }

    const modal = document.getElementById('challenge-modal');
    const title = document.getElementById('ch-title');
    const desc = document.getElementById('ch-desc');
    const emoji = document.getElementById('ch-emoji');
    const tag = document.getElementById('ch-tag');

    if (name === 'Pantry Party') {
        title.innerText = "Pantry Party";
        desc.innerText = "Â¡Cocina con amigos! Comparte una receta usando solo ingredientes bÃ¡sicos y gana puntos de comunidad dobles.";
        emoji.innerText = "ðŸ¥³";
        tag.innerText = "EVENTO ESPECIAL";
    } else if (name === 'Zero Waste Week') {
        title.innerText = "Zero Waste Week";
        desc.innerText = "Utiliza todos los ingredientes a punto de caducar de tu despensa esta semana. Â¡Reduce el desperdicio al mÃ­nimo!";
        emoji.innerText = "ðŸ“‰";
        tag.innerText = "RETO SEMANAL";
    }

    modal.style.display = 'flex';
}

function openShareDish() {
    SoundEngine.click();
    document.getElementById('share-dish-modal').style.display = 'flex';
}

function closeShareDish() {
    document.getElementById('share-dish-modal').style.display = 'none';
    document.getElementById('upload-status').style.display = 'none';
}

function submitSharedDish() {
    SoundEngine.click();
    const status = document.getElementById('upload-status');
    status.style.display = 'block';
    
    // Simulate IA analysis
    setTimeout(() => {
        closeShareDish();
        showHeatNotification("¡Plato publicado!", "Tu creación ya está en el feed. Pantry Chef ha detectado 3 ingredientes y un ahorro de 0.5kg de CO2.");
    }, 2500);
}

function closeChallenge() {
    SoundEngine.back();
    document.getElementById('challenge-modal').style.display = 'none';
}

function acceptChallenge() {
    SoundEngine.confirm();
    alert("Reto aceptado");
    closeChallenge();
}

let currentStep = 1;
function nextStep() {
    if (currentStep < 5) {
        currentStep++;
        updateStepper();
    } else {
        alert("ð Â¡Plato completado! Has ahorrado 0.4kg de CO2. Â¡Comparte tu logro!");
    }
}

function updateStepper() {
    const stepNum = document.querySelector('.step-num');
    const stepDesc = document.getElementById('step-desc');
    const progress = document.querySelector('.progress-bar');

    const steps = [
        "Hierve 2L de agua con sal. La IA detectarÃ¡ el hervor.",
        "AÃ±ade la pasta y activa el temporizador sincronizado (8min).",
        "Saltea los ingredientes rescatados en una sartÃ©n con AOVE.",
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
    SoundEngine.tick();
    element.classList.toggle('active');
    // Actualizar dinÃ¡micamente el mensaje de recetas disponibles
    const activeCount = document.querySelectorAll('.smart-item.active').length;
    console.log(`Ingredientes activos para cocinar: ${activeCount}`);
}

function toggleFABMenu() {
    SoundEngine.click();
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
        alert("Procesando nota de voz con NLP... ðï¸\n\nIdentificado: Manzanas (14 dÃ­as), Leche (7 dÃ­as).");
        addPantryItem("Manzanas", "ð", "14d");
        addPantryItem("Leche", "ð¥", "7d");
        updateEcoScore(0.5); // Feedback de ahorro
    }
}

async function generateSmartRecipe() {
    SoundEngine.magic();
    const activeItems = Array.from(document.querySelectorAll('.smart-item.active')).map(el => {
        return {
            name: el.querySelector('.name').innerText,
            icon: el.querySelector('.icon').innerText,
            isUrgent: el.querySelector('.expiry-tag').classList.contains('urgent')
        };
    });

    if (activeItems.length === 0) {
        alert("Â¡Eh, Chef! Selecciona al menos un ingrediente para hacer magia. â¨");
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
            t3.innerHTML = `Â¡RECETA GENERADA! Prioridad: ${urgentNames.length > 0 ? urgentNames[0] : activeItems[0].name}`;

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
                    utensils: ['Wok o sartÃ©n grande', 'Cuchara de madera', 'Bol'],
                    steps: [
                        `Prepara tu área de trabajo y lava los ingredientes: ${activeItems.map(i => i.name).join(', ')}.`,
                        `Saltea los ingredientes a fuego alto con un chorrito de aceite hasta que el aroma empiece a caramelizar y llenar la cocina.`,
                        `Incorpora el resto de ingredientes uno a uno, notando cómo cambian los matices del perfume del plato.`,
                        `Añade la salsa de la casa y deja que reduzca 2 minutos mientras disfrutas del olor a especias calientes.`,
                        `Sirve inmediatamente inhalando el delicioso aroma final y disfruta.`
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
                        addPantryItem(name, "ð¦", "5d");
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
    SoundEngine.click();
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

    // Knife chop sound on login input
    const emailInput = document.getElementById('user-email');
    const passInput = document.getElementById('user-pass');
    if (emailInput) emailInput.addEventListener('input', () => SoundEngine.chop());
    if (passInput) passInput.addEventListener('input', () => SoundEngine.chop());
});
function addTuppersitos(amount) {
    SoundEngine.click();
    const xpBar = document.querySelector('.xp-bar-progress');
    const xpText = document.querySelector('.xp-text');
    const levelBadge = document.getElementById('chef-level');

    if (xpBar && xpText && levelBadge) {
        let currentWidth = parseFloat(xpBar.style.width) || 50;
        let newWidth = currentWidth + (amount / 30); // Adjusted for Tuppersitos sensitivity

        let currentPtsText = xpText.innerText.split(' / ')[0].replace('.', '');
        let currentPts = parseInt(currentPtsText) || 750;
        let finalPts = currentPts + amount;

        if (newWidth >= 100) {
            newWidth = 10; 
            levelBadge.innerText = `PrÃ³ximo Nivel Desbloqueado`;
            alert(`ð Â¡NIVEL COMPLETADO! Has ganado ${amount} Tuppersitos. Tu impacto es increÃ­ble.`);
        }

        xpBar.style.width = newWidth + '%';
        xpText.innerText = `${finalPts.toLocaleString('de-DE')} / 1.500 Tuppersitos`;
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
    SoundEngine.back();
    if (confirm('Â¿EstÃ¡s seguro de que quieres cerrar sesiÃ³n?')) {
        SoundEngine.stopAmbient();
        const phoneFrame = document.querySelector('.phone-frame');
        const mainApp = document.getElementById('main-app-content');
        mainApp.classList.remove('visible');
        phoneFrame.classList.remove('in-app');
        setTimeout(() => {
            mainApp.style.display = 'none';
            document.getElementById('auth-screen').classList.remove('hidden');
            document.getElementById('auth-fields').style.display = 'none';
            document.getElementById('auth-actions').style.display = 'flex';
            showScreen('home'); // Reset navigation for next login
            
            // Reset lock screen states
            const cover = document.getElementById('ios-cover-screen');
            const lock = document.getElementById('ios-lock-screen');
            if (cover) cover.classList.remove('hidden');
            if (lock) {
                lock.classList.remove('visible');
                lock.classList.remove('unlocked');
            }
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

    alert("â¨ Perfil actualizado correctamente.");
    showScreen('profile');
}

// --- 8. SMART CART & COOKING MODE LOGIC ---

function switchCartTab(tab) {
    SoundEngine.click();
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
    SoundEngine.confirm();
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
    SoundEngine.back();
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
    SoundEngine.ding();
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

function updateBothClocks() {
    const timeElement = document.getElementById("current-time");
    const lockTimes = document.querySelectorAll('.lock-time');
    const lockDates = document.querySelectorAll('.lock-date');

    const now = new Date();
    
    // Madrid Timezone
    const timeOptions = {
        timeZone: "Europe/Madrid",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
    };

    const dateOptions = {
        timeZone: "Europe/Madrid",
        weekday: 'long',
        day: 'numeric',
        month: 'long'
    };

    const timeStr = now.toLocaleTimeString("es-ES", timeOptions);
    const dateStrRaw = now.toLocaleDateString("es-ES", dateOptions);
    const dateStr = dateStrRaw.charAt(0).toUpperCase() + dateStrRaw.slice(1);

    if (timeElement) timeElement.innerText = timeStr;
    lockTimes.forEach(el => el.innerText = timeStr);
    lockDates.forEach(el => el.innerText = dateStr);
}

// Initial update and interval
updateBothClocks();
setInterval(updateBothClocks, 1000);


// --- 10. KITCHEN SOUND TOGGLE CONTROLLER ---

function handleSoundToggle() {
    var btn   = document.getElementById('sound-toggle-btn');
    var badge = document.getElementById('sound-badge');
    var isNowOn = SoundEngine.toggleAmbient();

    // Toggle Taylor Swift music alongside ambient sounds
    initTSAudio();
    if (tsAudio) {
        if (isNowOn) {
            tsAudio.play().catch(e => console.warn("Music play blocked:", e));
        } else {
            tsAudio.pause();
        }
    }

    if (isNowOn) {
        btn.classList.remove('muted');
        if (badge) badge.textContent = 'ON';
    } else {
        btn.classList.add('muted');
        if (badge) badge.textContent = 'OFF';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    var soundBtn = document.getElementById('sound-toggle-btn');
    if (soundBtn) soundBtn.style.display = 'none';

    var mainApp = document.getElementById('main-app-content');
    var observer = new MutationObserver(function() {
        if (mainApp && mainApp.classList.contains('visible')) {
            setTimeout(function() {
                if (soundBtn) soundBtn.style.display = 'flex';
            }, 950);
        } else {
            if (soundBtn) soundBtn.style.display = 'none';
        }
    });
    if (mainApp) observer.observe(mainApp, { attributes: true, attributeFilter: ['class'] });
});

// --- 11. TAYLOR SWIFT NATIVE MUSIC PLAYER (The Fate of Ophelia) ---

var tsAudio = null;
var tsProgressInterval = null;

function initTSAudio() {
    if (!tsAudio) {
        tsAudio = document.getElementById('ts-audio-element');
        if (tsAudio) {
            // Force unmuted and full volume
            tsAudio.muted = false;
            tsAudio.volume = 0.05;
            
            tsAudio.addEventListener('playing', function() {
                var btn = document.getElementById('ts-play-btn');
                var img = document.querySelector('.ts-album-art img');
                if (btn) btn.textContent = 'â¸';
                if (img) img.classList.remove('paused');
                startTSProgress();
            });
            tsAudio.addEventListener('pause', function() {
                var btn = document.getElementById('ts-play-btn');
                var img = document.querySelector('.ts-album-art img');
                if (btn) btn.textContent = 'â¶';
                if (img) img.classList.add('paused');
                stopTSProgress();
            });
            tsAudio.addEventListener('ended', function() {
                closeTSPlayer();
            });
        }
    }
}

function startTaylorSwiftSong() {
    initTSAudio();
    // Native music player UI is now hidden per user request
    if (tsAudio) {
        tsAudio.muted = false;
        tsAudio.volume = 0.05; // Much lower volume per user request
        console.log("Starting background music...");
        tsAudio.play();
    }
}

function toggleTSPlayer() {
    initTSAudio();
    if (!tsAudio) return;
    if (tsAudio.paused) {
        tsAudio.play();
    } else {
        tsAudio.pause();
    }
}

function closeTSPlayer() {
    if (tsAudio) {
        tsAudio.pause();
        tsAudio.currentTime = 0;
    }
    stopTSProgress();
    var wrap = document.getElementById('ts-player-wrap');
    if (wrap) {
        var player = document.getElementById('ts-mini-player');
        if (player) {
            player.style.animation = 'none';
            player.style.transition = 'opacity 0.3s, transform 0.3s';
            player.style.opacity = '0';
            player.style.transform = 'translateX(-50%) translateY(20px)';
        }
        setTimeout(function() { wrap.style.display = 'none'; }, 350);
    }
}

function startTSProgress() {
    stopTSProgress();
    tsProgressInterval = setInterval(function() {
        if (!tsAudio) return;
        var current = tsAudio.currentTime || 0;
        var duration = tsAudio.duration || 1;
        var pct = (current / duration) * 100;
        var bar = document.getElementById('ts-progress');
        if (bar) bar.style.width = pct + '%';
    }, 500);
}

function stopTSProgress() {
    if (tsProgressInterval) {
        clearInterval(tsProgressInterval);
        tsProgressInterval = null;
    }
}

// --- 12. PUSH NOTIFICATIONS (iOS Style) ---

function showIOSNotification(title, message, delay = 0, duration = 5500) {
    setTimeout(() => {
        SoundEngine.ding(); // Reproducir sonido corto
        const notif = document.getElementById('ios-notification');
        document.getElementById('ios-notif-title').innerText = title;
        document.getElementById('ios-notif-msg').innerText = message;
        
        notif.classList.add('show');
        
        setTimeout(() => {
            notif.classList.remove('show');
        }, duration); 
    }, delay);
}

// Automated notifications removed as per request
/*
document.addEventListener('DOMContentLoaded', function() {
    simulateSmartNotifications();
});
*/

function showScreen(screenId) {
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    const navItems = document.querySelectorAll('.nav-item');
    if (screenId === 'home') navItems[0].classList.add('active');
    if (screenId === 'pantry') navItems[1].classList.add('active');
    if (screenId === 'cart') navItems[2].classList.add('active');
    if (screenId === 'points') navItems[3].classList.add('active');
    if (screenId === 'profile' || screenId === 'settings' || screenId === 'profile-edit') navItems[4].classList.add('active');

    document.querySelectorAll('.screen').forEach(screen => screen.classList.remove('active'));
    const target = document.getElementById('screen-' + screenId);
    if (target) {
        target.classList.add('active');
        if (screenId === 'home') simulateSocialUpdates();
        
        // Stop relaxing music if leaving recipe view
        if (screenId !== 'recipe') {
            SoundEngine.stopZen();
        }

        // Pantry Disclaimer / Notification
        if (screenId === 'pantry') {
            showIOSNotification(
                "Consejo de Pantry Chef", 
                "Esa lata de garbanzos olvidada tiene potencial para convertirse en un hummus casero. ¡Vamos a rescatarla!", 
                600,
                12000
            );
        }
    }

    // Trigger heat notification when clicking profile tab
    if (screenId === 'profile' || screenId === 'settings' || screenId === 'profile-edit') {
        console.log("Heat notification triggered for Profile sub-screen");
        setTimeout(showHeatNotification, 600);
    }
}

// --- 13. APP ENTRY TRANSITION ---

function openApp() {
    SoundEngine.click();
    const homeScreen = document.getElementById('ios-home-screen');
    const authScreen = document.getElementById('auth-screen');
    const phoneFrame = document.querySelector('.phone-frame');

    homeScreen.style.transform = 'scale(1.5)';
    homeScreen.style.opacity = '0';
    document.querySelector('.status-bar').style.color = '#000';

    setTimeout(() => {
        homeScreen.style.display = 'none';
        authScreen.style.display = 'flex';
        setTimeout(() => {
            authScreen.style.opacity = '1';
        }, 50);
    }, 400);
}
// --- 14. iOS LOCK SCREEN LOGIC ---
let passcode = [];
function enterDigit(digit) {
    if (passcode.length < 4) {
        passcode.push(digit);
        updatePasscodeDots();
        SoundEngine.click();
        
        if (passcode.length === 4) {
            setTimeout(unlockPhone, 300);
        }
    }
}

function deleteDigit() {
    passcode.pop();
    updatePasscodeDots();
    SoundEngine.back();
}

function updatePasscodeDots() {
    const dots = document.querySelectorAll('#passcode-dots .dot');
    dots.forEach((dot, index) => {
        if (index < passcode.length) {
            dot.classList.add('filled');
        } else {
            dot.classList.remove('filled');
        }
    });
}

function unlockPhone() {
    const lockScreen = document.getElementById('ios-lock-screen');
    lockScreen.classList.add('unlocked');
    SoundEngine.confirm();
    
    // Notifications trigger removed as per request
}


function openCamera() {
    SoundEngine.click();
    alert('Cámara desactivada en esta simulación.');
}


function showPasscode() {
    const cover = document.getElementById('ios-cover-screen');
    const lock = document.getElementById('ios-lock-screen');
    if (cover) {
        cover.classList.add('hidden');
        SoundEngine.click();
    }
    if (lock) {
        lock.classList.add('visible');
    }
}

// Actualizar ambos relojes
// --- 15. PREMIUM DESKTOP ACCESSIBILITY: MOUSE DRAG SCROLL ---
function initPremiumScroll() {
    const scrollContainers = document.querySelectorAll('.tier-scroll, .badges-scroll');
    
    scrollContainers.forEach(slider => {
        let isDown = false;
        let startX;
        let scrollLeft;

        slider.addEventListener('mousedown', (e) => {
            isDown = true;
            slider.classList.add('active-dragging');
            startX = e.pageX - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;
        });

        slider.addEventListener('mouseleave', () => {
            isDown = false;
            slider.classList.remove('active-dragging');
        });

        slider.addEventListener('mouseup', () => {
            isDown = false;
            slider.classList.remove('active-dragging');
        });

        slider.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - slider.offsetLeft;
            const walk = (x - startX) * 2; // Scroll speed multiplier
            slider.scrollLeft = scrollLeft - walk;
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // Other initializations...
    initPremiumScroll();
});

function scrollTiers(direction) {
    const container = document.querySelector('.tier-scroll');
    const cards = document.querySelectorAll('.tier-card');
    
    if (container && cards.length > 0) {
        const cardWidth = cards[0].offsetWidth + 15; // Width + gap
        container.scrollBy({
            left: direction * cardWidth,
            behavior: 'smooth'
        });
        SoundEngine.tick();
    }
}

// End of Script
