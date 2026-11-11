import { useRef, type ReactNode } from "react"
import { Cookie, Leaf, Recycle, Drop } from "@phosphor-icons/react"
import { Badge } from "@/components/ui/badge"
import { gsap, useGSAP, revealLines, isFinePointer } from "@/lib/motion"
import { cn } from "@/lib/utils"

function TiltCard({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  useGSAP(() => {
    const el = ref.current
    if (!el || !isFinePointer()) return
    const rx = gsap.quickTo(el, "rotateX", { duration: 0.8, ease: "power3" })
    const ry = gsap.quickTo(el, "rotateY", { duration: 0.8, ease: "power3" })
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height
      el.style.setProperty("--mx", `${x * 100}%`)
      el.style.setProperty("--my", `${y * 100}%`)
      ry((x - 0.5) * 7); rx((0.5 - y) * 6)
    }
    const leave = () => { rx(0); ry(0) }
    el.addEventListener("pointermove", move)
    el.addEventListener("pointerleave", leave)
    return () => { el.removeEventListener("pointermove", move); el.removeEventListener("pointerleave", leave) }
  })
  return (
    <div
      ref={ref}
      className={cn(
        "why-card group/card relative overflow-hidden rounded-[28px] [transform-style:preserve-3d]",
        "after:pointer-events-none after:absolute after:inset-0 after:rounded-[inherit] after:opacity-0 after:transition-opacity after:duration-500 hover:after:opacity-100",
        "after:bg-[radial-gradient(500px_circle_at_var(--mx,50%)_var(--my,50%),rgba(238,215,164,.16),transparent_60%)]",
        className
      )}
    >
      {children}
    </div>
  )
}

