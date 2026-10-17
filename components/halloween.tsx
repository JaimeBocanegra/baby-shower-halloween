'use client'

import { useEffect, useRef } from 'react'

type Kind = 'bat' | 'spider' | 'pumpkin' | 'ghost' | 'spark' | 'trail'

interface Particle {
  kind: Kind
  x: number
  y: number
  base: number
  size: number
  vx: number
  vy: number
  phase: number
  color: string
  alpha: number
  life?: number
  maxLife?: number
}

const INK = '#2c1a3d'
const ORANGE = '#ef8020'
const VIOLET = '#8a55c8'
const GHOST = '#fdf9ff'
const TAU = Math.PI * 2

const rand = (min: number, max: number) => min + Math.random() * (max - min)
const pick = (list: string[]) => list[Math.floor(Math.random() * list.length)]

function createParticles(w: number, h: number): Particle[] {
  const small = w < 640
  const list: Particle[] = []

  const bats = small ? 3 : 5
  for (let i = 0; i < bats; i++) {
    list.push({
      kind: 'bat',
      x: rand(-40, w + 40),
      y: 0,
      base: rand(40, h * 0.72),
      size: rand(16, 27),
      vx: rand(45, 95) * (Math.random() < 0.5 ? -1 : 1),
      vy: 0,
      phase: rand(0, TAU),
      color: INK,
      alpha: rand(0.55, 0.85),
    })
  }

  const spiders = small ? 2 : 3
  for (let i = 0; i < spiders; i++) {
    list.push({
      kind: 'spider',
      x: rand(40, w - 40),
      y: rand(-60, h * 0.8),
      base: rand(40, w - 40),
      size: rand(12, 18),
      vx: 0,
      vy: rand(9, 22),
      phase: rand(0, TAU),
      color: INK,
      alpha: rand(0.5, 0.8),
    })
  }

  const pumpkins = small ? 4 : 6
  for (let i = 0; i < pumpkins; i++) {
    list.push({
      kind: 'pumpkin',
      x: rand(20, w - 20),
      y: rand(-40, h + 40),
      base: 0,
      size: rand(16, 26),
      vx: 0,
      vy: -rand(8, 18),
      phase: rand(0, TAU),
      color: ORANGE,
      alpha: rand(0.7, 0.95),
    })
  }

  const ghosts = small ? 2 : 3
  for (let i = 0; i < ghosts; i++) {
    list.push({
      kind: 'ghost',
      x: rand(0, w),
      y: rand(0, h),
      base: 0,
      size: rand(22, 34),
      vx: rand(-14, 14),
      vy: -rand(5, 12),
      phase: rand(0, TAU),
      color: GHOST,
      alpha: rand(0.5, 0.75),
    })
  }

  const sparks = small ? 14 : 22
  for (let i = 0; i < sparks; i++) {
    list.push({
      kind: 'spark',
      x: rand(0, w),
      y: rand(0, h),
      base: 0,
      size: rand(2.5, 6),
      vx: 0,
      vy: rand(16, 46),
      phase: rand(0, TAU),
      color: pick([ORANGE, VIOLET, '#f7b741']),
      alpha: rand(0.35, 0.85),
    })
  }

  return list
}

function step(p: Particle, dt: number, t: number, w: number, h: number) {
  switch (p.kind) {
    case 'bat': {
      p.x += p.vx * dt
      p.y = p.base + Math.sin(t * 1.7 + p.phase) * 20
      if (p.x < -80) {
        p.x = w + 60
        p.base = rand(40, h * 0.72)
      } else if (p.x > w + 80) {
        p.x = -60
        p.base = rand(40, h * 0.72)
      }
      break
    }
    case 'spider': {
      p.y += p.vy * dt
      p.x = p.base + Math.sin(t * 1.1 + p.phase) * 15
      if (p.y > h + 60) {
        p.y = -50
        p.base = rand(40, Math.max(60, w - 40))
      }
      break
    }
    case 'pumpkin': {
      p.y += p.vy * dt
      p.x += Math.sin(t * 0.9 + p.phase) * 14 * dt
      if (p.y < -70) {
        p.y = h + 45
        p.x = rand(20, Math.max(40, w - 20))
      }
      break
    }
    case 'ghost': {
      p.x += p.vx * dt
      p.y += p.vy * dt
      if (p.y < -80) {
        p.y = h + 55
        p.x = rand(20, Math.max(40, w - 20))
      }
      if (p.x < -80) p.x = w + 60
      else if (p.x > w + 80) p.x = -60
      break
    }
    case 'spark': {
      p.y += p.vy * dt
      p.x += Math.sin(t * 2 + p.phase) * 12 * dt
      if (p.y > h + 20) {
        p.y = -20
        p.x = rand(0, w)
      }
      break
    }
    case 'trail': {
      p.life = (p.life ?? 0) - dt
      p.x += p.vx * dt
      p.y += p.vy * dt
      p.vy -= 22 * dt
      p.alpha = Math.max(0, (p.life / (p.maxLife ?? 1)) * 0.95)
      break
    }
  }
}

