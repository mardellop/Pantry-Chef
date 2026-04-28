
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

    // Show notification (class still added for transitions)
    notif.classList.add('show');
    
    // Play notification sound
    SoundEngine.ding();

    // Set click handler to open recipe in new window
    notif.onclick = (e) => {
        e.stopPropagation();
        console.log("Notificación pinchada, abriendo salmorejo.html");
        openPage('salmorejo.html');
        notif.classList.remove('show');
    };

    // Auto hide after 8 seconds
    setTimeout(() => {
        notif.classList.remove('show');
    }, 8000);
}

// --- Base de Datos de Recetas Pantry Chef ---
const recipesDB = {
    // TOMATE
    'Salmorejo cordobés': {
        image: 'salmorejo-cordobes.png',
        time: 15, difficulty: 'Muy fácil', servings: 4,
        ingredients: ['1 kg de tomates maduros', '200 g de pan de hogaza', '100 ml de AOVE', '1 diente de ajo', 'Sal', 'Vinagre de Jerez', 'Huevo duro y jamón'],
        utensils: ['Batidora', 'Colador fino', 'Bol'],
        steps: ['Tritura los tomates con el pan remojado, ajo y aceite.', 'Pasa por un colador, ajusta sal y vinagre.', 'Enfría 30 min y sirve con huevo y jamón.']
    },
    'Ensalada caprese': {
        image: 'ensalada-caprese.jpg',
        time: 10, difficulty: 'Muy fácil', servings: 2,
        ingredients: ['2 tomates grandes', '2 bolas de mozzarella fresca', 'Albahaca fresca', 'AOVE', 'Sal en escamas', 'Pimienta'],
        utensils: ['Cuchillo', 'Plato'],
        steps: ['Corta tomate y mozzarella en rodajas.', 'Alterna rodajas en un plato con albahaca.', 'Aliña con aceite, sal y pimiento.']
    },
    'Pan con tomate': {
        image: 'pan-con-tomate.jpg',
        time: 5, difficulty: 'Muy fácil', servings: 2,
        ingredients: ['2 rebanadas de pan', '1 tomate maduro', '1/2 diente de ajo', 'AOVE', 'Sal'],
        utensils: ['Tostadora', 'Cuchillo'],
        steps: ['Tuesta el pan hasta que esté dorado.', 'Frota el ajo por la superficie.', 'Restriega el tomate, añade sal y aceite.']
    },
    'Huevos con tomate': {
        image: 'huevos-con-tomate.jpg',
        time: 15, difficulty: 'Muy fácil', servings: 2,
        ingredients: ['4 huevos', '400 g de tomate picado', '1/2 cebolla', '1 diente de ajo', '1/2 pimiento verde', 'AOVE', 'Sal', 'Pimienta'],
        utensils: ['Sartén', 'Tapa'],
        steps: ['Sofríe cebolla y tomate 8 min.', 'Casca los huevos encima y tapa.', 'Cocina a fuego medio y sirve con pan.']
    },
    'Pollo al tomate': {
        image: 'pollo-al-tomate.jpg',
        time: 35, difficulty: 'Media', servings: 2,
        ingredients: ['500 g de pollo', '400 g de tomate', '1 cebolla', '2 dientes de ajo', '1 pimiento rojo', 'AOVE', 'Sal', 'Pimienta'],
        utensils: ['Cazuela', 'Cuchillo'],
        steps: ['Dora el pollo salpimentado.', 'Añade tomate, cebolla y ajo. Rehoga 5 min.', 'Cocina tapado 20 min a fuego bajo.']
    },
    'Pasta al pomodoro': {
        image: 'pasta-al-pomodoro.jpg',
        time: 20, difficulty: 'fácil', servings: 2,
        ingredients: ['200 g de pasta', '400 g de tomate triturado', '2 dientes de ajo', '1/2 cebolla', 'AOVE', 'Albahaca fresca', 'Sal'],
        utensils: ['Olla', 'Sartén'],
        steps: ['Cuece la pasta según instrucciones.', 'Sofríe ajo y tomate 10 min.', 'Mezcla y sirve con albahaca y aceite.']
    },
    'Pisto manchego': {
        image: 'pisto-manchego.jpg',
        time: 30, difficulty: 'fácil', servings: 3,
        ingredients: ['2 pimientos verdes', '1 pimiento rojo', '1 cebolla', '500 g de tomate', '2 dientes de ajo', '3 huevos (opcional)', 'AOVE', 'Sal'],
        utensils: ['Sartén grande', 'Espátula'],
        steps: ['Sofríe cebolla y pimiento 10 min.', 'Añade tomate y ajo. Cocina destapado.', 'Sazona y sirve (con huevos fritos si quieres).']
    },

    // AGUACATE
    'Guacamole casero': {
        image: 'guacamole-casero.jpg',
        time: 10, difficulty: 'Muy fácil', servings: 4,
        ingredients: ['3 aguacates maduros', '1 tomate pequeño', '1/2 cebolla', '1/2 limón', 'Cilantro', 'Sal', 'Pimienta', 'Nachos'],
        utensils: ['Bol', 'Tenedor'],
        steps: ['Aplasta los aguacates en un bol.', 'Añade tomate, cebolla y limón.', 'Sazona y sirve con nachos.']
    },
    'Tostada de aguacate': {
        image: 'tostada-de-aguacate.jpg',
        time: 10, difficulty: 'Muy fácil', servings: 1,
        ingredients: ['1 rebanada de pan', '1/2 aguacate', '1/2 tomate', 'Limón', 'Sésamo', 'AOVE', 'Sal', 'Pimienta'],
        utensils: ['Tostadora', 'Tenedor'],
        steps: ['Tuesta el pan dorado.', 'Aplasta aguacate con limón y unta.', 'Añade tomate, sésamo y aceite.']
    },
    'Ensalada de aguacate y tomate': {
        image: 'ensalada-de-aguacate-y-tomate.jpg',
        time: 10, difficulty: 'Muy fácil', servings: 2,
        ingredients: ['2 aguacates', '2 tomates', '1/4 cebolla morada', 'Limón', 'AOVE', 'Sal', 'Cilantro'],
        utensils: ['Cuchillo', 'Bol'],
        steps: ['Corta aguacate y tomate en dados.', 'Añade cebolla picada y mezcla.', 'Aliña con limón, aceite, sal y cilantro.']
    },
    'Aguacate con huevo al horno': {
        image: 'aguacate-con-huevo-al-horno',
        time: 22, difficulty: 'fácil', servings: 2,
        ingredients: ['2 aguacates', '4 huevos pequeños', 'Salsa picante', 'Sal', 'Pimienta', 'Tomate'],
        utensils: ['Bandeja horno', 'Cuchara'],
        steps: ['Quita el hueso del aguacate y amplía hueco.', 'Casca un huevo dentro, salpimenta y pon salsa.', 'Hornea 15-18 min a 200°C.']
    },
    'Bowl de aguacate y espinacas': {
        image: 'bowl-de-aguacate-y-espinacas.jpg',
        time: 10, difficulty: 'Muy fácil', servings: 2,
        ingredients: ['1 aguacate', '200 g espinacas baby', '10 tomates cherry', 'Pipas girasol', 'Limón', 'AOVE', 'Sal'],
        utensils: ['Bol'],
        steps: ['Lava espinacas y ponlas de base.', 'Añade aguacate y tomate cherry.', 'Aliña con limón, aceite y pipas.']
    },

    // ESPINACAS
    'Espinacas al ajillo': {
        image: 'espinacas-al-ajillo.jpg',
        time: 10, difficulty: 'Muy fácil', servings: 2,
        ingredients: ['500 g espinacas', '3 dientes de ajo', '1/2 cebolla', 'AOVE', 'Sal', 'Limón', 'Nuez moscada'],
        utensils: ['Sartén'],
        steps: ['Dora los ajos laminados en aceite.', 'Añade espinacas hasta que reduzcan.', 'Sazona con sal, limón y nuez moscada.']
    },
    'Revuelto de espinacas y huevo': {
        image: 'revuelto-de-espinacas-y-huevo.jpg',
        time: 12, difficulty: 'Muy fácil', servings: 2,
        ingredients: ['300 g espinacas', '4 huevos', '2 dientes de ajo', '50 g queso rallado', '1/2 cebolla', 'AOVE', 'Sal'],
        utensils: ['Sartén', 'Bol'],
        steps: ['Saltea espinacas con ajo 3 min.', 'Bate huevos con sal y vierte.', 'Remueve a fuego bajo, añade queso y sirve.']
    },
    'Crema de espinacas': {
        image: 'crema-de-espinacas.jpg',
        time: 20, difficulty: 'fácil', servings: 3,
        ingredients: ['500 g espinacas', '1 cebolla', '2 dientes de ajo', '750 ml caldo vegetal', '50 g queso', 'AOVE', 'Sal'],
        utensils: ['Olla', 'Batidora'],
        steps: ['Pocha cebolla y ajo.', 'Añade espinacas y caldo. Hierve 10 min.', 'Tritura hasta obtener crema y pon queso.']
    },
    'Pasta con espinacas y queso': {
        image: 'pasta-con-espinacas-y-queso.jpg',
        time: 20, difficulty: 'fácil', servings: 2,
        ingredients: ['200 g pasta', '200 g espinacas', '60 g queso rallado', '2 dientes de ajo', 'AOVE', 'Sal'],
        utensils: ['Olla', 'Sartén'],
        steps: ['Cuece pasta (reserva agua).', 'Saltea espinacas con ajo y añade pasta.', 'Añade queso y agua de cocción. Mezcla.']
    },

    // CEBOLLA
    'Sopa de cebolla gratinada': {
        image: 'sopa-de-cebolla-gratinada.jpg',
        time: 40, difficulty: 'fácil', servings: 3,
        ingredients: ['4 cebollas', '1L caldo verduras', '60 g mantequilla', '1 diente de ajo', '4 rebanadas pan', '100 g queso'],
        utensils: ['Olla', 'Horno'],
        steps: ['Carameliza cebolla 25 min.', 'Añade caldo y cocina 10 min.', 'Sirve con pan y queso gratinado.']
    },
    'Tortilla con cebolla': {
        image: 'tortilla-con-cebolla.jpg',
        time: 25, difficulty: 'fácil', servings: 2,
        ingredients: ['4 huevos', '2 cebollas', '50 g queso', '1/2 pimiento', 'AOVE', 'Sal'],
        utensils: ['Sartén'],
        steps: ['Pocha cebolla dulce y translúcida.', 'Bate huevos y mezcla con cebolla.', 'Cuaja a fuego medio-bajo por ambos lados.']
    },
    'Pollo encebollado': {
        image: 'pollo-encebollado.jpg',
        time: 35, difficulty: 'Media', servings: 2,
        ingredients: ['2 pechugas pollo', '3 cebollas', '2 dientes de ajo', '1/2 pimiento', '100 ml vino blanco', 'AOVE', 'Sal'],
        utensils: ['Sartén con tapa'],
        steps: ['Dora el pollo y retira.', 'Pocha cebolla en juliana.', 'Vuelve a poner pollo, vino y cocina tapado.']
    },

    // AJO
    'Sopa de ajo castellana': {
        image: 'sopa-de-ajo-castellana.jpg',
        time: 20, difficulty: 'fácil', servings: 2,
        ingredients: ['6 dientes ajo', '150 g pan duro', '2 huevos', '1L caldo', 'Pimentón', 'AOVE', 'Sal'],
        utensils: ['Cazuela'],
        steps: ['Fríe ajos y pan dorado.', 'Añade caldo, pimentón y sal. Cocina 10 min.', 'Casca huevos, tapa y cuaja 3 min.']
    },
    'Pan de ajo casero': {
        image: 'pan-de-ajo-casero.jpg',
        time: 15, difficulty: 'Muy fácil', servings: 4,
        ingredients: ['1 baguette', '3 dientes ajo', '60 g mantequilla', '50 g queso', 'Perejil', 'Sal'],
        utensils: ['Horno'],
        steps: ['Mezcla mantequilla, ajo, sal y perejil.', 'Unta en rebanadas de pan.', 'Hornea 10 min a 200°C.']
    },
    'Pasta aglio e olio': {
        image: 'pasta-aglio-e-olio.jpg',
        time: 15, difficulty: 'fácil', servings: 2,
        ingredients: ['200 g pasta', '5 dientes ajo', '1 guindilla', '60 ml AOVE', 'Queso parmesano', 'Sal'],
        utensils: ['Olla', 'Sartén'],
        steps: ['Cuece pasta al dente (reserva agua).', 'Dora ajo con guindilla en aceite.', 'Mezcla pasta con aceite y agua. Sirve con queso.']
    },
    'Pollo al ajillo': {
        image: 'pollo-al-ajillo.jpg',
        time: 30, difficulty: 'fácil', servings: 2,
        ingredients: ['500 g pollo', '8 dientes ajo', '100 ml vino blanco', '1/2 cebolla', '1 tomate', 'AOVE', 'Sal'],
        utensils: ['Sartén'],
        steps: ['Dora el pollo en aceite caliente.', 'Añade ajo y vino blanco. Evapora.', 'Cocina tapado 15 min.']
    },

    // PIMIENTO
    'Pimientos asados al horno': {
        image: 'pimientos-asados-al-horno.jpg',
        time: 40, difficulty: 'Muy fácil', servings: 4,
        ingredients: ['3 pimientos', '2 dientes ajo', '1 tomate', 'AOVE', 'Vinagre', 'Sal'],
        utensils: ['Horno'],
        steps: ['Hornea pimientos con aceite y sal 35 min.', 'Pela calientes y corta en tiras.', 'Aliña con ajo, vinagre y aceite.']
    },
    'Revuelto de pimientos': {
        image: 'revuelto-de-pimientos.jpg',
        time: 15, difficulty: 'Muy fácil', servings: 2,
        ingredients: ['3 huevos', '2 pimientos', '1/2 cebolla', '1 diente ajo', '1 tomate pequeño', 'AOVE', 'Sal'],
        utensils: ['Sartén'],
        steps: ['Sofríe pimiento y cebolla.', 'Bate huevos con sal y vierte.', 'Remueve a fuego bajo hasta que cuaje.']
    },
    'Pollo con pimientos al horno': {
        image: 'pollo-con-pimientos-al-horno.jpg',
        time: 45, difficulty: 'Media', servings: 3,
        ingredients: ['500 g pollo', '2 pimientos', '1 cebolla', '2 dientes ajo', '1 tomate', 'AOVE', 'Sal', 'Pimentón', 'Orégano'],
        utensils: ['Horno'],
        steps: ['Dora pollo con sal, pimentón y orégano.', 'Añade verduras y remueve.', 'Hornea a 180°C hasta que esté hecho.']
    },
    'Arroz salteado con pimientos': {
        image: 'arroz-salteado-con-pimientos.jpg',
        time: 25, difficulty: 'fácil', servings: 2,
        ingredients: ['160 g arroz', '2 pimientos', '1/2 cebolla', '1 diente ajo', '1 tomate pequeño', 'AOVE', 'Sal', 'Pimienta'],
        utensils: ['Olla', 'Sartén'],
        steps: ['Cuece arroz y reserva.', 'Saltea pimientos con cebolla y ajo.', 'Mezcla arroz con verduras y sazona.']
    },

    // HUEVOS
    'Tortilla francesa': {
        image: 'tortilla-francesa.jpg',
        time: 8, difficulty: 'Muy fácil', servings: 1,
        ingredients: ['3 huevos', '30 g queso', 'Tomate cherry', 'AOVE', 'Sal', 'Pimienta'],
        utensils: ['Sartén'],
        steps: ['Bate huevos con sal y pimienta.', 'Vierte en sartén y mueve suave.', 'Dobla cuando esté casi cuajada.']
    },
    'Huevos rotos': {
        image: 'huevos-rotos.jpg',
        time: 10, difficulty: 'Muy fácil', servings: 1,
        ingredients: ['2 huevos', 'Leche', '1 rebanada pan grande', '30 g queso', 'Sal', 'AOVE'],
        utensils: ['Sartén'],
        steps: ['Bate huevos con leche y sal.', 'Cocina a fuego muy bajo removiendo.', 'Sirve sobre tostada con queso.']
    },
    'French toast con canela': {
        image: 'french-toast-con-canela.jpg',
        time: 15, difficulty: 'Muy fácil', servings: 2,
        ingredients: ['4 rebanadas pan', '2 huevos', '150 ml leche', '1 cda azúcar', 'Mantequilla', 'Canela'],
        utensils: ['Sartén'],
        steps: ['Mezcla huevos, leche, canela y azúcar.', 'Empapa el pan en la mezcla.', 'Dora en mantequilla por ambos lados.']
    },

    // POLLO
    'Pollo a la plancha con limón': {
        image: 'pollo-a-la-plancha-con-limon.jpg',
        time: 15, difficulty: 'Muy fácil', servings: 2,
        ingredients: ['2 pechugas pollo', '1 limón', '2 dientes ajo', '1/2 cebolla', 'AOVE', 'Sal', 'Orégano'],
        utensils: ['Plancha'],
        steps: ['Marina pollo con limón, ajo y especias.', 'Cocina en plancha 7 min por lado.', 'Reposa 2 min antes de servir.']
    },
    'Pasta con pollo y verduras': {
        image: 'pasta-con-pollo-y-verduras.jpg',
        time: 25, difficulty: 'fácil', servings: 2,
        ingredients: ['200 g pasta', '1 pechuga pollo', '1 tomate', '1/2 pimiento', '1/2 cebolla', '1 diente ajo', 'AOVE', 'Sal'],
        utensils: ['Olla', 'Sartén'],
        steps: ['Cuece pasta al dente.', 'Saltea pollo con ajo, cebolla y pimiento.', 'Mezcla pasta con pollo y tomate.']
    },
    'Pollo gratinado con queso': {
        image: 'pollo-gratinado-con-queso.jpg',
        time: 30, difficulty: 'fácil', servings: 2,
        ingredients: ['2 pechugas pollo', '100 g queso fundir', '1 tomate', '1/2 cebolla', 'AOVE', 'Sal', 'Pimienta'],
        utensils: ['Sartén', 'Horno'],
        steps: ['Dora pechugas en sartén.', 'Cubre con queso en bandeja horno.', 'Gratina a 220°C hasta que burbujee.']
    },

    // PAN
    'Sandwich crujiente de queso': {
        image: 'sandwich-crujiente-de-queso.jpg',
        time: 10, difficulty: 'Muy fácil', servings: 1,
        ingredients: ['2 rebanadas pan molde', '4 láminas queso', 'Mantequilla', 'Tomate', '1 huevo'],
        utensils: ['Sartén'],
        steps: ['Pon queso entre rebanadas.', 'Unta mantequilla por fuera.', 'Dora en sartén 4 min por lado.']
    },

    // QUESO
    'Macarrones con queso': {
        image: 'macarrones-con-queso.jpg',
        time: 20, difficulty: 'fácil', servings: 2,
        ingredients: ['200 g pasta', '150 g queso cheddar', '25 g mantequilla', '25 g harina', '300 ml leche', 'Ajo en polvo'],
        utensils: ['Olla', 'Sartén'],
        steps: ['Cuece pasta al dente.', 'Prepara bechamel con queso.', 'Mezcla y gratina si lo deseas.']
    },
    'Risotto de queso': {
        image: 'risotto-de-queso.jpg',
        time: 30, difficulty: 'Media', servings: 2,
        ingredients: ['160 g arroz arborio', '40 g mantequilla', '80 g parmesano', '1/2 cebolla', '600 ml caldo'],
        utensils: ['Cazuela'],
        steps: ['Sofríe cebolla y tuesta arroz.', 'Añade caldo cazo a cazo removiendo.', 'Añade parmesano y mantequilla al final.']
    },

    // PASTA
    'Espaguetis a la carbonara': {
        image: 'espaguetis-a-la-carbonara.jpg',
        time: 20, difficulty: 'Media', servings: 2,
        ingredients: ['200 g espaguetis', '3 yemas huevo', '60 g parmesano', 'Pimienta negra', 'Sal'],
        utensils: ['Olla', 'Bol'],
        steps: ['Cuece pasta al dente (reserva agua).', 'Bate yemas con queso y pimienta.', 'Mezcla pasta con crema fuera del fuego.']
    },
    'Pasta con parmesano': {
        image: 'pasta-con-parmesano.jpg',
        time: 15, difficulty: 'Muy fácil', servings: 2,
        ingredients: ['200 g pasta', '50 g parmesano', '30 g mantequilla', '1 diente ajo', 'Sal'],
        utensils: ['Olla'],
        steps: ['Cuece pasta al dente.', 'Escurre (reserva un poco de agua).', 'Mezcla con mantequilla, queso y agua.']
    },
    'Pasta napolitana': {
        image: 'pasta-napolitana.jpg',
        time: 20, difficulty: 'fácil', servings: 2,
        ingredients: ['200 g pasta', '400 g tomate triturado', '2 dientes ajo', '1/2 cebolla', 'Albahaca', 'AOVE', 'Sal'],
        utensils: ['Olla', 'Sartén'],
        steps: ['Cuece pasta. Sofríe ajo.', 'Añade tomate y sazona 8 min.', 'Mezcla pasta con salsa y albahaca.']
    },

    // ARROZ
    'Arroz blanco perfecto': {
        image: 'arroz-blanco-perfecto.jpg',
        time: 20, difficulty: 'Muy fácil', servings: 2,
        ingredients: ['160 g arroz largo', '1 diente ajo', 'Cebolla', 'Agua (x2)', 'Sal'],
        utensils: ['Olla'],
        steps: ['Lava el arroz bajo el grifo.', 'Hierve agua con sal y echa arroz.', 'Cocina tapado 15 min y reposa 5.']
    },
    'Arroz con tomate': {
        image: 'arroz-con-tomate.jpg',
        time: 25, difficulty: 'fácil', servings: 2,
        ingredients: ['160 g arroz', '300 g tomate triturado', '1/2 cebolla', '1 diente ajo', '400 ml caldo', 'AOVE', 'Sal'],
        utensils: ['Olla'],
        steps: ['Sofríe cebolla y ajo.', 'Añade tomate y arroz. Remueve.', 'Cubre con caldo y cocina lento tapado.']
    },
    'Arroz con espinacas': {
        image: 'arroz-con-espinacas.jpg',
        time: 25, difficulty: 'fácil', servings: 2,
        ingredients: ['160 g arroz', '200 g espinacas', '1/2 cebolla', '2 dientes ajo', '400 ml caldo', 'AOVE', 'Sal'],
        utensils: ['Olla'],
        steps: ['Sofríe cebolla y ajo.', 'Añade arroz y caldo. Cocina 15 min.', 'Incorpora espinacas los últimos 3 min.']
    },
    'Arroz frito con huevo': {
        image: 'arroz-frito-con-huevo.jpg',
        time: 20, difficulty: 'fácil', servings: 2,
        ingredients: ['160 g arroz cocido', '2 huevos', '1/2 pimiento', '1/2 cebolla', '1 diente ajo', 'Aceite sésamo', 'Sal'],
        utensils: ['Wok/Sartén'],
        steps: ['Usa arroz cocido seco.', 'Saltea verduras a fuego alto.', 'Añade arroz y huevos. Mezcla rápido.']
    },
    'Arroz con pollo': {
        image: 'arroz-con-pollo.jpg',
        time: 30, difficulty: 'Media', servings: 2,
        ingredients: ['160 g arroz', '300 g pollo', '1 cebolla', '2 dientes ajo', '1 pimiento', '1 tomate', '400 ml caldo pollo', 'Azafrán'],
        utensils: ['Cazuela'],
        steps: ['Dora pollo con ajo y cebolla.', 'Añade arroz y caldo caliente.', 'Cocina tapado 18 min y reposa 5.']
    },
    'Pasta con setas y salvia': {
        image: 'https://images.unsplash.com/photo-1473093226795-af9932fe5856?auto=format&fit=crop&w=800&q=80',
        time: 12, difficulty: 'Fácil', servings: 2,
        ingredients: ['200g pasta', '150g setas variadas', 'Hojas de salvia fresca', '2 dientes de ajo', 'AOVE', 'Sal y pimienta'],
        utensils: ['Olla', 'Sartén grande'],
        steps: ['Hervir agua y cocer pasta hasta que esté perfectamente al dente.', 'Saltear setas carnosas con ajo y salvia hasta sentir su sabor profundo y umami y el aroma herbáceo.', 'Mezclar la pasta con las setas, permitiendo que el calor libere todo el perfume de la salvia en una textura sedosa.', 'Servir caliente y disfrutar del contraste de sabores.']
    },
    'Vegan Bowl': {
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
        time: 25, difficulty: 'Media', servings: 1,
        ingredients: ['Garbanzos cocidos', 'Espinacas frescas', 'Tomates cherry', 'Aguacate', 'Semillas de sésamo', 'Aliño de limón y tahini'],
        utensils: ['Bol grande', 'Cuchillo'],
        steps: ['Pon una base de lechuga refrescante en el fondo del bowl.', 'Ve colocando cada ingrediente disfrutando de la textura firme y sabor terroso del tofu marinado.', 'Añade el resto de vegetales para un festín de frescor crujiente.', 'Espolvorea cebollino picado, soltando su aroma punzante y sabor vibrante al cortarlo.']
    },
    'Ensalada de Quinoa': {
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
        time: 40, difficulty: 'Media', servings: 2,
        ingredients: ['1 taza de quinoa', 'Pimiento rojo', 'Cebolla morada', 'Pepino', 'Perejil fresco', 'Zumo de limón'],
        utensils: ['Olla pequeña', 'Colador', 'Ensaladera'],
        steps: ['Enjuaga y cuece la quinoa durante 15 min.', 'Pica finamente las verduras.', 'Mezcla todo cuando la quinoa esté fría.']
    },
    'Espaguetis con salsa pomodoro': {
        image: 'https://images.unsplash.com/photo-1551892374-ecf8754cf8b0?auto=format&fit=crop&w=800&q=80',
        time: 15, difficulty: 'Fácil', servings: 2,
        ingredients: ['250g espaguetis', '400g tomate natural triturado', 'Albahaca fresca', '1 cebolla', 'Queso parmesano (opcional)'],
        utensils: ['Olla', 'Sartén'],
        steps: ['Prepara la salsa sofriendo la cebolla y el tomate.', 'Cuece la pasta.', 'Combina y añade albahaca fresca al final.']
    },
    'Freakshake de chocolate': {
        image: 'https://images.unsplash.com/photo-1577805947697-89e18249d767?auto=format&fit=crop&w=800&q=80',
        time: 10, difficulty: 'Fácil', servings: 1,
        ingredients: ['Leche', 'Cacao puro', 'Plátano congelado', 'Nata montada', 'Sirope de chocolate', 'Virutas de chocolate'],
        utensils: ['Batidora de vaso', 'Vaso alto'],
        steps: ['Funde chocolate para una textura líquida y pecaminosa.', 'Bate hasta conseguir un batido denso, cremoso y de dulzor intenso.', 'La nata montada aporta una ligereza aérea en contraste con el chocolate fundido.', ' El cacao en polvo añade un toque final de amargor sofisticado.']
    },
    'Pasta PrimavIA': {
        image: 'https://images.unsplash.com/photo-1473093226795-af9932fe5856?auto=format&fit=crop&w=800&q=80',
        time: 20, difficulty: 'Fácil', servings: 2,
        ingredients: ['Pasta de trigo integral', 'Verduras de temporada', 'Ajo', 'Aceite de oliva virgen extra'],
        utensils: ['Olla', 'Sartén'],
        steps: ['Hierve la pasta.', 'Saltea las verduras con ajo.', 'Mezcla y disfruta de una comida saludable.']
    }
};

