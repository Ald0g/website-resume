import { Box, Container } from '@mui/material';
import { Link } from 'react-router-dom';
import { useEffect, useRef, useState, useCallback } from 'react';
import './SledGame.css';
import { hillTile, penguinRunMap } from './SledGameData';

// Import Assets using Glob for dynamic access
const hillTileImages = import.meta.glob('./assets/SledRacing/HillTiles/*.png', { eager: true, as: 'url', import: 'default' });
const penguinAssets = import.meta.glob('./assets/SledRacing/Penguin/*.png', { eager: true, as: 'url', import: 'default' });
const tubeAssets = import.meta.glob('./assets/SledRacing/Tube/*.png', { eager: true, as: 'url', import: 'default' });
const otherAssets = import.meta.glob('./assets/SledRacing/*.png', { eager: true, as: 'url', import: 'default' });

import hillTileImages
import mapCornerImg from './assets/SledRacing/MapCorner.png'
import backgroundImg from './assets/SledRacing/Background.png'
import cloudsImg from './assets/SledRacing/Clouds.png'
import AudioPlayer from './AudioPlayer';

console.log(hillTileImages)

// Helper to get asset URL
const getHillTileImg = (id: string | number) => {
    // try direct match
    const key = `./assets/SledRacing/HillTiles/${id}.png`;
    console.log('key', key, hillTileImages[key], hillTileImages[key][0]);
    if (hillTileImages[key]) return hillTileImages[key];
    return '';
};

const getPenguinImg = (name: string) => {
    const key = `./assets/SledRacing/Penguin/${name}.png`;
    return penguinAssets[key] || '';
};

const getTubeImg = (name: string) => {
    const key = `./assets/SledRacing/Tube/${name}.png`;
    return tubeAssets[key] || '';
};

// Game Constants
const MAX_SPEED = 5;
const GRAVITY = 0.5;
const DECAY = 0.98;
const X_MULTIPLIER = 249 / 149; // ~1.67

