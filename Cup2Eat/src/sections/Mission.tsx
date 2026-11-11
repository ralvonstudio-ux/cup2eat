import { useRef } from "react"
import { Quotes } from "@phosphor-icons/react"
import { Separator } from "@/components/ui/separator"
import { gsap, useGSAP, revealLines } from "@/lib/motion"

export function Mission() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      revealLines(q(".mis-quote")[0], { start: "top 80%" })
      gsap.to(q(".mis-ring"), { rotate: 360, duration: 28, ease: "none", repeat: -1, transformOrigin: "50% 50%" })
      gsap.fromTo(q(".mis-badge"), { rotate: -40, scale: 0.7 }, {
        rotate: 0, scale: 1, ease: "none",
        scrollTrigger: { trigger: root.current, start: "top bottom", end: "center center", scrub: true },
      })
      gsap.from(q(".mis-fade"), {
        y: 30, opacity: 0, stagger: 0.1, duration: 1,
        scrollTrigger: { trigger: q(".mis-quote")[0], start: "top 70%", once: true },
      })
    },
    { scope: root }
  )

  return (
    <section ref={root} id="mission" className="gutter relative overflow-hidden py-[clamp(110px,18vh,200px)]">
      <div className="pointer-events-none absolute left-1/2 top-1/2 size-[90vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(30,107,83,.45),transparent_65%)]" />
      <div className="relative mx-auto flex max-w-[1100px] flex-col items-center text-center">
        <div className="mis-badge relative mb-14 size-[150px] md:size-[180px]">
          <svg viewBox="0 0 200 200" className="mis-ring absolute inset-0 size-full">
            <defs>
              <path id="mis-circle" d="M100 100 m-86 0 a86 86 0 1 1 172 0 a86 86 0 1 1 -172 0" />
            </defs>
            <text className="fill-gold-hi text-[13px] uppercase tracking-[0.42em]" style={{ fontFamily: "var(--font-sans)", fontWeight: 500 }}>
              <textPath href="#mis-circle">Cup2Eat · Eat your drink · Zero waste ·</textPath>
            </text>
          </svg>
          <img src="/logo.png" alt="Cup2Eat badge" loading="lazy" className="absolute inset-[22%] size-[56%] rounded-full shadow-[0_20px_50px_-10px_rgba(0,0,0,.7)]" />
        </div>

        <span className="mis-fade eyebrow inline-flex items-center gap-2 text-gold"><Quotes weight="fill" className="size-4" /> Our mission</span>
        <blockquote className="mis-quote display mt-8 text-[clamp(46px,7.4vw,124px)] leading-[0.95]">
          Revolutionizing the way you <em className="text-gold-grad">drink.</em>
        </blockquote>

        <div className="mis-fade mt-14 flex w-full max-w-[520px] items-center gap-6">
          <Separator className="flex-1" />
          <div>
            <p className="text-[15px] font-medium tracking-[0.04em]">Varun Khera</p>
            <p className="eyebrow mt-1 text-[10px] text-cream/45">Founder, Cup2Eat</p>
          </div>
          <Separator className="flex-1" />
        </div>
      </div>
    </section>
  )
}