// Mapeo de ingredientes a recetas para la lógica de selección
const ingredientToRecipes = {
    'Tomate': ['Salmorejo cordobés', 'Ensalada caprese', 'Pan con tomate', 'Huevos con tomate', 'Pollo al tomate', 'Pasta al pomodoro', 'Pisto manchego'],
    'Aguacate': ['Guacamole casero', 'Tostada de aguacate', 'Ensalada de aguacate y tomate', 'Aguacate con huevo al horno', 'Bowl de aguacate y espinacas'],
    'Espinacas': ['Espinacas al ajillo', 'Revuelto de espinacas y huevo', 'Crema de espinacas', 'Pasta con espinacas y queso'],
    'Cebolla': ['Sopa de cebolla gratinada', 'Tortilla con cebolla', 'Pollo encebollado'],
    'Ajo': ['Sopa de ajo castellana', 'Pan de ajo casero', 'Pasta aglio e olio', 'Pollo al ajillo'],
    'Pimiento': ['Pimientos asados al horno', 'Revuelto de pimientos', 'Pollo con pimientos al horno', 'Arroz salteado con pimientos'],
    'Huevos': ['Tortilla francesa', 'Huevos rotos', 'French toast con canela'],
    'Pollo': ['Pollo a la plancha con limón', 'Pasta con pollo y verduras', 'Pollo gratinado con queso'],
    'Pan': ['Sandwich crujiente de queso', 'Pan con tomate', 'Pan de ajo casero', 'French toast con canela'],
    'Queso': ['Macarrones con queso', 'Risotto de queso', 'Ensalada caprese', 'Pasta con espinacas y queso', 'Sandwich crujiente de queso', 'Pollo gratinado con queso'],
    'Pasta': ['Pasta al pomodoro', 'Pasta con espinacas y queso', 'Pasta aglio e olio', 'Pasta con pollo y verduras', 'Macarrones con queso', 'Espaguetis a la carbonara', 'Pasta con parmesano', 'Pasta napolitana'],
    'Arroz': ['Arroz con tomate', 'Arroz con espinacas', 'Arroz frito con huevo', 'Arroz con pollo', 'Risotto de queso', 'Arroz blanco perfecto']
};

