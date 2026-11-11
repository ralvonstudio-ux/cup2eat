import { useRef } from "react"
import { gsap, useGSAP } from "@/lib/motion"

const CRITICAL = ["/logo.png", "/media/cup-iced-cut.webp", "/media/cup-pour-cut.webp"]

export function Preloader({ onDone }: { onDone: () => void }) {
  const root = useRef<HTMLDivElement>(null)
  const num = useRef<HTMLSpanElement>(null)

  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      const images = Promise.all(
        CRITICAL.map((src) => new Promise((r) => { const i = new Image(); i.onload = i.onerror = () => r(null); i.src = src }))
      )
      const fonts = document.fonts?.ready ?? Promise.resolve()
      const counter = { v: 0 }

      const tl = gsap.timeline({ paused: true })
      tl.to(counter, {
        v: 100, duration: 2.1, ease: "power2.inOut",
        onUpdate: () => { if (num.current) num.current.textContent = String(Math.round(counter.v)).padStart(3, "0") },
      }, 0)
        .fromTo(q(".pl-fill"), { clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0% 0 0 0)", duration: 2.1, ease: "power2.inOut" }, 0)
        .from(q(".pl-meta"), { opacity: 0, y: 12, stagger: 0.08, duration: 0.8 }, 0.1)
        .to(q(".pl-center, .pl-meta"), { opacity: 0, y: -24, duration: 0.6, ease: "power3.in", stagger: 0.03 }, "+=0.2")
        .to(q(".pl-ink"), { yPercent: -100, duration: 1.15, ease: "expo.inOut" }, "-=0.15")
        .to(q(".pl-gold"), { yPercent: -100, duration: 1.15, ease: "expo.inOut" }, "<0.12")
        .add(onDone, "<0.1")
        .set(root.current, { display: "none" })

      Promise.all([images, fonts]).then(() => tl.play())
    },
    { scope: root }
  )

  return (
    <div ref={root} className="fixed inset-0 z-[100]" aria-label="Loading">
      <div className="pl-gold absolute inset-0 bg-[linear-gradient(160deg,var(--color-gold-hi),var(--color-bronze))]" />
      <div className="pl-ink absolute inset-0 flex flex-col items-center justify-center bg-ink">
        <div className="pl-center flex flex-col items-center">
          <div className="relative size-[132px] md:size-[168px]">
            <img src="/logo.png" alt="" className="absolute inset-0 size-full opacity-15 grayscale" />
            <img src="/logo.png" alt="" className="pl-fill absolute inset-0 size-full drop-shadow-[0_20px_50px_rgba(201,164,92,.35)]" />
          </div>
          <div className="mt-8 flex items-baseline gap-3 text-cream/60">
            <span ref={num} className="display text-5xl tabular-nums text-gold-hi">000</span>
            <span className="eyebrow">Pouring your cup</span>
          </div>
        </div>
        <span className="pl-meta eyebrow gutter absolute left-0 top-7 text-cream/50">Cup2Eat</span>
        <span className="pl-meta eyebrow gutter absolute right-0 top-7 text-cream/50">Edible cups</span>
        <span className="pl-meta eyebrow gutter absolute bottom-7 left-0 text-cream/50">Zero waste</span>
        <span className="pl-meta display gutter absolute bottom-6 right-0 text-2xl italic text-gold">Eat your drink.</span>
      </div>
    </div>
  )
}
