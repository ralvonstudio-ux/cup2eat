import { useRef } from "react"
import { Cookie, Leaf, Recycle, InstagramLogo } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowSwap, Magnetic, RollText } from "@/components/Interaction"
import { GoldDust } from "@/components/GoldDust"
import { gsap, SplitText, useGSAP, isFinePointer, scrollToTarget, continuousGradient } from "@/lib/motion"
import { IG_DM } from "@/lib/utils"

export function Hero({ ready }: { ready: boolean }) {
  const root = useRef<HTMLElement>(null)
  const intro = useRef<gsap.core.Timeline | null>(null)

  // Build the intro once (paused) so initial states render before the preloader lifts.
  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      const chars = SplitText.create(q(".h-line"), { type: "chars", charsClass: "inline-block will-change-transform" }).chars
      const goldLine = q(".h-line.text-gold-grad")[0] as HTMLElement
      continuousGradient(goldLine, Array.from(goldLine.querySelectorAll(".inline-block")))

      intro.current = gsap
        .timeline({ paused: true })
        .from(q(".h-glow"), { opacity: 0, scale: 0.6, duration: 2.2, ease: "power2.out" }, 0.2)
        .from(q(".h-cup"), { yPercent: 30, opacity: 0, scale: 0.86, rotate: -6, filter: "blur(16px)", duration: 1.9, ease: "expo.out" }, 0.45)
        .from(q(".h-shadow"), { opacity: 0, scaleX: 0.3, duration: 1.6 }, 0.8)
        .from(chars, { yPercent: 118, rotate: 6, duration: 1.4, stagger: 0.035, ease: "expo.out" }, 0.55)
        .from(q(".h-fade"), { y: 26, opacity: 0, duration: 1.1, stagger: 0.09 }, 1.15)

      // idle float
      gsap.to(q(".h-float"), { y: -16, rotate: 1.2, duration: 3.2, ease: "sine.inOut", yoyo: true, repeat: -1 })

      // scroll-out choreography
      const out = gsap.timeline({
        scrollTrigger: { trigger: root.current, start: "top top", end: "bottom top", scrub: 0.8 },
        defaults: { ease: "none" },
      })
      out.to(q(".h-cup-wrap"), { yPercent: 22, scale: 1.08 }, 0)
        .to(q(".h-l1"), { xPercent: -14, opacity: 0.2 }, 0)
        .to(q(".h-l2"), { xPercent: 14, opacity: 0.2 }, 0)
        .to(q(".h-copy, .h-meta"), { y: -60, opacity: 0 }, 0)

      // pointer parallax
      if (isFinePointer()) {
        const cupX = gsap.quickTo(q(".h-par-cup"), "x", { duration: 1.2, ease: "power3" })
        const cupY = gsap.quickTo(q(".h-par-cup"), "y", { duration: 1.2, ease: "power3" })
        const cupR = gsap.quickTo(q(".h-par-cup"), "rotateY", { duration: 1.2, ease: "power3" })
        const txtX = gsap.quickTo(q(".h-par-txt"), "x", { duration: 1.8, ease: "power3" })
        const move = (e: PointerEvent) => {
          const nx = e.clientX / innerWidth - 0.5, ny = e.clientY / innerHeight - 0.5
          cupX(nx * 28); cupY(ny * 18); cupR(nx * 14)
          txtX(nx * 14)
        }
        window.addEventListener("pointermove", move, { passive: true })
        return () => window.removeEventListener("pointermove", move)
      }
    },
    { scope: root }
  )

  useGSAP(() => { if (ready) intro.current?.play() }, { dependencies: [ready] })

  return (
    <section ref={root} id="top" className="relative h-[100svh] min-h-[640px] w-full overflow-hidden">
      {/* atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_45%,#155a46_0%,#0b3a2e_45%,#051a14_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink to-transparent" />
      <GoldDust className="absolute inset-0 size-full" />

      {/* headline */}
      <h1 className="sr-only">Cup2Eat — Eat your drink.</h1>
      <div className="h-par-txt pointer-events-none absolute inset-0" aria-hidden>
        <div className="h-l1 gutter absolute inset-x-0 top-[13svh] text-center md:top-[12svh] md:text-left">
          <span className="block overflow-hidden pb-[0.08em] pr-[0.1em]">
            <span className="h-line display block text-[clamp(64px,17vw,108px)] md:text-[clamp(96px,13vw,240px)]">Eat your</span>
          </span>
        </div>
        <div className="h-l2 gutter absolute inset-x-0 top-[calc(13svh+clamp(54px,14.5vw,92px))] text-center md:top-[47svh] md:text-right">
          <span className="block overflow-hidden pb-[0.12em] pr-[0.12em]">
            <span className="h-line display text-gold-grad block text-[clamp(64px,17vw,108px)] italic md:text-[clamp(96px,13vw,240px)]">drink.</span>
          </span>
        </div>
      </div>

      {/* the cup */}
      <div className="h-cup-wrap pointer-events-none absolute inset-x-0 bottom-[17svh] flex justify-center md:bottom-[13svh]">
        <div className="h-par-cup relative [perspective:900px]">
          <div className="h-glow absolute left-1/2 top-[45%] size-[120%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(238,215,164,.32),rgba(201,164,92,.08)_45%,transparent_70%)] blur-2xl" />
          <div className="h-shadow absolute -bottom-3 left-1/2 h-8 w-[78%] -translate-x-1/2 rounded-[50%] bg-black/70 blur-xl" />
          <div className="h-float">
            <img
              src="/media/cup-iced-cut.webp"
              alt="An edible Cup2Eat waffle cup filled with iced coffee"
              className="h-cup relative h-[38svh] w-auto drop-shadow-[0_40px_60px_rgba(0,0,0,.45)] md:h-[52svh]"
              {...{ fetchpriority: "high" }}
            />
          </div>
        </div>
      </div>

      {/* copy + CTA */}
      <div className="h-copy gutter absolute inset-x-0 bottom-[4svh] flex flex-col items-center gap-5 text-center md:bottom-[9svh] md:max-w-[440px] md:items-start md:text-left">
        <Badge className="h-fade hidden md:inline-flex">
          <span className="size-1.5 rounded-full bg-gold-hi shadow-[0_0_10px_2px_rgba(238,215,164,.7)]" />
          Edible cups · Zero waste
        </Badge>
        <p className="h-fade hidden max-w-[34ch] text-[17px] leading-relaxed font-light text-cream/70 md:block">
          The cup is the last bite. Pour, sip, then crunch — and leave nothing behind but a good memory.
        </p>
        <div className="h-fade flex flex-wrap items-center justify-center gap-3 md:justify-start">
          <Magnetic>
            <Button asChild size="lg" data-cursor="DM">
              <a href={IG_DM} target="_blank" rel="noopener noreferrer">
                <InstagramLogo weight="duotone" className="size-5" />
                <RollText>DM to order</RollText>
                <ArrowSwap />
              </a>
            </Button>
          </Magnetic>
          <Magnetic>
            <Button variant="outline" size="lg" className="group/btn" onClick={() => scrollToTarget("#ritual")}>
              <RollText>See how it works</RollText>
            </Button>
          </Magnetic>
        </div>
      </div>

      {/* right meta */}
      <ul className="h-meta gutter absolute bottom-[9svh] right-0 hidden flex-col items-end gap-3 text-[13px] text-cream/60 lg:flex">
        {[
          [Cookie, "Edible cups"],
          [Leaf, "Eco-friendly"],
          [Recycle, "Zero waste"],
        ].map(([Icon, label], i) => {
          const I = Icon as typeof Cookie
          return (
            <li key={i} className="h-fade flex items-center gap-3">
              {label as string}
              <span className="grid size-8 place-items-center rounded-full border border-gold/30 text-gold">
                <I weight="duotone" className="size-4" />
              </span>
            </li>
          )
        })}
      </ul>

      <div className="h-fade pointer-events-none absolute bottom-[3svh] left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex">
        <span className="eyebrow text-[10px] text-cream/40">Scroll to sip</span>
        <span className="relative h-10 w-px overflow-hidden bg-gold/15">
          <span className="absolute inset-x-0 top-0 h-1/2 animate-[drip_2s_ease-in-out_infinite] bg-gold" />
        </span>
      </div>
      <style>{`@keyframes drip{0%{transform:translateY(-100%)}100%{transform:translateY(200%)}}`}</style>
    </section>
  )
}
