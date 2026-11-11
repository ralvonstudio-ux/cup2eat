import { useRef } from "react"
import { Sparkle } from "@phosphor-icons/react"
import { gsap, ScrollTrigger, useGSAP } from "@/lib/motion"

const WORDS = ["Eat your drink", "Edible cups", "Eco-friendly", "Zero waste", "Revolutionizing the way you drink"]

/** Cream band whose speed and direction follow scroll velocity. */
export function Marquee() {
  const root = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const tween = gsap.to(track.current, { xPercent: -50, duration: 38, ease: "none", repeat: -1 })
      let dir = 1
      ScrollTrigger.create({
        trigger: root.current,
        start: "top bottom",
        end: "bottom top",
        onUpdate(self) {
          const v = self.getVelocity()
          if (self.direction !== dir) dir = self.direction
          gsap.to(tween, { timeScale: dir * Math.min(1 + Math.abs(v) / 350, 6), duration: 0.25, overwrite: true })
          gsap.to(tween, { timeScale: dir, duration: 1.2, delay: 0.25, ease: "power2.out" })
        },
      })
      gsap.fromTo(root.current, { rotate: -2.5 }, {
        rotate: 1.2, ease: "none",
        scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
      })
    },
    { scope: root }
  )

  const row = (
    <div className="flex shrink-0 items-center">
      {WORDS.map((w) => (
        <span key={w} className="flex items-center">
          <span className="display whitespace-nowrap px-8 text-[clamp(40px,6vw,92px)] italic">{w}</span>
          <Sparkle weight="fill" className="size-6 text-bronze md:size-8" />
        </span>
      ))}
    </div>
  )

  return (
    <div className="relative z-10 -my-10 overflow-hidden py-10" aria-hidden>
      <div ref={root} className="-mx-[5vw] bg-cream py-5 text-ink shadow-[0_30px_80px_-30px_rgba(0,0,0,.6)] md:py-7">
        <div ref={track} className="flex w-max">
          {row}
          {row}
        </div>
      </div>
    </div>
  )
}
