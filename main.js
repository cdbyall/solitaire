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

    // --- Sound Engine ---
    let sounds;
    let analyser;

    // *** NEW *** Check if external libraries are loaded
    const libs = {
        Tone: typeof Tone !== 'undefined',
        Matter: typeof Matter !== 'undefined'
    };

    function setupSounds() {
        // Only run if Tone.js is loaded
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
    
    // --- Game Initialization ---
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
        // Only run if Matter.js is loaded
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
        if (!libs.Tone || Tone.context.state === 'running') return;
        Tone.start().then(() => {
            setupSounds();
            setupPhysics();

            if (!dom.titleScreen.classList.contains('hidden')) {
                introPlayer = new Tone.Player("https://raw.githubusercontent.com/cdbyall/solitaire/main/music/00.mp3").toDestination();
                introPlayer.loop = true;
                introPlayer.autostart = true;
                updateMuteState(false);
            }
        });
    }

    // --- The rest of the code is the same as the previous "Complete" version ---
    // I am including all of it again below for certainty.

    function promptNewGame() {
        dom.drawSelectModal.style.display = 'flex';
    }

    function initializeNewGame() {
        if (introPlayer) {
            introPlayer.stop();
            introPlayer.dispose();
            introPlayer = null;
        }
        startMainPlaylist();

        if (!isGameWon) {
            winStreak = 0;
        }
        isGameWon = false;
        aceBonusAwarded = false;
        tableauBonusAwarded = [false, false, false, false, false, false, false];
        resetCombo();
        startTimer();
        clearTimeout(winAnimationTimeout);
        dom.comboCanvas.style.pointerEvents = 'none';
        moveHistory = [];
        dom.gameTimerEl.textContent = '00:00';
        
        newGameClickTimes.push(Date.now());
        if (newGameClickTimes.length > 5) {
            newGameClickTimes.shift();
            if (newGameClickTimes[4] - newGameClickTimes[0] < 10000) {
                triggerAchievement('newGameSpam');
            }
        }
        
        stock = []; waste = []; foundations = [[], [], [], []];
        tableau = Array.from({ length: 7 }, () => []);
        dom.messageBox.textContent = '';
        dom.autocompleteBtn.classList.add('hidden');
        dom.gameBoard.style.pointerEvents = 'auto';
        document.querySelectorAll('.win-animate, .hint-glow').forEach(el => el.classList.remove('win-animate', 'hint-glow'));

        const deck = createDeck();
        shuffleDeck(deck);
        dealCards(deck);
        updateCardStyles();
        render();
        updatePlayerStatsUI();
    }

    function loadProgress() {
        winCount = parseInt(localStorage.getItem('solitaireWinCount') || '0');
        winStreak = parseInt(localStorage.getItem('solitaireWinStreak') || '0');
        unlockedBacks = JSON.parse(localStorage.getItem('solitaireUnlockedBacks') || '["back-0"]');
        selectedBack = localStorage.getItem('solitaireSelectedBack') || 'back-0';
        unlockedBoards = JSON.parse(localStorage.getItem('solitaireUnlockedBoards') || '["board-0"]');
        selectedBoard = localStorage.getItem('solitaireSelectedBoard') || 'board-0';
        playerXP = parseInt(localStorage.getItem('solitairePlayerXP') || '0');
        hintsAvailable = parseInt(localStorage.getItem('solitaireHintsAvailable') || '0');
        undosAvailable = parseInt(localStorage.getItem('solitaireUndosAvailable') || '0');
        unlockedAchievements = JSON.parse(localStorage.getItem('solitaireAchievements') || '[]');
        achievementScore = parseInt(localStorage.getItem('solitaireAchievementScore') || '0');
        isMuted = JSON.parse(localStorage.getItem('solitaireIsMuted') || 'false');
        unlockedTracks = JSON.parse(localStorage.getItem('solitaireUnlockedTracks')) || ['track-1'];
        
        checkLevelUp(false);
        updateMuteState(false);
        updateCardStyles();
        updatePlayerStatsUI();
    }

    function saveProgress() {
        localStorage.setItem('solitaireWinCount', winCount);
        localStorage.setItem('solitaireWinStreak', winStreak);
        localStorage.setItem('solitaireUnlockedBacks', JSON.stringify(unlockedBacks));
        localStorage.setItem('solitaireSelectedBack', selectedBack);
        localStorage.setItem('solitaireUnlockedBoards', JSON.stringify(unlockedBoards));
        localStorage.setItem('solitaireSelectedBoard', selectedBoard);
        localStorage.setItem('solitairePlayerXP', playerXP);
        localStorage.setItem('solitaireHintsAvailable', hintsAvailable);
        localStorage.setItem('solitaireUndosAvailable', undosAvailable);
        localStorage.setItem('solitaireAchievements', JSON.stringify(unlockedAchievements));
        localStorage.setItem('solitaireAchievementScore', achievementScore);
        localStorage.setItem('solitaireIsMuted', JSON.stringify(isMuted));
        localStorage.setItem('solitaireUnlockedTracks', JSON.stringify(unlockedTracks));
    }

    // --- Animated Backgrounds ---
    function setupStarfield() { if (!backgroundCanvases.starfield) return; backgroundCanvases.starfield.width = window.innerWidth; backgroundCanvases.starfield.height = window.innerHeight; starfieldCtx = backgroundCanvases.starfield.getContext('2d'); stars = []; const numStars = window.innerWidth < 600 ? 400 : 800; const w = backgroundCanvases.starfield.width; const h = backgroundCanvases.starfield.height; for(let i = 0; i < numStars; i++) { stars.push({ x: Math.random() * w - w / 2, y: Math.random() * h - h / 2, z: Math.random() * w }); } }
    function animateStarfield() { if (!starfieldCtx) return; const w = backgroundCanvases.starfield.width; const h = backgroundCanvases.starfield.height; const speed = 2; starfieldCtx.fillStyle = 'rgba(0, 0, 0, 0.2)'; starfieldCtx.fillRect(0, 0, w, h); starfieldCtx.fillStyle = 'white'; stars.forEach(star => { star.z -= speed; if (star.z <= 0) { star.x = Math.random() * w - w / 2; star.y = Math.random() * h / 2; star.z = w; } const k = 128.0 / star.z; const px = star.x * k + w / 2; const py = star.y * k + h / 2; if (px >= 0 && px < w && py >= 0 && py < h) { const size = (1 - star.z / w) * 5; starfieldCtx.fillRect(px, py, size, size); } }); starfieldAnimationId = requestAnimationFrame(animateStarfield); }
    function startStarfield() { if (starfieldAnimationId) return; if (!backgroundCanvases.starfield) return; backgroundCanvases.starfield.style.display = 'block'; setupStarfield(); animateStarfield(); }
    function stopStarfield() { if (!starfieldAnimationId) return; cancelAnimationFrame(starfieldAnimationId); starfieldAnimationId = null; if (backgroundCanvases.starfield) backgroundCanvases.starfield.style.display = 'none'; }
    class Blob { constructor(w, h) { this.w = w; this.h = h; this.x = Math.random() * w; this.y = Math.random() * h; this.vx = (Math.random() - 0.5) * 2; this.vy = (Math.random() - 0.5) * 2; this.radius = Math.random() * 40 + 40; } update() { this.x += this.vx; this.y += this.vy; if (this.x < this.radius || this.x > this.w - this.radius) this.vx *= -1; if (this.y < this.radius || this.y > this.h - this.radius) this.vy *= -1; } }
    function setupLavalamp() { if (!backgroundCanvases.lavalamp) return; backgroundCanvases.lavalamp.width = window.innerWidth; backgroundCanvases.lavalamp.height = window.innerHeight; lavalampCtx = backgroundCanvases.lavalamp.getContext('2d'); blobs = []; const numBlobs = 10; for(let i=0; i<numBlobs; i++) { blobs.push(new Blob(backgroundCanvases.lavalamp.width, backgroundCanvases.lavalamp.height)); } }
    function animateLavalamp() { if (!lavalampCtx) return; lavalampCtx.clearRect(0, 0, backgroundCanvases.lavalamp.width, backgroundCanvases.lavalamp.height); const bgGradient = lavalampCtx.createLinearGradient(0, 0, 0, backgroundCanvases.lavalamp.height); bgGradient.addColorStop(0, "#3a1c71"); bgGradient.addColorStop(0.5, "#d76d77"); bgGradient.addColorStop(1, "#ffaf7b"); lavalampCtx.fillStyle = bgGradient; lavalampCtx.fillRect(0, 0, backgroundCanvases.lavalamp.width, backgroundCanvases.lavalamp.height); lavalampCtx.filter = 'blur(40px) contrast(30)'; lavalampCtx.beginPath(); blobs.forEach(blob => { blob.update(); lavalampCtx.moveTo(blob.x, blob.y); lavalampCtx.arc(blob.x, blob.y, blob.radius, 0, Math.PI * 2); }); lavalampCtx.fillStyle = 'white'; lavalampCtx.fill(); lavalampCtx.filter = 'none'; lavalampAnimationId = requestAnimationFrame(animateLavalamp); }
    function startLavalamp() { if (lavalampAnimationId) return; if (!backgroundCanvases.lavalamp) return; backgroundCanvases.lavalamp.style.display = 'block'; setupLavalamp(); animateLavalamp(); }
    function stopLavalamp() { if (!lavalampAnimationId) return; cancelAnimationFrame(lavalampAnimationId); lavalampAnimationId = null; if (backgroundCanvases.lavalamp) backgroundCanvases.lavalamp.style.display = 'none'; }
    function setupOcean() { if (!backgroundCanvases.ocean) return; backgroundCanvases.ocean.width = window.innerWidth; backgroundCanvases.ocean.height = window.innerHeight; oceanCtx = backgroundCanvases.ocean.getContext('2d'); waveTime = 0; }
    function animateOcean() { if (!oceanCtx) return; const w = backgroundCanvases.ocean.width; const h = backgroundCanvases.ocean.height; oceanCtx.fillStyle = '#001f3f'; oceanCtx.fillRect(0, 0, w, h); waveTime += 0.02; const drawWave = (color, alpha, speed, amplitude, frequency) => { oceanCtx.fillStyle = color; oceanCtx.globalAlpha = alpha; oceanCtx.beginPath(); oceanCtx.moveTo(0, h); for (let x = 0; x < w; x++) { const y = Math.sin(x * frequency + waveTime * speed) * amplitude + h * 0.7; oceanCtx.lineTo(x, y); } oceanCtx.lineTo(w, h); oceanCtx.fill(); }; drawWave('#7FDBFF', 0.5, 0.8, 40, 0.01); drawWave('#0074D9', 0.5, 1, 50, 0.008); drawWave('#001f3f', 0.5, 1.2, 60, 0.006); oceanCtx.globalAlpha = 1; oceanAnimationId = requestAnimationFrame(animateOcean); }
    function startOcean() { if (oceanAnimationId) return; if (!backgroundCanvases.ocean) return; backgroundCanvases.ocean.style.display = 'block'; setupOcean(); animateOcean(); }
    function stopOcean() { if (!oceanAnimationId) return; cancelAnimationFrame(oceanAnimationId); oceanAnimationId = null; if (backgroundCanvases.ocean) backgroundCanvases.ocean.style.display = 'none'; }
    function setupMatrix() { if (!backgroundCanvases.matrix) return; backgroundCanvases.matrix.width = window.innerWidth; backgroundCanvases.matrix.height = window.innerHeight; matrixCtx = backgroundCanvases.matrix.getContext('2d'); const columns = backgroundCanvases.matrix.width / 20; drops = []; for (let x = 0; x < columns; x++) { drops[x] = 1; } }
    function animateMatrix() { if (!matrixCtx) return; matrixCtx.fillStyle = 'rgba(0, 0, 0, 0.05)'; matrixCtx.fillRect(0, 0, backgroundCanvases.matrix.width, backgroundCanvases.matrix.height); matrixCtx.fillStyle = '#0F0'; matrixCtx.font = '15px monospace'; const katakana = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン'; for (let i = 0; i < drops.length; i++) { const text = katakana.charAt(Math.floor(Math.random() * katakana.length)); matrixCtx.fillText(text, i * 20, drops[i] * 20); if (drops[i] * 20 > backgroundCanvases.matrix.height && Math.random() > 0.975) { drops[i] = 0; } drops[i]++; } matrixAnimationId = requestAnimationFrame(animateMatrix); }
    function startMatrix() { if (matrixAnimationId) return; if (!backgroundCanvases.matrix) return; backgroundCanvases.matrix.style.display = 'block'; setupMatrix(); animateMatrix(); }
    function stopMatrix() { if (!matrixAnimationId) return; cancelAnimationFrame(matrixAnimationId); matrixAnimationId = null; if (backgroundCanvases.matrix) backgroundCanvases.matrix.style.display = 'none'; }
    function setupGeometric() { if (!backgroundCanvases.geometric) return; backgroundCanvases.geometric.width = window.innerWidth; backgroundCanvases.geometric.height = window.innerHeight; geometricCtx = backgroundCanvases.geometric.getContext('2d'); geoTime = 0; }
    function animateGeometric() { if (!geometricCtx) return; const w = backgroundCanvases.geometric.width; const h = backgroundCanvases.geometric.height; geometricCtx.fillStyle = 'rgba(20, 20, 30, 0.1)'; geometricCtx.fillRect(0, 0, w, h); geoTime += 0.01; geometricCtx.save(); geometricCtx.translate(w/2, h/2); for (let i = 1; i < 60; i++) { geometricCtx.strokeStyle = `hsla(${i * 10 + geoTime * 100}, 80%, 60%, ${1 - i/60})`; geometricCtx.lineWidth = 2; geometricCtx.beginPath(); const radius = i * 20; const sides = 6; geometricCtx.moveTo(radius, 0); for (let j = 1; j <= sides; j++) { const angle = (j * 2 * Math.PI / sides) + geoTime * (i % 2 === 0 ? 1 : -1); geometricCtx.lineTo(radius * Math.cos(angle), radius * Math.sin(angle)); } geometricCtx.closePath(); geometricCtx.stroke(); } geometricCtx.restore(); geometricAnimationId = requestAnimationFrame(animateGeometric); }
    function startGeometric() { if (geometricAnimationId) return; if (!backgroundCanvases.geometric) return; backgroundCanvases.geometric.style.display = 'block'; setupGeometric(); animateGeometric(); }
    function stopGeometric() { if (!geometricAnimationId) return; cancelAnimationFrame(geometricAnimationId); geometricAnimationId = null; if (backgroundCanvases.geometric) backgroundCanvases.geometric.style.display = 'none'; }
    function setupFire() { if (!backgroundCanvases.fire) return; backgroundCanvases.fire.width = window.innerWidth; backgroundCanvases.fire.height = window.innerHeight; fireCtx = backgroundCanvases.fire.getContext('2d'); particles = []; for (let i = 0; i < 100; i++) { particles.push({ x: Math.random() * backgroundCanvases.fire.width, y: backgroundCanvases.fire.height, size: Math.random() * 5 + 1, speedY: Math.random() * 3 + 1, color: `hsl(${Math.random() * 30 + 30}, 100%, 50%)` }); } }
    function animateFire() { if (!fireCtx) return; fireCtx.globalCompositeOperation = 'source-over'; fireCtx.fillStyle = 'rgba(0,0,0,0.1)'; fireCtx.fillRect(0, 0, backgroundCanvases.fire.width, backgroundCanvases.fire.height); fireCtx.globalCompositeOperation = 'lighter'; particles.forEach(p => { p.y -= p.speedY; p.x += (Math.random() - 0.5); if (p.y < 0) { p.x = Math.random() * backgroundCanvases.fire.width; p.y = backgroundCanvases.fire.height; } fireCtx.beginPath(); fireCtx.fillStyle = p.color; fireCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2); fireCtx.fill(); }); fireAnimationId = requestAnimationFrame(animateFire); }
    function startFire() { if (fireAnimationId) return; if (!backgroundCanvases.fire) return; backgroundCanvases.fire.style.display = 'block'; setupFire(); animateFire(); }
    function stopFire() { if (!fireAnimationId) return; cancelAnimationFrame(fireAnimationId); fireAnimationId = null; if (backgroundCanvases.fire) backgroundCanvases.fire.style.display = 'none'; }
    function setupRain() { if (!backgroundCanvases.rain) return; backgroundCanvases.rain.width = window.innerWidth; backgroundCanvases.rain.height = window.innerHeight; rainCtx = backgroundCanvases.rain.getContext('2d'); raindrops = []; for (let i = 0; i < 500; i++) { raindrops.push({ x: Math.random() * backgroundCanvases.rain.width, y: Math.random() * backgroundCanvases.rain.height, length: Math.random() * 20 + 10, speed: Math.random() * 5 + 2 }); } }
    function animateRain() { if (!rainCtx) return; rainCtx.fillStyle = 'rgba(0, 20, 40, 0.2)'; rainCtx.fillRect(0, 0, backgroundCanvases.rain.width, backgroundCanvases.rain.height); rainCtx.strokeStyle = 'rgba(174,194,224,0.5)'; rainCtx.lineWidth = 1; raindrops.forEach(drop => { drop.y += drop.speed; if (drop.y > backgroundCanvases.rain.height) { drop.y = 0 - drop.length; drop.x = Math.random() * backgroundCanvases.rain.width; } rainCtx.beginPath(); rainCtx.moveTo(drop.x, drop.y); rainCtx.lineTo(drop.x, drop.y + drop.length); rainCtx.stroke(); }); rainAnimationId = requestAnimationFrame(animateRain); }
    function startRain() { if (rainAnimationId) return; if (!backgroundCanvases.rain) return; backgroundCanvases.rain.style.display = 'block'; setupRain(); animateRain(); }
    function stopRain() { if (!rainAnimationId) return; cancelAnimationFrame(rainAnimationId); rainAnimationId = null; if (backgroundCanvases.rain) backgroundCanvases.rain.style.display = 'none'; }
    function setupHyperspace() { if (!backgroundCanvases.hyperspace) return; backgroundCanvases.hyperspace.width = window.innerWidth; backgroundCanvases.hyperspace.height = window.innerHeight; hyperspaceCtx = backgroundCanvases.hyperspace.getContext('2d'); hyperStars = []; for (let i = 0; i < 500; i++) { hyperStars.push({ x: Math.random() * backgroundCanvases.hyperspace.width, y: Math.random() * backgroundCanvases.hyperspace.height, z: Math.random() * backgroundCanvases.hyperspace.width }); } }
    function animateHyperspace() { if (!hyperspaceCtx) return; const w = backgroundCanvases.hyperspace.width; const h = backgroundCanvases.hyperspace.height; const halfW = w / 2; const halfH = h / 2; hyperspaceCtx.fillStyle = 'rgba(0, 0, 0, 0.2)'; hyperspaceCtx.fillRect(0, 0, w, h); hyperStars.forEach(star => { star.z -= 4; if (star.z <= 0) { star.z = w; } const k = 128.0 / star.z; const px = (star.x - halfW) * k + halfW; const py = (star.y - halfH) * k + halfH; if (px >= 0 && px < w && py >= 0 && py < h) { const size = (1 - star.z / w) * 5; const shade = (1 - star.z / w) * 255; hyperspaceCtx.fillStyle = `rgb(${shade}, ${shade}, ${shade})`; hyperspaceCtx.fillRect(px, py, size, size); } }); hyperspaceAnimationId = requestAnimationFrame(animateHyperspace); }
    function startHyperspace() { if (hyperspaceAnimationId) return; if (!backgroundCanvases.hyperspace) return; backgroundCanvases.hyperspace.style.display = 'block'; setupHyperspace(); animateHyperspace(); }
    function stopHyperspace() { if (!hyperspaceAnimationId) return; cancelAnimationFrame(hyperspaceAnimationId); hyperspaceAnimationId = null; if (backgroundCanvases.hyperspace) backgroundCanvases.hyperspace.style.display = 'none'; }
    function setupPlasma() { if (!backgroundCanvases.plasma) return; backgroundCanvases.plasma.width = 128; backgroundCanvases.plasma.height = 128; plasmaCtx = backgroundCanvases.plasma.getContext('2d'); plasmaTime = 0; }
    function animatePlasma() { if (!plasmaCtx) return; const w = backgroundCanvases.plasma.width; const h = backgroundCanvases.plasma.height; const imgData = plasmaCtx.createImageData(w, h); const data = imgData.data; plasmaTime += 0.05; for (let x = 0; x < w; x++) { for (let y = 0; y < h; y++) { const i = (x + y * w) * 4; const v = Math.sin(x / 8 + plasmaTime) + Math.sin(y / 4 + plasmaTime) + Math.sin((x + y) / 8 + plasmaTime) + Math.sin(Math.sqrt(x * x + y * y) / 4 + plasmaTime); data[i] = Math.sin(v * Math.PI) * 128 + 127; data[i+1] = Math.sin(v * Math.PI + 2 * Math.PI / 3) * 128 + 127; data[i+2] = Math.sin(v * Math.PI + 4 * Math.PI / 3) * 128 + 127; data[i+3] = 255; } } plasmaCtx.putImageData(imgData, 0, 0); plasmaAnimationId = requestAnimationFrame(animatePlasma); }
    function startPlasma() { if (plasmaAnimationId) return; if (!backgroundCanvases.plasma) return; backgroundCanvases.plasma.style.display = 'block'; setupPlasma(); animatePlasma(); }
    function stopPlasma() { if (!plasmaAnimationId) return; cancelAnimationFrame(plasmaAnimationId); plasmaAnimationId = null; if (backgroundCanvases.plasma) backgroundCanvases.plasma.style.display = 'none'; }
    function setupForest() { if (!backgroundCanvases.forest) return; backgroundCanvases.forest.width = window.innerWidth; backgroundCanvases.forest.height = window.innerHeight; forestCtx = backgroundCanvases.forest.getContext('2d'); leaves = []; for (let i = 0; i < 50; i++) { leaves.push({ x: Math.random() * backgroundCanvases.forest.width, y: Math.random() * backgroundCanvases.forest.height, size: Math.random() * 5 + 3, speed: Math.random() + 0.5, angle: Math.random() * Math.PI * 2 }); } }
    function animateForest() { if (!forestCtx) return; const w = backgroundCanvases.forest.width; const h = backgroundCanvases.forest.height; const gradient = forestCtx.createLinearGradient(0, 0, 0, h); gradient.addColorStop(0, '#2a4a2a'); gradient.addColorStop(1, '#0a1a0a'); forestCtx.fillStyle = gradient; forestCtx.fillRect(0, 0, w, h); leaves.forEach(leaf => { leaf.y += leaf.speed; leaf.x += Math.sin(leaf.angle + leaf.y / 20); if (leaf.y > h) { leaf.y = -leaf.size; leaf.x = Math.random() * w; } forestCtx.fillStyle = 'rgba(255, 223, 186, 0.7)'; forestCtx.beginPath(); forestCtx.arc(leaf.x, leaf.y, leaf.size, 0, Math.PI * 2); forestCtx.fill(); }); forestAnimationId = requestAnimationFrame(animateForest); }
    function startForest() { if (forestAnimationId) return; if (!backgroundCanvases.forest) return; backgroundCanvases.forest.style.display = 'block'; setupForest(); animateForest(); }
    function stopForest() { if (!forestAnimationId) return; cancelAnimationFrame(forestAnimationId); forestAnimationId = null; if (backgroundCanvases.forest) backgroundCanvases.forest.style.display = 'none'; }
    function setupNeonGrid() { if (!backgroundCanvases.neongrid) return; backgroundCanvases.neongrid.width = window.innerWidth; backgroundCanvases.neongrid.height = window.innerHeight; neongridCtx = backgroundCanvases.neongrid.getContext('2d'); }
    function animateNeonGrid() { if (!neongridCtx) return; const w = backgroundCanvases.neongrid.width; const h = backgroundCanvases.neongrid.height; const time = Date.now() * 0.0002; neongridCtx.fillStyle = '#000'; neongridCtx.fillRect(0, 0, w, h); const gridSize = 50; for (let i = 0; i < w / gridSize + 1; i++) { for (let j = 0; j < h / gridSize + 1; j++) { const x = i * gridSize; const y = j * gridSize; const dx = x - w / 2; const dy = y - h / 2; const dist = Math.sqrt(dx * dx + dy * dy); const pulse = Math.sin(dist * 0.05 - time * 5) * 0.5 + 0.5; neongridCtx.strokeStyle = `rgba(0, 255, 255, ${0.2 + pulse * 0.5})`; neongridCtx.lineWidth = 1 + pulse; neongridCtx.strokeRect(x - 1, y - 1, 2, 2); } } neongridAnimationId = requestAnimationFrame(animateNeonGrid); }
    function startNeonGrid() { if (neongridAnimationId) return; if (!backgroundCanvases.neongrid) return; backgroundCanvases.neongrid.style.display = 'block'; setupNeonGrid(); animateNeonGrid(); }
    function stopNeonGrid() { if (!neongridAnimationId) return; cancelAnimationFrame(neongridAnimationId); neongridAnimationId = null; if (backgroundCanvases.neongrid) backgroundCanvases.neongrid.style.display = 'none'; }
    function setupSakura() { if (!backgroundCanvases.sakura) return; backgroundCanvases.sakura.width = window.innerWidth; backgroundCanvases.sakura.height = window.innerHeight; sakuraCtx = backgroundCanvases.sakura.getContext('2d'); sakuraPetals = []; for (let i = 0; i < 50; i++) { sakuraPetals.push({ x: Math.random() * backgroundCanvases.sakura.width, y: Math.random() * backgroundCanvases.sakura.height, size: Math.random() * 3 + 2, speed: Math.random() * 1 + 0.5, angle: Math.random() * 360 }); } }
    function animateSakura() { if (!sakuraCtx) return; const w = backgroundCanvases.sakura.width; const h = backgroundCanvases.sakura.height; sakuraCtx.fillStyle = 'rgba(255, 230, 240, 0.1)'; sakuraCtx.fillRect(0, 0, w, h); sakuraCtx.fillStyle = '#FFC0CB'; sakuraPetals.forEach(p => { p.y += p.speed; p.x += Math.sin(p.angle); p.angle += 0.01; if (p.y > h) { p.y = -p.size; p.x = Math.random() * w; } sakuraCtx.save(); sakuraCtx.translate(p.x, p.y); sakuraCtx.rotate(p.angle); sakuraCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size); sakuraCtx.restore(); }); sakuraAnimationId = requestAnimationFrame(animateSakura); }
    function startSakura() { if (sakuraAnimationId) return; if (!backgroundCanvases.sakura) return; backgroundCanvases.sakura.style.display = 'block'; setupSakura(); animateSakura(); }
    function stopSakura() { if (!sakuraAnimationId) return; cancelAnimationFrame(sakuraAnimationId); sakuraAnimationId = null; if (backgroundCanvases.sakura) backgroundCanvases.sakura.style.display = 'none'; }
    function setupQuantum() { if (!backgroundCanvases.quantum) return; backgroundCanvases.quantum.width = window.innerWidth; backgroundCanvases.quantum.height = window.innerHeight; quantumCtx = backgroundCanvases.quantum.getContext('2d'); quantumParticles = []; for (let i = 0; i < 200; i++) { quantumParticles.push({ x: Math.random() * backgroundCanvases.quantum.width, y: Math.random() * backgroundCanvases.quantum.height, size: Math.random() * 2, vx: (Math.random() - 0.5) * 0.5, vy: (Math.random() - 0.5) * 0.5 }); } }
    function animateQuantum() { if (!quantumCtx) return; const w = backgroundCanvases.quantum.width; const h = backgroundCanvases.quantum.height; quantumCtx.fillStyle = 'rgba(10, 10, 20, 0.1)'; quantumCtx.fillRect(0, 0, w, h); quantumCtx.fillStyle = '#aaa'; quantumParticles.forEach(p => { p.x += p.vx; p.y += p.vy; if (p.x < 0 || p.x > w) p.vx *= -1; if (p.y < 0 || p.y > h) p.vy *= -1; quantumCtx.fillRect(p.x, p.y, p.size, p.size); }); quantumAnimationId = requestAnimationFrame(animateQuantum); }
    function startQuantum() { if (quantumAnimationId) return; if (!backgroundCanvases.quantum) return; backgroundCanvases.quantum.style.display = 'block'; setupQuantum(); animateQuantum(); }
    function stopQuantum() { if (!quantumAnimationId) return; cancelAnimationFrame(quantumAnimationId); quantumAnimationId = null; if (backgroundCanvases.quantum) backgroundCanvases.quantum.style.display = 'none'; }
    function setupDigitalRain() { if (!backgroundCanvases.digitalrain) return; backgroundCanvases.digitalrain.width = window.innerWidth; backgroundCanvases.digitalrain.height = window.innerHeight; digitalrainCtx = backgroundCanvases.digitalrain.getContext('2d'); const columns = backgroundCanvases.digitalrain.width / 20; digitalDrops = []; for (let x = 0; x < columns; x++) { digitalDrops[x] = 1; } }
    function animateDigitalRain() { if (!digitalrainCtx) return; digitalrainCtx.fillStyle = 'rgba(0, 0, 0, 0.05)'; digitalrainCtx.fillRect(0, 0, backgroundCanvases.digitalrain.width, backgroundCanvases.digitalrain.height); digitalrainCtx.fillStyle = '#0FF'; digitalrainCtx.font = '15px monospace'; const chars = SUITS.concat(VALUES); for (let i = 0; i < digitalDrops.length; i++) { const text = chars[Math.floor(Math.random() * chars.length)]; digitalrainCtx.fillText(text, i * 20, digitalDrops[i] * 20); if (digitalDrops[i] * 20 > backgroundCanvases.digitalrain.height && Math.random() > 0.975) { digitalDrops[i] = 0; } digitalDrops[i]++; } digitalrainAnimationId = requestAnimationFrame(animateDigitalRain); }
    function startDigitalRain() { if (digitalrainAnimationId) return; if (!backgroundCanvases.digitalrain) return; backgroundCanvases.digitalrain.style.display = 'block'; setupDigitalRain(); animateDigitalRain(); }
    function stopDigitalRain() { if (!digitalrainAnimationId) return; cancelAnimationFrame(digitalrainAnimationId); digitalrainAnimationId = null; if (backgroundCanvases.digitalrain) backgroundCanvases.digitalrain.style.display = 'none'; }
    function setupSands() { if (!backgroundCanvases.sands) return; backgroundCanvases.sands.width = window.innerWidth; backgroundCanvases.sands.height = window.innerHeight; sandsCtx = backgroundCanvases.sands.getContext('2d'); sandTime = 0; }
    function animateSands() { if (!sandsCtx) return; const w = backgroundCanvases.sands.width; const h = backgroundCanvases.sands.height; sandTime += 0.01; sandsCtx.clearRect(0, 0, w, h); for (let i = 0; i < 10; i++) { const color = `hsl(40, 50%, ${70 - i * 4}%)`; sandsCtx.fillStyle = color; sandsCtx.beginPath(); sandsCtx.moveTo(0, h); for (let x = 0; x < w; x++) { const y = h * 0.6 + Math.sin(x * 0.01 + sandTime + i * 0.5) * 20 * Math.sin(x * 0.001) + i * 20; sandsCtx.lineTo(x, y); } sandsCtx.lineTo(w, h); sandsCtx.fill(); } sandsAnimationId = requestAnimationFrame(animateSands); }
    function startSands() { if (sandsAnimationId) return; if (!backgroundCanvases.sands) return; backgroundCanvases.sands.style.display = 'block'; setupSands(); animateSands(); }
    function stopSands() { if (!sandsAnimationId) return; cancelAnimationFrame(sandsAnimationId); sandsAnimationId = null; if (backgroundCanvases.sands) backgroundCanvases.sands.style.display = 'none'; }
    function setupInkBlot() { if (!backgroundCanvases.inkblot) return; backgroundCanvases.inkblot.width = window.innerWidth; backgroundCanvases.inkblot.height = window.innerHeight; inkblotCtx = backgroundCanvases.inkblot.getContext('2d'); inkblots = []; inkblotCtx.fillStyle = '#F5EEDC'; inkblotCtx.fillRect(0,0,backgroundCanvases.inkblot.width, backgroundCanvases.inkblot.height); const handler = (e) => { const rect = backgroundCanvases.inkblot.getBoundingClientRect(); const x = (e.clientX || e.touches[0].clientX) - rect.left; const y = (e.clientY || e.touches[0].clientY) - rect.top; inkblots.push({ x, y, radius: 0, maxRadius: Math.random() * 50 + 20, speed: Math.random() * 0.5 + 0.2 }); }; backgroundCanvases.inkblot.addEventListener('mousedown', handler); backgroundCanvases.inkblot.addEventListener('touchstart', handler); }
    function animateInkBlot() { if (!inkblotCtx) return; inkblotCtx.fillStyle = 'rgba(0,0,0,0.5)'; inkblots.forEach(blot => { if(blot.radius < blot.maxRadius) { blot.radius += blot.speed; } inkblotCtx.beginPath(); inkblotCtx.arc(blot.x, blot.y, blot.radius, 0, Math.PI * 2); inkblotCtx.fill(); }); inkblotAnimationId = requestAnimationFrame(animateInkBlot); }
    function startInkBlot() { if(inkblotAnimationId) return; if(!backgroundCanvases.inkblot) return; backgroundCanvases.inkblot.style.display = 'block'; setupInkBlot(); animateInkBlot(); }
    function stopInkBlot() { if(!inkblotAnimationId) return; cancelAnimationFrame(inkblotAnimationId); inkblotAnimationId = null; if(backgroundCanvases.inkblot) backgroundCanvases.inkblot.style.display = 'none'; }
    function setupCosmic() { if (!backgroundCanvases.cosmic) return; backgroundCanvases.cosmic.width = window.innerWidth; backgroundCanvases.cosmic.height = window.innerHeight; cosmicCtx = backgroundCanvases.cosmic.getContext('2d'); cosmicStars = Array.from({length: 500}, () => ({x: Math.random(), y: Math.random(), z: Math.random()})); cosmicRipples = []; const handler = (e) => { const rect = backgroundCanvases.cosmic.getBoundingClientRect(); const x = (e.clientX || e.touches[0].clientX) - rect.left; const y = (e.clientY || e.touches[0].clientY) - rect.top; cosmicRipples.push({x, y, radius: 0, maxRadius: 200, speed: 2}); }; backgroundCanvases.cosmic.addEventListener('mousedown', handler); backgroundCanvases.cosmic.addEventListener('touchstart', handler); }
    function animateCosmic() { if (!cosmicCtx) return; const w = backgroundCanvases.cosmic.width; const h = backgroundCanvases.cosmic.height; cosmicCtx.fillStyle = 'black'; cosmicCtx.fillRect(0,0,w,h); cosmicRipples.forEach((r, i) => { r.radius += r.speed; if(r.radius > r.maxRadius) cosmicRipples.splice(i, 1); }); cosmicCtx.fillStyle = 'white'; cosmicStars.forEach(s => { let sx = s.x * w; let sy = s.y * h; cosmicRipples.forEach(r => { const dx = sx-r.x; const dy = sy-r.y; const dist = Math.sqrt(dx*dx + dy*dy); if(dist < r.radius) { const angle = Math.atan2(dy, dx); const warp = (1 - dist/r.radius) * 20; sx += Math.cos(angle) * warp; sy += Math.sin(angle) * warp; } }); const size = s.z * 2; cosmicCtx.fillRect(sx, sy, size, size); }); cosmicAnimationId = requestAnimationFrame(animateCosmic); }
    function startCosmic() { if(cosmicAnimationId) return; if(!backgroundCanvases.cosmic) return; backgroundCanvases.cosmic.style.display = 'block'; setupCosmic(); animateCosmic(); }
    function stopCosmic() { if(!cosmicAnimationId) return; cancelAnimationFrame(cosmicAnimationId); cosmicAnimationId = null; if(backgroundCanvases.cosmic) backgroundCanvases.cosmic.style.display = 'none'; }
    function setupMusicViz() { if (!backgroundCanvases.musicviz) return; backgroundCanvases.musicviz.width = window.innerWidth; backgroundCanvases.musicviz.height = window.innerHeight; musicvizCtx = backgroundCanvases.musicviz.getContext('2d'); }
    function animateMusicViz() { if (!musicvizCtx || !analyser) return; const w = backgroundCanvases.musicviz.width; const h = backgroundCanvases.musicviz.height; musicvizCtx.fillStyle = 'rgba(0,0,10,0.1)'; musicvizCtx.fillRect(0,0,w,h); const values = analyser.getValue(); const barWidth = w / values.length; for(let i=0; i<values.length; i++) { const val = (values[i] + 140) * 2; const hue = i / values.length * 360; musicvizCtx.fillStyle = `hsla(${hue}, 100%, 50%, 0.5)`; musicvizCtx.fillRect(i*barWidth, h-val, barWidth, val); } musicvizAnimationId = requestAnimationFrame(animateMusicViz); }
    function startMusicViz() { if(musicvizAnimationId) return; if(!backgroundCanvases.musicviz) return; backgroundCanvases.musicviz.style.display = 'block'; setupMusicViz(); animateMusicViz(); }
    function stopMusicViz() { if(!musicvizAnimationId) return; cancelAnimationFrame(musicvizAnimationId); musicvizAnimationId = null; if(backgroundCanvases.musicviz) backgroundCanvases.musicviz.style.display = 'none'; }
    function setupBioForest() { if (!backgroundCanvases.bioforest) return; backgroundCanvases.bioforest.width = window.innerWidth; backgroundCanvases.bioforest.height = window.innerHeight; bioforestCtx = backgroundCanvases.bioforest.getContext('2d'); bioPlants = Array.from({length: 100}, () => ({x: Math.random() * backgroundCanvases.bioforest.width, y: Math.random() * backgroundCanvases.bioforest.height, size: Math.random() * 10 + 5, brightness: 0.1, hue: Math.random()*60 + 100})); const handler = (e) => { const rect = backgroundCanvases.bioforest.getBoundingClientRect(); mousePos.x = (e.clientX || e.touches[0].clientX) - rect.left; mousePos.y = (e.clientY || e.touches[0].clientY) - rect.top; }; backgroundCanvases.bioforest.addEventListener('mousemove', handler); backgroundCanvases.bioforest.addEventListener('touchmove', handler); }
    function animateBioForest() { if (!bioforestCtx) return; const w = backgroundCanvases.bioforest.width; const h = backgroundCanvases.bioforest.height; bioforestCtx.fillStyle = '#0a1a0a'; bioforestCtx.fillRect(0,0,w,h); bioPlants.forEach(p => { const dx = p.x - mousePos.x; const dy = p.y - mousePos.y; const dist = Math.sqrt(dx*dx + dy*dy); p.brightness = Math.max(0.1, 1 - dist/100); bioforestCtx.fillStyle = `hsla(${p.hue}, 80%, 50%, ${p.brightness})`; bioforestCtx.beginPath(); bioforestCtx.arc(p.x, p.y, p.size, 0, Math.PI*2); bioforestCtx.fill(); }); bioforestAnimationId = requestAnimationFrame(animateBioForest); }
    function startBioForest() { if(bioforestAnimationId) return; if(!backgroundCanvases.bioforest) return; backgroundCanvases.bioforest.style.display = 'block'; setupBioForest(); animateBioForest(); }
    function stopBioForest() { if(!bioforestAnimationId) return; cancelAnimationFrame(bioforestAnimationId); bioforestAnimationId = null; if(backgroundCanvases.bioforest) backgroundCanvases.bioforest.style.display = 'none'; }
    function setupWatery() { if (!backgroundCanvases.watery) return; backgroundCanvases.watery.width = window.innerWidth/4; backgroundCanvases.watery.height = window.innerHeight/4; wateryCtx = backgroundCanvases.watery.getContext('2d'); wateryRipples = []; const handler = (e) => { const rect = backgroundCanvases.watery.getBoundingClientRect(); const x = ((e.clientX || e.touches[0].clientX) - rect.left) / 4; const y = ((e.clientY || e.touches[0].clientY) - rect.top) / 4; wateryRipples.push({x, y, radius: 0, maxRadius: 50, speed: 1}); }; backgroundCanvases.watery.addEventListener('mousedown', handler); backgroundCanvases.watery.addEventListener('touchstart', handler); }
    function animateWatery() { if (!wateryCtx) return; const w = backgroundCanvases.watery.width; const h = backgroundCanvases.watery.height; wateryCtx.fillStyle = '#3498db'; wateryCtx.fillRect(0,0,w,h); wateryRipples.forEach((r,i) => { r.radius += r.speed; if(r.radius > r.maxRadius) wateryRipples.splice(i,1); wateryCtx.strokeStyle = `rgba(255,255,255, ${1 - r.radius/r.maxRadius})`; wateryCtx.lineWidth = 2; wateryCtx.beginPath(); wateryCtx.arc(r.x, r.y, r.radius, 0, Math.PI*2); wateryCtx.stroke(); }); wateryAnimationId = requestAnimationFrame(animateWatery); }
    function startWatery() { if(wateryAnimationId) return; if(!backgroundCanvases.watery) return; backgroundCanvases.watery.style.display = 'block'; setupWatery(); animateWatery(); }
    function stopWatery() { if(!wateryAnimationId) return; cancelAnimationFrame(wateryAnimationId); wateryAnimationId = null; if(backgroundCanvases.watery) backgroundCanvases.watery.style.display = 'none'; }
    function setupStainedGlass() { if (!backgroundCanvases.stainedglass) return; backgroundCanvases.stainedglass.width = window.innerWidth; backgroundCanvases.stainedglass.height = window.innerHeight; stainedglassCtx = backgroundCanvases.stainedglass.getContext('2d'); glassPanes = []; const cols = 20; const rows = 15; const paneWidth = backgroundCanvases.stainedglass.width / cols; const paneHeight = backgroundCanvases.stainedglass.height / rows; for (let i = 0; i < cols; i++) { for (let j = 0; j < rows; j++) { glassPanes.push({ x: i * paneWidth, y: j * paneHeight, width: paneWidth, height: paneHeight, hue: Math.random() * 360, brightness: 0.2 }); } } }
    function animateStainedGlass() { if (!stainedglassCtx) return; const w = backgroundCanvases.stainedglass.width; const h = backgroundCanvases.stainedglass.height; stainedglassCtx.fillStyle = 'black'; stainedglassCtx.fillRect(0, 0, w, h); glassPanes.forEach(p => { const dx = (p.x + p.width / 2) - mousePos.x; const dy = (p.y + p.height / 2) - mousePos.y; const dist = Math.sqrt(dx * dx + dy * dy); p.brightness = Math.max(0.2, 1 - dist / 300); stainedglassCtx.fillStyle = `hsl(${p.hue}, 80%, ${p.brightness * 50}%)`; stainedglassCtx.fillRect(p.x, p.y, p.width, p.height); stainedglassCtx.strokeStyle = 'black'; stainedglassCtx.lineWidth = 4; stainedglassCtx.strokeRect(p.x, p.y, p.width, p.height); }); stainedglassAnimationId = requestAnimationFrame(animateStainedGlass); }
    function startStainedGlass() { if (stainedglassAnimationId) return; if (!backgroundCanvases.stainedglass) return; backgroundCanvases.stainedglass.style.display = 'block'; setupStainedGlass(); animateStainedGlass(); }
    function stopStainedGlass() { if (!stainedglassAnimationId) return; cancelAnimationFrame(stainedglassAnimationId); stainedglassAnimationId = null; if (backgroundCanvases.stainedglass) backgroundCanvases.stainedglass.style.display = 'none'; }
    function setupSwarm() { if (!backgroundCanvases.swarm) return; backgroundCanvases.swarm.width = window.innerWidth; backgroundCanvases.swarm.height = window.innerHeight; swarmCtx = backgroundCanvases.swarm.getContext('2d'); swarmParticles = []; for (let i = 0; i < 200; i++) { swarmParticles.push({ x: Math.random() * backgroundCanvases.swarm.width, y: Math.random() * backgroundCanvases.swarm.height, size: Math.random() * 2 + 1, vx: 0, vy: 0 }); } }
    function animateSwarm() { if (!swarmCtx) return; const w = backgroundCanvases.swarm.width; const h = backgroundCanvases.swarm.height; swarmCtx.fillStyle = 'rgba(0,0,0,0.2)'; swarmCtx.fillRect(0, 0, w, h); swarmParticles.forEach(p => { const dx = p.x - mousePos.x; const dy = p.y - mousePos.y; const dist = Math.sqrt(dx * dx + dy * dy); const maxDist = 100; if (dist < maxDist) { const force = (maxDist - dist) / maxDist; p.vx += (dx / dist) * force * 0.5; p.vy += (dy / dist) * force * 0.5; } p.vx *= 0.95; p.vy *= 0.95; p.vx += (Math.random() - 0.5) * 0.1; p.vy += (Math.random() - 0.5) * 0.1; p.x += p.vx; p.y += p.vy; if (p.x > w || p.x < 0) p.vx *= -1; if (p.y > h || p.y < 0) p.vy *= -1; swarmCtx.fillStyle = 'white'; swarmCtx.fillRect(p.x, p.y, p.size, p.size); }); swarmAnimationId = requestAnimationFrame(animateSwarm); }
    function startSwarm() { if (swarmAnimationId) return; if (!backgroundCanvases.swarm) return; backgroundCanvases.swarm.style.display = 'block'; setupSwarm(); animateSwarm(); }
    function stopSwarm() { if (!swarmAnimationId) return; cancelAnimationFrame(swarmAnimationId); swarmAnimationId = null; if (backgroundCanvases.swarm) backgroundCanvases.swarm.style.display = 'none'; }
    function setupGlitch() { if (!backgroundCanvases.glitch) return; backgroundCanvases.glitch.width = window.innerWidth; backgroundCanvases.glitch.height = window.innerHeight; glitchCtx = backgroundCanvases.glitch.getContext('2d'); glitchCtx.fillStyle = 'black'; glitchCtx.fillRect(0,0,backgroundCanvases.glitch.width, backgroundCanvases.glitch.height); glitchCtx.font = "bold 15vw 'Courier New'"; glitchCtx.textAlign = 'center'; glitchCtx.textBaseline = 'middle'; glitchCtx.fillStyle = '#0f0'; glitchCtx.fillText('SOLITAIRE', backgroundCanvases.glitch.width/2, backgroundCanvases.glitch.height/2); glitchData = glitchCtx.getImageData(0,0,backgroundCanvases.glitch.width, backgroundCanvases.glitch.height); }
    function animateGlitch() { if (!glitchCtx) return; const w = backgroundCanvases.glitch.width; const h = backgroundCanvases.glitch.height; if (Math.random() > 0.9) { const tempImgData = new ImageData(new Uint8ClampedArray(glitchData.data), w, h); const data = tempImgData.data; const glitchAmount = Math.floor(mousePos.x / w * 50); for (let i = 0; i < 10; i++) { const y = Math.floor(Math.random() * h); const rowOffset = (Math.floor(Math.random() * glitchAmount) - glitchAmount / 2) * 4; const row = tempImgData.data.slice(y * w * 4, (y + 1) * w * 4); for (let x = 0; x < w * 4; x++) { data[y * w * 4 + x] = row[(x + rowOffset + w * 4) % (w * 4)]; } } glitchCtx.putImageData(tempImgData, 0, 0); } glitchAnimationId = requestAnimationFrame(animateGlitch); }
    function startGlitch() { if (glitchAnimationId) return; if (!backgroundCanvases.glitch) return; backgroundCanvases.glitch.style.display = 'block'; setupGlitch(); animateGlitch(); }
    function stopGlitch() { if (!glitchAnimationId) return; cancelAnimationFrame(glitchAnimationId); glitchAnimationId = null; if (backgroundCanvases.glitch) backgroundCanvases.glitch.style.display = 'none'; }
    function setupAurora() { if (!backgroundCanvases.aurora) return; backgroundCanvases.aurora.width = window.innerWidth; backgroundCanvases.aurora.height = window.innerHeight; auroraCtx = backgroundCanvases.aurora.getContext('2d'); auroraParticles = []; for (let i = 0; i < 3; i++) { for (let j = 0; j < 50; j++) { auroraParticles.push({ x: Math.random() * backgroundCanvases.aurora.width, y: Math.random() * backgroundCanvases.aurora.height, vx: 0, vy: 0, hue: 120 + i * 40, life: Math.random() * 100 }); } } }
    function animateAurora() { if (!auroraCtx) return; const w = backgroundCanvases.aurora.width; const h = backgroundCanvases.aurora.height; auroraCtx.globalCompositeOperation = 'source-over'; auroraCtx.fillStyle = 'rgba(0,0,10,0.1)'; auroraCtx.fillRect(0,0,w,h); auroraCtx.globalCompositeOperation = 'lighter'; auroraParticles.forEach(p => { const dx = p.x - mousePos.x; const dy = p.y - mousePos.y; const dist = Math.sqrt(dx*dx + dy*dy); const angle = Math.sin(p.x / 100) + Math.sin(p.y / 100) + Date.now() * 0.0001; p.vx += Math.cos(angle) * 0.1; p.vy += Math.sin(angle) * 0.1; if (dist < 150) { p.vx += (dx / dist) * (1 - dist / 150) * 0.5; p.vy += (dy / dist) * (1 - dist / 150) * 0.5; } p.vx *= 0.98; p.vy *= 0.98; p.x += p.vx; p.y += p.vy; p.life--; if (p.life <= 0 || p.x < 0 || p.x > w || p.y < 0 || p.y > h) { p.x = Math.random() * w; p.y = Math.random() * h; p.vx = 0; p.vy = 0; p.life = 100; } auroraCtx.fillStyle = `hsla(${p.hue}, 100%, 50%, ${p.life/100 * 0.1})`; auroraCtx.beginPath(); auroraCtx.arc(p.x, p.y, 2, 0, Math.PI*2); auroraCtx.fill(); }); auroraAnimationId = requestAnimationFrame(animateAurora); }
    function startAurora() { if (auroraAnimationId) return; if (!backgroundCanvases.aurora) return; backgroundCanvases.aurora.style.display = 'block'; setupAurora(); animateAurora(); }
    function stopAurora() { if (!auroraAnimationId) return; cancelAnimationFrame(auroraAnimationId); auroraAnimationId = null; if (backgroundCanvases.aurora) backgroundCanvases.aurora.style.display = 'none'; }
    function setupConstellation() { if (!backgroundCanvases.constellation) return; backgroundCanvases.constellation.width = window.innerWidth; backgroundCanvases.constellation.height = window.innerHeight; constellationCtx = backgroundCanvases.constellation.getContext('2d'); constellationStars = []; for (let i = 0; i < 200; i++) { constellationStars.push({ x: Math.random() * backgroundCanvases.constellation.width, y: Math.random() * backgroundCanvases.constellation.height, size: Math.random() * 2 + 1 }); } }
    function animateConstellation() { if (!constellationCtx) return; const w = backgroundCanvases.constellation.width; const h = backgroundCanvases.constellation.height; constellationCtx.fillStyle = 'black'; constellationCtx.fillRect(0,0,w,h); constellationStars.forEach(s1 => { const dx = s1.x - mousePos.x; const dy = s1.y - mousePos.y; const dist = Math.sqrt(dx*dx + dy*dy); const brightness = Math.max(0.2, 1 - dist / 200); constellationCtx.fillStyle = `rgba(255,255,255, ${brightness})`; constellationCtx.beginPath(); constellationCtx.arc(s1.x, s1.y, s1.size * brightness, 0, Math.PI*2); constellationCtx.fill(); constellationStars.forEach(s2 => { if (s1 === s2) return; const lineDist = Math.sqrt(Math.pow(s1.x - s2.x, 2) + Math.pow(s1.y - s2.y, 2)); if (lineDist < 100) { const lineOpacity = 1 - lineDist / 100; constellationCtx.strokeStyle = `rgba(255,255,255, ${lineOpacity * brightness * 0.5})`; constellationCtx.lineWidth = 0.5; constellationCtx.beginPath(); constellationCtx.moveTo(s1.x, s1.y); constellationCtx.lineTo(s2.x, s2.y); constellationCtx.stroke(); } }); }); constellationAnimationId = requestAnimationFrame(animateConstellation); }
    function startConstellation() { if (constellationAnimationId) return; if (!backgroundCanvases.constellation) return; backgroundCanvases.constellation.style.display = 'block'; setupConstellation(); animateConstellation(); }
    function stopConstellation() { if (!constellationAnimationId) return; cancelAnimationFrame(constellationAnimationId); constellationAnimationId = null; if (backgroundCanvases.constellation) backgroundCanvases.constellation.style.display = 'none'; }
    function setupSynthwave() { if (!backgroundCanvases.synthwave) return; backgroundCanvases.synthwave.width = window.innerWidth; backgroundCanvases.synthwave.height = window.innerHeight; synthwaveCtx = backgroundCanvases.synthwave.getContext('2d'); synthwaveTime = 0; }
    function animateSynthwave() { if (!synthwaveCtx) return; const w = backgroundCanvases.synthwave.width; const h = backgroundCanvases.synthwave.height; synthwaveTime += 0.01; synthwaveCtx.fillStyle = '#21003c'; synthwaveCtx.fillRect(0, 0, w, h); const sunGradient = synthwaveCtx.createRadialGradient(w / 2, h / 2, 50, w / 2, h / 2, 200); sunGradient.addColorStop(0, '#ffcc00'); sunGradient.addColorStop(1, 'rgba(255, 100, 0, 0)'); synthwaveCtx.fillStyle = sunGradient; synthwaveCtx.fillRect(0, 0, w, h); synthwaveCtx.strokeStyle = '#ff00ff'; synthwaveCtx.lineWidth = 2; for (let i = 0; i < 20; i++) { const y = h / 2 + i * i; const p = (y - h / 2) / (h / 2); synthwaveCtx.beginPath(); synthwaveCtx.moveTo(0, y); synthwaveCtx.lineTo(w, y); synthwaveCtx.stroke(); } for (let i = -20; i < 20; i++) { synthwaveCtx.beginPath(); synthwaveCtx.moveTo(w / 2, h / 2); synthwaveCtx.lineTo(w / 2 + Math.tan(p * 1.4 - 0.7) * w, h); synthwaveCtx.stroke(); } synthwaveAnimationId = requestAnimationFrame(animateSynthwave); }
    function startSynthwave() { if (synthwaveAnimationId) return; if (!backgroundCanvases.synthwave) return; backgroundCanvases.synthwave.style.display = 'block'; setupSynthwave(); animateSynthwave(); }
    function stopSynthwave() { if (!synthwaveAnimationId) return; cancelAnimationFrame(synthwaveAnimationId); synthwaveAnimationId = null; if (backgroundCanvases.synthwave) backgroundCanvases.synthwave.style.display = 'none'; }
    function setupNebula() { if (!backgroundCanvases.nebula) return; backgroundCanvases.nebula.width = window.innerWidth; backgroundCanvases.nebula.height = window.innerHeight; nebulaCtx = backgroundCanvases.nebula.getContext('2d'); nebulaParticles = []; for (let i = 0; i < 200; i++) { nebulaParticles.push({ x: Math.random() * backgroundCanvases.nebula.width, y: Math.random() * backgroundCanvases.nebula.height, size: Math.random() * 2, hue: Math.random() * 60 + 240 }); } }
    function animateNebula() { if (!nebulaCtx) return; const w = backgroundCanvases.nebula.width; const h = backgroundCanvases.nebula.height; nebulaCtx.globalCompositeOperation = 'source-over'; nebulaCtx.fillStyle = 'rgba(0, 0, 10, 0.1)'; nebulaCtx.fillRect(0, 0, w, h); nebulaCtx.globalCompositeOperation = 'lighter'; nebulaParticles.forEach(p => { p.x += (Math.random() - 0.5); p.y += (Math.random() - 0.5); if (p.x < 0 || p.x > w || p.y < 0 || p.y > h) { p.x = Math.random() * w; p.y = Math.random() * h; } const gradient = nebulaCtx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 20); gradient.addColorStop(0, `hsla(${p.hue}, 100%, 70%, 0.2)`); gradient.addColorStop(1, `hsla(${p.hue}, 100%, 70%, 0)`); nebulaCtx.fillStyle = gradient; nebulaCtx.fillRect(0, 0, w, h); }); nebulaAnimationId = requestAnimationFrame(animateNebula); }
    function startNebula() { if (nebulaAnimationId) return; if (!backgroundCanvases.nebula) return; backgroundCanvases.nebula.style.display = 'block'; setupNebula(); animateNebula(); }
    function stopNebula() { if (!nebulaAnimationId) return; cancelAnimationFrame(nebulaAnimationId); nebulaAnimationId = null; if (backgroundCanvases.nebula) backgroundCanvases.nebula.style.display = 'none'; }
    function setupJungle() { if (!backgroundCanvases.jungle) return; backgroundCanvases.jungle.width = window.innerWidth; backgroundCanvases.jungle.height = window.innerHeight; jungleCtx = backgroundCanvases.jungle.getContext('2d'); jungleVines = []; for (let i = 0; i < 20; i++) { jungleVines.push({ x: Math.random() * backgroundCanvases.jungle.width, len: Math.random() * 200 + 100, angle: 0 }); } }
    function animateJungle() { if (!jungleCtx) return; const w = backgroundCanvases.jungle.width; const h = backgroundCanvases.jungle.height; jungleCtx.fillStyle = '#0c2e12'; jungleCtx.fillRect(0, 0, w, h); jungleVines.forEach(v => { v.angle += 0.01; jungleCtx.strokeStyle = '#3a5f0b'; jungleCtx.lineWidth = 5; jungleCtx.beginPath(); jungleCtx.moveTo(v.x, 0); jungleCtx.quadraticCurveTo(v.x + Math.sin(v.angle) * 50, v.len / 2, v.x, v.len); jungleCtx.stroke(); }); jungleAnimationId = requestAnimationFrame(animateJungle); }
    function startJungle() { if (jungleAnimationId) return; if (!backgroundCanvases.jungle) return; backgroundCanvases.jungle.style.display = 'block'; setupJungle(); animateJungle(); }
    function stopJungle() { if (!jungleAnimationId) return; cancelAnimationFrame(jungleAnimationId); jungleAnimationId = null; if (backgroundCanvases.jungle) backgroundCanvases.jungle.style.display = 'none'; }
    function setupCityscape() { if (!backgroundCanvases.cityscape) return; backgroundCanvases.cityscape.width = window.innerWidth; backgroundCanvases.cityscape.height = window.innerHeight; cityscapeCtx = backgroundCanvases.cityscape.getContext('2d'); cityscapeWindows = []; for (let i = 0; i < 300; i++) { cityscapeWindows.push({ x: Math.random() * backgroundCanvases.cityscape.width, y: Math.random() * backgroundCanvases.cityscape.height, on: Math.random() > 0.8 }); } }
    function animateCityscape() { if (!cityscapeCtx) return; const w = backgroundCanvases.cityscape.width; const h = backgroundCanvases.cityscape.height; cityscapeCtx.fillStyle = '#0a0a1a'; cityscapeCtx.fillRect(0, 0, w, h); cityscapeWindows.forEach(win => { if (Math.random() > 0.995) win.on = !win.on; if (win.on) { cityscapeCtx.fillStyle = '#ffffaa'; cityscapeCtx.fillRect(win.x, win.y, 4, 6); } }); cityscapeAnimationId = requestAnimationFrame(animateCityscape); }
    function startCityscape() { if (cityscapeAnimationId) return; if (!backgroundCanvases.cityscape) return; backgroundCanvases.cityscape.style.display = 'block'; setupCityscape(); animateCityscape(); }
    function stopCityscape() { if (!cityscapeAnimationId) return; cancelAnimationFrame(cityscapeAnimationId); cityscapeAnimationId = null; if (backgroundCanvases.cityscape) backgroundCanvases.cityscape.style.display = 'none'; }
    function setupPaint() { if (!backgroundCanvases.paint) return; backgroundCanvases.paint.width = window.innerWidth; backgroundCanvases.paint.height = window.innerHeight; paintCtx = backgroundCanvases.paint.getContext('2d'); paintBlobs = []; for (let i = 0; i < 15; i++) { paintBlobs.push({ x: Math.random() * backgroundCanvases.paint.width, y: Math.random() * backgroundCanvases.paint.height, vx: (Math.random() - 0.5), vy: (Math.random() - 0.5), radius: Math.random() * 100 + 50, hue: Math.random() * 360 }); } }
    function animatePaint() { if (!paintCtx) return; const w = backgroundCanvases.paint.width; const h = backgroundCanvases.paint.height; paintCtx.globalCompositeOperation = 'source-over'; paintCtx.fillStyle = 'rgba(255, 255, 255, 0.05)'; paintCtx.fillRect(0, 0, w, h); paintCtx.globalCompositeOperation = 'lighter'; paintBlobs.forEach(b => { b.x += b.vx; b.y += b.vy; if (b.x < 0 || b.x > w) b.vx *= -1; if (b.y < 0 || b.y > h) b.vy *= -1; paintCtx.fillStyle = `hsla(${b.hue}, 100%, 50%, 0.05)`; paintCtx.beginPath(); paintCtx.arc(b.x, b.y, b.radius, 0, Math.PI * 2); paintCtx.fill(); }); paintAnimationId = requestAnimationFrame(animatePaint); }
    function startPaint() { if (paintAnimationId) return; if (!backgroundCanvases.paint) return; backgroundCanvases.paint.style.display = 'block'; setupPaint(); animatePaint(); }
    function stopPaint() { if (!paintAnimationId) return; cancelAnimationFrame(paintAnimationId); paintAnimationId = null; if (backgroundCanvases.paint) backgroundCanvases.paint.style.display = 'none'; }
    function setupLaserGrid() { if (!backgroundCanvases.laserGrid) return; backgroundCanvases.laserGrid.width = window.innerWidth; backgroundCanvases.laserGrid.height = window.innerHeight; laserGridCtx = backgroundCanvases.laserGrid.getContext('2d'); laserGridTime = 0; }
    function animateLaserGrid() { if (!laserGridCtx) return; const w = backgroundCanvases.laserGrid.width; const h = backgroundCanvases.laserGrid.height; laserGridTime += 0.02; laserGridCtx.fillStyle = '#00001a'; laserGridCtx.fillRect(0, 0, w, h); const horizon = h / 2.2; for(let i = 0; i < 40; i++) { const p = 1 - (i / 40); laserGridCtx.strokeStyle = `rgba(255, 0, 255, ${p * 0.5})`; laserGridCtx.lineWidth = p * 2; laserGridCtx.beginPath(); const y = horizon + Math.pow(i, 1.8); laserGridCtx.moveTo(0, y); laserGridCtx.lineTo(w, y); laserGridCtx.stroke(); } laserGridCtx.strokeStyle = '#00ffff'; for (let i = 0; i < 40; i++) { const p = i / 40; laserGridCtx.beginPath(); laserGridCtx.moveTo(w / 2, horizon); laserGridCtx.lineTo(w / 2 + Math.tan(p * 1.4 - 0.7) * w, h); laserGridCtx.stroke(); } laserGridAnimationId = requestAnimationFrame(animateLaserGrid); }
    function startLaserGrid() { if (laserGridAnimationId) return; if (!backgroundCanvases.laserGrid) return; backgroundCanvases.laserGrid.style.display = 'block'; setupLaserGrid(); animateLaserGrid(); }
    function stopLaserGrid() { if (!laserGridAnimationId) return; cancelAnimationFrame(laserGridAnimationId); laserGridAnimationId = null; if (backgroundCanvases.laserGrid) backgroundCanvases.laserGrid.style.display = 'none'; }
    function setupNeonPalms() { if (!backgroundCanvases.neonPalms) return; backgroundCanvases.neonPalms.width = window.innerWidth; backgroundCanvases.neonPalms.height = window.innerHeight; neonPalmsCtx = backgroundCanvases.neonPalms.getContext('2d'); neonPalmsTime = 0; }
    function animateNeonPalms() { if (!neonPalmsCtx) return; const w = backgroundCanvases.neonPalms.width; const h = backgroundCanvases.neonPalms.height; neonPalmsTime += 0.01; const bgGrad = neonPalmsCtx.createLinearGradient(0, 0, 0, h); bgGrad.addColorStop(0, '#10002b'); bgGrad.addColorStop(0.5, '#2c003e'); bgGrad.addColorStop(1, '#ff00ff'); neonPalmsCtx.fillStyle = bgGrad; neonPalmsCtx.fillRect(0, 0, w, h); neonPalmsCtx.strokeStyle = '#00ffff'; neonPalmsCtx.lineWidth = 3; [-w * 0.1, w * 0.6].forEach(baseX => { neonPalmsCtx.beginPath(); neonPalmsCtx.moveTo(baseX, h); for(let i = 0; i < 80; i++) { neonPalmsCtx.lineTo(baseX + i, h - i * 1.5); } neonPalmsCtx.stroke(); for(let i = 0; i < 8; i++) { const angle = (i/7) * Math.PI - (Math.PI / 14) + Math.sin(neonPalmsTime + baseX) * 0.1; const len = 100 + i % 2 * 20; neonPalmsCtx.beginPath(); neonPalmsCtx.moveTo(baseX + 79, h - 118.5); neonPalmsCtx.quadraticCurveTo(baseX + 79 + Math.cos(angle) * len * 0.5, h - 118.5 - Math.sin(angle) * len * 0.5, baseX + 79 + Math.cos(angle) * len, h - 118.5 - Math.sin(angle) * len); neonPalmsCtx.stroke(); } }); neonPalmsAnimationId = requestAnimationFrame(animateNeonPalms); }
    function startNeonPalms() { if (neonPalmsAnimationId) return; if (!backgroundCanvases.neonPalms) return; backgroundCanvases.neonPalms.style.display = 'block'; setupNeonPalms(); animateNeonPalms(); }
    function stopNeonPalms() { if (!neonPalmsAnimationId) return; cancelAnimationFrame(neonPalmsAnimationId); neonPalmsAnimationId = null; if (backgroundCanvases.neonPalms) backgroundCanvases.neonPalms.style.display = 'none'; }
    function setupMemphis() { if (!backgroundCanvases.memphis) return; backgroundCanvases.memphis.width = window.innerWidth; backgroundCanvases.memphis.height = window.innerHeight; memphisCtx = backgroundCanvases.memphis.getContext('2d'); memphisShapes = []; const colors = ['#ffc107', '#00bcd4', '#e91e63', '#4caf50', '#3f51b5']; for (let i = 0; i < 50; i++) { memphisShapes.push({ type: ['circle', 'rect', 'triangle', 'squiggle'][Math.floor(Math.random() * 4)], x: Math.random() * backgroundCanvases.memphis.width, y: Math.random() * backgroundCanvases.memphis.height, size: Math.random() * 50 + 20, color: colors[Math.floor(Math.random() * colors.length)], angle: Math.random() * Math.PI * 2, speed: (Math.random() - 0.5) * 0.01 }); } }
    function animateMemphis() { if (!memphisCtx) return; const w = backgroundCanvases.memphis.width; const h = backgroundCanvases.memphis.height; memphisCtx.fillStyle = '#f0f0f0'; memphisCtx.fillRect(0, 0, w, h); memphisShapes.forEach(s => { s.angle += s.speed; memphisCtx.fillStyle = s.color; memphisCtx.save(); memphisCtx.translate(s.x, s.y); memphisCtx.rotate(s.angle); if (s.type === 'rect') { memphisCtx.fillRect(-s.size / 2, -s.size / 2, s.size, s.size); } else if (s.type === 'circle') { memphisCtx.beginPath(); memphisCtx.arc(0, 0, s.size / 2, 0, Math.PI * 2); memphisCtx.fill(); } else if (s.type === 'triangle') { memphisCtx.beginPath(); memphisCtx.moveTo(0, -s.size / 2); memphisCtx.lineTo(-s.size / 2, s.size / 2); memphisCtx.lineTo(s.size / 2, s.size / 2); memphisCtx.closePath(); memphisCtx.fill(); } else if (s.type === 'squiggle') { memphisCtx.strokeStyle = s.color; memphisCtx.lineWidth = s.size/5; memphisCtx.beginPath(); memphisCtx.moveTo(-s.size/2, 0); memphisCtx.quadraticCurveTo(0, -s.size/2, 0, 0); memphisCtx.quadraticCurveTo(0, s.size/2, s.size/2, 0); memphisCtx.stroke(); } memphisCtx.restore(); }); memphisAnimationId = requestAnimationFrame(animateMemphis); }
    function startMemphis() { if (memphisAnimationId) return; if (!backgroundCanvases.memphis) return; backgroundCanvases.memphis.style.display = 'block'; setupMemphis(); animateMemphis(); }
    function stopMemphis() { if (!memphisAnimationId) return; cancelAnimationFrame(memphisAnimationId); memphisAnimationId = null; if (backgroundCanvases.memphis) backgroundCanvases.memphis.style.display = 'none'; }
    function setupCassette() { if (!backgroundCanvases.cassette) return; backgroundCanvases.cassette.width = window.innerWidth; backgroundCanvases.cassette.height = window.innerHeight; cassetteCtx = backgroundCanvases.cassette.getContext('2d'); cassetteTime = 0; }
    function animateCassette() { if (!cassetteCtx) return; const w = backgroundCanvases.cassette.width; const h = backgroundCanvases.cassette.height; cassetteTime += 0.1; cassetteCtx.fillStyle = '#444'; cassetteCtx.fillRect(0, 0, w, h); cassetteCtx.save(); cassetteCtx.translate(w / 2, h / 2); cassetteCtx.fillStyle = '#aaa'; cassetteCtx.fillRect(-150, -90, 300, 180); cassetteCtx.fillStyle = '#222'; cassetteCtx.fillRect(-140, -80, 280, 160); cassetteCtx.fillStyle = '#fff'; cassetteCtx.fillRect(-130, -70, 260, 50); cassetteCtx.fillStyle = '#222'; for (let i = 0; i < 2; i++) { const x = -75 + i * 150; cassetteCtx.beginPath(); cassetteCtx.arc(x, 20, 30, 0, Math.PI * 2); cassetteCtx.fill(); cassetteCtx.save(); cassetteCtx.translate(x, 20); cassetteCtx.rotate(cassetteTime); cassetteCtx.fillStyle = '#444'; for (let j = 0; j < 6; j++) { cassetteCtx.fillRect(-5, -25, 10, 50); cassetteCtx.rotate(Math.PI / 3); } cassetteCtx.restore(); } cassetteCtx.restore(); cassetteAnimationId = requestAnimationFrame(animateCassette); }
    function startCassette() { if (cassetteAnimationId) return; if (!backgroundCanvases.cassette) return; backgroundCanvases.cassette.style.display = 'block'; setupCassette(); animateCassette(); }
    function stopCassette() { if (!cassetteAnimationId) return; cancelAnimationFrame(cassetteAnimationId); cassetteAnimationId = null; if (backgroundCanvases.cassette) backgroundCanvases.cassette.style.display = 'none'; }
    function setupEightBitCity() { if (!backgroundCanvases.eightBitCity) return; const w = backgroundCanvases.eightBitCity.width = window.innerWidth; const h = backgroundCanvases.eightBitCity.height = window.innerHeight; eightBitCityCtx = backgroundCanvases.eightBitCity.getContext('2d'); eightBitCityBuildings = []; const bw = 40; for (let i = 0; i < w/bw; i++) { eightBitCityBuildings.push({ x: i * bw, h: Math.random() * (h * 0.6) + h * 0.1 }); } }
    function animateEightBitCity() { if (!eightBitCityCtx) return; const w = backgroundCanvases.eightBitCity.width; const h = backgroundCanvases.eightBitCity.height; eightBitCityCtx.fillStyle = '#000022'; eightBitCityCtx.fillRect(0, 0, w, h); eightBitCityBuildings.forEach(b => { eightBitCityCtx.fillStyle = '#222'; eightBitCityCtx.fillRect(b.x, h - b.h, 40, b.h); if (Math.random() > 0.7) { eightBitCityCtx.fillStyle = '#ffff00'; eightBitCityCtx.fillRect(b.x + Math.floor(Math.random() * 7) * 4 + 4, h - b.h + Math.floor(Math.random() * (b.h / 6)) * 6, 2, 4); } }); eightBitCityAnimationId = requestAnimationFrame(animateEightBitCity); }
    function startEightBitCity() { if (eightBitCityAnimationId) return; if (!backgroundCanvases.eightBitCity) return; backgroundCanvases.eightBitCity.style.display = 'block'; setupEightBitCity(); animateEightBitCity(); }
    function stopEightBitCity() { if (!eightBitCityAnimationId) return; cancelAnimationFrame(eightBitCityAnimationId); eightBitCityAnimationId = null; if (backgroundCanvases.eightBitCity) backgroundCanvases.eightBitCity.style.display = 'none'; }

    function updateCardStyles() {
        dom.gameBoard.dataset.backStyle = selectedBack;
        dom.gameBoard.dataset.faceStyle = faceStyle;

        BOARD_DATA.forEach(board => {
            if (board.stop) board.stop();
        });
        document.body.style.backgroundImage = 'none';
        
        const boardToStart = BOARD_DATA.find(b => b.id === selectedBoard);
        if (boardToStart && boardToStart.start) {
            boardToStart.start();
            document.body.style.backgroundColor = 'transparent';
        } else {
             const boardIndex = BOARD_DATA.findIndex(b => b.id === selectedBoard);
             if (boardIndex > -1) {
                 const color = `hsl(${boardIndex * 7.2}, 50%, 20%)`;
                 document.body.style.backgroundColor = color;
                 document.body.style.backgroundImage = `linear-gradient(45deg, rgba(0,0,0,0.1) 25%, transparent 25%), linear-gradient(-45deg, rgba(0,0,0,0.1) 25%, transparent 25%)`;
             }
        }
        
        const styleSheet = document.styleSheets[0];
        CARD_BACKS.forEach((back) => {
            if (back.type === 'procedural') {
                const i = parseInt(back.id.split('-')[1]);
                const color1 = `hsl(${i * 7.2}, 70%, 50%)`;
                const color2 = `hsl(${(i * 7.2 + 40)}, 70%, 50%)`;
                try {
                    const rule = `[data-back-style="${back.id}"] .face-down { background: linear-gradient(45deg, ${color1}, ${color2}); }`;
                    let ruleExists = false;
                    for(let i = 0; i < styleSheet.cssRules.length; i++) {
                        if(styleSheet.cssRules[i].selectorText === `[data-back-style="${back.id}"] .face-down`) {
                            ruleExists = true;
                            break;
                        }
                    }
                    if(!ruleExists) styleSheet.insertRule(rule, styleSheet.cssRules.length);

                } catch(e) { /* Ignore */ }
            }
        });
        
        populateOptions();
    }
    
    function populateOptions() {
        dom.cardBackSelector.innerHTML = '';
        SHUFFLED_CARD_BACKS.forEach((back) => {
            const option = document.createElement('div');
            option.className = 'options-grid-item';
            option.dataset.backStyle = back.id;
            
            if (unlockedBacks.includes(back.id)) {
                if (back.id === selectedBack) option.classList.add('selected');
                option.addEventListener('click', () => {
                    selectedBack = back.id;
                    if(sounds) sounds.click.triggerAttackRelease("C3", "8n");
                    updateCardStyles();
                    saveProgress();
                });
            } else {
                option.classList.add('locked');
            }
            dom.cardBackSelector.appendChild(option);
        });

        document.querySelectorAll('#card-back-selector .options-grid-item').forEach(el => {
            const backId = el.dataset.backStyle;
            const backData = CARD_BACKS.find(b => b.id === backId);
            if (backData && backData.type === 'procedural') {
                const i = parseInt(backId.split('-')[1]);
                const color1 = `hsl(${i * 7.2}, 70%, 50%)`;
                const color2 = `hsl(${(i * 7.2 + 40)}, 70%, 50%)`;
                el.style.background = `linear-gradient(45deg, ${color1}, ${color2})`;
            }
        });

        dom.boardSelector.innerHTML = '';
        BOARD_DATA.forEach((boardData) => {
            const option = document.createElement('div');
            option.className = 'options-grid-item';
            option.dataset.tempBoard = boardData.id;
            if (unlockedBoards.includes(boardData.id)) {
                if (boardData.id === selectedBoard) option.classList.add('selected');
                option.addEventListener('click', () => {
                    if (boardData.id === 'board-0') {
                        devUnlockCounter++;
                        if (devUnlockCounter >= 8) {
                            unlockEverything();
                            devUnlockCounter = 0;
                        }
                    } else {
                        devUnlockCounter = 0;
                    }

                    selectedBoard = boardData.id;
                    if(sounds) sounds.click.triggerAttackRelease("C3", "8n");
                    updateCardStyles();
                    saveProgress();
                });
            } else {
                option.classList.add('locked');
            }
            dom.boardSelector.appendChild(option);
        });
        
        document.querySelectorAll('[data-temp-board]').forEach(el => {
            const boardId = el.dataset.tempBoard;
            const i = BOARD_DATA.findIndex(b => b.id === boardId);
            const previews = {
                'board-1': { bg: 'linear-gradient(45deg, #3a1c71, #d76d77, #ffaf7b)', icon: '💧' },
                'board-2': { bg: 'black', icon: '✨' },
                'board-3': { bg: '#001f3f', icon: '🌊' },
                'board-4': { bg: 'black', icon: 'ア', color: '#0F0' },
                'board-5': { bg: '#14141e', icon: '🌀' },
                'board-6': { bg: 'black', icon: '🔥' },
                'board-7': { bg: '#001428', icon: '💧' },
                'board-8': { bg: 'black', icon: '🚀' },
                'board-9': { bg: 'linear-gradient(45deg, #ff00ff, #00ffff)', icon: '🌈' },
                'board-10': { bg: 'linear-gradient(#2a4a2a, #0a1a0a)', icon: '🌲' },
                'board-11': { bg: 'black', icon: '🌐', color: '#0FF' },
                'board-12': { bg: '#FFC0CB', icon: '🌸', color: '#FFF' },
                'board-13': { bg: '#111', icon: '✨', color: '#AAA' },
                'board-14': { bg: 'black', icon: '♦', color: '#0FF' },
                'board-15': { bg: 'hsl(40, 50%, 70%)', icon: '🏜️' },
                'board-16': { bg: '#F5EEDC', icon: '✒️', color: 'black' },
                'board-17': { bg: 'black', icon: '💫' },
                'board-18': { bg: 'black', icon: '🎵', color: 'magenta' },
                'board-19': { bg: '#0a1a0a', icon: '🍄', color: 'cyan' },
                'board-20': { bg: 'black', icon: '💎', color: 'white' },
                'board-21': { bg: '#3498db', icon: '💧' },
                'board-22': { bg: 'black', icon: '✨' },
                'board-23': { bg: 'black', icon: ' glitch ' , color: '#f0f'},
                'board-24': { bg: '#111', icon: '🌌' },
                'board-25': { bg: 'black', icon: '⭐' },
                'board-26': { bg: '#21003c', icon: '🌇', color: '#ff00ff' },
                'board-27': { bg: '#000010', icon: '☄️' },
                'board-28': { bg: '#0c2e12', icon: '🌿', color: '#3a5f0b' },
                'board-29': { bg: '#0a0a1a', icon: '🏙️', color: '#ffffaa' },
                'board-30': { bg: '#f0f0f0', icon: '🎨' },
                'board-31': { bg: '#00001a', icon: '🏁', color: '#ff00ff' },
                'board-32': { bg: '#10002b', icon: '🌴', color: '#00ffff' },
                'board-33': { bg: '#f0f0f0', icon: '🎉', color: '#e91e63' },
                'board-34': { bg: '#444', icon: '📼', color: '#fff' },
                'board-35': { bg: '#000022', icon: '💾', color: '#ffff00' },
            };
            if (previews[boardId]) {
                el.style.background = previews[boardId].bg;
                el.style.backgroundImage = 'none';
                el.innerHTML = `<span style="font-size: 40px; line-height: 140px; text-align: center; display: block; color: ${previews[boardId].color || 'white'};">${previews[boardId].icon}</span>`;
            } else {
                const color = `hsl(${i * 7.2}, 50%, 20%)`;
                el.style.backgroundColor = color;
                el.style.backgroundImage = `linear-gradient(45deg, rgba(0,0,0,0.1) 25%, transparent 25%), linear-gradient(-45deg, rgba(0,0,0,0.1) 25%, transparent 25%)`;
                el.innerHTML = '';
            }
        });

        dom.musicSelector.innerHTML = '';
        MUSIC_DATA.forEach((trackData) => {
            const option = document.createElement('div');
            option.className = 'options-grid-item';
            option.style.cssText = `display: flex; align-items: center; justify-content: center; flex-direction: column; font-size: 12px; padding: 10px; box-sizing: border-box; text-align: center; background-color: #333; color: white;`;

            if (unlockedTracks.includes(trackData.id)) {
                option.innerHTML = `<span style="font-size: 40px;">🎵</span><span>${trackData.name}</span>`;
                option.title = `Unlocked: ${trackData.name}`;
            } else {
                option.classList.add('locked');
                option.innerHTML = `<span>${trackData.name}</span>`;
                option.title = 'Locked';
            }
            dom.musicSelector.appendChild(option);
        });
    }

    // --- Core Game Logic (Continued) ---
    function createDeck() { return SUITS.flatMap(suit => VALUES.map((value, index) => ({ suit, value, rank: index + 1, color: (suit === '♥' || suit === '♦') ? 'red' : 'black', isFaceUp: false, id: `${value}-${suit}` }))); }
    function shuffleDeck(deck) { for (let i = deck.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [deck[i], deck[j]] = [deck[j], deck[i]]; } }
    function dealCards(deck) { for (let i = 0; i < 7; i++) { for (let j = i; j < 7; j++) tableau[j].push(deck.pop()); } tableau.forEach(pile => { if (pile.length > 0) pile[pile.length - 1].isFaceUp = true; }); stock = deck; }
    
    function render() {
        if (isGameWon) return;
        renderStockAndWaste();
        renderFoundations();
        renderTableau();
        checkWinCondition();
        checkAutocomplete();
    }

    function renderStockAndWaste() {
        dom.stockPileEl.innerHTML = '';
        dom.wastePileEl.innerHTML = '';
        if (stock.length > 0) dom.stockPileEl.appendChild(createCardElement(stock[stock.length - 1]));
        if (waste.length > 0) {
            const showCount = drawCount === 1 ? 1 : 3;
            const cardsToShow = waste.slice(-showCount);
            cardsToShow.forEach((card, i) => {
                card.isFaceUp = true;
                const isTop = i === cardsToShow.length - 1;
                const cardEl = createCardElement(card, isTop);
                cardEl.style.left = `${i * 20}px`;
                cardEl.style.zIndex = i;
                if (!isTop) cardEl.style.pointerEvents = 'none';
                dom.wastePileEl.appendChild(cardEl);
            });
        }
    }

    function renderFoundations() {
        dom.foundationEls.forEach((foundationEl, index) => {
            foundationEl.innerHTML = '';
            const pile = foundations[index];
            if (pile.length > 0) {
                foundationEl.appendChild(createCardElement(pile[pile.length - 1], true));
            }
        });
    }
    
    function renderTableau() {
        dom.tableauEls.forEach((tableauEl, pileIndex) => {
            tableauEl.innerHTML = '';
            const pile = tableau[pileIndex];
            if (pile.length === 0) {
                const placeholder = document.createElement('div');
                placeholder.className = 'pile';
                placeholder.style.position = 'static';
                tableauEl.appendChild(placeholder);
                tableauEl.style.minHeight = `var(--card-height)`;
            } else {
                pile.forEach((card, cardIndex) => {
                    const isTop = cardIndex === pile.length - 1;
                    const cardEl = createCardElement(card, isTop);
                    cardEl.style.top = `${cardIndex * CARD_OVERLAP}px`;
                    tableauEl.appendChild(cardEl);
                });
                const cardHeight = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--card-height'));
                const newHeight = cardHeight + (pile.length > 1 ? (pile.length - 1) * CARD_OVERLAP : 0);
                tableauEl.style.minHeight = `${newHeight}px`;
            }
        });
    }
    
    function createCardElement(card, isTopCard = false) {
        const cardEl = document.createElement('div');
        cardEl.className = `card ${card.color}`;
        if (isTopCard) cardEl.classList.add('is-top-card');
        cardEl.dataset.cardId = card.id;
        if (card.isFaceUp) {
            cardEl.innerHTML = `<div class="card-value top">${card.value}${card.suit}</div><div class="card-center-suit">${card.suit}<div class="card-center-value">${card.value}</div></div><div class="card-value bottom">${card.value}${card.suit}</div>`;
        } else {
            cardEl.classList.add('face-down');
        }
        return cardEl;
    }

    function createDragProxy(cards) {
        if (dragProxyEl) {
            dragProxyEl.remove();
        }
        dragProxyEl = document.createElement('div');
        dragProxyEl.style.position = 'fixed';
        dragProxyEl.style.pointerEvents = 'none';
        dragProxyEl.style.zIndex = '2000';
        dragProxyEl.style.transform = 'scale(1.05)';

        cards.forEach((card, i) => {
            const cardEl = createCardElement(card, i === cards.length - 1);
            cardEl.style.position = 'absolute';
            cardEl.style.top = `${i * CARD_OVERLAP}px`;
            cardEl.style.left = '0';
            dragProxyEl.appendChild(cardEl);
        });

        document.body.appendChild(dragProxyEl);
    }

    function startDrag(clientX, clientY, targetCardEl) {
        const cardId = targetCardEl.dataset.cardId;
        const loc = findCardLocation(cardId);
        if (!loc.pileName || (loc.pileName === 'waste' && loc.cardIndex !== waste.length - 1)) return false;

        isDragging = true;
        
        const cardsToDrag = loc.pileName === 'tableau' ? tableau[loc.pileIndex].slice(loc.cardIndex) : [findCard(cardId)];
        draggedCardInfo = { cardId, sourcePileName: loc.pileName, sourcePileIndex: loc.pileIndex, sourceCardIndex: loc.cardIndex, draggedCards: cardsToDrag };

        const topCardOfStackEl = document.querySelector(`[data-card-id="${cardsToDrag[0].id}"]`);
        const topCardRect = topCardOfStackEl.getBoundingClientRect();

        offsetX = clientX - topCardRect.left;
        offsetY = clientY - topCardRect.top;

        createDragProxy(cardsToDrag);
        moveDrag(clientX, clientY);

        cardsToDrag.forEach(c => {
            const el = document.querySelector(`[data-card-id="${c.id}"]`);
            if (el) el.style.opacity = '0.4';
        });
        return true;
    }

    function moveDrag(clientX, clientY) {
        if (!isDragging || !dragProxyEl) return;
        dragProxyEl.style.left = `${clientX - offsetX}px`;
        dragProxyEl.style.top = `${clientY - offsetY}px`;
    }

    function endDrag(clientX, clientY) {
        if (!isDragging || !draggedCardInfo) {
            isDragging = false;
            draggedCardInfo = null;
            return;
        }
        
        isDragging = false;

        draggedCardInfo.draggedCards.forEach(c => {
            const el = document.querySelector(`[data-card-id="${c.id}"]`);
            if (el) el.style.opacity = '1';
        });

        let dropTargetEl = null;
        if (dragProxyEl) {
            dragProxyEl.style.display = 'none';
            dropTargetEl = document.elementFromPoint(clientX, clientY);
            dragProxyEl.remove();
            dragProxyEl = null;
        } else {
            dropTargetEl = document.elementFromPoint(clientX, clientY);
        }
        
        let moveSuccessful = false;
        const draggedCard = draggedCardInfo.draggedCards[0];
        const isAce = draggedCard.rank === 1;
        const isFoundationAreaDrop = dropTargetEl && dropTargetEl.closest('.foundation-area');

        if (isAce && isFoundationAreaDrop) {
            for (let i = 0; i < foundations.length; i++) {
                if (isValidFoundationMove(draggedCard, i)) {
                    moveSuccessful = handleMove('foundation', i);
                    break;
                }
            }
        } else {
            const targetTableauEl = dropTargetEl ? dropTargetEl.closest('.tableau-pile') : null;
            const targetFoundationEl = dropTargetEl ? dropTargetEl.closest('.foundation-area .pile') : null;

            let targetPileName, targetPileIndex;

            if (targetFoundationEl) {
                targetPileName = 'foundation';
                targetPileIndex = parseInt(targetFoundationEl.id.split('-')[1]);
            } else if (targetTableauEl) {
                targetPileName = 'tableau';
                targetPileIndex = parseInt(targetTableauEl.id.split('-')[1]);
            }

            if (targetPileName !== undefined) {
                const { sourcePileName, sourcePileIndex } = draggedCardInfo;
                if (targetPileName !== sourcePileName || targetPileIndex !== sourcePileIndex) {
                     moveSuccessful = handleMove(targetPileName, targetPileIndex);
                } else {
                    moveSuccessful = true;
                }
            }
        }

        if (!moveSuccessful && draggedCardInfo) {
            if(sounds) sounds.error.triggerAttackRelease("G2", "8n");
        }

        draggedCardInfo = null;
        render();
    }
    
    async function handleDoubleClick(target) {
        if (playerLevel < 2) {
            dom.messageBox.textContent = 'Unlock Auto-Move at Level 2!';
            setTimeout(() => dom.messageBox.textContent = '', 2000);
            return;
        }

        const cardEl = target.closest('.card');
        if (!cardEl || cardEl.classList.contains('face-down')) return;

        const cardId = cardEl.dataset.cardId;
        const loc = findCardLocation(cardId);
        if (!loc.pileName) return;

        const cardToMove = findCard(cardId);
        if (!cardToMove) return;

        const isTopCard = (loc.pileName === 'waste' && loc.cardIndex === waste.length - 1) ||
                              (loc.pileName === 'tableau' && loc.cardIndex === tableau[loc.pileIndex].length - 1);

        if (isTopCard) {
            for (let i = 0; i < foundations.length; i++) {
                if (isValidFoundationMove(cardToMove, i)) {
                    saveState();
                    triggerAchievement('firstMove');
                    const targetId = dom.foundationEls[i].id;
                    const moveFn = () => {
                        moveCards(loc.pileName, loc.pileIndex, 'foundation', i, 1);
                        flipSourceTableauCard(loc.pileName, loc.pileIndex);
                        addXP(1, "+1 XP");
                        checkAceBonus();
                        triggerAchievement('firstFoundation');
                        handleCombo();
                    };
                    if(sounds) sounds.foundationPlace.triggerAttackRelease("C5", "8n");
                    await animateAndMoveCard(cardEl, targetId, moveFn);
                    return;
                }
            }
        }
        
        const cardsToMove = (loc.pileName === 'tableau') ? tableau[loc.pileIndex].slice(loc.cardIndex) : [cardToMove];
        
        if (cardsToMove[0].rank === 13) {
            for (let i = 0; i < tableau.length; i++) {
                if (tableau[i].length === 0) {
                    saveState();
                    triggerAchievement('firstMove');
                    triggerAchievement('kingMe');
                    const targetId = dom.tableauEls[i].id;
                    const moveFn = () => {
                        moveCards(loc.pileName, loc.pileIndex, 'tableau', i, cardsToMove.length);
                        flipSourceTableauCard(loc.pileName, loc.pileIndex);
                        handleCombo();
                    };
                    if(sounds) sounds.place.triggerAttackRelease("C4", "8n");
                    await animateAndMoveCard(cardEl, targetId, moveFn);
                    return;
                }
            }
        }
        
        if (isTopCard || loc.pileName === 'tableau') {
            for (let i = 0; i < tableau.length; i++) {
                if (loc.pileName === 'tableau' && i === loc.pileIndex) continue;
                if (isValidTableauMove(cardsToMove[0], i)) {
                    saveState();
                    triggerAchievement('firstMove');
                    const targetId = dom.tableauEls[i].id;
                    const moveFn = () => {
                        moveCards(loc.pileName, loc.pileIndex, 'tableau', i, cardsToMove.length);
                        flipSourceTableauCard(loc.pileName, loc.pileIndex);
                        checkTableauBonus(i);
                        handleCombo();
                    };
                    if(sounds) sounds.place.triggerAttackRelease("C4", "8n");
                    await animateAndMoveCard(cardEl, targetId, moveFn);
                    return;
                }
            }
        }

        if(sounds) sounds.error.triggerAttackRelease("G2", "8n");
    }

    function handleMove(targetPileName, targetPileIndex) {
        saveState();
        triggerAchievement('firstMove');
        const { sourcePileName, sourcePileIndex, draggedCards } = draggedCardInfo;
        const cardToMove = draggedCards[0];
        
        let isValid = false;
        if (targetPileName === 'foundation' && draggedCards.length === 1 && isValidFoundationMove(cardToMove, targetPileIndex)) {
            if(sounds) sounds.foundationPlace.triggerAttackRelease("C5", "8n");
            moveCards(sourcePileName, sourcePileIndex, 'foundation', targetPileIndex, 1);
            addXP(1, "+1 XP"); checkAceBonus(); triggerAchievement('firstFoundation'); isValid = true;
        } else if (targetPileName === 'tableau' && isValidTableauMove(cardToMove, targetPileIndex)) {
            if (tableau[targetPileIndex].length === 0 && cardToMove.rank === 13) {
                triggerAchievement('kingMe');
            }
            if(sounds) sounds.place.triggerAttackRelease("C4", "8n");
            moveCards(sourcePileName, sourcePileIndex, 'tableau', targetPileIndex, draggedCards.length);
            checkTableauBonus(targetPileIndex); isValid = true;
        }

        if (isValid) {
            handleCombo();
            flipSourceTableauCard(sourcePileName, sourcePileIndex);
            return true;
        } else {
            moveHistory.pop();
            return false;
        }
    }

    function moveCards(fromName, fromIndex, toName, toIndex, numCards) { let sourcePile; if (fromName === 'tableau') sourcePile = tableau[fromIndex]; else if (fromName === 'waste') sourcePile = waste; let targetPile; if (toName === 'tableau') targetPile = tableau[toIndex]; else if (toName === 'foundation') targetPile = foundations[toIndex]; const cards = sourcePile.splice(sourcePile.length - numCards, numCards); targetPile.push(...cards); }
    
    async function animateAndMoveCard(cardEl, targetId, moveLogic) {
        dom.gameBoard.style.pointerEvents = 'none';
        const startRect = cardEl.getBoundingClientRect();
        const clone = cardEl.cloneNode(true);
        clone.style.cssText = `position: fixed; left: ${startRect.left}px; top: ${startRect.top}px; z-index: 2000; margin: 0;`;
        document.body.appendChild(clone);
        cardEl.style.opacity = '0';

        moveLogic();
        render();
        
        const newTargetEl = document.getElementById(targetId);
        if (!newTargetEl) {
            document.body.removeChild(clone);
            render();
            dom.gameBoard.style.pointerEvents = 'auto';
            return;
        }
        
        const topCardEl = newTargetEl.querySelector('.card:last-child') || newTargetEl;
        const endRect = topCardEl.getBoundingClientRect();
        const deltaX = endRect.left - startRect.left;
        const deltaY = endRect.top - startRect.top;
        
        await new Promise(resolve => requestAnimationFrame(() => {
            clone.style.transition = 'transform 0.25s ease-in-out';
            clone.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
            resolve();
        }));
        await new Promise(resolve => setTimeout(resolve, 250));
        
        document.body.removeChild(clone);
        render();
        dom.gameBoard.style.pointerEvents = 'auto';
    }

    function isValidFoundationMove(card, foundationIndex) {
        const foundationPile = foundations[foundationIndex];
        if (foundationPile.length === 0) {
            const suitAlreadyPlaced = foundations.some(pile => pile.length > 0 && pile[0].suit === card.suit);
            return card.rank === 1 && !suitAlreadyPlaced;
        } else {
            const topCard = foundationPile[foundationPile.length - 1];
            return card.suit === topCard.suit && card.rank === topCard.rank + 1;
        }
    }

    function isValidTableauMove(card, tableauIndex) { const tableauPile = tableau[tableauIndex]; if (tableauPile.length === 0) return card.rank === 13; const topCard = tableauPile[tableauPile.length - 1]; return card.rank === topCard.rank - 1 && card.color !== topCard.color; }
    
    function flipSourceTableauCard(sourcePileName, sourcePileIndex) { if (sourcePileName === 'tableau') { const sourcePile = tableau[sourcePileIndex]; if (sourcePile.length > 0 && !sourcePile[sourcePile.length - 1].isFaceUp) { sourcePile[sourcePile.length - 1].isFaceUp = true; } } }
    function findCard(cardId) { for (const pile of [stock, waste, ...foundations, ...tableau]) { for (const card of pile) { if (card.id === cardId) return card; } } return null; }
    function findCardLocation(cardId) { if (waste.length > 0 && waste[waste.length - 1].id === cardId) return { pileName: 'waste', pileIndex: -1, cardIndex: waste.length - 1 }; for (let i = 0; i < foundations.length; i++) { const p = foundations[i]; if (p.length > 0 && p[p.length - 1].id === cardId) return { pileName: 'foundation', pileIndex: i, cardIndex: p.length - 1 }; } for (let i = 0; i < tableau.length; i++) { const p = tableau[i]; for (let j = 0; j < p.length; j++) if (p[j].id === cardId) return { pileName: 'tableau', pileIndex: i, cardIndex: j }; } return {}; }
    
    function handleCombo() {
        const now = Date.now();
        if (now - lastMoveTime < 4000) {
            comboCounter++;
        } else {
            comboCounter = 1;
        }
        lastMoveTime = now;
        clearTimeout(comboTimeout);
        comboTimeout = setTimeout(resetCombo, 4000);
        if (comboCounter > 1) {
            if (comboCounter === 5) triggerAchievement('combo5');
            const comboText = `${COMBO_WORDS[Math.min(comboCounter - 2, COMBO_WORDS.length - 1)]} x${comboCounter}`;
            const comboSize = 40 + (comboCounter * 8);
            const comboColor = `hsl(${200 + comboCounter * 10}, 100%, 50%)`;
            if(sounds) sounds.combo.triggerAttackRelease(100 + comboCounter * 20, "8n");
            spawnComboText(comboText, comboSize, comboColor);
        }
    }

    function resetCombo() {
        comboCounter = 0;
        clearComboText();
    }

    function spawnComboText(text, size, color) {
        if (!libs.Matter) return;
        clearComboText();
        const { Bodies, World } = Matter;
        const letters = text.split('');
        const xStart = window.innerWidth / 2 - (letters.length * size / 4);
        const yStart = window.innerHeight / 3;
        letters.forEach((letter, i) => {
            const body = Bodies.rectangle(xStart + i * size / 2, yStart, size * 0.5, size * 0.5, {
                restitution: 0.8,
                friction: 0.1,
                render: {
                    sprite: {
                        texture: createLetterTexture(letter, size, color),
                        xScale: 1,
                        yScale: 1
                    }
                }
            });
            World.add(world, body);
            comboBodies.push(body);
        });
    }

    function createLetterTexture(letter, size, color) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = size;
        canvas.height = size;
        ctx.fillStyle = color;
        ctx.font = `bold ${size}px 'Segoe UI', sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(letter, size / 2, size / 2);
        return canvas.toDataURL();
    }

    function clearComboText() {
        if(world && libs.Matter) Matter.World.remove(world, comboBodies);
        comboBodies = [];
    }
    
    function unlockEverything() {
        playerXP = LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
        unlockedBacks = SHUFFLED_CARD_BACKS.map(b => b.id);
        unlockedBoards = BOARD_DATA.map(b => b.id);
        unlockedAchievements = Object.keys(ACHIEVEMENTS);
        achievementScore = Object.values(ACHIEVEMENTS).reduce((sum, ach) => sum + ach.points, 0);
        hintsAvailable = 99;
        undosAvailable = 99;
        unlockedTracks = MUSIC_DATA.map(t => t.id);
        
        checkLevelUp(false);
        updateCardStyles();
        updatePlayerStatsUI();
        saveProgress();
        
        if(sounds) sounds.levelUp.triggerAttackRelease("C7", "2n");
        queueUnlockPopup("👑 Dev Mode Activated 👑", "Everything has been unlocked. Enjoy!");
    }

    function addXP(amount, reason = '') {
        if (reason) {
            dom.messageBox.textContent = reason;
            setTimeout(() => {
                if (dom.messageBox.textContent === reason) {
                    dom.messageBox.textContent = '';
                }
            }, 2000);
        }
        playerXP += amount;
        checkLevelUp(true);
        updatePlayerStatsUI();
        saveProgress();
    }

    function queueUnlockPopup(title, description, applyCallback = null) {
        unlockPopupQueue.push({ title, description, applyCallback });
        showNextUnlockPopup();
    }

    function showNextUnlockPopup() {
        if (isPopupVisible || unlockPopupQueue.length === 0) return;
        isPopupVisible = true;
        
        const { title, description, applyCallback } = unlockPopupQueue.shift();
        
        dom.unlockTitle.textContent = title;
        dom.unlockDescription.innerHTML = description;
        currentApplyCallback = applyCallback;
        
        if (applyCallback) {
            dom.unlockPrompt.style.display = 'block';
            dom.unlockApplyBtn.style.display = 'inline-block';
            dom.unlockCloseBtn.textContent = 'No, Thanks';
        } else {
            dom.unlockPrompt.style.display = 'none';
            dom.unlockApplyBtn.style.display = 'none';
            dom.unlockCloseBtn.textContent = 'Awesome!';
        }
        
        dom.unlockModal.style.display = 'flex';
    }

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

                    if(l === 3 || (l > 3 && l % 2 !== 0)) { hintsAvailable += 1; rewards.push("+1 Hint"); }
                    if(l === 4 || (l > 4 && l % 2 === 0)) { undosAvailable += 2; rewards.push("+2 Undos"); }
                }
                dom.messageBox.textContent = `Level Up! You are now Level ${newLevel}! ${rewards.join(', ')}!`;
                setTimeout(() => dom.messageBox.textContent = '', 4000);
            }
        }
        updatePlayerStatsUI();
    }
    
    function updatePlayerStatsUI() {
        dom.levelTextEl.textContent = `Level ${playerLevel}`;
        dom.achievementScoreDisplay.textContent = `🏆 ${achievementScore}`;
        const currentLevelXP = LEVEL_THRESHOLDS[playerLevel - 1] || 0;
        const nextLevelXP = LEVEL_THRESHOLDS[playerLevel] || playerXP;
        const xpInLevel = playerXP - currentLevelXP;
        const xpForLevel = nextLevelXP - currentLevelXP;
        
        dom.xpTextEl.textContent = `${xpInLevel}/${xpForLevel} XP`;
        
        const xpPercentage = xpForLevel > 0 ? `${(xpInLevel / xpForLevel) * 100}%` : '100%';
        dom.xpBarEl.style.width = xpPercentage;

        const hintsUnlocked = playerLevel >= 3;
        dom.hintBtn.disabled = !hintsUnlocked || hintsAvailable <= 0;
        dom.hintBtn.textContent = hintsUnlocked ? `💡 Hint (${hintsAvailable})` : '💡 (Lvl 3)';

        const undosUnlocked = playerLevel >= 4;
        dom.undoBtn.disabled = !undosUnlocked || undosAvailable <= 0 || moveHistory.length === 0;
        dom.undoBtn.textContent = undosUnlocked ? `⎌ Undo (${undosAvailable})` : '⎌ (Lvl 4)';
    }

    function checkAceBonus() {
        if (aceBonusAwarded) return;
        const allAcesPlaced = foundations.every(pile => pile.length > 0 && pile[0].rank === 1);
        if (allAcesPlaced) {
            addXP(5, "+5 XP: All Aces Placed!");
            aceBonusAwarded = true;
        }
    }

    function checkTableauBonus(pileIndex) {
        if (tableauBonusAwarded[pileIndex]) return;
        const pile = tableau[pileIndex];
        if (pile.length === 13 && pile[0].rank === 13) {
            addXP(10, "+10 XP: Full Stack!");
            tableauBonusAwarded[pileIndex] = true;
        }
    }

    function findHint() {
        if (playerLevel < 3 || hintsAvailable <= 0) {
            if(sounds) sounds.error.triggerAttackRelease("G2", "8n");
            return;
        }
        if(sounds) sounds.click.triggerAttackRelease("E4", "8n");

        if (waste.length > 0) {
            const card = waste[waste.length - 1];
            for (let i = 0; i < foundations.length; i++) { if (isValidFoundationMove(card, i)) { glowHint(card.id, foundations[i].length > 0 ? foundations[i][foundations[i].length-1].id : `foundation-${i}`); useHint(); return; } }
        }
        for (let i = 0; i < tableau.length; i++) {
            if (tableau[i].length > 0) {
                const card = tableau[i][tableau[i].length - 1];
                for (let f = 0; f < foundations.length; f++) { if (isValidFoundationMove(card, f)) { glowHint(card.id, foundations[f].length > 0 ? foundations[f][foundations[f].length-1].id : `foundation-${f}`); useHint(); return; } }
            }
        }
        for (let i = 0; i < tableau.length; i++) {
            if (tableau[i].length > 0) {
                for (let k = 0; k < tableau[i].length; k++) {
                    if(tableau[i][k].isFaceUp) {
                        const card = tableau[i][k];
                        for (let j = 0; j < tableau.length; j++) {
                            if (i === j) continue;
                            if (isValidTableauMove(card, j)) { glowHint(card.id, tableau[j].length > 0 ? tableau[j][tableau[j].length-1].id : `tableau-${j}`); useHint(); return; }
                        }
                    }
                }
            }
        }
        if (waste.length > 0) {
            const card = waste[waste.length-1];
            for (let i = 0; i < tableau.length; i++) { if (isValidTableauMove(card, i)) { glowHint(card.id, tableau[i].length > 0 ? tableau[i][tableau[i].length-1].id : `tableau-${i}`); useHint(); return; } }
        }
        dom.messageBox.textContent = 'No moves found!';
        setTimeout(() => dom.messageBox.textContent = '', 2000);
    }

    function useHint() {
        hintsAvailable--;
        updatePlayerStatsUI();
        saveProgress();
    }

    function glowHint(sourceCardId, targetId) {
        document.querySelectorAll('.hint-glow').forEach(el => el.classList.remove('hint-glow'));
        const sourceEl = document.querySelector(`[data-card-id="${sourceCardId}"]`);
        let targetEl = document.querySelector(`[data-card-id="${targetId}"]`);
        if (!targetEl) targetEl = document.getElementById(targetId);

        if (sourceEl) sourceEl.classList.add('hint-glow');
        if (targetEl) targetEl.classList.add('hint-glow');

        setTimeout(() => {
            if (sourceEl) sourceEl.classList.remove('hint-glow');
            if (targetEl) targetEl.classList.remove('hint-glow');
        }, 1500);
    }

    function saveState() {
        const state = {
            stock: JSON.parse(JSON.stringify(stock)),
            waste: JSON.parse(JSON.stringify(waste)),
            foundations: JSON.parse(JSON.stringify(foundations)),
            tableau: JSON.parse(JSON.stringify(tableau)),
            aceBonusAwarded: aceBonusAwarded,
            tableauBonusAwarded: [...tableauBonusAwarded],
            playerXP: playerXP,
            hintsAvailable: hintsAvailable,
            undosAvailable: undosAvailable
        };
        moveHistory.push(state);
        updatePlayerStatsUI();
    }

    function undoMove() {
        if (playerLevel < 4 || moveHistory.length === 0 || undosAvailable <= 0) {
            if(sounds) sounds.error.triggerAttackRelease("G2", "8n");
            return;
        }
        if(sounds) sounds.click.triggerAttackRelease("A2", "8n");
        
        const lastState = moveHistory.pop();
        
        stock = lastState.stock;
        waste = lastState.waste;
        foundations = lastState.foundations;
        tableau = lastState.tableau;
        aceBonusAwarded = lastState.aceBonusAwarded;
        tableauBonusAwarded = lastState.tableauBonusAwarded;
        playerXP = lastState.playerXP;
        hintsAvailable = lastState.hintsAvailable;
        
        undosAvailable--;

        resetCombo();
        updatePlayerStatsUI();
        saveProgress();
        render();
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
            
            const winAnimations = [winAnimationConfetti, winAnimationVortex, winAnimationFountain, winAnimationCascade, winAnimationShuffle];
            const randomAnimation = winAnimations[Math.floor(Math.random() * winAnimations.length)];
            randomAnimation();
        }
    }

    function checkAutocomplete() { if (isGameWon) return; const allTableauFaceUp = tableau.every(pile => pile.every(card => card.isFaceUp)); const isStockEmpty = stock.length === 0 && waste.length === 0; if (allTableauFaceUp && isStockEmpty) { dom.autocompleteBtn.classList.remove('hidden'); } else { dom.autocompleteBtn.classList.add('hidden'); } }
    
    async function runAutocomplete() {
        dom.autocompleteBtn.classList.add('hidden');
        dom.gameBoard.style.pointerEvents = 'none';
        let movableCardFound = true;
        while (movableCardFound) {
            movableCardFound = false;
            for (let i = tableau.length - 1; i >= 0; i--) {
                const pile = tableau[i];
                if (pile.length > 0) {
                    const card = pile[pile.length - 1];
                    const cardEl = document.querySelector(`[data-card-id="${card.id}"]`);
                    for (let f = 0; f < foundations.length; f++) {
                        if (isValidFoundationMove(card, f)) {
                            saveState();
                            if(sounds) sounds.foundationPlace.triggerAttackRelease("C5", "8n");
                            addXP(1, "+1 XP");
                            const targetId = dom.foundationEls[f].id;
                            await animateAndMoveCard(cardEl, targetId, () => {
                                moveCards('tableau', i, 'foundation', f, 1);
                            });
                            movableCardFound = true;
                            break;
                        }
                    }
                }
                if (movableCardFound) break;
            }
        }
    }

    function winAnimationConfetti() {
        if (!libs.Matter) return;
        dom.comboCanvas.style.pointerEvents = 'auto';
        const { Bodies, World } = Matter;
        const cardWidth = varToNum('--card-width');
        const cardHeight = varToNum('--card-height');
        const fullDeck = createDeck();
        fullDeck.forEach((card, i) => {
            setTimeout(() => {
                const cardBody = Bodies.rectangle(
                    window.innerWidth / 2, window.innerHeight / 2, cardWidth, cardHeight,
                    { restitution: 0.7, friction: 0.1, angle: Math.random() * Math.PI * 2, render: { sprite: { texture: createCardTexture(card) } } }
                );
                Matter.Body.applyForce(cardBody, cardBody.position, { x: (Math.random() - 0.5) * 0.5, y: (Math.random() - 0.5) * 0.5 });
                World.add(world, cardBody);
            }, i * 20);
        });
        winAnimationTimeout = setTimeout(() => {
            if(world) Matter.World.clear(world, false);
            dom.comboCanvas.style.pointerEvents = 'none';
        }, 30000);
    }
    
    function winAnimationVortex() { /* Placeholder */ }
    function winAnimationFountain() { /* Placeholder */ }
    function winAnimationCascade() { /* Placeholder */ }
    function winAnimationShuffle() { /* Placeholder */ }
    
    function createCardTexture(card) {
        const canvas = document.createElement('canvas');
        canvas.width = varToNum('--card-width');
        canvas.height = varToNum('--card-height');
        const ctx = canvas.getContext('2d');
        
        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--card-bg');
        ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--card-border');
        ctx.lineWidth = 2;
        // Use roundRect if available for cleaner corners
        if (ctx.roundRect) {
            ctx.beginPath();
            ctx.roundRect(0, 0, canvas.width, canvas.height, [8]);
            ctx.fill();
            ctx.stroke();
        } else {
            // Fallback for older browsers
            ctx.fillRect(0,0,canvas.width, canvas.height);
            ctx.strokeRect(0,0,canvas.width, canvas.height);
        }

        ctx.fillStyle = card.color === 'red' ? '#d90429' : '#000000';
        ctx.font = `bold ${canvas.width * 0.28}px 'Segoe UI', sans-serif`;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillText(`${card.value}${card.suit}`, 10, 10);
        
        ctx.save();
        ctx.translate(canvas.width, canvas.height);
        ctx.rotate(Math.PI);
        ctx.fillText(`${card.value}${card.suit}`, 10, 10);
        ctx.restore();

        return canvas.toDataURL();
    }
    
    function varToNum(varName) {
        return parseFloat(getComputedStyle(document.documentElement).getPropertyValue(varName));
    }
    
    function startTimer() {
        stopTimer();
        gameTime = 0;
        gameTimerInterval = setInterval(() => {
            gameTime++;
            const minutes = Math.floor(gameTime / 60).toString().padStart(2, '0');
            const seconds = (gameTime % 60).toString().padStart(2, '0');
            dom.gameTimerEl.textContent = `${minutes}:${seconds}`;
        }, 1000);
    }

    function stopTimer() {
        clearInterval(gameTimerInterval);
    }

    function triggerAchievement(id) {
        if (unlockedAchievements.includes(id)) return;
        const achievement = ACHIEVEMENTS[id];
        unlockedAchievements.push(id);
        achievementScore += achievement.points;
        addXP(achievement.xp, `Achievement: ${achievement.name}`);
        
        const toast = document.createElement('div');
        toast.className = 'achievement-toast';
        toast.innerHTML = `<div class="achievement-icon">${achievement.icon}</div><div class="achievement-details"><h4>${achievement.name}</h4><p>${achievement.desc}</p></div>`;
        dom.achievementContainer.appendChild(toast);
        if(sounds) sounds.achievement.triggerAttackRelease("C5", "8n");
        setTimeout(() => toast.remove(), 5000);

        updatePlayerStatsUI();
        saveProgress();
    }
    
    function renderAchievementList() {
        dom.achievementListEl.innerHTML = '';
        Object.keys(ACHIEVEMENTS).forEach(id => {
            const ach = ACHIEVEMENTS[id];
            if (ach.secret && !unlockedAchievements.includes(id)) return;
            const entry = document.createElement('div');
            entry.className = 'achievement-entry';
            if (unlockedAchievements.includes(id)) entry.classList.add('unlocked');
            entry.innerHTML = `<div class="achievement-entry-icon">${ach.icon}</div><div class="achievement-entry-details"><h4>${ach.name} (+${ach.points}🏆)</h4><p>${ach.desc}</p></div>`;
            dom.achievementListEl.appendChild(entry);
        });
    }

    function toggleFullScreen() {
        const docEl = document.documentElement;
        const requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullscreen || docEl.msRequestFullscreen;
        const cancelFullScreen = document.exitFullscreen || document.mozCancelFullScreen || document.webkitExitFullscreen || document.msExitFullscreen;

        if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
            if (requestFullScreen) requestFullScreen.call(docEl).catch(err => console.error(err));
        } else {
            if (cancelFullScreen) cancelFullScreen.call(document);
        }
    }

    function updateFullscreenIcon() {
        if (document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement) {
            dom.fullscreenIcon.style.display = 'none';
            dom.exitFullscreenIcon.style.display = 'block';
        } else {
            dom.fullscreenIcon.style.display = 'block';
            dom.exitFullscreenIcon.style.display = 'none';
        }
    }

    function updateMuteState(playSound = true) {
        if (!libs.Tone) return;
        Tone.Master.mute = isMuted;
        if (isMuted) {
            dom.unmutedIcon.style.display = 'none';
            dom.mutedIcon.style.display = 'block';
        } else {
            dom.unmutedIcon.style.display = 'block';
            dom.mutedIcon.style.display = 'none';
            if(playSound && sounds) sounds.click.triggerAttackRelease("C3", "8n");
        }
        saveProgress();
    }

    function playNextTrack() {
        if (!libs.Tone) return;
        if (currentTrackPlayer) currentTrackPlayer.dispose();
        
        if (shuffledPlaylist.length === 0) {
            shuffledPlaylist = unlockedTracks.map(trackId => MUSIC_DATA.find(t => t.id === trackId).url);
            shuffleArray(shuffledPlaylist);
            currentTrackIndex = -1;
        }
        
        currentTrackIndex = (currentTrackIndex + 1) % shuffledPlaylist.length;
        const nextTrackUrl = shuffledPlaylist[currentTrackIndex];
        
        currentTrackPlayer = new Tone.Player({
            url: nextTrackUrl,
            autostart: true,
            onstop: () => { if (libs.Tone && Tone.Transport.state === 'started') playNextTrack(); }
        }).toDestination();
    }
    
    function startMainPlaylist() {
        if (!libs.Tone || !unlockedTracks.length) return;
        if (Tone.Transport.state === 'started') {
            Tone.Transport.stop();
            if(currentTrackPlayer) currentTrackPlayer.stop();
        }
        
        shuffledPlaylist = unlockedTracks.map(trackId => MUSIC_DATA.find(t => t.id === trackId).url);
        shuffleArray(shuffledPlaylist);
        currentTrackIndex = -1;
        
        Tone.Transport.start();
        playNextTrack();
    }

    function playTrackNow(trackUrl) {
        if (!libs.Tone) return;
        if (currentTrackPlayer) {
            currentTrackPlayer.stop();
            currentTrackPlayer.dispose();
        }
        currentTrackPlayer = new Tone.Player({
            url: trackUrl,
            autostart: true,
            onstop: () => { if (libs.Tone && Tone.Transport.state === 'started') playNextTrack(); }
        }).toDestination();
        
        shuffledPlaylist = unlockedTracks.map(trackId => MUSIC_DATA.find(t => t.id === trackId).url);
        shuffleArray(shuffledPlaylist);
        currentTrackIndex = shuffledPlaylist.indexOf(trackUrl);
    }
    
    // --- Event Listeners ---
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
    dom.newGameBtn.addEventListener('click', () => { if(sounds) sounds.click.triggerAttackRelease("C2", "8n"); promptNewGame(); });
    dom.draw1Btn.addEventListener('click', () => { drawCount = 1; dom.drawSelectModal.style.display = 'none'; dom.cardStyleModal.style.display = 'flex'; });
    dom.draw3Btn.addEventListener('click', () => { drawCount = 3; dom.drawSelectModal.style.display = 'none'; dom.cardStyleModal.style.display = 'flex'; });
    dom.normalStyleBtn.addEventListener('click', () => { faceStyle = 'default'; dom.cardStyleModal.style.display = 'none'; initializeNewGame(); });
    dom.easySeeBtn.addEventListener('click', () => { faceStyle = 'easy-see'; dom.cardStyleModal.style.display = 'none'; initializeNewGame(); });
    dom.autocompleteBtn.addEventListener('click', runAutocomplete);
    dom.hintBtn.addEventListener('click', findHint);
    dom.undoBtn.addEventListener('click', undoMove);
    dom.optionsBtn.addEventListener('click', () => { if(sounds) sounds.click.triggerAttackRelease("C3", "8n"); dom.optionsModal.style.display = 'flex'; updateCardStyles(); });
    dom.closeModalBtn.addEventListener('click', () => { dom.optionsModal.style.display = 'none'; });
    dom.unlockCloseBtn.addEventListener('click', () => { dom.unlockModal.style.display = 'none'; isPopupVisible = false; showNextUnlockPopup(); });
    dom.unlockApplyBtn.addEventListener('click', () => { if (currentApplyCallback) currentApplyCallback(); dom.unlockModal.style.display = 'none'; isPopupVisible = false; showNextUnlockPopup(); });
    dom.achievementsBtn.addEventListener('click', () => { renderAchievementList(); dom.achievementModal.style.display = 'flex'; });
    dom.closeAchievementModalBtn.addEventListener('click', () => { dom.achievementModal.style.display = 'none'; });
    dom.stockPileEl.addEventListener('click', () => {
        const now = Date.now();
        if (now - lastStockClickTime < 200) return;
        lastStockClickTime = now;
        saveState();
        if (stock.length > 0) {
            const numToDraw = Math.min(stock.length, drawCount);
            for (let i = 0; i < numToDraw; i++) waste.push(stock.pop());
        } else if (waste.length > 0) {
            stock = waste.map(card => ({ ...card, isFaceUp: false })).reverse();
            waste = [];
        }
        render();
    });
    
    dom.gameBoard.addEventListener('mousedown', (e) => {
        if (e.button !== 0 || isDragging) return;
        const cardEl = e.target.closest('.card:not(.face-down)');
        if (!cardEl) return;
        e.preventDefault();
        if (Date.now() - lastClickTime < 300) {
            clearTimeout(clickTimeout);
            lastClickTime = 0;
            handleDoubleClick(e.target);
        } else {
            lastClickTime = Date.now();
            mouseDownPos = { x: e.clientX, y: e.clientY, target: cardEl };
        }
    });

    window.addEventListener('mousemove', (e) => {
        mousePos.x = e.clientX;
        mousePos.y = e.clientY;
        if (mouseDownPos && !isDragging) {
            const dx = Math.abs(e.clientX - mouseDownPos.x);
            const dy = Math.abs(e.clientY - mouseDownPos.y);
            if (dx > 5 || dy > 5) {
                startDrag(mouseDownPos.x, mouseDownPos.y, mouseDownPos.target);
                mouseDownPos = null;
            }
        }
        if (isDragging) {
            e.preventDefault();
            moveDrag(e.clientX, e.clientY);
        }
    });

    window.addEventListener('mouseup', (e) => {
        if (isDragging) {
            e.preventDefault();
            endDrag(e.clientX, e.clientY);
        }
        mouseDownPos = null;
    });

    dom.gameBoard.addEventListener('touchstart', (e) => {
        const cardEl = e.target.closest('.card:not(.face-down)');
        if (!cardEl) return;
        const touch = e.touches[0];
        lastClickTime = Date.now();
        mouseDownPos = { x: touch.clientX, y: touch.clientY, target: cardEl };
    }, { passive: true });

    dom.gameBoard.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
            mousePos.x = e.touches[0].clientX;
            mousePos.y = e.touches[0].clientY;
        }
        if (mouseDownPos && !isDragging) {
            const touch = e.touches[0];
            const dx = Math.abs(touch.clientX - mouseDownPos.x);
            const dy = Math.abs(touch.clientY - mouseDownPos.y);
            if (dx > 10 || dy > 10) {
                e.preventDefault();
                startDrag(mouseDownPos.x, mouseDownPos.y, mouseDownPos.target);
                mouseDownPos = null;
            }
        }
        if (isDragging) {
            e.preventDefault();
            moveDrag(e.touches[0].clientX, e.touches[0].clientY);
        }
    }, { passive: false });

    dom.gameBoard.addEventListener('touchend', (e) => {
        if (isDragging) {
            e.preventDefault();
            endDrag(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
        } else if (mouseDownPos) {
            const timeDiff = Date.now() - lastClickTime;
            if (timeDiff < 250) {
                handleDoubleClick(mouseDownPos.target);
            }
        }
        mouseDownPos = null;
        isDragging = false;
    });

    window.addEventListener('click', (e) => {
        if (e.target == dom.optionsModal) dom.optionsModal.style.display = 'none';
        if (e.target == dom.achievementModal) dom.achievementModal.style.display = 'none';
        if (e.target == dom.unlockModal) { dom.unlockModal.style.display = 'none'; isPopupVisible = false; showNextUnlockPopup(); }
        if (e.target == dom.resetConfirmModal) dom.resetConfirmModal.style.display = 'none';
    });
    
    dom.fullscreenBtn.addEventListener('click', toggleFullScreen);
    document.addEventListener('fullscreenchange', updateFullscreenIcon);
    document.addEventListener('webkitfullscreenchange', updateFullscreenIcon);
    document.addEventListener('mozfullscreenchange', updateFullscreenIcon);
    document.addEventListener('MSFullscreenChange', updateFullscreenIcon);

    dom.muteBtn.addEventListener('click', () => { isMuted = !isMuted; updateMuteState(); });
    
    dom.resetProgressBtn.addEventListener('click', () => { dom.resetConfirmModal.style.display = 'flex'; });
    dom.resetCancelBtn.addEventListener('click', () => { dom.resetConfirmModal.style.display = 'none'; });
    dom.resetConfirmBtn.addEventListener('click', () => { localStorage.clear(); location.reload(); });
    
    window.addEventListener('resize', () => {
        updatePlayerStatsUI();
        const boardToResize = BOARD_DATA.find(b => b.id === selectedBoard);
        if (boardToResize && boardToResize.resize) {
            boardToResize.resize();
        }
    });

    // --- Initial Setup ---
    document.addEventListener('click', initializeAudio, { once: true });
    document.addEventListener('touchstart', initializeAudio, { once: true });
    animateTitleScreen();
});
