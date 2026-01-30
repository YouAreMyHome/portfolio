import React, { useRef, useEffect, useState } from 'react'
import './FlappyCatGame.css'

// Minimal Flappy Cat implementation using Canvas and assets in public/assets/game/Flappy_cat
export default function FlappyCatGame() {
  const canvasRef = useRef(null)
  const ledRef = useRef(null)
  const [running, setRunning] = useState(false)
  const [gameState, setGameState] = useState('menu') // menu | playing | gameover
  const [mode, setMode] = useState('easy') // easy | hard
  const [highScore, setHighScore] = useState(() => Number(localStorage.getItem('flappy-cat-highscore') || 0))
  const scoreRef = useRef(0)
  const [uiScore, setUiScore] = useState(0)

  useEffect(() => {
  const canvas = canvasRef.current
  const ctx = canvas.getContext('2d')
  let w, h
  let rafId = 0
  // foreground/buildings removed per request
  // (no sky gradient; background uses cloud maps)
  let preRenderedClouds = []
  let spriteCols = 0
  let spriteRows = 0

    // Game state
  const GRAVITY = 0.5
  let gravity = GRAVITY
  let speed = 2
    let pipeGap = 160
  let spawnInterval = 1800

    const assetsRoot = '/assets/game/Flappy_cat'

    // Images
  const imgPlayer = new Image()
  // prefer the provided animated GIF if present
  imgPlayer.src = assetsRoot + '/SuperKucingFlyingAnimation.gif'
  const isAnimatedGif = String(imgPlayer.src).toLowerCase().endsWith('.gif')
  // sprite sheet config (approx 48x48 per frame as analyzed)
  const SPRITE_W = 48
  const SPRITE_H = 48
  const frameDurations = { idle: 140, fly: 80, hurt: 100, die: 120 }
    // load 8 cloud maps (each map uses the first tile '1.png')
    const cloudLayers = []
    for (let i = 1; i <= 8; i++) {
      const img = new Image()
      img.src = `${assetsRoot}/Clouds ${i}/1.png`
      cloudLayers.push(img)
    }
    const imgPipe = new Image(); imgPipe.src = assetsRoot + '/pipe/pipe-green.png'
    const imgCoin = new Image(); imgCoin.src = assetsRoot + '/Coin/coin1.png'
    const scoreDigits = []
    for (let i = 0; i < 10; i++) {
      const d = new Image(); d.src = `${assetsRoot}/Score/${i}.png`; scoreDigits.push(d)
    }

  // cloud parallax state (offsets will be set once map size is known)
  const cloudOffsets = new Array(8).fill(0)
  const cloudSpeeds = new Array(8).fill(0).map((_, idx) => 0.2 + idx * 0.12)

    let player = {
      x: 100,
      y: 0,
      vy: 0,
      width: 34,
      height: 24,
      frame: 0,
      frameTime: 0,
      state: 'idle', // idle | fly | hurt | die
      lastFlap: 0,
      hurtTimer: 0,
      alive: true
    }

    // update LED visual if available
    if (ledRef && ledRef.current) {
      const el = ledRef.current
      el.classList.remove('menu','playing','gameover')
      if (gameState === 'playing' && running) el.classList.add('playing')
      else if (gameState === 'gameover') el.classList.add('gameover')
      else el.classList.add('menu')
    }

    // wait for at least the first cloud image to load to set canvas size to map size
    const firstCloud = cloudLayers[0]
    let started = false
    function startWhenReady() {
      if (started) return
      if (firstCloud && firstCloud.complete && firstCloud.naturalWidth) {
        w = canvas.width = firstCloud.naturalWidth
        h = canvas.height = firstCloud.naturalHeight
  // adjust CSS so canvas displays at native size
        canvas.style.width = w + 'px'
        canvas.style.height = h + 'px'
  // keep crisp pixel art
  ctx.imageSmoothingEnabled = false
  // reposition player based on new h
  player.y = h / 2
  player.frame = 0
  player.frameTime = 0
  // initialize cloud offsets relative to width
  for (let i = 0; i < cloudOffsets.length; i++) cloudOffsets[i] = Math.random() * w
  // foreground/buildings intentionally omitted
        // pre-render scaled cloud layers to offscreen canvases (avoid per-frame scaling)
        preRenderedClouds = []
        for (let i = 0; i < cloudLayers.length; i++) {
          const img = cloudLayers[i]
          if (!img || !img.complete) { preRenderedClouds.push(null); continue }
          const layerFactor = 0.22 + i * 0.06
          const layerH = Math.max(24, Math.min(h * 0.6, Math.round(h * layerFactor)))
          const scale = layerH / img.naturalHeight
          const scaledW = Math.max(1, Math.round(img.naturalWidth * scale))
          const off = document.createElement('canvas')
          off.width = scaledW
          off.height = layerH
          const octx = off.getContext('2d')
          octx.imageSmoothingEnabled = false
          octx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, 0, 0, scaledW, layerH)
          preRenderedClouds.push({ canvas: off, w: scaledW, h: layerH })
        }
        // compute sprite cols/rows if player sheet loaded and not using GIF
        if (!isAnimatedGif) {
          if (imgPlayer.complete && imgPlayer.naturalWidth) {
            spriteCols = Math.floor(imgPlayer.naturalWidth / SPRITE_W)
            spriteRows = Math.floor(imgPlayer.naturalHeight / SPRITE_H)
          } else {
            imgPlayer.addEventListener('load', () => {
              spriteCols = Math.floor(imgPlayer.naturalWidth / SPRITE_W)
              spriteRows = Math.floor(imgPlayer.naturalHeight / SPRITE_H)
            }, { once: true })
          }
        }
        lastTime = performance.now()
  rafId = requestAnimationFrame(loop)
        started = true
      } else {
        // try again when it loads
        firstCloud.addEventListener('load', () => startWhenReady(), { once: true })
      }
    }

    let pipes = []
    let coins = []
    let lastPipe = 0
    let lastTime = performance.now()
  let score = 0
    let shield = 0

    function triggerGameOver() {
      setRunning(false)
      setGameState('gameover')
      player.state = 'die'
      player.alive = false
      if (score > highScore) { localStorage.setItem('flappy-cat-highscore', String(score)); setHighScore(score) }
    }

    function reset() {
      player.y = h / 2
      player.vy = 0
  player.state = 'idle'
  player.lastFlap = 0
  player.hurtTimer = 0
  player.alive = true
      pipes = []
      coins = []
      lastPipe = 0
      score = 0
      shield = 0
      speed = 2.2
      gravity = GRAVITY
    }

    function spawnPipe(now) {
      const topHeight = 80 + Math.random() * (h - 300 - pipeGap)
      pipes.push({ x: w + 40, top: topHeight, width: 52, passed: false })
      // occasionally spawn coin between pipes
      if (Math.random() < 0.4) {
        coins.push({ x: w + 40 + 26, y: topHeight + pipeGap / 2, r: 12, taken: false })
      }
      lastPipe = now
    }

    function rectsCollide(a, b, tol = 0) {
      return !(a.x + a.width < b.x + tol || a.x > b.x + b.width - tol || a.y + a.height < b.y + tol || a.y > b.y + b.height - tol)
    }

    function update(dt, now) {
  // remember previous vertical position to detect landing on surfaces
  const prevY = player.y
      // update cloud offsets (parallax)
      for (let i = 0; i < cloudOffsets.length; i++) {
        cloudOffsets[i] = (cloudOffsets[i] - cloudSpeeds[i] * (speed / 2) * (dt / 16)) % w
      }

  // foreground/ground layer removed

  // player physics
  if (player.alive) player.vy += gravity
  player.y += player.vy
  player.frameTime += dt
  // animation frame advance (frame count computed when drawing)
  // idle anim cycles slower
  const frameDelay = player.state === 'idle' ? 140 : 80
  if (player.frameTime > frameDelay) { player.frame = player.frame + 1; player.frameTime = 0 }

      // spawn pipes
      if (now - lastPipe > spawnInterval) spawnPipe(now)

      // move pipes
      for (let p of pipes) {
        p.x -= speed
        // mark passed
        if (!p.passed && p.x + p.width < player.x) { score += 1; p.passed = true; scoreRef.current = score; setUiScore(score) }
      }
      pipes = pipes.filter(p => p.x + p.width > -50)

      // coins
      for (let c of coins) {
        c.x -= speed
        // collect
        const coinRect = { x: c.x - c.r, y: c.y - c.r, width: c.r * 2, height: c.r * 2 }
        const playerRect = { x: player.x, y: player.y, width: player.width, height: player.height }
        if (!c.taken && rectsCollide(coinRect, playerRect)) { c.taken = true; score += 2; shield = Math.min(1, shield + 1) }
      }
      coins = coins.filter(c => c.x + 30 > -50 && !c.taken)

      // collisions with pipes
      for (let p of pipes) {
        const pipeTop = { x: p.x, y: 0, width: p.width, height: p.top }
        const bottomY = p.top + pipeGap
        const pipeBottom = { x: p.x, y: bottomY, width: p.width, height: h - bottomY }
        const playerRect = { x: player.x, y: player.y, width: player.width, height: player.height }

        // landing detection: if player was above the top of the bottom pipe and now intersects it while moving downwards,
        // snap the player to the contact point, then trigger game over (player stands on the object).
        const prevBottom = prevY + player.height
        const currBottom = player.y + player.height
        const landedOnBottomPipe = prevBottom <= bottomY && currBottom >= bottomY && player.vy >= 0 && (player.x + player.width) > p.x && player.x < (p.x + p.width)
        if (landedOnBottomPipe) {
          // snap to top of bottom pipe
          player.y = bottomY - player.height
          player.vy = 0
          // trigger death but keep position
          player.state = 'die'
          player.alive = false
          triggerGameOver()
          // continue to next pipe
          continue
        }

        if (rectsCollide(playerRect, pipeTop) || rectsCollide(playerRect, pipeBottom)) {
          if (shield > 0) {
            shield = 0; /* consume shield */
          } else {
            // attempt to snap to the approximate contact point (top or bottom) then mark dead
            const playerMidY = player.y + player.height / 2
            if (playerMidY < bottomY) {
              // collided with top pipe area -> place player just below the bottom edge of the top pipe
              player.y = p.top + 2
            } else {
              // collided with bottom pipe -> snap to top of bottom pipe
              player.y = bottomY - player.height
            }
            player.vy = 0
            player.state = 'die'
            player.alive = false
            triggerGameOver()
          }
        }
      }

      // boundaries: only die when hitting bottom; allow brief upward travel and clamp top
      if (player.y + player.height > h) {
        if (shield > 0) {
          shield = 0
          player.y = Math.max(10, Math.min(h - player.height - 10, player.y))
        } else {
          // falling out counts as death
          player.state = 'die'
          player.alive = false
          triggerGameOver()
        }
      } else if (player.y < -50) {
        // clamp top to avoid instant death when player flaps too high
        player.y = -50
        player.vy = 0
      }

  // difficulty scaling
  speed += 0.0005 * dt
  if (mode === 'hard') { pipeGap = 130; spawnInterval = 1400; } else { pipeGap = 160; spawnInterval = 1800 }
      // hurt state timer
      if (player.state === 'hurt') {
        player.hurtTimer -= dt
        if (player.hurtTimer <= 0) {
          player.state = 'die'
        }
      }
    }

    function draw() {
      // clear canvas
      ctx.clearRect(0, 0, w, h)

      // Background: draw only the 8 cloud maps as full-viewport layers with horizontal parallax
      for (let i = 0; i < cloudLayers.length; i++) {
        const img = cloudLayers[i]
        const pr = preRenderedClouds && preRenderedClouds[i]
        if (pr) {
          // use pre-rendered smaller layer canvas for performance
          const off = pr.canvas
          const layerW = pr.w
          const layerH = pr.h
          // offset should wrap relative to the layer width, not the full canvas
          const ox = ((cloudOffsets[i] % layerW) + layerW) % layerW
          const y = Math.round((h - layerH) / 2)
          ctx.globalAlpha = Math.max(0.15, 0.85 - i * 0.08)
          // tile the pre-rendered layer across the full canvas width to avoid gaps
          for (let x = -ox; x < w; x += layerW) {
            ctx.drawImage(off, x, y, layerW, layerH)
          }
          ctx.globalAlpha = 1
          continue
        }
        if (!img || !img.complete) continue

        // layer alpha and parallax speed
        ctx.globalAlpha = Math.max(0.15, 0.85 - i * 0.08)

        // compute horizontal offset in pixels and wrap
        const ox = ((cloudOffsets[i] % w) + w) % w
        // draw two copies to ensure seamless wrap
        try {
          ctx.drawImage(img, -ox, 0, w, h)
          ctx.drawImage(img, -ox + w, 0, w, h)
        } catch (e) {
          // fallback: if image aspect differs, draw scaled proportionally and center vertically
          const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight)
          const sw = img.naturalWidth * scale
          const sh = img.naturalHeight * scale
          const y = Math.round((h - sh) / 2)
          ctx.drawImage(img, -ox, y, sw, sh)
          ctx.drawImage(img, -ox + sw, y, sw, sh)
        }

        ctx.globalAlpha = 1
      }

      // pipes
      for (let p of pipes) {
        // top pipe (flip)
        ctx.save()
        ctx.translate(p.x + p.width / 2, p.top / 2)
        ctx.scale(1, -1)
        ctx.drawImage(imgPipe, -p.width / 2, -p.top / 2, p.width, p.top)
        ctx.restore()

        // bottom pipe
        ctx.drawImage(imgPipe, p.x, p.top + pipeGap, p.width, h - (p.top + pipeGap))
      }

  // foreground/buildings removed to avoid overlaying UI

      // coins
      for (let c of coins) {
        ctx.drawImage(imgCoin, c.x - 12, c.y - 12, 24, 24)
      }

      // player (sprite sheet frames + tilt based on vertical velocity)
      if (imgPlayer.complete && imgPlayer.naturalWidth && imgPlayer.naturalHeight) {
        const cols = spriteCols || Math.max(1, Math.floor(imgPlayer.naturalWidth / SPRITE_W))
        const rows = spriteRows || Math.max(1, Math.floor(imgPlayer.naturalHeight / SPRITE_H))
        if (isAnimatedGif) {
          // for animated GIFs, draw the current GIF frame as-is and rotate
          const cx = player.x + 30
          const cy = player.y + 24
          const baseAngle = Math.max(-0.6, Math.min(0.6, player.vy * 0.06))
          const angle = player.state === 'hurt' || player.state === 'die' ? baseAngle + 0.8 : baseAngle
          ctx.save()
          ctx.translate(cx, cy)
          ctx.rotate(angle)
          ctx.drawImage(imgPlayer, -30, -24, 60, 48)
          ctx.restore()
        } else {
          // map states to rows (based on your analysis)
          const rowMap = {
            idle: 0,
            fly: 1,
            hurt: 3,
            die: 4
          }
          let row = rowMap[player.state] !== undefined ? rowMap[player.state] : 0
          // ensure row within available rows
          row = Math.min(row, rows - 1)

          const frameCount = Math.max(1, cols)
          // clamp frame index to cycle
          const f = ((player.frame % frameCount) + frameCount) % frameCount
          const sx = f * SPRITE_W
          const sy = row * SPRITE_H

          // tilt when alive; when dead/hurt tilt more
          const cx = player.x + 30
          const cy = player.y + 24
          const baseAngle = Math.max(-0.6, Math.min(0.6, player.vy * 0.06))
          const angle = player.state === 'hurt' || player.state === 'die' ? baseAngle + 0.8 : baseAngle

          ctx.save()
          ctx.translate(cx, cy)
          ctx.rotate(angle)
          ctx.drawImage(imgPlayer, sx, sy, SPRITE_W, SPRITE_H, -30, -24, 60, 48)
          ctx.restore()
        }
      } else {
        ctx.fillStyle = 'orange'
        ctx.fillRect(player.x, player.y, player.width, player.height)
      }

  // HUD is rendered as HTML overlays for clarity
    }

  function loop(now) {
      const dt = now - lastTime
      lastTime = now
      if (running) update(dt, now)
      draw()
      rafId = requestAnimationFrame(loop)
    }

    // input handlers
    function flap() {
  if (!player.alive) return
  player.vy = -10
  // set fly animation
  player.state = 'fly'
  player.frame = 0
  player.frameTime = 0
  player.lastFlap = performance.now()
  if (gameState === 'menu') {
    setGameState('playing')
    setRunning(true)
  }
    }

    function onKey(e) {
      if (e.code === 'Space') { e.preventDefault(); flap(); if (!running) setRunning(true) }
    }

    function onTap() { flap(); }

    function doRestart() {
      reset()
      setGameState('menu')
      setRunning(false)
    }

    window.addEventListener('keydown', onKey)
    canvas.addEventListener('pointerdown', onTap)

  // start loop once map size known
  startWhenReady()

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('keydown', onKey)
      canvas.removeEventListener('pointerdown', onTap)
    }
  }, [running, mode, highScore, gameState])

  return (
    <div className="flappy-wrap">
      <div className="controls">
        {/* Play / Pause contextually */}
          {!running ? (
          <button className="fc-btn pixel" onClick={() => { setRunning(true); setGameState('playing') }} aria-label="Play">
            <img className="icon-img" src={'/assets/ui/icon-play.svg'} alt="play" />
          </button>
        ) : (
          <button className="fc-btn pixel" onClick={() => { setRunning(false); setGameState('menu') }} aria-label="Pause">
            <img className="icon-img" src={'/assets/ui/icon-pause.svg'} alt="pause" />
          </button>
        )}

        {/* Restart: reset game state without reload */}
        <button className="fc-btn pixel" onClick={() => { doRestart() }} aria-label="Restart">
          <img className="icon-img" src={'/assets/ui/icon-restart.svg'} alt="restart" />
        </button>

        {/* Mode selector styled */}
        <label style={{ marginLeft: 6, marginRight: 6, fontFamily: 'monospace' }}>Mode:</label>
        <select className="fc-mode" value={mode} onChange={e => setMode(e.target.value)}>
          <option value="easy">Easy</option>
          <option value="hard">Hard</option>
        </select>

        {/* Info button (pixel-style) */}
        <button className="fc-btn pixel" title="Info" aria-label="Info">
          <img className="icon-img" src={'/assets/ui/icon-info.svg'} alt="info" />
        </button>
      </div>
      <div className="tv-frame">
        <div className="tv-bezel">
          <div className="tv-screen">
            <canvas ref={canvasRef} className="flappy-canvas" />
            <div className="scanlines" />
            <div className="glare" />
          </div>
          {/* HUD and HTML overlays for Menu/GameOver */}
          <div style={{ position: 'absolute', left: 12, top: 10, zIndex: 40 }} className="hud-font">
            <div style={{ color: 'white', fontSize: 10 }}>Score: {uiScore}</div>
            <div style={{ color: 'white', fontSize: 10 }}>High: {highScore}</div>
          </div>
          {!running && gameState === 'menu' && (
            <div className="gameover-overlay">
              <div className="title hud-font">FLAPPY CAT</div>
              <div className="score hud-font">Tap / Space to flap</div>
              <div>
                <button className="overlay-btn primary pixel" onClick={() => { setGameState('playing'); setRunning(true) }}>PLAY</button>
              </div>
            </div>
          )}
          {!running && gameState === 'gameover' && (
            <div className="gameover-overlay">
              <div className="title hud-font">GAME OVER</div>
              <div className="score hud-font">Score: {uiScore}</div>
              <div>
                <button className="overlay-btn primary pixel" onClick={() => { doRestart(); setRunning(true); setGameState('playing') }}>RESTART</button>
                <button className="overlay-btn ghost pixel" onClick={() => { doRestart(); setGameState('menu') }}>MENU</button>
              </div>
            </div>
          )}
          <div className="tv-footer">
            <div ref={ledRef} className="led menu" aria-hidden="true" />
            <div className="knobs">
              <div className="knob" />
              <div className="knob small" />
            </div>
          </div>
        </div>
      </div>
      <div className="note">Tap / Space to flap • Coins give +2 & shield</div>
    </div>
  )
}
