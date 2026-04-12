// ============================================================
// 🍳 Pantry Chef — Sound Engine (Web Audio API)
// Generates all kitchen sounds synthetically — no files needed
// ============================================================

const SoundEngine = (() => {
    let ctx = null;
    let masterGain = null;
    let ambientNodes = [];
    let ambientActive = false;
    let ambientVolume = 0.35;
    let uiVolume = 0.7;

    // Lazy-init AudioContext on first user interaction
    function getCtx() {
        if (!ctx) {
            ctx = new (window.AudioContext || window.webkitAudioContext)();
            masterGain = ctx.createGain();
            masterGain.gain.value = 1.0;
            masterGain.connect(ctx.destination);
        }
        if (ctx.state === 'suspended') ctx.resume();
        return ctx;
    }

    // ── Utility helpers ──────────────────────────────────────

    function createGain(value, dest) {
        const g = getCtx().createGain();
        g.gain.value = value;
        g.connect(dest || masterGain);
        return g;
    }

    function createOscillator(type, freq, gainNode) {
        const osc = getCtx().createOscillator();
        osc.type = type;
        osc.frequency.value = freq;
        osc.connect(gainNode);
        return osc;
    }

    // White / pink noise buffer
    function createNoiseBuffer(seconds = 2) {
        const ac = getCtx();
        const frames = ac.sampleRate * seconds;
        const buffer = ac.createBuffer(1, frames, ac.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < frames; i++) data[i] = Math.random() * 2 - 1;
        return buffer;
    }

    function playBuffer(buffer, gainValue, loop = false) {
        const ac = getCtx();
        const g = createGain(gainValue);
        const src = ac.createBufferSource();
        src.buffer = buffer;
        src.loop = loop;
        src.connect(g);
        src.start();
        return { src, gain: g };
    }

    // ── UI Click Sounds ───────────────────────────────────────

    /**
     * A quick, satisfying "pop" click.
     */
    function playClick() {
        const ac = getCtx();
        const g = createGain(uiVolume);
        const osc = ac.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, ac.currentTime);
        osc.frequency.exponentialRampToValueAtTime(300, ac.currentTime + 0.06);
        osc.connect(g);
        g.gain.setValueAtTime(uiVolume, ac.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.08);
        osc.start();
        osc.stop(ac.currentTime + 0.1);
    }

    /**
     * A positive "confirm" chime (two tones).
     */
    function playConfirm() {
        const ac = getCtx();
        [0, 0.12].forEach((delay, i) => {
            const g = createGain(uiVolume * 0.6);
            const osc = ac.createOscillator();
            osc.type = 'sine';
            osc.frequency.value = i === 0 ? 880 : 1100;
            osc.connect(g);
            g.gain.setValueAtTime(0, ac.currentTime + delay);
            g.gain.linearRampToValueAtTime(uiVolume * 0.6, ac.currentTime + delay + 0.02);
            g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + delay + 0.25);
            osc.start(ac.currentTime + delay);
            osc.stop(ac.currentTime + delay + 0.3);
        });
    }

    /**
     * A "back / cancel" low click.
     */
    function playBack() {
        const ac = getCtx();
        const g = createGain(uiVolume * 0.5);
        const osc = ac.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(500, ac.currentTime);
        osc.frequency.exponentialRampToValueAtTime(220, ac.currentTime + 0.08);
        osc.connect(g);
        g.gain.setValueAtTime(uiVolume * 0.5, ac.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.1);
        osc.start();
        osc.stop(ac.currentTime + 0.12);
    }

    /**
     * Ingredient toggle — a soft wooden "tick".
     */
    function playTick() {
        const ac = getCtx();
        const g = createGain(uiVolume * 0.4);
        // Noise burst shaped like a wood hit
        const nBuf = createNoiseBuffer(0.05);
        const { src, gain: ng } = playBuffer(nBuf, 0);
        const filter = ac.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 1200;
        filter.Q.value = 0.8;
        src.disconnect();
        src.connect(filter);
        filter.connect(ng);
        ng.gain.setValueAtTime(uiVolume * 0.55, ac.currentTime);
        ng.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.06);

        // Haptic Feedback for the ingredient tick (Increased for better feel)
        if ('vibrate' in navigator) {
            navigator.vibrate([40, 60, 40]);
        }
    }

    /**
     * "Magic recipe" — ascending sparkle.
     */
    function playMagic() {
        const ac = getCtx();
        const freqs = [523, 659, 784, 1047, 1319];
        freqs.forEach((f, i) => {
            const delay = i * 0.08;
            const g = createGain(0);
            const osc = ac.createOscillator();
            osc.type = 'sine';
            osc.frequency.value = f;
            osc.connect(g);
            g.gain.setValueAtTime(0, ac.currentTime + delay);
            g.gain.linearRampToValueAtTime(uiVolume * 0.4, ac.currentTime + delay + 0.04);
            g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + delay + 0.3);
            osc.start(ac.currentTime + delay);
            osc.stop(ac.currentTime + delay + 0.35);
        });
    }

    /**
     * Timer / step change — a soft "ding".
     */
    function playDing() {
        const ac = getCtx();
        const g = createGain(uiVolume);
        const osc = ac.createOscillator();
        osc.type = 'triangle';
        osc.frequency.value = 1760;
        osc.connect(g);
        g.gain.setValueAtTime(uiVolume, ac.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.6);
        osc.start();
        osc.stop(ac.currentTime + 0.65);
    }

    /**
     * Login success — warm "welcome" chord.
     */
    function playWelcome() {
        const ac = getCtx();
        [523, 659, 784].forEach((f, i) => {
            const delay = i * 0.05;
            const g = createGain(0);
            const osc = ac.createOscillator();
            osc.type = 'sine';
            osc.frequency.value = f;
            osc.connect(g);
            g.gain.setValueAtTime(0, ac.currentTime + delay);
            g.gain.linearRampToValueAtTime(uiVolume * 0.35, ac.currentTime + delay + 0.05);
            g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + delay + 0.5);
            osc.start(ac.currentTime + delay);
            osc.stop(ac.currentTime + delay + 0.55);
        });
    }

    /**
     * Single knife chop — a sharp metallic slice and wooden thud.
     */
    function playChop() {
        const ac = getCtx();
        const now = ac.currentTime;
        
        // Randomize slightly for organic feel
        const pitchVar = 0.85 + Math.random() * 0.3; 
        const volVar = 0.9 + Math.random() * 0.2;

        // 1. SHARP TRANSIENT (The blade hitting the surface)
        const clickG = createGain(uiVolume * 0.7 * volVar);
        const clickBuf = createNoiseBuffer(0.02);
        const clickSrc = ac.createBufferSource();
        clickSrc.buffer = clickBuf;
        const clickFilter = ac.createBiquadFilter();
        clickFilter.type = 'highpass';
        clickFilter.frequency.value = 4000 * pitchVar;
        clickSrc.connect(clickFilter);
        clickFilter.connect(clickG);
        clickG.gain.setValueAtTime(uiVolume * 0.7 * volVar, now);
        clickG.gain.exponentialRampToValueAtTime(0.001, now + 0.02);
        clickSrc.start(now);

        // 2. WOOD RESONANCE (The hollow sound of the board)
        const woodG = createGain(uiVolume * 0.5 * volVar);
        const woodBuf = createNoiseBuffer(0.06);
        const woodSrc = ac.createBufferSource();
        woodSrc.buffer = woodBuf;
        const woodFilter = ac.createBiquadFilter();
        woodFilter.type = 'bandpass';
        woodFilter.frequency.value = 600 * pitchVar;
        woodFilter.Q.value = 1.5;
        woodSrc.connect(woodFilter);
        woodFilter.connect(woodG);
        woodG.gain.setValueAtTime(uiVolume * 0.5 * volVar, now);
        woodG.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        woodSrc.start(now);

        // 3. METALLIC TING (The blade's steel ringing)
        const tingG = createGain(uiVolume * 0.2 * volVar);
        const tingOsc = ac.createOscillator();
        tingOsc.type = 'sine';
        tingOsc.frequency.setValueAtTime(7500 * pitchVar, now);
        tingOsc.connect(tingG);
        tingG.gain.setValueAtTime(uiVolume * 0.2, now);
        tingG.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
        tingOsc.start(now);
        tingOsc.stop(now + 0.04);

        // 4. DEEP BOARD THUD (The mass of the wood)
        const thudG = createGain(uiVolume * 0.4 * volVar);
        const thudOsc = ac.createOscillator();
        thudOsc.type = 'triangle';
        thudOsc.frequency.setValueAtTime(140 * pitchVar, now);
        thudOsc.frequency.exponentialRampToValueAtTime(80, now + 0.06);
        thudOsc.connect(thudG);
        thudG.gain.setValueAtTime(uiVolume * 0.4, now);
        thudG.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        thudOsc.start(now);
        thudOsc.stop(now + 0.1);

        // Haptic Feedback for the chop
        if ('vibrate' in navigator) {
            navigator.vibrate(10); // Short micro-vibration
        }
    }

    /**
     * Kitchen Timer Ding — Metallic, resonant chime with a vibrant tail.
     * Simulates the "food is ready" bell.
     */
    function playTimerDing() {
        const ac = getCtx();
        const now = ac.currentTime;
        const duration = 1.8;

        // Base frequency for the chime
        const baseFreq = 1600;

        // 1. Chime Components (Additive synthesis for metallic timbre)
        // Harmonics: Fundamental, slightly off-purity for character
        const frequencies = [baseFreq, baseFreq * 1.5, baseFreq * 2.1, baseFreq * 2.8, baseFreq * 3.5];
        const initialGains = [0.4, 0.2, 0.15, 0.1, 0.05];

        frequencies.forEach((f, i) => {
            const g = createGain(0);
            const osc = ac.createOscillator();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(f, now);
            
            // Add slight vibration (beating) to the fundamental
            if (i === 0) {
                const detune = ac.createOscillator();
                detune.type = 'sine';
                detune.frequency.value = 8; // 8Hz vibration
                const detuneG = ac.createGain();
                detuneG.gain.value = 5;
                detune.connect(detuneG);
                detuneG.connect(osc.frequency);
                detune.start(now);
                detune.stop(now + duration);
            }

            osc.connect(g);
            g.gain.setValueAtTime(0, now);
            // Applied 20% volume multiplier
            g.gain.linearRampToValueAtTime(initialGains[i] * uiVolume * 0.2, now + 0.005);
            g.gain.exponentialRampToValueAtTime(0.001, now + duration * (1 - i*0.15));
            
            osc.start(now);
            osc.stop(now + duration);
        });

        // 2. High metallic "ting" strike (also reduced to 20%)
        const strikeG = createGain(uiVolume * 0.06); // 0.3 * 0.2 = 0.06
        const strikeOsc = ac.createOscillator();
        strikeOsc.type = 'triangle';
        strikeOsc.frequency.setValueAtTime(5000, now);
        strikeOsc.connect(strikeG);
        strikeG.gain.setValueAtTime(uiVolume * 0.3, now);
        strikeG.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        strikeOsc.start(now);
        strikeOsc.stop(now + 0.1);

        // Haptic Feedback for the Timer (Tab Navigation)
        if ('vibrate' in navigator) {
            navigator.vibrate([15, 30, 20]); // Gentle vibrating pulse
        }
    }

    // ── Kitchen Ambient Sounds ────────────────────────────────

    /**
     * Boiling water — continuous low-frequency filtered noise.
     */
    function startBoiling() {
        const ac = getCtx();
        const masterAmbGain = createGain(ambientVolume * 0.5);
        const nodesGroup = [];

        // Base bubbling noise
        const buf = createNoiseBuffer(3);
        const src = ac.createBufferSource();
        src.buffer = buf;
        src.loop = true;

        const filter = ac.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 400;
        filter.Q.value = 2;

        // LFO for bubble rhythm
        const lfo = ac.createOscillator();
        lfo.type = 'sine';
        lfo.frequency.value = 3.5;
        const lfoGain = ac.createGain();
        lfoGain.gain.value = 120;
        lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency);

        src.connect(filter);
        filter.connect(masterAmbGain);
        lfo.start();
        src.start();

        nodesGroup.push(src, lfo, masterAmbGain);
        return nodesGroup;
    }

    /**
     * Sizzling in a pan — high-frequency white noise modulated by LFO.
     */
    function startSizzling() {
        const ac = getCtx();
        const masterAmbGain = createGain(ambientVolume * 0.45);
        const nodesGroup = [];

        const buf = createNoiseBuffer(4);
        const src = ac.createBufferSource();
        src.buffer = buf;
        src.loop = true;

        const filter = ac.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 4000;
        filter.Q.value = 0.5;

        // Irregular sizzle modulation
        const lfo = ac.createOscillator();
        lfo.type = 'sawtooth';
        lfo.frequency.value = 7;
        const lfoGain = ac.createGain();
        lfoGain.gain.value = 2000;
        lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency);

        const ampLFO = ac.createOscillator();
        ampLFO.type = 'sine';
        ampLFO.frequency.value = 1.2;
        const ampLFOGain = ac.createGain();
        ampLFOGain.gain.value = 0.25;
        ampLFO.connect(ampLFOGain);
        ampLFOGain.connect(masterAmbGain.gain);

        src.connect(filter);
        filter.connect(masterAmbGain);
        lfo.start();
        ampLFO.start();
        src.start();

        nodesGroup.push(src, lfo, ampLFO, masterAmbGain);
        return nodesGroup;
    }

    /**
     * Knife chopping — rhythmic transient clicks.
     */
    function startChopping() {
        const ac = getCtx();
        const nodesGroup = [];

        let nextChopTime = ac.currentTime + Math.random() * 0.5;
        const chopInterval = setInterval(() => {
            if (!ambientActive) { clearInterval(chopInterval); return; }

            const now = ac.currentTime;
            const g = createGain(ambientVolume * 0.6);
            const nBuf = createNoiseBuffer(0.04);
            const s = ac.createBufferSource();
            s.buffer = nBuf;

            const filter = ac.createBiquadFilter();
            filter.type = 'highpass';
            filter.frequency.value = 3000;

            s.connect(filter);
            filter.connect(g);
            g.gain.setValueAtTime(ambientVolume * 0.6, now);
            g.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
            s.start(now);

            nodesGroup.push(g);
        }, 380 + Math.random() * 320);

        // Store interval reference as a fake "node"
        nodesGroup._chopInterval = chopInterval;
        return nodesGroup;
    }

    /**
     * Lo-Fi Cooking Ambient — Gentle pulsing patterns for focus and relaxation.
     */
    let lofiNodes = [];
    let lofiActive = false;

    /**
     * Zen Cooking Ambient — Inspired by Shakuhachi flute and deep meditation pads.
     * Replaces the former Lo-Fi for a deeper emotional connection.
     */
    let zenNodes = [];
    let zenActive = false;

    function startZen() {
        if (zenActive) return;
        zenActive = true;
        const ac = getCtx();
        const masterZen = createGain(0);
        
        // 1. Deep Earth Pad (Warm, organic floor)
        const padG = createGain(0.08); // Subtle
        const pad = ac.createOscillator();
        pad.type = 'sine';
        pad.frequency.value = 55.00; // A1
        const padLFO = ac.createOscillator();
        padLFO.frequency.value = 0.1;
        const padLFOG = ac.createGain();
        padLFOG.gain.value = 0.03;
        padLFO.connect(padLFOG);
        padLFOG.connect(padG.gain);
        pad.connect(padG); padG.connect(masterZen);
        pad.start(); padLFO.start();

        // 2. Instrumental Plucks (Nylon Guitar / Koto / Guzheng)
        const zenScale = [196.00, 220.00, 261.63, 293.66, 329.63, 392.00, 440.00]; // G, A, C, D, E pentatonic
        const pluckInterval = setInterval(() => {
            if (!zenActive) { clearInterval(pluckInterval); return; }
            const now = ac.currentTime;
            const freq = zenScale[Math.floor(Math.random() * zenScale.length)];

            // String Logic
            const stringG = ac.createGain();
            const stringOsc = ac.createOscillator();
            stringOsc.type = 'triangle'; // Warmer than sine for strings
            stringOsc.frequency.setValueAtTime(freq, now);
            
            // Soft low-pass to make it sound like nylon, not a beep
            const filter = ac.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.value = 1200;
            filter.Q.value = 2;

            stringOsc.connect(filter);
            filter.connect(stringG);
            stringG.connect(masterZen);

            stringG.gain.setValueAtTime(0, now);
            stringG.gain.linearRampToValueAtTime(0.12 * uiVolume, now + 0.02);
            stringG.gain.exponentialRampToValueAtTime(0.001, now + 4);
            
            stringOsc.start(now);
            stringOsc.stop(now + 4.5);

            // Occasional high sparkle (Higher Octave)
            if (Math.random() > 0.7) {
                const bellG = ac.createGain();
                const bellOsc = ac.createOscillator();
                bellOsc.type = 'sine';
                bellOsc.frequency.value = freq * 2;
                bellOsc.connect(bellG); bellG.connect(masterZen);
                bellG.gain.setValueAtTime(0, now + 0.1);
                bellG.gain.linearRampToValueAtTime(0.04, now + 0.12);
                bellG.gain.exponentialRampToValueAtTime(0.001, now + 2);
                bellOsc.start(now + 0.1); bellOsc.stop(now + 2.5);
            }
        }, 5000); // Relaxed timing

        // 3. Subtle Forest Elements (Soft birds and water)
        const natureG = createGain(0.02);
        const nBuf = createNoiseBuffer(4);
        const nSrc = ac.createBufferSource();
        nSrc.buffer = nBuf; nSrc.loop = true;
        const nFilter = ac.createBiquadFilter();
        nFilter.type = 'lowpass'; nFilter.frequency.value = 400;
        nSrc.connect(nFilter); nFilter.connect(natureG); natureG.connect(masterZen);
        nSrc.start();

        // Generative bird chirp (very sparse)
        const birdInterval = setInterval(() => {
            if (!zenActive) { clearInterval(birdInterval); return; }
            const now = ac.currentTime;
            const bG = ac.createGain();
            const bOsc = ac.createOscillator();
            bOsc.type = 'sine';
            const startF = 3000 + Math.random() * 2000;
            bOsc.frequency.setValueAtTime(startF, now);
            bOsc.frequency.exponentialRampToValueAtTime(startF + 1000, now + 0.1);
            bOsc.connect(bG); bG.connect(masterZen);
            bG.gain.setValueAtTime(0, now);
            bG.gain.linearRampToValueAtTime(0.02, now + 0.05);
            bG.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
            bOsc.start(now); bOsc.stop(now + 0.2);
        }, 12000);

        masterZen.connect(masterGain);
        masterZen.gain.linearRampToValueAtTime(1.0, ac.currentTime + 4);

        zenNodes = [pad, padLFO, nSrc, masterZen];
        zenNodes._intervals = [pluckInterval, birdInterval];
    }

    function stopZen() {
        if (!zenActive) return;
        zenActive = false;
        if (zenNodes._intervals) zenNodes._intervals.forEach(i => clearInterval(i));
        
        const ac = getCtx();
        const m = zenNodes[zenNodes.length-1];
        if (m && m.gain) m.gain.linearRampToValueAtTime(0.001, ac.currentTime + 2.5);

        setTimeout(() => {
            zenNodes.forEach(n => { try { n.stop(); n.disconnect(); } catch(e){} });
            zenNodes = [];
        }, 2800);
    }

    /**
     * Ventilation fan — very low steady hum.
     */
    function startVentilation() {
        const ac = getCtx();
        const g = createGain(ambientVolume * 0.2);

        const osc1 = createOscillator('sawtooth', 58, g);
        const osc2 = createOscillator('sine', 62, g);

        // gentle tremolo
        const lfo = ac.createOscillator();
        lfo.type = 'sine';
        lfo.frequency.value = 0.3;
        const lfoG = ac.createGain();
        lfoG.gain.value = 0.06;
        lfo.connect(lfoG);
        lfoG.connect(g.gain);

        osc1.start(); osc2.start(); lfo.start();
        return [osc1, osc2, lfo, g];
    }

    /**
     * Start the full ambient kitchen soundscape.
     */
    function startAmbient() {
        if (ambientActive) return;
        ambientActive = true;
        getCtx();

        const boiling = startBoiling();
        const sizzling = startSizzling();
        const chopping = startChopping();
        const ventilation = startVentilation();

        ambientNodes = [boiling, sizzling, chopping, ventilation].flat();
        ambientNodes._chopInterval = chopping._chopInterval;

        console.log('🍳 Ambient kitchen sounds started');
    }

    /**
     * Stop ambient gradually.
     */
    function stopAmbient() {
        if (!ambientActive) return;
        ambientActive = false;

        if (ambientNodes._chopInterval) clearInterval(ambientNodes._chopInterval);

        // Fade out master gain
        if (masterGain) {
            masterGain.gain.setValueAtTime(masterGain.gain.value, ctx.currentTime);
            masterGain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 1.5);
        }

        setTimeout(() => {
            ambientNodes.forEach(node => {
                try {
                    if (node && node.stop) node.stop();
                    if (node && node.disconnect) node.disconnect();
                } catch (e) { /* already stopped */ }
            });
            ambientNodes = [];
            if (masterGain && ctx) {
                masterGain.gain.setValueAtTime(1.0, ctx.currentTime);
            }
        }, 1600);

        console.log('🔇 Ambient sounds stopped');
    }

    /**
     * Toggle ambient sound on/off.
     */
    function toggleAmbient() {
        if (ambientActive) {
            stopAmbient();
            return false;
        } else {
            startAmbient();
            return true;
        }
    }

    // ── Public API ────────────────────────────────────────────
    return {
        // UI sounds
        click: playClick,
        confirm: playConfirm,
        back: playBack,
        tick: playTick,
        magic: playMagic,
        ding: playDing,
        welcome: playWelcome,
        chop: playChop,
        navDing: playTimerDing,
        startZen,
        stopZen,

        // Ambient
        startAmbient,
        stopAmbient,
        toggleAmbient,
        isAmbientActive: () => ambientActive,

        // Volume controls
        setAmbientVolume: (v) => { ambientVolume = Math.max(0, Math.min(1, v)); },
        setUIVolume: (v) => { uiVolume = Math.max(0, Math.min(1, v)); },
    };
})();