async function generateSmartRecipe() {
    SoundEngine.magic();
    const activeItems = Array.from(document.querySelectorAll('.smart-item.active')).map(el => {
        // Normalizar nombre (quitar saltos de línea y espacios extra)
        let name = el.querySelector('.name').innerText.replace(/\s+/g, ' ').trim();
        return {
            name: name,
            icon: el.querySelector('.icon').innerText
        };
    });

    if (activeItems.length === 0) {
        alert("¡Eh, Chef! Selecciona al menos un ingrediente para hacer magia. ✨");
        return;
    }


    const overlay = document.getElementById('scan-overlay');
    const t1 = document.getElementById('thought-1');
    const t2 = document.getElementById('thought-2');
    const t3 = document.getElementById('thought-3');
    const status = document.getElementById('scanning-status');

    if (overlay) overlay.style.display = 'flex';

    status.innerText = "RAZONAMIENTO IA";
    t1.innerHTML = `<i class="fas fa-microchip"></i> Buscando las mejores opciones para: ${activeItems.map(i => i.name).join(', ')}`;
    t2.innerText = "";
    t3.innerText = "";

    setTimeout(() => {
        t2.innerHTML = `<i class="fas fa-magic"></i> Cruzando datos de sabor y sostenibilidad...`;
        
        setTimeout(() => {
            // Lógica de búsqueda de TODAS las recetas posibles
            let allMatches = [];
            
            activeItems.forEach(item => {
                let name = item.name;
                if (name.includes('garbanzos')) name = 'Arroz';
                const possible = ingredientToRecipes[name] || [];
                allMatches = [...allMatches, ...possible];
            });

            // Eliminar duplicados
            allMatches = [...new Set(allMatches)];
            
            if (allMatches.length === 0) {
                allMatches = ['Arroz blanco perfecto'];
            }

            t3.innerHTML = `¡HEMOS ENCONTRADO ${allMatches.length} RECETAS!`;

            setTimeout(() => {
                if (overlay) overlay.style.display = 'none';
                
                // Poblar la pantalla de resultados
                const resultsList = document.getElementById('possible-recipes-list');
                const countEl = document.getElementById('results-count');
                
                if (resultsList && countEl) {
                    resultsList.innerHTML = '';
                    countEl.innerText = allMatches.length;
                    
                    allMatches.forEach(recipeTitle => {
                        const data = recipesDB[recipeTitle];
                        if (!data) return;
                        
                        const card = document.createElement('div');
                        card.className = 'dish-card';
                        card.style.cursor = 'pointer';
                        card.onclick = () => openRecipeDetail(recipeTitle, 'Chef IA', data.difficulty, 'pantry-results');
                        
                        card.innerHTML = `
                            <div class="dish-media" style="height: 140px;">
                                <img src="${data.image}" alt="${recipeTitle}">
                            </div>
                            <div class="dish-content" style="padding: 15px;">
                                <h2 style="font-size: 16px; margin-bottom: 5px;">${recipeTitle}</h2>
                                <div class="dish-meta">
                                    <span><i class="fas fa-signal"></i> ${data.difficulty}</span>
                                    <span><i class="fas fa-fire"></i> ${data.time} min</span>
                                </div>
                            </div>
                        `;
                        resultsList.appendChild(card);
                        keyFrameFadeIn(card);
                    });
                }
                
                showScreen('pantry-results');
            }, 1200);
        }, 1500);
    }, 1200);
}