function spawnTrail(x: number, y: number): Particle {
  const life = rand(0.5, 1)
  return {
    kind: 'trail',
    x: x + rand(-7, 7),
    y: y + rand(-7, 7),
    base: 0,
    size: rand(2.2, 5),
    vx: rand(-20, 20),
    vy: rand(-34, -8),
    phase: rand(0, TAU),
    color: pick([ORANGE, '#f7b741', VIOLET, '#ffd79a']),
    alpha: 0.95,
    life,
    maxLife: life,
  }
}

function drawBat(ctx: CanvasRenderingContext2D, p: Particle, t: number) {
  const s = p.size
  const flap = Math.sin(t * 10 + p.phase)
  ctx.save()
  ctx.translate(p.x, p.y)
  ctx.fillStyle = p.color
  ctx.globalAlpha = p.alpha

  for (const dir of [-1, 1]) {
    ctx.beginPath()
    ctx.moveTo(dir * s * 0.1, -s * 0.06)
    ctx.bezierCurveTo(
      dir * s * 0.42,
      -s * 0.5 - flap * s * 0.26,
      dir * s * 0.76,
      -s * 0.56 - flap * s * 0.3,
      dir * s,
      -s * 0.16 - flap * s * 0.36,
    )
    ctx.bezierCurveTo(
      dir * s * 0.8,
      s * 0.14 - flap * s * 0.1,
      dir * s * 0.45,
      s * 0.24,
      dir * s * 0.1,
      s * 0.14,
    )
    ctx.closePath()
    ctx.fill()
  }

  ctx.beginPath()
  ctx.ellipse(0, 0, s * 0.16, s * 0.26, 0, 0, TAU)
  ctx.fill()

  ctx.beginPath()
  ctx.moveTo(-s * 0.13, -s * 0.18)
  ctx.lineTo(-s * 0.05, -s * 0.38)
  ctx.lineTo(s * 0.01, -s * 0.2)
  ctx.moveTo(s * 0.13, -s * 0.18)
  ctx.lineTo(s * 0.05, -s * 0.38)
  ctx.lineTo(-s * 0.01, -s * 0.2)
  ctx.fill()
  ctx.restore()
}

function drawSpider(ctx: CanvasRenderingContext2D, p: Particle, t: number) {
  const s = p.size
  ctx.save()
  ctx.globalAlpha = p.alpha

  ctx.strokeStyle = 'rgba(44, 26, 61, .4)'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(p.base, -8)
  ctx.lineTo(p.x, p.y - s * 0.5)
  ctx.stroke()

  ctx.translate(p.x, p.y)
  ctx.strokeStyle = p.color
  ctx.lineWidth = Math.max(1.3, s * 0.1)
  ctx.lineCap = 'round'
  const wig = Math.sin(t * 5 + p.phase) * s * 0.1

  for (let i = 0; i < 4; i++) {
    const ay = (i - 1.5) * s * 0.17
    for (const dir of [-1, 1]) {
      ctx.beginPath()
      ctx.moveTo(dir * s * 0.1, ay * 0.5)
      ctx.quadraticCurveTo(dir * s * 0.6, ay - s * 0.3 + wig, dir * s * 0.8, ay + s * 0.32)
      ctx.stroke()
    }
  }

  ctx.fillStyle = p.color
  ctx.beginPath()
  ctx.ellipse(0, s * 0.16, s * 0.3, s * 0.36, 0, 0, TAU)
  ctx.fill()
  ctx.beginPath()
  ctx.arc(0, -s * 0.2, s * 0.2, 0, TAU)
  ctx.fill()

  ctx.fillStyle = '#fdf4ff'
  ctx.beginPath()
  ctx.arc(-s * 0.08, -s * 0.24, s * 0.05, 0, TAU)
  ctx.arc(s * 0.08, -s * 0.24, s * 0.05, 0, TAU)
  ctx.fill()
  ctx.restore()
}

