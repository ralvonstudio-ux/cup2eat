import { useRef } from "react"
import { InstagramLogo } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Magnetic, RollText } from "@/components/Interaction"
import { gsap, ScrollTrigger, useGSAP, scrollToTarget } from "@/lib/motion"
import { IG_DM } from "@/lib/utils"

const LINKS = [
  ["The idea", "#idea"],
  ["Ritual", "#ritual"],
  ["Why edible", "#why"],
  ["Occasions", "#occasions"],
] as const

export function Nav({ ready }: { ready: boolean }) {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      if (!ready) { gsap.set(root.current, { yPercent: -120 }); return }
      gsap.to(root.current, { yPercent: 0, duration: 1.2, ease: "expo.out", delay: 0.9 })
      let hidden = false
      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate(self) {
          const y = self.scroll()
          root.current?.classList.toggle("is-solid", y > 60)
          const hide = self.direction === 1 && y > 600
          if (hide !== hidden) {
            hidden = hide
            gsap.to(root.current, { yPercent: hide ? -120 : 0, duration: 0.7, ease: "power3.out" })
          }
        },
      })
    },
    { dependencies: [ready], scope: root }
  )

  return (
    <header
      ref={root}
      className="gutter group/nav fixed inset-x-0 top-0 z-50 flex h-20 items-center justify-between transition-[background,backdrop-filter,border-color] duration-500 [&.is-solid]:border-b [&.is-solid]:border-gold/15 [&.is-solid]:bg-ink/70 [&.is-solid]:backdrop-blur-xl"
    >
      <a href="#top" onClick={(e) => { e.preventDefault(); scrollToTarget(0) }} className="flex items-center gap-3" aria-label="Cup2Eat — back to top">
        <img src="/logo.png" alt="" className="size-11 rounded-full shadow-[0_0_0_1px_rgba(201,164,92,.35)] transition-transform duration-700 ease-[var(--ease-expo)] hover:rotate-[360deg]" />
        <span className="display text-[26px] leading-none tracking-[-0.02em]">Cup2Eat</span>
      </a>

      <nav className="hidden items-center gap-1 rounded-full border border-gold/15 bg-ink/30 p-1 backdrop-blur-md lg:flex">
        {LINKS.map(([label, href]) => (
          <a
            key={href}
            href={href}
            onClick={(e) => { e.preventDefault(); scrollToTarget(href) }}
            className="group/btn rounded-full px-4 py-2 text-[13px] text-cream/70 transition-colors duration-300 hover:bg-gold/10 hover:text-gold-hi"
          >
            <RollText>{label}</RollText>
          </a>
        ))}
      </nav>

      <Magnetic>
        <Button asChild size="sm" data-cursor="DM">
          <a href={IG_DM} target="_blank" rel="noopener noreferrer">
            <InstagramLogo weight="duotone" className="size-4" />
            <RollText>DM to order</RollText>
          </a>
        </Button>
      </Magnetic>
    </header>
  )
}
