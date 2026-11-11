import { useRef, useState } from "react"
import { ArrowUpRight } from "@phosphor-icons/react"
import { gsap, useGSAP, revealLines, isFinePointer } from "@/lib/motion"
import { cn } from "@/lib/utils"

const ROWS = [
  { title: "Cafés & kiosks", note: "A serve your customers film before they finish it", img: "/media/cafe.webp" },
  { title: "Weddings", note: "Welcome drinks with nothing to clear away", img: "/media/wedding.webp" },
  { title: "House parties", note: "Less washing up, more talking point", img: "/media/party.webp" },
  { title: "Brand pop-ups", note: "A sustainable story guests can taste", img: "/media/popup.webp" },
]

export function Occasions() {
  const root = useRef<HTMLElement>(null)
  const follower = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(-1)

  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      revealLines(q(".occ-title")[0])
      gsap.from(q(".occ-row"), {
        y: 60, opacity: 0, duration: 1.1, stagger: 0.1, ease: "expo.out",
        scrollTrigger: { trigger: q(".occ-list")[0], start: "top 80%", once: true },
      })

      const f = follower.current
      if (!f || !isFinePointer()) return
      const xTo = gsap.quickTo(f, "x", { duration: 0.7, ease: "power3" })
      const yTo = gsap.quickTo(f, "y", { duration: 0.7, ease: "power3" })
      const rTo = gsap.quickTo(f, "rotate", { duration: 0.9, ease: "power3" })
      let lastX = 0
      const move = (e: PointerEvent) => {
        xTo(e.clientX); yTo(e.clientY)
        rTo(gsap.utils.clamp(-12, 12, (e.clientX - lastX) * 0.6)); lastX = e.clientX
      }
      window.addEventListener("pointermove", move, { passive: true })
      return () => window.removeEventListener("pointermove", move)
    },
    { scope: root }
  )

  useGSAP(() => {
    if (!follower.current) return
    gsap.to(follower.current, { scale: active >= 0 ? 1 : 0, opacity: active >= 0 ? 1 : 0, duration: 0.6, ease: "expo.out" })
  }, { dependencies: [active] })

  return (
    <section ref={root} id="occasions" className="gutter relative py-[clamp(100px,14vh,160px)]">
      <div className="mx-auto max-w-[1320px]">
        <div className="mb-14 grid gap-6 md:mb-20 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <span className="eyebrow text-gold">(04) — Occasions</span>
            <h2 className="occ-title display mt-6 text-[clamp(48px,7vw,116px)]">
              Made for moments <em className="text-gold-grad">worth keeping.</em>
            </h2>
          </div>
        </div>

        <ul className="occ-list border-t border-gold/20" onPointerLeave={() => setActive(-1)}>
          {ROWS.map((r, i) => (
            <li
              key={r.title}
              className="occ-row group/row relative border-b border-gold/20"
              onPointerEnter={() => setActive(i)}
              data-cursor="Taste"
            >
              <div className="relative z-10 grid grid-cols-[auto_1fr_auto] items-center gap-5 py-7 transition-[padding] duration-700 ease-[var(--ease-expo)] md:gap-10 md:py-10 md:group-hover/row:pl-8">
                <span className="display w-10 text-lg italic text-gold/70">0{i + 1}</span>
                <div>
                  <h3 className="display text-[clamp(38px,5.4vw,88px)] leading-none transition-colors duration-500 group-hover/row:text-gold-hi">{r.title}</h3>
                  <p className="mt-3 text-[14px] text-cream/50 md:hidden">{r.note}</p>
                  <img src={r.img} alt={r.title} loading="lazy" className="mt-5 aspect-[4/3] w-full rounded-2xl object-cover md:hidden" />
                </div>
                <div className="flex items-center gap-6">
                  <p className="hidden max-w-[24ch] text-right text-[14px] text-cream/50 transition-colors duration-500 group-hover/row:text-cream/80 lg:block">{r.note}</p>
                  <span className="hidden size-14 place-items-center rounded-full border border-gold/30 text-gold transition-all duration-500 group-hover/row:rotate-45 group-hover/row:border-gold group-hover/row:bg-gold group-hover/row:text-ink md:grid">
                    <ArrowUpRight weight="bold" className="size-5" />
                  </span>
                </div>
              </div>
              <span className="absolute inset-0 origin-bottom scale-y-0 bg-gradient-to-r from-gold/[0.07] to-transparent transition-transform duration-700 ease-[var(--ease-expo)] group-hover/row:scale-y-100" />
            </li>
          ))}
        </ul>
      </div>

      {/* cursor-following image */}
      <div
        ref={follower}
        className="pointer-events-none fixed left-0 top-0 z-40 hidden h-[360px] w-[280px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[22px] opacity-0 shadow-[0_40px_80px_-20px_rgba(0,0,0,.8)] md:block"
        aria-hidden
      >
        {ROWS.map((r, i) => (
          <img
            key={r.img}
            src={r.img}
            alt=""
            loading="lazy"
            className={cn(
              "absolute inset-0 size-full object-cover transition-[clip-path,transform] duration-700 ease-[var(--ease-expo)]",
              i === active ? "scale-100 [clip-path:inset(0_0_0_0)]" : "scale-110 [clip-path:inset(100%_0_0_0)]"
            )}
          />
        ))}
      </div>
    </section>
  )
}