function SkiingGame() {
    // Game State Refs
    const gameState = useRef({
        speed: 0,
        distance: 0,
        isPlaying: false,
        isCrashed: false,
        crashState: 0,
        playerX: 0, // Grid coordinate (0-8)
        playerLeft: 424, // CSS Left
        playerTop: 161,  // CSS Top
        mapOffsetLeft: 0,
        mapOffsetTop: 0,
        currentMap: [] as string[], // We'll convert map numbers to strings for easier handling of "Finish"
        tileMap: [] as { l: number, t: number }[], // Positions of tiles
        playerTileIndex: 0,
        playerHillPos: 0, // Position relative to current tile top
        playerTilePos: 0, // Index within the 9x9 tile grid
        lastTime: 0,
    });

    const [uiState, setUiState] = useState({
        isPlaying: false,
        isGameOver: false,
        score: '00:00:00',
        loading: true,
        debug: '' // Debug info
    });

    const playerRef = useRef<HTMLDivElement>(null);
    const shadowRef = useRef<HTMLImageElement>(null);
    const tilesRef = useRef<HTMLDivElement>(null);
    const penguinRef = useRef<HTMLImageElement>(null);
    const tubeRef = useRef<HTMLImageElement>(null);
    const gameContainerRef = useRef<HTMLDivElement>(null);

    // Initialization
    useEffect(() => {
        // Simulate loading
        const timer = setTimeout(() => {
            setUiState(s => ({ ...s, loading: false }));
        }, 500);
        return () => clearTimeout(timer);
    }, []);

    const initGame = useCallback(() => {
        // Reset State
        let startLeft = 424;
        let startTop = 161;

        // Correct starting position calculation for X=1 (Player 1 default)
        startLeft += 24;
        startTop -= 24 / 1.5;

        gameState.current = {
            speed: 0,
            distance: 0,
            isPlaying: true,
            isCrashed: false,
            crashState: 0,
            playerX: 0,
            playerLeft: startLeft,
            playerTop: startTop,
            mapOffsetLeft: 0,
            mapOffsetTop: 0,
            currentMap: [...penguinRunMap.map(String), 'Finish'], // Add finish manually
            tileMap: [],
            playerTileIndex: 0,
            playerHillPos: 0,
            playerTilePos: 0,
            lastTime: Date.now(),
        };

        setUiState(prev => ({ ...prev, isPlaying: true, isGameOver: false, score: '00:00:00', debug: '' }));

        // Build Tile Map Data
        const generatedTileMap: { l: number, t: number }[] = [];

        // Tile 0 (Start) - Not part of 'map' array logic for collisions generally, but logic starts checks at index 0?
        // Original logic: PlayerTiles starts at index 0.
        // Index 0 of currentMap (after LoadMap shifts) is the first 'Map' tile.
        // Start Tile is visual only? No. 
        // Let's assume generatedTileMap aligns with currentMap.
        // Tile 0 (Map[0], was 2) -> 485, 318
        // Tile 1 (Map[1], was 3) -> 734, 467

        // generatedTileMap.push({ l: 485, t: 318 }); // Index 0
        generatedTileMap.push({ l: 485, t: 318 }); // Index 0
        generatedTileMap.push({ l: 734, t: 467 }); // Index 1

        // let tLeft = 734;
        // let tTop = 467;
        let tLeft = 734 + 249 * 1.5;
        let tTop = 467 + 149 * 1.5;

        // Iterate rest from index 2
        for (let i = 2; i < gameState.current.currentMap.length; i++) {
            tLeft += 249;
            tTop += 149;
            generatedTileMap.push({ l: tLeft, t: tTop });
        }

        gameState.current.tileMap = generatedTileMap;

        // Reset DOM
        if (playerRef.current) {
            playerRef.current.style.left = `${startLeft}px`;
            playerRef.current.style.top = `${startTop}px`;
            playerRef.current.style.marginTop = '0px'; // Reset jump margin
            playerRef.current.classList.remove('crashed');
        }
        if (penguinRef.current) penguinRef.current.src = getPenguinImg('default');
        if (tubeRef.current) tubeRef.current.src = getTubeImg('default');
        if (tilesRef.current) {
            tilesRef.current.style.left = '0px';
            tilesRef.current.style.top = '0px';
        }
        if (gameContainerRef.current) {
            // Focus for keys
            gameContainerRef.current.focus();
        }

    }, []);

    const updatePhysics = useCallback(() => {
        const state = gameState.current;
        if (!state.isPlaying || state.isCrashed) return;

        // Gravity / Speed
        if (state.speed < MAX_SPEED) {
            state.speed += GRAVITY / 5;
            // if (state.speed > MAX_SPEED) state.speed = MAX_SPEED;
        } else if (state.speed > MAX_SPEED) {
            state.speed *= DECAY;
            // if (state.speed < MAX_SPEED) state.speed = MAX_SPEED;
        }

        // if (state.speed < 0.4) state.speed = 0;



        // Update Position
        const moveDist = state.speed;
        const moveX = moveDist * X_MULTIPLIER;
        const moveY = moveDist;

        // Move Player absolute (on the hill)
        state.playerLeft += moveX;
        state.playerTop += moveY;

        if (playerRef.current) {
            playerRef.current.style.left = `${state.playerLeft}px`;
            playerRef.current.style.top = `${state.playerTop}px`;
        }

        if (tilesRef.current) {
            state.mapOffsetLeft -= moveX;
            state.mapOffsetTop -= moveY;
            tilesRef.current.style.left = `${state.mapOffsetLeft}px`;
            tilesRef.current.style.top = `${state.mapOffsetTop}px`;
        }

        // Collision / Tile Logic
        checkMap(state);

    }, []);

    // Debug logging throttling
    const frameCount = useRef(0);

    // Define helper functions outside or use callback refs if needed, but here simple closures work
    const finishGame = () => {
        gameState.current.isPlaying = false;
        const time = Date.now() - gameState.current.lastTime;
        const mins = Math.floor(time / 60000);
        const secs = Math.floor((time % 60000) / 1000);
        const ms = time % 1000;
        setUiState(prev => ({
            ...prev,
            isPlaying: false,
            isGameOver: true,
            score: `${mins}:${secs.toString().padStart(2, '0')}:${ms.toString().padStart(3, '0')}`
        }));
    };

    const crash = (state: typeof gameState.current) => {
        state.isCrashed = true;
        if (penguinRef.current) penguinRef.current.src = getPenguinImg('crashed');
        state.speed = 0;

        setTimeout(() => {
            setUiState(prev => ({ ...prev, isPlaying: false, isGameOver: true }));
        }, 1500);
    };

    const jump = (state: typeof gameState.current, type: 'small' | 'medium' | 'large' | 'mega') => {
        // Simple visual jump implementation
        // Adjust negative margin-top to simulate height
        if (playerRef.current) {
            const heights = { small: -20, medium: -30, large: -50, mega: -80 };
            playerRef.current.style.transition = 'margin-top 0.3s ease-out';
            playerRef.current.style.marginTop = `${heights[type]}px`;

            if (penguinRef.current) penguinRef.current.src = getPenguinImg('back'); // Jump sprite
            if (shadowRef.current) {
                shadowRef.current.className = 'shadow-2';
            }

            setTimeout(() => {
                if (playerRef.current) {
                    playerRef.current.style.transition = 'margin-top 0.3s ease-in';
                    playerRef.current.style.marginTop = '0px';
                }
                if (shadowRef.current) {
                    shadowRef.current.className = 'shadow-1';
                }
                if (penguinRef.current && !state.isCrashed) penguinRef.current.src = getPenguinImg('default');
            }, 600);
        }
    };

    const checkCollision = (state: typeof gameState.current) => {
        const tileType = state.currentMap[state.playerTileIndex];
        if (tileType === "Finish") return;

        const tileId = parseInt(tileType as string);
        if (isNaN(tileId)) return;

        const def = hillTile[tileId];
        if (!def || !def.map) return;

        // Row/Col logic:
        // Map data is map[row][col] or map[x][y]?
        // Original: var t = hillTile[pt.currentTile].map[$p.attr("x")][pt.tilePos]
        // $p.attr("x") is PlayerX (0-8). pt.tilePos is progress along tile (0-8).
        // So it is map[playerX][tilePos].

        const x = state.playerX;
        const y = state.playerTilePos;

        // Debug info update
        frameCount.current++;
        if (frameCount.current % 10 === 0) {
            setUiState(prev => ({
                ...prev,
                debug: `T:${tileId} I:${state.playerTileIndex} X:${x} Y:${y} speed:${state.speed}`
            }));
        }

        if (x < 0 || x > 8 || y < 0 || y > 8) return;

        const cell = def.map[x][y];

        // Update debug with cell info
        if (frameCount.current % 10 === 0) {
            setUiState(prev => ({
                ...prev,
                debug: `T:${tileId} I:${state.playerTileIndex} X:${x} Y:${y} speed:${state.speed}`
            }));
        }

        if (cell === 1) {
            crash(state);
        } else if (cell === 2) {
            jump(state, 'small');
        } else if (cell === 3) {
            jump(state, 'medium');
        } else if (cell === 4) {
            jump(state, 'large');
        } else if (cell === 5) {
            jump(state, 'mega');
        } else if (cell === 99) {
            state.speed = 16; // Boost speed
        }
    };

    const checkMap = (state: typeof gameState.current) => {
        if (state.playerTileIndex === -1) return;

        const tilePos = state.tileMap[state.playerTileIndex];
        if (!tilePos) return;

        const pL = state.playerLeft + 35;
        const pT = state.playerTop + 35;

        if (tilePos.l <= pL && tilePos.t <= pT) {
            state.playerTileIndex++;
            if (state.playerTileIndex >= state.currentMap.length) {
                finishGame();
                return;
            }

            state.playerHillPos = tilePos.t;
            state.playerTilePos = 0;
            checkCollision(state);
        } else {
            if (pT > state.playerHillPos + 16.5555) {
                state.playerHillPos += 16.5555;
                state.playerTilePos++;
                checkCollision(state);
            }
        }
    };

    const movePlayer = (dir: number) => {
        const state = gameState.current;
        const newX = state.playerX - dir;

        if (newX >= 0 && newX <= 8) {
            state.playerX = newX;
            const isLeft = dir === -1;

            if (isLeft) {
                state.playerLeft -= 24;
                state.playerTop += 16;
            } else {
                state.playerLeft += 24;
                state.playerTop -= 16;
            }

            if (playerRef.current) {
                playerRef.current.style.left = `${state.playerLeft}px`;
                playerRef.current.style.top = `${state.playerTop}px`;

                if (penguinRef.current) penguinRef.current.src = getPenguinImg(isLeft ? 'left' : 'right');
                if (tubeRef.current) tubeRef.current.src = getTubeImg(isLeft ? 'left' : 'right');

                setTimeout(() => {
                    if (penguinRef.current && !state.isCrashed) penguinRef.current.src = getPenguinImg('default');
                    if (tubeRef.current && !state.isCrashed) tubeRef.current.src = getTubeImg('default');
                }, 100);
            }
        }
    };

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (!gameState.current.isPlaying || gameState.current.isCrashed) return;

        if (e.key === 'ArrowLeft') {
            movePlayer(-1);
        } else if (e.key === 'ArrowRight') {
            movePlayer(1);
        }
    }, []);

    // Main Loop
    useEffect(() => {
        let raf: number;
        const loop = () => {
            updatePhysics();
            raf = requestAnimationFrame(loop);
        };
        raf = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(raf);
    }, [updatePhysics]);

    // Keyboard listener
    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    return (
        <Container maxWidth={false} sx={{
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: '#0184CE',
            overflow: 'hidden',
            p: 0,
            m: 0
        }}>

            <div className={`sled-game-container ${uiState.loading ? 'loading' : ''}`} ref={gameContainerRef} tabIndex={0} style={{ outline: 'none' }}>
                {/* <div className="background"></div> */}
                <img src={backgroundImg} className="background"></img>
                <img src={cloudsImg} className="clouds"></img>
                <img src={mapCornerImg} className="corner"></img>

                <div className="game">
                    <div className="tiles" ref={tilesRef}>
                        <img className="tile tile-start" src={getHillTileImg('Start')} style={{ left: '-18px', top: '101px' }} />
                        {gameState.current.currentMap.map((t, i) => {
                            if (t === 'Finish') return null;
                            if (i === 0) return <img key={i} className={`tile tile-${t}`} src={getHillTileImg(t)} style={{ left: 485, top: 318 }} />;
                            if (i === 1) return <img key={i} className={`tile tile-${t}`} src={getHillTileImg(t)} style={{ left: 734, top: 467 }} />;
                            const l = 734 + (i - 1) * 249;
                            const top = 467 + (i - 1) * 149;
                            return <img key={i} className={`tile tile-${t}`} src={getHillTileImg(t)} style={{ left: l, top: top }} />;
                        })}

                        {(() => {
                            const len = gameState.current.currentMap.length;
                            const lastMapIndex = len - 2;
                            const lastL = 734 + (lastMapIndex - 1) * 249;
                            const lastT = 467 + (lastMapIndex - 1) * 149;
                            return (
                                <>
                                    <img className="tile tile-finish" src={getHillTileImg('Finish')} style={{ left: lastL + 249, top: lastT + 149 }} />
                                    <img className="finish-line" src={otherAssets['./assets/SledRacing/FinishLine.png']} style={{ left: lastL + 249, top: lastT + 149 }} />
                                </>
                            );
                        })()}

                        <div className="player" ref={playerRef} style={{ left: 424, top: 161 }}>
                            <div className="name-tag">You</div>
                            <img className="penguin" ref={penguinRef} src={getPenguinImg('default')} />
                            {/* <img className="tube" ref={tubeRef} src={getTubeImg('default')} /> */}
                            <img className={'shadow-1'} ref={shadowRef} src={tubeAssets['./assets/SledRacing/Tube/shadow.png']} />
                        </div>
                    </div>
                </div>

                {uiState.loading && (
                    <div className="loading-wrapper">
                        <div className="loading-flex">
                            <Box sx={{ color: 'white', fontSize: 24, fontWeight: 'bold' }}>Loading Sled Racing...</Box>
                        </div>
                    </div>
                )}

                {!uiState.isPlaying && !uiState.loading && (
                    <div className="victory-screen" style={{ display: 'block', zIndex: 200 }}>
                        <div className="header">{uiState.isGameOver ? 'Finished!' : 'Sled Racing'}</div>
                        <div style={{ textAlign: 'center', color: 'white', marginTop: 20 }}>
                            {uiState.isGameOver ? `Time: ${uiState.score}` : 'Use Arrow Keys to Move'}
                        </div>
                        <div className="play-again" onClick={initGame} style={{ fontSize: 24, lineHeight: '200%' }}>
                            {uiState.isGameOver ? 'Play Again' : 'Start Game'}
                        </div>

                        <Link to="/" style={{ textDecoration: 'none' }}>
                            <div className="play-again" style={{ bottom: '20%', fontSize: 20, lineHeight: '250%', background: 'rgba(0,0,0,0.2)' }}>
                                Back to Home
                            </div>
                        </Link>
                    </div>
                )}

                {/* Debug Overlay */}
                {/* {uiState.isPlaying && (
                    <div style={{ position: 'absolute', top: 10, left: 10, color: 'white', background: 'rgba(0,0,0,0.5)', padding: 4, zIndex: 500, pointerEvents: 'none' }}>
                        {uiState.debug}
                    </div>
                )} */}
            </div>
            <AudioPlayer isGamePlaying={!uiState.isPlaying} />
        </Container>
    );
}

export default SkiingGame;