function drawPumpkin(ctx: CanvasRenderingContext2D, p: Particle, t: number) {
  const s = p.size
  ctx.save()
  ctx.translate(p.x, p.y)
  ctx.rotate(Math.sin(t * 1.6 + p.phase) * 0.12)
  ctx.globalAlpha = p.alpha

  ctx.fillStyle = '#4f7d35'
  ctx.beginPath()
  ctx.moveTo(-s * 0.06, -s * 0.5)
  ctx.quadraticCurveTo(s * 0.06, -s * 0.66, s * 0.14, -s * 0.52)
  ctx.lineTo(s * 0.05, -s * 0.4)
  ctx.closePath()
  ctx.fill()

  ctx.fillStyle = '#dd6d14'
  ctx.beginPath()
  ctx.ellipse(0, 0, s * 0.5, s * 0.42, 0, 0, TAU)
  ctx.fill()
  ctx.fillStyle = ORANGE
  ctx.beginPath()
  ctx.ellipse(-s * 0.2, 0, s * 0.26, s * 0.4, 0, 0, TAU)
  ctx.ellipse(s * 0.2, 0, s * 0.26, s * 0.4, 0, 0, TAU)
  ctx.fill()
  ctx.fillStyle = '#f79a3c'
  ctx.beginPath()
  ctx.ellipse(0, 0, s * 0.2, s * 0.4, 0, 0, TAU)
  ctx.fill()

  ctx.fillStyle = '#3b1d08'
  ctx.beginPath()
  ctx.moveTo(-s * 0.24, -s * 0.14)
  ctx.lineTo(-s * 0.07, -s * 0.14)
  ctx.lineTo(-s * 0.16, s * 0.02)
  ctx.closePath()
  ctx.moveTo(s * 0.24, -s * 0.14)
  ctx.lineTo(s * 0.07, -s * 0.14)
  ctx.lineTo(s * 0.16, s * 0.02)
  ctx.closePath()
  ctx.fill()
  ctx.beginPath()
  ctx.moveTo(-s * 0.24, s * 0.12)
  ctx.quadraticCurveTo(0, s * 0.36, s * 0.24, s * 0.12)
  ctx.quadraticCurveTo(0, s * 0.2, -s * 0.24, s * 0.12)
  ctx.closePath()
  ctx.fill()
  ctx.restore()
}

function drawGhost(ctx: CanvasRenderingContext2D, p: Particle, t: number) {
  const s = p.size
  const wob = Math.sin(t * 2 + p.phase)
  ctx.save()
  ctx.translate(p.x, p.y + wob * s * 0.08)
  ctx.globalAlpha = p.alpha * (0.78 + 0.22 * Math.sin(t * 2.4 + p.phase))

  ctx.fillStyle = p.color
  ctx.beginPath()
  ctx.arc(0, -s * 0.14, s * 0.4, Math.PI, 0)
  ctx.lineTo(s * 0.4, s * 0.28)
  ctx.quadraticCurveTo(s * 0.26, s * 0.5 + wob * s * 0.06, s * 0.13, s * 0.3)
  ctx.quadraticCurveTo(0, s * 0.52 + wob * s * 0.06, -s * 0.13, s * 0.3)
  ctx.quadraticCurveTo(-s * 0.26, s * 0.5 + wob * s * 0.06, -s * 0.4, s * 0.28)
  ctx.closePath()
  ctx.fill()
  ctx.strokeStyle = 'rgba(125, 75, 191, .4)'
  ctx.lineWidth = 1.1
  ctx.stroke()

  ctx.fillStyle = '#3a2456'
  ctx.beginPath()
  ctx.ellipse(-s * 0.15, -s * 0.16, s * 0.07, s * 0.09, 0, 0, TAU)
  ctx.ellipse(s * 0.15, -s * 0.16, s * 0.07, s * 0.09, 0, 0, TAU)
  ctx.fill()
  ctx.beginPath()
  ctx.ellipse(0, s * 0.04, s * 0.06, s * 0.08, 0, 0, TAU)
  ctx.fill()
  ctx.restore()
}

function drawSpark(ctx: CanvasRenderingContext2D, p: Particle, t: number) {
  const s = p.size
  ctx.save()
  ctx.translate(p.x, p.y)
  ctx.rotate(t * 1.4 + p.phase)
  ctx.globalAlpha = p.alpha * (0.6 + 0.4 * Math.sin(t * 3 + p.phase))
  ctx.fillStyle = p.color
  ctx.beginPath()
  ctx.moveTo(0, -s)
  ctx.quadraticCurveTo(s * 0.2, -s * 0.2, s, 0)
  ctx.quadraticCurveTo(s * 0.2, s * 0.2, 0, s)
  ctx.quadraticCurveTo(-s * 0.2, s * 0.2, -s, 0)
  ctx.quadraticCurveTo(-s * 0.2, -s * 0.2, 0, -s)
  ctx.closePath()
  ctx.fill()
  ctx.restore()
}