export function WhyEdible() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      revealLines(q(".why-title")[0])
      gsap.from(q(".why-card"), {
        y: 90, opacity: 0, duration: 1.3, stagger: 0.12, ease: "expo.out",
        scrollTrigger: { trigger: q(".why-grid")[0], start: "top 82%", once: true },
      })
      gsap.fromTo(q(".why-macro"), { scale: 1.25 }, {
        scale: 1, ease: "none",
        scrollTrigger: { trigger: q(".why-grid")[0], start: "top bottom", end: "bottom top", scrub: true },
      })
      gsap.from(q(".why-ring"), {
        strokeDashoffset: 1, duration: 2.2, ease: "power3.inOut",
        scrollTrigger: { trigger: q(".why-zero")[0], start: "top 80%", once: true },
      })
      gsap.to(q(".why-float"), { y: -18, rotate: 3, duration: 3.4, ease: "sine.inOut", yoyo: true, repeat: -1 })
    },
    { scope: root }
  )

  return (
    <section ref={root} id="why" className="gutter relative py-[clamp(110px,16vh,180px)]">
      <div className="mx-auto max-w-[1320px]">
        <div className="mb-14 grid gap-8 md:mb-20 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <span className="eyebrow text-gold">(03) — Why edible</span>
            <h2 className="why-title display mt-6 text-[clamp(48px,7vw,116px)]">
              The cup is the <em className="text-gold-grad">best part.</em>
            </h2>
          </div>
          <p className="text-[17px] font-light leading-relaxed text-cream/60 md:col-span-4">
            One small swap that changes what every drink leaves behind.
          </p>
        </div>

        <div className="why-grid grid gap-4 [perspective:1400px] md:grid-cols-12 md:grid-rows-[300px_300px]">
          {/* A — Edible */}
          <TiltCard className="min-h-[440px] md:col-span-7 md:row-span-2">
            <img src="/media/macro.webp" alt="Macro shot of the toasted waffle texture" loading="lazy" className="why-macro absolute inset-0 size-full object-cover transition-[filter] duration-700 group-hover/card:brightness-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 p-7 md:p-10">
              <div>
                <Badge><Cookie weight="duotone" className="size-3.5" /> Edible</Badge>
                <h3 className="display mt-5 text-[clamp(40px,4.4vw,72px)] leading-[0.95]">Baked to be<br /><em className="text-gold-grad">the last bite.</em></h3>
              </div>
              <p className="hidden max-w-[24ch] text-[15px] font-light leading-relaxed text-cream/70 lg:block">
                A crisp, toasted waffle cup — a treat in its own right, not packaging.
              </p>
            </div>
          </TiltCard>

          {/* B — Eco */}
          <TiltCard className="min-h-[280px] border border-gold/15 bg-[linear-gradient(150deg,#145441,#0b3a2e_60%,#072620)] p-7 md:col-span-5 md:p-9">
            <div className="flex h-full flex-col justify-between">
              <div className="flex items-start justify-between">
                <span className="grid size-14 place-items-center rounded-full border border-gold/40 text-gold-hi transition-transform duration-700 ease-[var(--ease-expo)] group-hover/card:rotate-[-20deg] group-hover/card:scale-110">
                  <Leaf weight="duotone" className="size-7" />
                </span>
                <span className="display text-xl italic text-gold/70">ii.</span>
              </div>
              <div>
                <h3 className="display text-[clamp(36px,3.4vw,54px)] leading-none">Eco-friendly</h3>
                <p className="mt-3 max-w-[36ch] text-[15px] font-light leading-relaxed text-cream/65">A simple alternative to single-use cups, for people who care what they leave behind.</p>
              </div>
            </div>
          </TiltCard>

          {/* C — Zero */}
          <TiltCard className="why-zero min-h-[280px] bg-cream p-7 text-ink md:col-span-5 md:p-9">
            <div className="flex h-full flex-col items-start gap-7 sm:flex-row sm:items-center">
              <div className="relative grid size-[150px] shrink-0 place-items-center md:size-[180px]">
                <svg viewBox="0 0 100 100" className="absolute inset-0 -rotate-90">
                  <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(10,40,30,.12)" strokeWidth="1" />
                  <circle className="why-ring" cx="50" cy="50" r="46" fill="none" stroke="#8a6131" strokeWidth="1.6" pathLength={1} strokeDasharray="1" strokeDashoffset="0" strokeLinecap="round" />
                </svg>
                <span className="display text-[120px] leading-none md:text-[140px]">0</span>
              </div>
              <div>
                <span className="eyebrow inline-flex items-center gap-2 text-bronze"><Recycle weight="duotone" className="size-4" /> Zero waste</span>
                <h3 className="display mt-3 text-[clamp(30px,2.8vw,44px)] leading-[1]">cups left for the bin.</h3>
                <p className="mt-3 text-[14px] leading-relaxed text-ink/60">No lid, no sleeve, no cup. When you're done, there's simply nothing left.</p>
              </div>
            </div>
          </TiltCard>

          {/* D — Pour your favourite */}
          <TiltCard className="min-h-[360px] bg-[linear-gradient(120deg,#eed7a4,#c9a45c_45%,#8a6131)] text-ink md:col-span-12 md:min-h-[380px]">
            <div className="relative z-10 flex h-full max-w-[560px] flex-col justify-between gap-10 p-7 md:p-12">
              <span className="eyebrow inline-flex items-center gap-2 text-ink/70"><Drop weight="duotone" className="size-4" /> Any drink you love</span>
              <h3 className="display text-[clamp(44px,5.6vw,96px)] leading-[0.92]">Pour your<br /><em>favourite.</em></h3>
              <p className="max-w-[36ch] text-[15px] leading-relaxed text-ink/70">Coffee, a mocktail, something cold for a hot afternoon — the cup holds it, then becomes part of it.</p>
            </div>
            <div className="pointer-events-none absolute bottom-[-3%] right-[4%] h-[96%] md:right-[8%]">
              <div className="absolute bottom-6 left-1/2 h-8 w-[70%] -translate-x-1/2 rounded-[50%] bg-black/35 blur-xl" />
              <img src="/media/cup-mocktail-cut.webp" alt="Edible cup with an orange mocktail" loading="lazy" className="why-float relative h-full w-auto drop-shadow-[0_30px_40px_rgba(60,35,10,.45)] max-md:opacity-40" />
            </div>
            <span className="display pointer-events-none absolute -right-4 top-2 text-[22vw] leading-none text-ink/[0.06] md:text-[16vw]" aria-hidden>Cup2Eat</span>
          </TiltCard>
        </div>
      </div>
    </section>
  )
}
