import { useRef } from "react"
import { ArrowUp, InstagramLogo, ChatCircleDots } from "@phosphor-icons/react"
import { Separator } from "@/components/ui/separator"
import { gsap, SplitText, useGSAP, scrollToTarget, continuousGradient } from "@/lib/motion"
import { IG_DM, IG_PROFILE } from "@/lib/utils"

const EXPLORE = [["The idea", "#idea"], ["Ritual", "#ritual"], ["Why edible", "#why"], ["Occasions", "#occasions"]] as const

export function Footer() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      const split = SplitText.create(q(".ft-word"), { type: "chars", charsClass: "inline-block" })
      continuousGradient(q(".ft-word")[0] as HTMLElement, split.chars)
      gsap.from(split.chars, {
        yPercent: 100, duration: 1.3, stagger: 0.05, ease: "expo.out",
        scrollTrigger: { trigger: q(".ft-word")[0], start: "top 95%", once: true },
      })
    },
    { scope: root }
  )

  const link = "text-[15px] text-cream/65 transition-colors duration-300 hover:text-gold-hi"

  return (
    <footer ref={root} className="relative overflow-hidden bg-ink pt-24">
      <div className="gutter mx-auto grid max-w-[1320px] gap-12 md:grid-cols-12">
        <div className="md:col-span-5">
          <img src="/logo.png" alt="Cup2Eat" loading="lazy" className="size-16 rounded-full" />
          <p className="display mt-6 text-[clamp(32px,3vw,46px)] leading-[1]">Eat your <em className="text-gold">drink.</em></p>
          <p className="mt-4 max-w-[34ch] text-[14px] text-cream/50">Edible cups for cafés, celebrations and everyday rituals. Founded by Varun Khera.</p>
        </div>
        <div className="md:col-span-2 md:col-start-7">
          <p className="eyebrow mb-5 text-gold">Order</p>
          <ul className="space-y-3">
            <li><a className={`${link} inline-flex items-center gap-2`} href={IG_DM} target="_blank" rel="noopener noreferrer"><ChatCircleDots weight="duotone" className="size-4" /> DM to order</a></li>
            <li><a className={`${link} inline-flex items-center gap-2`} href={IG_PROFILE} target="_blank" rel="noopener noreferrer"><InstagramLogo weight="duotone" className="size-4" /> Instagram</a></li>
          </ul>
        </div>
        <div className="md:col-span-2">
          <p className="eyebrow mb-5 text-gold">Explore</p>
          <ul className="space-y-3">
            {EXPLORE.map(([l, h]) => (
              <li key={h}><a className={link} href={h} onClick={(e) => { e.preventDefault(); scrollToTarget(h) }}>{l}</a></li>
            ))}
          </ul>
        </div>
        <div className="md:col-span-2">
          <p className="eyebrow mb-5 text-gold">Promise</p>
          <ul className="space-y-3 text-[15px] text-cream/65">
            <li>Edible cups</li><li>Eco-friendly</li><li>Zero waste</li>
          </ul>
        </div>
      </div>

      <div className="gutter mt-20 overflow-hidden" aria-hidden>
        <p className="ft-word display text-gold-grad text-center text-[23vw] leading-[0.82] tracking-[-0.05em]">Cup2Eat</p>
      </div>

      <div className="gutter mx-auto max-w-[1320px]">
        <Separator />
        <div className="flex flex-wrap items-center justify-between gap-4 py-7 text-[13px] text-cream/45">
          <span>© 2026 Cup2Eat. All rights reserved.</span>
          <span>Website concept by Blurrycat Studio</span>
          <button onClick={() => scrollToTarget(0)} className="group inline-flex items-center gap-2 transition-colors hover:text-gold-hi">
            Back to top
            <span className="grid size-8 place-items-center rounded-full border border-gold/30 transition-transform duration-500 group-hover:-translate-y-1">
              <ArrowUp weight="bold" className="size-3.5" />
            </span>
          </button>
        </div>
      </div>
    </footer>
  )
}