function draw(ctx: CanvasRenderingContext2D, p: Particle, t: number) {
  switch (p.kind) {
    case 'bat':
      drawBat(ctx, p, t)
      break
    case 'spider':
      drawSpider(ctx, p, t)
      break
    case 'pumpkin':
      drawPumpkin(ctx, p, t)
      break
    case 'ghost':
      drawGhost(ctx, p, t)
      break
    case 'spark':
      drawSpark(ctx, p, t)
      break
    case 'trail':
      drawSpark(ctx, p, t)
      break
  }
}

export function HalloweenParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const cv: HTMLCanvasElement = canvas
    const g: CanvasRenderingContext2D = ctx

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let width = 0
    let height = 0
    let particles: Particle[] = []
    let raf = 0
    let last = performance.now()
    let pointerX = 0
    let pointerY = 0
    let pointerActive = false
    let lastTrail = 0

    const cursorBat: Particle = {
      kind: 'bat',
      x: 0,
      y: 0,
      base: 0,
      size: 13,
      vx: 0,
      vy: 0,
      phase: 0,
      color: INK,
      alpha: 0.9,
    }
    let batActive = false

    function onPointerMove(event: PointerEvent) {
      pointerX = event.clientX
      pointerY = event.clientY
      pointerActive = true
      if (!batActive) {
        batActive = true
        cursorBat.x = pointerX
        cursorBat.y = pointerY
      }
      if (reduced) return
      const now = performance.now()
      if (now - lastTrail > 42 && particles.length < 260) {
        lastTrail = now
        particles.push(spawnTrail(pointerX, pointerY))
      }
    }

    function onPointerLeave() {
      pointerActive = false
      batActive = false
    }

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = window.innerWidth
      height = window.innerHeight
      cv.width = Math.max(1, Math.floor(width * dpr))
      cv.height = Math.max(1, Math.floor(height * dpr))
      cv.style.width = `${width}px`
      cv.style.height = `${height}px`
      g.setTransform(dpr, 0, 0, dpr, 0, 0)
      particles = createParticles(width, height)
      if (reduced) render(performance.now(), 0)
    }

    function render(now: number, dt: number) {
      const t = now / 1000
      g.clearRect(0, 0, width, height)
      for (const p of particles) {
        if (dt > 0) step(p, dt, t, width, height)
        draw(g, p, t)
      }
      if (dt > 0) {
        const alive = particles.filter((p) => p.kind !== 'trail' || (p.life ?? 0) > 0)
        if (alive.length !== particles.length) particles = alive
      }

      if (pointerActive && batActive) {
        const glow = g.createRadialGradient(pointerX, pointerY, 0, pointerX, pointerY, 95)
        glow.addColorStop(0, 'rgba(255, 168, 74, .2)')
        glow.addColorStop(0.55, 'rgba(214, 118, 40, .08)')
        glow.addColorStop(1, 'rgba(214, 118, 40, 0)')
        g.fillStyle = glow
        g.fillRect(pointerX - 95, pointerY - 95, 190, 190)

        cursorBat.x += (pointerX + 26 - cursorBat.x) * 0.09
        cursorBat.y += (pointerY + 22 - cursorBat.y) * 0.09
        drawBat(g, cursorBat, t)
      }
    }

    function frame(now: number) {
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      render(now, dt)
      raf = requestAnimationFrame(frame)
    }

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerleave', onPointerLeave)
    if (!reduced) raf = requestAnimationFrame(frame)

    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerleave', onPointerLeave)
      cancelAnimationFrame(raf)
    }
  }, [])

  return <canvas ref={canvasRef} className="halloween-particles" aria-hidden="true" />
}

