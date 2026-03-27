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