let currentRecipeTime = 0;
let timerInterval;

function openRecipeDetail(title, author, difficulty, fromScreen = 'home') {
    SoundEngine.confirm();
    
    // Update back button
    const backBtn = document.getElementById('recipe-back-btn');
    if (backBtn) {
        backBtn.onclick = (e) => {
            e.stopPropagation();
            showScreen(fromScreen);
        };
    }

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
            alert("â ° Â¡Tiempo terminado! Â¡A disfrutar!");
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
    alert(`Abriendo Marketplace de ${name}...\n\nAquí­ puedes ver el pasillo exacto de cada producto para ahorrar tiempo.`);
}

function openChallenge(name) {
    SoundEngine.click();
    
    if (name === 'Zero to Hero') {
        openPage('challenge-hero.html');
        return;
    }

    const modal = document.getElementById('challenge-modal');
    const title = document.getElementById('ch-title');
    const desc = document.getElementById('ch-desc');
    const emoji = document.getElementById('ch-emoji');
    const tag = document.getElementById('ch-tag');

    if (name === 'Pantry Party') {
        window.open('https://lp.constantcontactpages.com/ev/reg/zha446j', '_blank');
        return;
    }
 else if (name === 'Zero Waste Week') {
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
        alert("Procesando nota de voz con NLP... ðŸŽ™ï¸ \n\nIdentificado: Manzanas (14 dÃ­as), Leche (7 dÃ­as).");
        addPantryItem("Manzanas", "ðŸ Ž", "14d");
        addPantryItem("Leche", "ðŸ¥›", "7d");
        updateEcoScore(0.5); // Feedback de ahorro
    }
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
    
    // Stop any ambient sounds if they were playing
    if (SoundEngine.isAmbientActive()) {
        SoundEngine.stopAmbient();
    }

    // Toggle Taylor Swift music only
    initTSAudio();
    if (tsAudio) {
        if (tsAudio.paused) {
            tsAudio.play().catch(e => console.warn("Music play blocked:", e));
            btn.classList.remove('muted');
            if (badge) badge.textContent = 'ON';
        } else {
            tsAudio.pause();
            btn.classList.add('muted');
            if (badge) badge.textContent = 'OFF';
        }
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
var tsCurrentIndex = 0;
const tsPlaylist = [
    { title: "The Fate of Ophelia", src: "ophelia.mp3" },
    { title: "Opalite", src: "opalite.mp3" }
];

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
                tsCurrentIndex++;
                if (tsCurrentIndex >= tsPlaylist.length) {
                    tsCurrentIndex = 0; // Loop back to the beginning
                }
                loadAndPlayTSPlaylist(tsCurrentIndex);
            });
        }
    }
}