function mulberry32(seed: number) {
  let a = seed
  return function next() {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function SectionParticles({
  count = 10,
  seed = 7,
  tone = 'light',
}: {
  count?: number
  seed?: number
  tone?: 'light' | 'dark'
}) {
  const random = mulberry32(seed)
  const dust = Array.from({ length: count }, (_, index) => {
    const duration = 9 + random() * 9
    return {
      key: index,
      style: {
        left: `${(4 + random() * 92).toFixed(2)}%`,
        top: `${(10 + random() * 82).toFixed(2)}%`,
        width: `${(3 + random() * 5).toFixed(2)}px`,
        height: `${(3 + random() * 5).toFixed(2)}px`,
        animationDuration: `${duration.toFixed(2)}s`,
        animationDelay: `${(-random() * duration).toFixed(2)}s`,
        '--drift': `${(-45 + random() * 90).toFixed(1)}px`,
        '--peak': (0.3 + random() * 0.4).toFixed(2),
      } as React.CSSProperties,
    }
  })

  return (
    <div className={`section-particles tone-${tone}`} aria-hidden="true">
      {dust.map((item) => (
        <span key={item.key} className="section-dust" style={item.style} />
      ))}
    </div>
  )
}

const WEB_DIRS: Array<[number, number]> = [
  [1, 0],
  [0.944, 0.33],
  [0.819, 0.573],
  [0.514, 0.857],
  [0.243, 0.97],
]

function cobwebPaths() {
  const paths: string[] = []
  for (const [dx, dy] of WEB_DIRS) paths.push(`M0 0 L${(dx * 125).toFixed(1)} ${(dy * 125).toFixed(1)}`)
  for (const r of [45, 78, 112]) {
    const pts = WEB_DIRS.map(([dx, dy]) => [dx * r, dy * r])
    for (let i = 0; i < pts.length - 1; i++) {
      const [x1, y1] = pts[i]
      const [x2, y2] = pts[i + 1]
      const cx = ((x1 + x2) / 2) * 0.8
      const cy = ((y1 + y2) / 2) * 0.8
      paths.push(`M${x1.toFixed(1)} ${y1.toFixed(1)} Q${cx.toFixed(1)} ${cy.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}`)
    }
  }
  return paths
}

export function Cobweb({ position = 'tl' }: { position?: 'tl' | 'tr' | 'bl' | 'br' }) {
  return (
    <svg className={`cobweb cobweb-${position}`} viewBox="0 0 130 130" aria-hidden="true">
      {cobwebPaths().map((d, i) => (
        <path key={i} d={d} />
      ))}
    </svg>
  )
}

export function BatGlyph({ className }: { className?: string }) {
  const wing = 'M50 17C42 11 32 8 22 10 15 11.4 8 9 2 4c3 10 2 20-2 28 10-6 22-5 30 0 4-4 10-7 20-8Z'
  return (
    <svg className={className} viewBox="0 0 100 46" aria-hidden="true" fill="currentColor">
      <path d={wing} />
      <g transform="translate(100 0) scale(-1 1)">
        <path d={wing} />
      </g>
      <ellipse cx="50" cy="24" rx="6.5" ry="9.5" />
      <path d="M44.5 16 46 6.5 51 14.5ZM55.5 16 54 6.5 49 14.5Z" />
    </svg>
  )
}

export function HangingSpider({ className }: { className?: string }) {
  const legs = [
    'M40 112C52 106 56 98 57 88',
    'M42 120C54 118 58 112 59 103',
    'M42 128C54 130 57 136 58 145',
    'M39 134C50 140 53 147 54 155',
  ]
  return (
    <svg className={className} viewBox="0 0 60 160" aria-hidden="true">
      <line x1="30" y1="0" x2="30" y2="98" stroke="currentColor" strokeWidth="1.2" opacity=".55" />
      <g stroke="currentColor" strokeWidth="2.6" fill="none" strokeLinecap="round">
        {legs.map((d) => (
          <path key={d} d={d} />
        ))}
        <g transform="translate(60 0) scale(-1 1)">
          {legs.map((d) => (
            <path key={d} d={d} />
          ))}
        </g>
      </g>
      <ellipse cx="30" cy="124" rx="13" ry="15" fill="currentColor" />
      <circle cx="30" cy="106" r="8.5" fill="currentColor" />
      <circle cx="27" cy="104" r="1.7" fill="#fff8ef" />
      <circle cx="33" cy="104" r="1.7" fill="#fff8ef" />
    </svg>
  )
}

export function PumpkinGlyph({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" aria-hidden="true">
      <path d="M30 12c0-5 3-8 8-8-1 5-3 7-6 8Z" fill="#4f7d35" />
      <ellipse cx="32" cy="38" rx="27" ry="21" fill="#dd6d14" />
      <ellipse cx="17" cy="38" rx="14" ry="20" fill="#ef8020" />
      <ellipse cx="47" cy="38" rx="14" ry="20" fill="#ef8020" />
      <ellipse cx="32" cy="38" rx="11" ry="20" fill="#f79a3c" />
      <path d="M17 32l10 1 4 8ZM47 32l-10 1-4 8Z" fill="#3b1d08" />
      <path d="M17 45c4 8 10 11 15 11s11-3 15-11c-5 4-10 5-15 5s-10-1-15-5Z" fill="#3b1d08" />
    </svg>
  )
}
