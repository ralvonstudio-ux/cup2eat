import { useRef, Fragment } from "react"
import { gsap, useGSAP } from "@/lib/motion"
import { Separator } from "@/components/ui/separator"

type Token = string | { img: string; alt: string }

const STATEMENT: Token[] = [
  "Every", "drink", "ends", "the", "same", "way", "—", "with", "a", "cup", "nobody", "wants.",
  { img: "/media/macro.webp", alt: "Close-up of the baked waffle texture" },
  "So", "we", "made", "the", "cup", "the", "best", "part.",
  { img: "/media/cup-iced.webp", alt: "Cup2Eat cup with iced coffee" },
  "You", "finish", "it.", "Every", "last", "crumb.",
]

export function Idea() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      const tl = gsap.timeline({
        scrollTrigger: { trigger: q(".idea-text")[0], start: "top 75%", end: "bottom 40%", scrub: 0.6 },
      })
      tl.to(q(".idea-w"), { opacity: 1, stagger: 0.1, ease: "none" }, 0)
        .from(q(".idea-pill"), { scale: 0, rotate: -12, stagger: 1.2, ease: "back.out(2)", duration: 1 }, 0.6)

      gsap.from(q(".idea-meta"), {
        y: 30, opacity: 0, stagger: 0.1, duration: 1,
        scrollTrigger: { trigger: root.current, start: "top 80%", once: true },
      })
    },
    { scope: root }
  )

  return (
    <section ref={root} id="idea" className="gutter relative py-[clamp(110px,18vh,200px)]">
      <div className="mx-auto max-w-[1320px]">
        <div className="mb-14 flex items-center gap-6 md:mb-20">
          <span className="idea-meta eyebrow text-gold">(01) — The idea</span>
          <Separator className="idea-meta flex-1" />
          <span className="idea-meta eyebrow hidden text-cream/40 md:inline">Eat your drink</span>
        </div>

        <p className="idea-text display text-[clamp(36px,5.6vw,92px)] leading-[1.02] tracking-[-0.03em]">
          {STATEMENT.map((t, i) =>
            typeof t === "string" ? (
              <Fragment key={i}>
                <span className="idea-w opacity-[0.16]">{t}</span>{" "}
              </Fragment>
            ) : (
              <Fragment key={i}>
                <span className="idea-pill relative mx-[0.08em] inline-block h-[0.78em] w-[1.7em] -translate-y-[0.04em] overflow-hidden rounded-full align-middle shadow-[0_10px_30px_-10px_rgba(0,0,0,.7)] ring-1 ring-gold/30">
                  <img src={t.img} alt={t.alt} className="absolute inset-0 size-full object-cover" loading="lazy" />
                </span>{" "}
              </Fragment>
            )
          )}
        </p>

        <div className="mt-16 grid gap-8 md:mt-24 md:grid-cols-12">
          <p className="idea-meta text-[17px] font-light leading-relaxed text-cream/65 md:col-span-5 md:col-start-8">
            Cup2Eat replaces the throwaway cup with one you can eat. The same drink and the same ritual — just no bin at the end of it.
          </p>
        </div>
      </div>
    </section>
  )
}
