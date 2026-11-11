import { useEffect, useRef } from "react"
import { prefersReduced } from "@/lib/motion"

/** Subtle drifting gold bokeh rendered with Three.js points + a tiny shader. Lazy-loaded, pauses off-screen. */
export function GoldDust({ className, count = 150 }: { className?: string; count?: number }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    let disposed = false
    let cleanup = () => {}

    import("three").then((THREE) => {
      const canvas = ref.current
      if (disposed || !canvas) return
      let renderer: InstanceType<typeof THREE.WebGLRenderer>
      try {
        renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: "low-power" })
      } catch {
        return
      }
      const px = Math.min(window.devicePixelRatio, 1.75)
      renderer.setPixelRatio(px)
      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100)
      camera.position.z = 10

      const pos = new Float32Array(count * 3)
      const seed = new Float32Array(count)
      const size = new Float32Array(count)
      for (let i = 0; i < count; i++) {
        pos[i * 3] = (Math.random() - 0.5) * 20
        pos[i * 3 + 1] = (Math.random() - 0.5) * 12
        pos[i * 3 + 2] = (Math.random() - 0.5) * 8
        seed[i] = Math.random()
        size[i] = 0.35 + Math.random() * Math.random() * 2.2
      }
      const geo = new THREE.BufferGeometry()
      geo.setAttribute("position", new THREE.BufferAttribute(pos, 3))
      geo.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1))
      geo.setAttribute("aSize", new THREE.BufferAttribute(size, 1))

      const uniforms = { uTime: { value: 0 }, uPx: { value: px }, uMouse: { value: new THREE.Vector2() } }
      const mat = new THREE.ShaderMaterial({
        uniforms,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexShader: /* glsl */ `
          uniform float uTime; uniform float uPx; uniform vec2 uMouse;
          attribute float aSeed; attribute float aSize;
          varying float vAlpha;
          void main(){
            vec3 p = position;
            p.y = mod(p.y + 6.0 + uTime * (0.08 + aSeed * 0.22), 12.0) - 6.0;
            p.x += sin(uTime * 0.3 + aSeed * 40.0) * 0.35;
            p.xy += uMouse * (p.z + 5.0) * 0.06;
            vec4 mv = modelViewMatrix * vec4(p, 1.0);
            gl_Position = projectionMatrix * mv;
            gl_PointSize = aSize * 34.0 * uPx / -mv.z;
            vAlpha = 0.25 + 0.75 * (0.5 + 0.5 * sin(uTime * 0.9 + aSeed * 60.0));
          }`,
        fragmentShader: /* glsl */ `
          varying float vAlpha;
          void main(){
            float d = length(gl_PointCoord - 0.5);
            float a = smoothstep(0.5, 0.0, d);
            gl_FragColor = vec4(0.95, 0.82, 0.55, a * a * vAlpha * 0.75);
          }`,
      })
      scene.add(new THREE.Points(geo, mat))

      const resize = () => {
        const w = canvas.clientWidth, h = canvas.clientHeight
        if (!w || !h) return
        renderer.setSize(w, h, false)
        camera.aspect = w / h
        camera.updateProjectionMatrix()
      }
      const ro = new ResizeObserver(resize)
      ro.observe(canvas)
      resize()

      const target = new THREE.Vector2()
      const onMove = (e: PointerEvent) => target.set(e.clientX / innerWidth - 0.5, -(e.clientY / innerHeight - 0.5))
      window.addEventListener("pointermove", onMove, { passive: true })

      let visible = true, raf = 0
      const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting))
      io.observe(canvas)
      const clock = new THREE.Clock()
      const still = prefersReduced()
      const loop = () => {
        raf = requestAnimationFrame(loop)
        if (!visible) return
        uniforms.uTime.value = still ? 4 : clock.getElapsedTime()
        uniforms.uMouse.value.lerp(target, 0.04)
        renderer.render(scene, camera)
      }
      loop()

      cleanup = () => {
        cancelAnimationFrame(raf)
        ro.disconnect(); io.disconnect()
        window.removeEventListener("pointermove", onMove)
        geo.dispose(); mat.dispose(); renderer.dispose()
      }
    })

    return () => { disposed = true; cleanup() }
  }, [count])

  return <canvas ref={ref} className={className} aria-hidden />
}