function startTaylorSwiftSong() {
    initTSAudio();
    if (tsAudio) {
        tsAudio.muted = false;
        tsAudio.volume = 0.05;
        console.log("Starting background music...");
        
        // Ensure the correct song is loaded for the current index
        const song = tsPlaylist[tsCurrentIndex];
        if (!tsAudio.src.includes(song.src)) {
            loadAndPlayTSPlaylist(tsCurrentIndex);
        } else {
            // Update UI title just in case
            const titleEl = document.querySelector('.ts-song-title');
            if (titleEl) titleEl.textContent = song.title;
            tsAudio.play();
        }
    }
}

function loadAndPlayTSPlaylist(index) {
    initTSAudio();
    if (!tsAudio) return;
    
    tsCurrentIndex = index;
    const song = tsPlaylist[tsCurrentIndex];
    
    // Update Source
    tsAudio.src = song.src;
    tsAudio.load();
    tsAudio.play().catch(e => console.warn("Auto-play blocked:", e));
    
    // Update UI Metadata
    const titleEl = document.querySelector('.ts-song-title');
    if (titleEl) titleEl.textContent = song.title;
    
    console.log("Playing next song in playlist:", song.title);
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
        notif.onclick = null; // Reset click handler
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
    if (screenId === 'pantry' || screenId === 'pantry-results') navItems[1].classList.add('active');
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

// --- 16. PERSISTENT NAVIGATION (MUSIC PERSISTENCE) ---

function openPage(url) {
    const overlay = document.getElementById('page-overlay');
    const iframe = document.getElementById('page-iframe');
    if (overlay && iframe) {
        iframe.src = url;
        overlay.style.display = 'block';
        
        // Listener to detect if the iframe tries to go back to index.html
        iframe.onload = function() {
            try {
                if (iframe.contentWindow.location.href.includes('index.html')) {
                    closePageOverlay();
                }
            } catch (e) {
                // Cross-origin issues (not expected here, but for robustness)
                console.warn("Iframe navigation check blocked:", e);
            }
        };
    }
}

function closePageOverlay() {
    const overlay = document.getElementById('page-overlay');
    const iframe = document.getElementById('page-iframe');
    if (overlay && iframe) {
        overlay.style.display = 'none';
        iframe.src = '';
    }
}

// End of Script
