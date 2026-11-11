import { useRef } from "react"
import { InstagramLogo, ArrowUpRight } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { ArrowSwap, Magnetic, RollText } from "@/components/Interaction"
import { gsap, useGSAP, revealLines } from "@/lib/motion"
import { IG_DM, IG_PROFILE } from "@/lib/utils"

const MOMENTS = [
  ["/media/cafe.webp", "Café serve"],
  ["/media/cup-iced.webp", "Iced coffee"],
  ["/media/wedding.webp", "Wedding welcome drinks"],
  ["/media/cup-mocktail.webp", "Orange mocktail"],
  ["/media/party.webp", "House party"],
  ["/media/macro.webp", "Waffle texture"],
  ["/media/popup.webp", "Brand pop-up"],
  ["/media/cup-bite.webp", "The last bite"],
] as const

export function Order() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      revealLines(q(".ord-title")[0], { start: "top 80%" })
      gsap.fromTo(q(".ord-bg"), { scale: 1.3, yPercent: -8 }, {
        scale: 1, yPercent: 8, ease: "none",
        scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
      })
      gsap.fromTo(q(".ord-frame"), { clipPath: "inset(12% 8% 12% 8% round 48px)" }, {
        clipPath: "inset(0% 0% 0% 0% round 0px)", ease: "none",
        scrollTrigger: { trigger: root.current, start: "top bottom", end: "top top", scrub: true },
      })
      gsap.from(q(".ord-fade"), {
        y: 30, opacity: 0, stagger: 0.1, duration: 1,
        scrollTrigger: { trigger: q(".ord-title")[0], start: "top 75%", once: true },
      })
      gsap.to(q(".ord-strip"), { xPercent: -50, duration: 50, ease: "none", repeat: -1 })
    },
    { scope: root }
  )

  const tiles = MOMENTS.map(([src, alt]) => (
    <a
      key={src}
      href={IG_PROFILE}
      target="_blank"
      rel="noopener noreferrer"
      data-cursor="View"
      className="group/tile relative block aspect-square w-[180px] shrink-0 overflow-hidden rounded-2xl md:w-[230px]"
    >
      <img src={src} alt={alt} loading="lazy" className="size-full object-cover transition-transform duration-700 ease-[var(--ease-expo)] group-hover/tile:scale-110" />
      <span className="absolute inset-0 grid place-items-center bg-ink/55 opacity-0 transition-opacity duration-500 group-hover/tile:opacity-100">
        <InstagramLogo weight="duotone" className="size-9 text-gold-hi" />
      </span>
    </a>
  ))

  return (
    <section ref={root} id="order" className="relative">
      <div className="ord-frame relative flex min-h-[100svh] flex-col overflow-hidden">
        <img src="/media/flatlay.webp" alt="" loading="lazy" className="ord-bg absolute inset-0 size-full object-cover" />
        <div className="absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_40%,rgba(5,26,20,.55),rgba(5,26,20,.92))]" />

        <div className="gutter relative z-10 flex flex-1 flex-col items-center justify-center pb-10 pt-32 text-center">
          <span className="ord-fade eyebrow text-gold-hi">(05) — Order now</span>
          <h2 className="ord-title display mt-7 text-[clamp(56px,10vw,184px)] leading-[0.88]">
            Ready to eat<br /><em className="text-gold-grad">your drink?</em>
          </h2>
          <p className="ord-fade mt-8 max-w-[44ch] text-[17px] font-light leading-relaxed text-cream/75">
            Orders are open on Instagram. Send us a message and we'll take it from there.
          </p>
          <div className="ord-fade mt-10 flex flex-wrap items-center justify-center gap-3">
            <Magnetic>
              <Button asChild size="lg" className="h-16 px-10 text-[17px]" data-cursor="DM">
                <a href={IG_DM} target="_blank" rel="noopener noreferrer">
                  <InstagramLogo weight="duotone" className="size-5" />
                  <RollText>DM for orders</RollText>
                  <ArrowSwap />
                </a>
              </Button>
            </Magnetic>
            <Magnetic>
              <Button asChild variant="outline" size="lg" className="h-16 bg-ink/30 px-9 backdrop-blur-md">
                <a href={IG_PROFILE} target="_blank" rel="noopener noreferrer">
                  <RollText>@cup2eat</RollText>
                  <ArrowUpRight weight="bold" className="size-4" />
                </a>
              </Button>
            </Magnetic>
          </div>
        </div>

        <div className="relative z-10 pb-10">
          <div className="gutter mb-5 flex items-center justify-between">
            <span className="eyebrow text-cream/50">Moments</span>
            <a href={IG_PROFILE} target="_blank" rel="noopener noreferrer" className="eyebrow text-gold transition-colors hover:text-gold-hi">Follow @cup2eat</a>
          </div>
          <div className="overflow-hidden">
            <div className="ord-strip flex w-max gap-4 pl-4">
              {tiles}
              {tiles}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
