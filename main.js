document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Element Selection ---
    const dom = {
        gameBoard: document.getElementById('game-board'),
        stockPileEl: document.getElementById('stock-pile'),
        wastePileEl: document.getElementById('waste-pile'),
        foundationEls: Array.from({ length: 4 }, (_, i) => document.getElementById(`foundation-${i}`)),
        tableauEls: Array.from({ length: 7 }, (_, i) => document.getElementById(`tableau-${i}`)),
        newGameBtn: document.getElementById('new-game-btn'),
        autocompleteBtn: document.getElementById('autocomplete-btn'),
        hintBtn: document.getElementById('hint-btn'),
        undoBtn: document.getElementById('undo-btn'),
        messageBox: document.getElementById('message-box'),
        titleScreen: document.getElementById('title-screen'),
        startGameBtn: document.getElementById('start-game-btn'),
        gameContainer: document.getElementById('game-container'),
        optionsBtn: document.getElementById('options-btn'),
        optionsModal: document.getElementById('options-modal'),
        closeModalBtn: document.querySelector('#options-modal .close-btn'),
        unlockModal: document.getElementById('unlock-modal'),
        unlockCloseBtn: document.getElementById('unlock-close-btn'),
        unlockApplyBtn: document.getElementById('unlock-apply-btn'),
        unlockPrompt: document.getElementById('unlock-prompt'),
        unlockTitle: document.getElementById('unlock-title'),
        unlockDescription: document.getElementById('unlock-description'),
        cardBackSelector: document.getElementById('card-back-selector'),
        boardSelector: document.getElementById('board-selector'),
        musicSelector: document.getElementById('music-selector'),
        levelTextEl: document.getElementById('level-text'),
        xpTextEl: document.getElementById('xp-text'),
        xpBarEl: document.getElementById('xp-bar'),
        comboCanvas: document.getElementById('combo-canvas'),
        gameTimerEl: document.getElementById('game-timer'),
        achievementContainer: document.getElementById('achievement-container'),
        achievementScoreDisplay: document.getElementById('achievement-score-display'),
        achievementsBtn: document.getElementById('achievements-btn'),
        achievementModal: document.getElementById('achievement-modal'),
        achievementListEl: document.getElementById('achievement-list'),
        closeAchievementModalBtn: document.querySelector('#achievement-modal .close-btn'),
        flashOverlay: document.getElementById('flash-overlay'),
        drawSelectModal: document.getElementById('draw-select-modal'),
        draw1Btn: document.getElementById('draw-1-btn'),
        draw3Btn: document.getElementById('draw-3-btn'),
        cardStyleModal: document.getElementById('card-style-modal'),
        normalStyleBtn: document.getElementById('normal-style-btn'),
        easySeeBtn: document.getElementById('easy-see-btn'),
        fullscreenBtn: document.getElementById('fullscreen-btn'),
        fullscreenIcon: document.getElementById('fullscreen-icon'),
        exitFullscreenIcon: document.getElementById('exit-fullscreen-icon'),
        muteBtn: document.getElementById('mute-btn'),
        unmutedIcon: document.getElementById('unmuted-icon'),
        mutedIcon: document.getElementById('muted-icon'),
        resetProgressBtn: document.getElementById('reset-progress-btn'),
        resetConfirmModal: document.getElementById('reset-confirm-modal'),
        resetConfirmBtn: document.getElementById('reset-confirm-btn'),
        resetCancelBtn: document.getElementById('reset-cancel-btn'),
        fireworksContainer: document.getElementById('fireworks-container'),
    };
    
    const backgroundCanvases = {
        starfield: document.getElementById('starfield-canvas'),
        lavalamp: document.getElementById('lavalamp-canvas'),
        ocean: document.getElementById('ocean-canvas'),
        matrix: document.getElementById('matrix-canvas'),
        geometric: document.getElementById('geometric-canvas'),
        fire: document.getElementById('fire-canvas'),
        rain: document.getElementById('rain-canvas'),
        hyperspace: document.getElementById('hyperspace-canvas'),
        plasma: document.getElementById('plasma-canvas'),
        forest: document.getElementById('forest-canvas'),
        neongrid: document.getElementById('neongrid-canvas'),
        sakura: document.getElementById('sakura-canvas'),
        quantum: document.getElementById('quantum-canvas'),
        digitalrain: document.getElementById('digitalrain-canvas'),
        sands: document.getElementById('sands-canvas'),
        inkblot: document.getElementById('inkblot-canvas'),
        cosmic: document.getElementById('cosmic-canvas'),
        musicviz: document.getElementById('musicviz-canvas'),
        bioforest: document.getElementById('bioforest-canvas'),
        stainedglass: document.getElementById('stainedglass-canvas'),
        watery: document.getElementById('watery-canvas'),
        swarm: document.getElementById('swarm-canvas'),
        glitch: document.getElementById('glitch-canvas'),
        aurora: document.getElementById('aurora-canvas'),
        constellation: document.getElementById('constellation-canvas'),
        synthwave: document.getElementById('synthwave-canvas'),
        nebula: document.getElementById('nebula-canvas'),
        jungle: document.getElementById('jungle-canvas'),
        cityscape: document.getElementById('cityscape-canvas'),
        paint: document.getElementById('paint-canvas'),
        laserGrid: document.getElementById('laserGrid-canvas'),
        neonPalms: document.getElementById('neonPalms-canvas'),
        memphis: document.getElementById('memphis-canvas'),
        cassette: document.getElementById('cassette-canvas'),
        eightBitCity: document.getElementById('eightBitCity-canvas'),
    };

    // --- Game Constants ---
    const SUITS = ['♥', '♦', '♣', '♠'];
    const VALUES = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    const CARD_OVERLAP = 28;
    const LEVEL_THRESHOLDS = (() => {
        const thresholds = [0];
        for (let i = 1; i < 101; i++) {
            thresholds.push(thresholds[i - 1] + (i * 10) + 10);
        }
        return thresholds;
    })();
    const COMBO_WORDS = ["Good!", "Great!", "Excellent!", "Amazing!", "Wonderful!", "SUPER!", "INCREDIBLE!", "UNSTOPPABLE!", "GODLIKE!"];
    const CARD_BACKS = [
        ...Array.from({length: 50}, (_, i) => ({ id: `back-${i}`, name: `Style ${i+1}`, type: 'procedural' })),
        { id: 'animated-vortex', name: 'Vortex', type: 'animated' },
        { id: 'animated-scanlines', name: 'Scan Lines', type: 'animated' },
        { id: 'animated-pulse', name: 'Pulse', type: 'animated' },
        { id: 'animated-rainbow', name: 'Rainbow Shift', type: 'animated' },
        { id: 'animated-circuitry', name: 'Circuitry', type: 'animated' },
        { id: 'animated-liquid', name: 'Liquid Metal', type: 'animated' },
        { id: 'animated-stars', name: 'Twinkling Stars', type: 'animated' },
        { id: 'animated-ice', name: 'Glacial Ice', type: 'animated' },
        { id: 'animated-runes', name: 'Arcane Runes', type: 'animated' },
        { id: 'animated-molten', name: 'Molten Core', type: 'animated' }
    ];

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    const SHUFFLED_CARD_BACKS = (() => {
        const defaultBack = CARD_BACKS.find(b => b.id === 'back-0');
        const otherBacks = CARD_BACKS.filter(b => b.id !== 'back-0');
        shuffleArray(otherBacks);
        return [defaultBack, ...otherBacks];
    })();

    const BOARD_DATA = [
        { id: 'board-0', name: 'Classic Green', type: 'procedural' },
        { id: 'board-1', name: 'Lava Lamp', type: 'animated', start: startLavalamp, stop: stopLavalamp, resize: setupLavalamp },
        { id: 'board-2', name: 'Starfield', type: 'animated', start: startStarfield, stop: stopStarfield, resize: setupStarfield },
        { id: 'board-3', name: 'Ocean Waves', type: 'animated', start: startOcean, stop: stopOcean, resize: setupOcean },
        { id: 'board-4', name: 'Matrix', type: 'animated', start: startMatrix, stop: stopMatrix, resize: setupMatrix },
        { id: 'board-5', name: 'Geometric', type: 'animated', start: startGeometric, stop: stopGeometric, resize: setupGeometric },
        { id: 'board-6', name: 'Soothing Fire', type: 'animated', start: startFire, stop: stopFire, resize: setupFire },
        { id: 'board-7', name: 'Gentle Rain', type: 'animated', start: startRain, stop: stopRain, resize: setupRain },
        { id: 'board-8', name: 'Hyperspace', type: 'animated', start: startHyperspace, stop: stopHyperspace, resize: setupHyperspace },
        { id: 'board-9', name: 'Plasma', type: 'animated', start: startPlasma, stop: stopPlasma, resize: setupPlasma },
        { id: 'board-10', name: 'Enchanted Forest', type: 'animated', start: startForest, stop: stopForest, resize: setupForest },
        { id: 'board-11', name: 'Neon Grid', type: 'animated', start: startNeonGrid, stop: stopNeonGrid, resize: setupNeonGrid },
        { id: 'board-12', name: 'Sakura Blizzard', type: 'animated', start: startSakura, stop: stopSakura, resize: setupSakura },
        { id: 'board-13', name: 'Quantum Foam', type: 'animated', start: startQuantum, stop: stopQuantum, resize: setupQuantum },
        { id: 'board-14', name: 'Digital Rain', type: 'animated', start: startDigitalRain, stop: stopDigitalRain, resize: setupDigitalRain },
        { id: 'board-15', name: 'Shifting Sands', type: 'animated', start: startSands, stop: stopSands, resize: setupSands },
        { id: 'board-16', name: 'Ink Blot', type: 'animated', start: startInkBlot, stop: stopInkBlot, resize: setupInkBlot },
        { id: 'board-17', name: 'Cosmic Ripples', type: 'animated', start: startCosmic, stop: stopCosmic, resize: setupCosmic },
        { id: 'board-18', name: 'Musical Visualizer', type: 'animated', start: startMusicViz, stop: stopMusicViz, resize: setupMusicViz },
        { id: 'board-19', name: 'Bioluminescent Forest', type: 'animated', start: startBioForest, stop: stopBioForest, resize: setupBioForest },
        { id: 'board-20', name: 'Stained Glass', type: 'animated', start: startStainedGlass, stop: stopStainedGlass, resize: setupStainedGlass },
        { id: 'board-21', name: 'Watery Surface', type: 'animated', start: startWatery, stop: stopWatery, resize: setupWatery },
        { id: 'board-22', name: 'Particle Swarm', type: 'animated', start: startSwarm, stop: stopSwarm, resize: setupSwarm },
        { id: 'board-23', name: 'Glitchscape', type: 'animated', start: startGlitch, stop: stopGlitch, resize: setupGlitch },
        { id: 'board-24', name: 'Aurora Borealis', type: 'animated', start: startAurora, stop: stopAurora, resize: setupAurora },
        { id: 'board-25', name: 'Interactive Constellations', type: 'animated', start: startConstellation, stop: stopConstellation, resize: setupConstellation },
        { id: 'board-26', name: 'Synthwave Sunset', type: 'animated', start: startSynthwave, stop: stopSynthwave, resize: setupSynthwave },
        { id: 'board-27', name: 'Deep Space Nebula', type: 'animated', start: startNebula, stop: stopNebula, resize: setupNebula },
        { id: 'board-28', name: 'Jungle Canopy', type: 'animated', start: startJungle, stop: stopJungle, resize: setupJungle },
        { id: 'board-29', name: 'Cityscape at Night', type: 'animated', start: startCityscape, stop: stopCityscape, resize: setupCityscape },
        { id: 'board-30', name: 'Abstract Paint', type: 'animated', start: startPaint, stop: stopPaint, resize: setupPaint },
        { id: 'board-31', name: 'Laser Grid', type: 'animated', start: startLaserGrid, stop: stopLaserGrid, resize: setupLaserGrid },
        { id: 'board-32', name: 'Neon Palms', type: 'animated', start: startNeonPalms, stop: stopNeonPalms, resize: setupNeonPalms },
        { id: 'board-33', name: 'Memphis Pattern', type: 'animated', start: startMemphis, stop: stopMemphis, resize: setupMemphis },
        { id: 'board-34', name: 'Cassette Tape', type: 'animated', start: startCassette, stop: stopCassette, resize: setupCassette },
        { id: 'board-35', name: '8-bit City', type: 'animated', start: startEightBitCity, stop: stopEightBitCity, resize: setupEightBitCity },
        ...Array.from({length: 24}, (_, i) => ({ id: `board-${i + 36}`, name: `Pattern ${i + 1}`, type: 'procedural' }))
    ];
    const MUSIC_DATA = Array.from({length: 10}, (_, i) => ({
        id: `track-${i+1}`,
        name: `Track ${String(i + 1).padStart(2, '0')}`,
        url: `https://raw.githubusercontent.com/cdbyall/solitaire/main/music/${String(i + 1).padStart(2, '0')}.mp3`
    }));
    const ACHIEVEMENTS = {
        firstMove: { name: "Getting Started", desc: "Make your first move.", xp: 1, icon: "▶️", points: 10 },
        firstFoundation: { name: "On the Up and Up", desc: "Place your first card on a foundation.", xp: 5, icon: "🏆", points: 10 },
        kingMe: { name: "All Hail the King", desc: "Place a King on an empty tableau pile.", xp: 5, icon: "👑", points: 10 },
        clearPile: { name: "Clean Sweep", desc: "Clear a tableau pile of all cards.", xp: 10, icon: "🧹", points: 20 },
        combo5: { name: "Chain Reaction", desc: "Achieve a x5 combo.", xp: 10, icon: "🔥", points: 20 },
        speedy: { name: "Quick Draw", desc: "Win a game in under 5 minutes.", xp: 25, icon: "⏱️", points: 50 },
        win1: { name: "First Victory", desc: "Win your first game.", xp: 10, icon: "🥇", points: 20 },
        win5: { name: "Five-Timer", desc: "Win 5 games.", xp: 20, icon: "🖐️", points: 50 },
        win10: { name: "Decade of Dominance", desc: "Win 10 games.", xp: 50, icon: "🔟", points: 100 },
        winStreak2: { name: "Double Down", desc: "Win 2 games in a row.", xp: 20, icon: "✌️", points: 50 },
        winStreak3: { name: "Triple Threat", desc: "Win 3 games in a row.", xp: 50, icon: "🔥", points: 100 },
        newGameSpam: { name: "A Bit Impatient?", desc: "Click 'New Game' 5 times in 10 seconds.", xp: 0, icon: "😠", points: 10, secret: true },
        fullStack1: { name: "Column Major", desc: "Build a full stack from King to Ace.", xp: 20, icon: "🏛️", points: 20 },
        fullStack2: { name: "Major Major", desc: "Build two full stacks in one game.", xp: 50, icon: "🏛️🏛️", points: 50 },
        firstUndo: { name: "Second Thoughts", desc: "Use the Undo button for the first time.", xp: 1, icon: "⎌", points: 10 },
        firstHint: { name: "A Little Help?", desc: "Use the Hint button for the first time.", xp: 1, icon: "💡", points: 10 },
        level2: { name: "Rookie", desc: "Reach Level 2.", xp: 10, icon: "⭐", points: 10 },
        level5: { name: "Veteran", desc: "Reach Level 5.", xp: 20, icon: "⭐⭐", points: 20 },
        level10: { name: "Solitaire Pro", desc: "Reach Level 10.", xp: 50, icon: "⭐⭐⭐", points: 50 },
    };

    // --- Game State Variables ---
    let stock = [], waste = [], foundations = [[], [], [], []], tableau = [[], [], [], [], [], [], []];
    let drawCount = 3;
    let isGameWon = false;
    let winCount = 0;
    let winStreak = 0;
    let unlockedBacks = ['back-0'];
    let selectedBack = 'back-0';
    let unlockedBoards = ['board-0'];
    let selectedBoard = 'board-0';
    let faceStyle = 'default';
    let playerXP = 0;
    let playerLevel = 1;
    let hintsAvailable = 0;
    let undosAvailable = 0;
    let gameTimerInterval;
    let gameTime = 0;
    let lastStockClickTime = 0;
    let moveHistory = [];
    let unlockedAchievements = [];
    let achievementScore = 0;
    let newGameClickTimes = [];
    let devUnlockCounter = 0;
    let isMuted = false;
    let unlockedTracks = ['track-1'];
    let currentTrackPlayer;
    let currentTrackIndex = -1;
    let shuffledPlaylist = [];
    let introPlayer;
    
    // --- Drag & Drop State ---
    let isDragging = false;
    let dragProxyEl = null;
    let draggedCardInfo = null;
    let offsetX, offsetY;
    let lastClickTime = 0;
    let mouseDownPos = null;
    
    // --- Game-specific XP State ---
    let aceBonusAwarded = false;
    let tableauBonusAwarded = [];

    // --- Combo State ---
    let lastMoveTime = 0;
    let comboCounter = 0;
    let comboTimeout;

    // --- Physics Engine ---
    let engine, matterRender, world, mouseConstraint;
    let comboBodies = [];
    let winAnimationTimeout;

    // --- Animated Backgrounds ---
    let starfieldCtx, stars = [], starfieldAnimationId = null;
    let lavalampCtx, blobs = [], lavalampAnimationId = null;
    let oceanCtx, waveTime = 0, oceanAnimationId = null;
    let matrixCtx, drops = [], matrixAnimationId = null;
    let geometricCtx, geoTime = 0, geometricAnimationId = null;
    let fireCtx, particles = [], fireAnimationId = null;
    let rainCtx, raindrops = [], rainAnimationId = null;
    let hyperspaceCtx, hyperStars = [], hyperspaceAnimationId = null;
    let plasmaCtx, plasmaTime = 0, plasmaAnimationId = null;
    let forestCtx, leaves = [], forestAnimationId = null;
    let neongridCtx, neongridAnimationId = null;
    let sakuraCtx, sakuraPetals = [], sakuraAnimationId = null;
    let quantumCtx, quantumParticles = [], quantumAnimationId = null;
    let digitalrainCtx, digitalDrops = [], digitalrainAnimationId = null;
    let sandsCtx, sandTime = 0, sandsAnimationId = null;
    let inkblotCtx, inkblots = [], inkblotAnimationId = null;
    let cosmicCtx, cosmicStars = [], cosmicRipples = [], cosmicAnimationId = null;
    let musicvizCtx, musicvizAnimationId = null;
    let bioforestCtx, bioPlants = [], bioforestAnimationId = null;
    let stainedglassCtx, glassPanes = [], stainedglassAnimationId = null;
    let wateryCtx, wateryRipples = [], wateryAnimationId = null;
    let swarmCtx, swarmParticles = [], swarmAnimationId = null;
    let glitchCtx, glitchData, glitchAnimationId = null;
    let auroraCtx, auroraParticles = [], auroraAnimationId = null;
    let constellationCtx, constellationStars = [], constellationLines = [], constellationAnimationId = null;
    let synthwaveCtx, synthwaveTime = 0, synthwaveAnimationId = null;
    let nebulaCtx, nebulaParticles = [], nebulaAnimationId = null;
    let jungleCtx, jungleVines = [], jungleAnimationId = null;
    let cityscapeCtx, cityscapeWindows = [], cityscapeAnimationId = null;
    let paintCtx, paintBlobs = [], paintAnimationId = null;
    let laserGridCtx, laserGridTime = 0, laserGridAnimationId = null;
    let neonPalmsCtx, neonPalmsTime = 0, neonPalmsAnimationId = null;
    let memphisCtx, memphisShapes = [], memphisAnimationId = null;
    let cassetteCtx, cassetteTime = 0, cassetteAnimationId = null;
    let eightBitCityCtx, eightBitCityBuildings = [], eightBitCityAnimationId = null;
    let mousePos = { x: 0, y: 0 };
    let currentApplyCallback = null;
    let unlockPopupQueue = [];
    let isPopupVisible = false;

    // --- NEW: Win Animation Data ---
    const WIN_ANIMATION_DATA = [
        { id: 'fireworks', name: 'Fireworks', unlockLevel: 2, func: winAnimationFireworks },
        { id: 'cardCyclone', name: 'Card Cyclone', unlockLevel: 4, func: winAnimationCyclone },
        { id: 'pop', name: 'Card Pop', unlockLevel: 6, func: winAnimationPop },
        { id: 'flip', name: 'Mass Flip', unlockLevel: 8, func: winAnimationFlip },
        { id: 'march', name: 'Card March', unlockLevel: 10, func: winAnimationMarch },
        { id: 'matrixRain', name: 'Matrix Rain', unlockLevel: 12, func: winAnimationMatrixRain },
        { id: 'gravityWell', name: 'Gravity Well', unlockLevel: 14, func: winAnimationGravityWell },
        { id: 'colorCycle', name: 'Color Cycle', unlockLevel: 16, func: winAnimationColorCycle },
        { id: 'buildWall', name: 'Build a Wall', unlockLevel: 18, func: winAnimationBuildWall },
        { id: 'blackHole', name: 'Black Hole', unlockLevel: 20, func: winAnimationBlackHole },
    ];
    let unlockedWinAnimations = ['confetti', 'vortex', 'fountain', 'cascade', 'shuffle'];
    const ALL_WIN_ANIMATIONS = {
        'confetti': winAnimationConfetti,
        'vortex': winAnimationVortex,
        'fountain': winAnimationFountain,
        'cascade': winAnimationCascade,
        'shuffle': winAnimationShuffle,
        ...Object.fromEntries(WIN_ANIMATION_DATA.map(a => [a.id, a.func]))
    };

    // --- Sound Engine ---
    let sounds;
    let analyser;
    const libs = {
        Tone: typeof Tone !== 'undefined',
        Matter: typeof Matter !== 'undefined'
    };

    function setupSounds() {
        if (!libs.Tone) return;
        sounds = {
            place: new Tone.PolySynth(Tone.Synth, { oscillator: { type: 'sine' }, envelope: { attack: 0.005, decay: 0.1, sustain: 0.3, release: 1 } }).toDestination(),
            foundationPlace: new Tone.PolySynth(Tone.MetalSynth, { frequency: 200, envelope: { attack: 0.001, decay: 0.4, release: 0.2 }, harmonicity: 5.1, modulationIndex: 32, resonance: 4000, octaves: 1.5 }).toDestination(),
            error: new Tone.PolySynth(Tone.Synth, { oscillator: { type: 'square' }, envelope: { attack: 0.01, decay: 0.2, sustain: 0 } }).toDestination(),
            win: new Tone.PolySynth(Tone.Synth).toDestination(),
            click: new Tone.PolySynth(Tone.MembraneSynth).toDestination(),
            levelUp: new Tone.Synth().toDestination(),
            achievement: new Tone.PluckSynth({ attackNoise: 0.5, dampening: 4000, resonance: 0.9 }).toDestination(),
            combo: new Tone.PolySynth(Tone.FMSynth, { harmonicity: 3, modulationIndex: 10, detune: 0, oscillator: { type: "sine" }, envelope: { attack: 0.01, decay: 0.2, sustain: 0.5, release: 0.5 }, modulation: { type: "square" }, modulationEnvelope: { attack: 0.01, decay: 0.2, sustain: 0.5, release: 0.5 } }).toDestination(),
            pop: new Tone.PolySynth(Tone.MembraneSynth, { pitchDecay: 0.01, octaves: 2, oscillator: { type: "sine" }, envelope: { attack: 0.001, decay: 0.1, sustain: 0.01, release: 0.01 } }).toDestination(),
        };
        analyser = new Tone.Analyser('fft', 32);
        Tone.getDestination().connect(analyser);
    }
    
    function animateTitleScreen() {
        const container = document.querySelector('.title-cards');
        container.innerHTML = '';
        const titleSuits = ['♥', '♦', '♣', '♠', '★'];
        for (let i = 0; i < 5; i++) {
            const card = document.createElement('div');
            card.className = 'title-card';
            card.style.setProperty('--rot', `${(i - 2) * 15}deg`);
            card.style.setProperty('--i', i);
            
            const cardInner = document.createElement('div');
            cardInner.className = 'title-card-inner';

            const cardFront = document.createElement('div');
            cardFront.className = 'title-card-front';
            cardFront.textContent = titleSuits[i];
            cardFront.style.color = (i < 2) ? '#d90429' : '#000000';

            const cardBack = document.createElement('div');
            cardBack.className = 'title-card-back';

            cardInner.appendChild(cardFront);
            cardInner.appendChild(cardBack);
            card.appendChild(cardInner);
            container.appendChild(card);
        }
    }

    function setupPhysics() {
        if (!libs.Matter) return;
        const { Engine, Render, World, Bodies, Mouse, MouseConstraint, Runner, Events } = Matter;
        engine = Engine.create({ gravity: { y: 0.2 } });
        world = engine.world;
        matterRender = Render.create({
            canvas: dom.comboCanvas,
            engine: engine,
            options: {
                width: window.innerWidth,
                height: window.innerHeight,
                wireframes: false,
                background: 'transparent'
            }
        });

        const mouse = Mouse.create(matterRender.canvas);
        mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.2,
                render: { visible: false }
            }
        });
        World.add(world, mouseConstraint);
        matterRender.mouse = mouse;

        Runner.run(engine);
        Render.run(matterRender);

        Events.on(mouseConstraint, 'mousedown', function(event) {
            const clickedBody = Matter.Query.point(comboBodies, event.mouse.position)[0];
            if (clickedBody) {
                if (sounds) sounds.pop.triggerAttackRelease("C3", "8n");
                Matter.World.remove(world, clickedBody);
                comboBodies = comboBodies.filter(b => b !== clickedBody);
            }
        });
    }

    function initializeAudio() {
        if (!libs.Tone || (libs.Tone && Tone.context.state === 'running')) return;
        Tone.start().then(() => {
            setupSounds();
            if (!dom.titleScreen.classList.contains('hidden')) {
                introPlayer = new Tone.Player("https://raw.githubusercontent.com/cdbyall/solitaire/main/music/00.mp3").toDestination();
                introPlayer.loop = true;
                introPlayer.autostart = true;
                updateMuteState(false);
            }
        });
    }

    function initializeApp() {
        // Run physics setup regardless of audio, as it's visual
        setupPhysics();
        // The rest of the app can initialize
        animateTitleScreen();
        // Add listeners that will try to init audio on first interaction
        document.addEventListener('click', initializeAudio, { once: true });
        document.addEventListener('touchstart', initializeAudio, { once: true });
    }
    
    // --- (The rest of the functions are the same until checkLevelUp and checkWinCondition) ---
    // ... all functions from createDeck to unlockEverything ...

    function checkLevelUp(showNotification) {
        const oldLevel = playerLevel;
        let newLevel = 1;
        for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
            if (playerXP >= LEVEL_THRESHOLDS[i]) {
                newLevel = i + 1;
            }
        }
        if (newLevel > playerLevel) {
            playerLevel = newLevel;
            if (showNotification) {
                if(sounds) sounds.levelUp.triggerAttackRelease("C6", "4n");
                let rewards = [];
                const featureUnlocks = {
                    2: { type: 'feature', name: 'Auto-Move', desc: 'You can now <b>double-tap</b> or <b>double-click</b> a card to automatically move it to a valid pile.' },
                    3: { type: 'feature', name: 'Hints', desc: 'You can now spend Hint points to find a possible move. You get more hints as you level up!' },
                    4: { type: 'feature', name: 'Undo', desc: 'You can now undo your previous move. You get more undos as you level up!' },
                };

                for(let l = oldLevel + 1; l <= newLevel; l++) {
                    if (featureUnlocks[l]) {
                        const unlock = featureUnlocks[l];
                        queueUnlockPopup(`⚡ ${unlock.name} Unlocked!`, unlock.desc);
                    }
                    
                    const boardToUnlock = BOARD_DATA[l - 1];
                    if (boardToUnlock && !unlockedBoards.includes(boardToUnlock.id)) {
                        unlockedBoards.push(boardToUnlock.id);
                        const applyCallback = () => {
                            selectedBoard = boardToUnlock.id;
                            updateCardStyles();
                            saveProgress();
                        };
                        queueUnlockPopup('New Board Unlocked!', `You've unlocked the <b>${boardToUnlock.name}</b> background!`, applyCallback);
                    }

                    const cardBackToUnlock = SHUFFLED_CARD_BACKS[l - 1];
                    if (cardBackToUnlock && !unlockedBacks.includes(cardBackToUnlock.id)) {
                        unlockedBacks.push(cardBackToUnlock.id);
                        const applyCallback = () => {
                            selectedBack = cardBackToUnlock.id;
                            updateCardStyles();
                            saveProgress();
                        };
                        queueUnlockPopup('New Card Back Unlocked!', `You've unlocked the <b>${cardBackToUnlock.name}</b> card back!`, applyCallback);
                    }

                    if (l % 2 === 1) {
                        const trackIndex = (l - 1) / 2;
                        const trackToUnlock = MUSIC_DATA[trackIndex];
                        if (trackToUnlock && !unlockedTracks.includes(trackToUnlock.id)) {
                            unlockedTracks.push(trackToUnlock.id);
                            const applyCallback = () => {
                                playTrackNow(trackToUnlock.url);
                            };
                            queueUnlockPopup('🎵 New Music Unlocked!', `<b>${trackToUnlock.name}</b> is now in your playlist!`, applyCallback);
                        }
                    }

                    // --- NEW: Win Animation Unlock ---
                    WIN_ANIMATION_DATA.forEach(anim => {
                        if (l === anim.unlockLevel && !unlockedWinAnimations.includes(anim.id)) {
                            unlockedWinAnimations.push(anim.id);
                            queueUnlockPopup('🏆 New Win Animation!', `You've unlocked the <b>${anim.name}</b> win animation!`);
                        }
                    });

                    if(l === 3 || (l > 3 && l % 2 !== 0)) { hintsAvailable += 1; rewards.push("+1 Hint"); }
                    if(l === 4 || (l > 4 && l % 2 === 0)) { undosAvailable += 2; rewards.push("+2 Undos"); }
                }
                dom.messageBox.textContent = `Level Up! You are now Level ${newLevel}! ${rewards.join(', ')}!`;
                setTimeout(() => dom.messageBox.textContent = '', 4000);
            }
        }
        updatePlayerStatsUI();
    }

    function checkWinCondition() {
        if (foundations.reduce((sum, pile) => sum + pile.length, 0) === 52 && !isGameWon) {
            isGameWon = true;
            stopTimer();
            dom.messageBox.textContent = '🎉 You Win! 🎉';
            dom.autocompleteBtn.classList.add('hidden');
            dom.gameBoard.style.pointerEvents = 'none';
            
            winCount++;
            winStreak++;
            const winBonus = drawCount === 3 ? 20 : 10;
            addXP(winBonus, `+${winBonus} XP: You Win!`);
            hintsAvailable++;
            saveProgress();
            
            if(sounds) {
                const now = Tone.now();
                sounds.win.triggerAttackRelease("C4", "2n", now);
                sounds.win.triggerAttackRelease("E4", "2n", now + 0.2);
                sounds.win.triggerAttackRelease("G4", "2n", now + 0.4);
                sounds.win.triggerAttackRelease("C5", "1n", now + 0.6);
            }
            
            // --- MODIFIED: Select from unlocked animations ---
            const randomAnimationId = unlockedWinAnimations[Math.floor(Math.random() * unlockedWinAnimations.length)];
            const animationFunction = ALL_WIN_ANIMATIONS[randomAnimationId];
            if (animationFunction) {
                animationFunction();
            } else {
                winAnimationConfetti(); // Fallback
            }
        }
    }

    // --- (The rest of the functions until win animations are the same) ---
    // ... all functions from runAutocomplete to varToNum ...

    // --- NEW: Win Animation Implementations ---

    // Lv 2
    function winAnimationFireworks() {
        dom.fireworksContainer.innerHTML = ''; // Clear old fireworks
        for (let i = 0; i < 30; i++) { // Create 30 fireworks
            setTimeout(() => {
                const fw = document.createElement('div');
                fw.className = 'firework-particle';
                const x = Math.random() * 100;
                const y = Math.random() * 100;
                fw.style.left = `${x}vw`;
                fw.style.top = `${y}vh`;
                fw.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
                dom.fireworksContainer.appendChild(fw);
                
                // Explode
                for (let j = 0; j < 20; j++) {
                    const p = document.createElement('div');
                    p.className = 'firework-particle';
                    p.style.left = `${x}vw`;
                    p.style.top = `${y}vh`;
                    p.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
                    const angle = Math.random() * 360;
                    const radius = Math.random() * 150;
                    p.style.transform = `translate(-50%, -50%) rotate(${angle}deg) translateX(${radius}px)`;
                    p.style.opacity = '0';
                    dom.fireworksContainer.appendChild(p);
                    setTimeout(() => p.remove(), 1000);
                }
                setTimeout(() => fw.remove(), 1000);
            }, i * 100);
        }
    }

    // Lv 4
    function winAnimationCyclone() {
        if (!libs.Matter) { winAnimationConfetti(); return; } // Fallback
        dom.comboCanvas.style.pointerEvents = 'auto';
        const { Bodies, World, Body } = Matter;
        const cardWidth = varToNum('--card-width');
        const cardHeight = varToNum('--card-height');
        const fullDeck = createDeck();
        const cardBodies = [];

        fullDeck.forEach((card, i) => {
            const cardBody = Bodies.rectangle(
                Math.random() * window.innerWidth, -100, cardWidth, cardHeight,
                { frictionAir: 0, angle: Math.random() * Math.PI * 2, render: { sprite: { texture: createCardTexture(card) }}}
            );
            cardBodies.push(cardBody);
            World.add(world, cardBody);
        });

        const cycloneInterval = setInterval(() => {
            cardBodies.forEach(body => {
                const dx = window.innerWidth / 2 - body.position.x;
                const dy = window.innerHeight / 2 - body.position.y;
                const angle = Math.atan2(dy, dx);
                // Apply a force perpendicular to the center and a force towards the center
                Body.applyForce(body, body.position, {
                    x: Math.cos(angle + Math.PI / 2) * 0.005,
                    y: Math.sin(angle + Math.PI / 2) * 0.005,
                });
                Body.applyForce(body, body.position, {
                    x: dx * 0.00001,
                    y: dy * 0.00001,
                });
            });
        }, 16);

        winAnimationTimeout = setTimeout(() => {
            clearInterval(cycloneInterval);
            if(world) Matter.World.clear(world, false);
            dom.comboCanvas.style.pointerEvents = 'none';
        }, 15000);
    }
    
    // Lv 6
    function winAnimationPop() {
        const allCardEls = Array.from(document.querySelectorAll('.foundation-area .card'));
        shuffleArray(allCardEls);
        allCardEls.forEach((cardEl, i) => {
            setTimeout(() => {
                cardEl.style.transition = 'transform 0.2s, opacity 0.2s';
                cardEl.style.transform = 'scale(1.5)';
                cardEl.style.opacity = '0';
                if (sounds) sounds.pop.triggerAttackRelease("C4", "8n", `+${i * 0.05}`);
            }, i * 50);
        });
    }

    // Lv 8
    function winAnimationFlip() {
        const allCardEls = Array.from(document.querySelectorAll('.foundation-area .card'));
        allCardEls.forEach((cardEl, i) => {
            setTimeout(() => {
                cardEl.classList.add('win-flip');
                setTimeout(() => cardEl.classList.remove('win-flip'), 500);
            }, i * 30);
        });
    }

    // Lv 10
    function winAnimationMarch() {
        const allCardEls = Array.from(document.querySelectorAll('.foundation-area .card'));
        allCardEls.forEach((cardEl, i) => {
            const clone = cardEl.cloneNode(true);
            const rect = cardEl.getBoundingClientRect();
            clone.style.position = 'fixed';
            clone.style.left = `${rect.left}px`;
            clone.style.top = `${rect.top}px`;
            clone.style.zIndex = 10000 + i;
            clone.style.transition = 'transform 2s ease-in';
            document.body.appendChild(clone);
            
            setTimeout(() => {
                clone.style.transform = `translateY(${window.innerHeight}px) rotate(720deg)`;
                setTimeout(() => clone.remove(), 2000);
            }, i * 50);
        });
    }
    
    // Lv 12
    function winAnimationMatrixRain() {
        const allCardEls = Array.from(document.querySelectorAll('.foundation-area .card'));
        allCardEls.forEach((cardEl, i) => {
            const clone = cardEl.cloneNode(true);
            clone.style.position = 'fixed';
            clone.style.left = `${Math.random() * 100}vw`;
            clone.style.top = '-150px';
            clone.style.zIndex = 10000 + i;
            clone.style.transition = `top ${Math.random() * 2 + 2}s linear`;
            document.body.appendChild(clone);
            
            setTimeout(() => {
                clone.style.top = `${window.innerHeight + 150}px`;
                setTimeout(() => clone.remove(), 4000);
            }, Math.random() * 2000);
        });
    }

    // Lv 14
    function winAnimationGravityWell() {
        if (!libs.Matter) { winAnimationConfetti(); return; } // Fallback
        dom.comboCanvas.style.pointerEvents = 'auto';
        const { Bodies, World, Body } = Matter;
        const cardWidth = varToNum('--card-width');
        const cardHeight = varToNum('--card-height');
        const fullDeck = createDeck();
        const cardBodies = [];

        fullDeck.forEach((card, i) => {
            const cardBody = Bodies.rectangle(
                (Math.random() > 0.5 ? -100 : window.innerWidth + 100), Math.random() * window.innerHeight, 
                cardWidth, cardHeight,
                { frictionAir: 0, angle: Math.random() * Math.PI * 2, render: { sprite: { texture: createCardTexture(card) }}}
            );
            cardBodies.push(cardBody);
            World.add(world, cardBody);
        });

        const gravityInterval = setInterval(() => {
            cardBodies.forEach(body => {
                const dx = window.innerWidth / 2 - body.position.x;
                const dy = window.innerHeight / 2 - body.position.y;
                const dist = Math.sqrt(dx*dx + dy*dy);
                if (dist > 10) {
                    Body.applyForce(body, body.position, { x: dx * 0.0001, y: dy * 0.0001 });
                }
            });
        }, 16);

        winAnimationTimeout = setTimeout(() => {
            clearInterval(gravityInterval);
            if(world) Matter.World.clear(world, false);
            dom.comboCanvas.style.pointerEvents = 'none';
        }, 15000);
    }
    
    // Lv 16
    function winAnimationColorCycle() {
        dom.gameBoard.classList.add('color-cycle');
        setTimeout(() => {
            dom.gameBoard.classList.remove('color-cycle');
        }, 10000);
    }

    // Lv 18
    function winAnimationBuildWall() {
        if (!libs.Matter) { winAnimationConfetti(); return; } // Fallback
        dom.comboCanvas.style.pointerEvents = 'auto';
        const { Bodies, World } = Matter;
        const cardWidth = varToNum('--card-width');
        const cardHeight = varToNum('--card-height');
        const fullDeck = createDeck();

        const rows = 6;
        const cols = Math.floor(52 / rows);
        const startX = (window.innerWidth - (cols * cardWidth)) / 2;
        const startY = (window.innerHeight - (rows * cardHeight * 0.8)) / 2;

        fullDeck.forEach((card, i) => {
            setTimeout(() => {
                const row = Math.floor(i / cols);
                const col = i % cols;
                const cardBody = Bodies.rectangle(
                    startX + col * cardWidth, startY + row * cardHeight * 0.8, cardWidth, cardHeight,
                    { isStatic: false, restitution: 0.1, friction: 0.8, render: { sprite: { texture: createCardTexture(card) }}}
                );
                World.add(world, cardBody);
            }, i * 30);
        });

        winAnimationTimeout = setTimeout(() => {
            if(world) Matter.World.clear(world, false);
            dom.comboCanvas.style.pointerEvents = 'none';
        }, 20000);
    }

    // Lv 20
    function winAnimationBlackHole() {
        const allCardEls = Array.from(document.querySelectorAll('.foundation-area .card'));
        allCardEls.forEach((cardEl, i) => {
            const clone = cardEl.cloneNode(true);
            const rect = cardEl.getBoundingClientRect();
            clone.style.position = 'fixed';
            clone.style.left = `${rect.left}px`;
            clone.style.top = `${rect.top}px`;
            clone.style.zIndex = 10000 + i;
            clone.style.transition = 'all 1.5s ease-in';
            document.body.appendChild(clone);
            
            setTimeout(() => {
                clone.style.left = '50vw';
                clone.style.top = '50vh';
                clone.style.transform = 'scale(0) rotate(1080deg)';
                setTimeout(() => clone.remove(), 1500);
            }, i * 20);
        });
    }

    // --- (The rest of the script is identical to the previous version) ---
    // Make sure to copy the entire script, including the event listeners and the final `initializeApp()` call.
    
    // ... all other functions like createCardTexture, timers, achievements, etc. ...
    
    // --- Initial Setup ---
    initializeApp();
    
    // ... The rest of the event listeners ...
    dom.startGameBtn.addEventListener('click', () => {
        initializeAudio();
        if(sounds) sounds.click.triggerAttackRelease("C2", "8n");
        dom.titleScreen.classList.add('hidden');
        setTimeout(() => {
            dom.gameContainer.style.display = 'flex';
            loadProgress();
            promptNewGame();
        }, 500);
    });
    // (All other listeners remain the same)
});
