import { useMemo, useRef } from "react"
import { gsap, useGSAP } from "@/lib/motion"

const STEPS = [
  {
    word: "Pour",
    title: "Pour it in.",
    copy: "Fill the cup with whatever you love. It's made to be part of the serve, not just to hold it.",
    img: "/media/cup-pour-cut.webp",
    alt: "Coffee being poured into an edible Cup2Eat cup",
  },
  {
    word: "Sip",
    title: "Sip, slowly.",
    copy: "Drink the way you always do. Take your time — the best part is still waiting at the bottom.",
    img: "/media/cup-iced-cut.webp",
    alt: "Edible cup filled with iced coffee",
  },
  {
    word: "Eat",
    title: "Then eat the cup.",
    copy: "Finish the drink, then finish the cup. One crunch, then another. Nothing left to throw away.",
    img: "/media/cup-bite-cut.webp",
    alt: "Edible cup with a bite taken out of the rim",
  },
]

const BGS = [
  "radial-gradient(80% 70% at 50% 55%, #145441 0%, #0b3a2e 50%, #051a14 100%)",
  "radial-gradient(80% 70% at 50% 55%, #0f4a3a 0%, #072620 55%, #03110c 100%)",
  "radial-gradient(80% 70% at 50% 55%, #4a3218 0%, #23170b 55%, #0d0804 100%)",
]

export function Ritual() {
  const root = useRef<HTMLElement>(null)

  const crumbs = useMemo(
    () =>
      Array.from({ length: 34 }, (_, i) => {
        const a = (i / 34) * Math.PI * 2 + Math.random() * 0.4
        const r = 0.55 + Math.random() * 0.6
        return {
          x: Math.cos(a) * r * 100,
          y: -Math.abs(Math.sin(a)) * r * 60 + Math.random() * 70,
          s: 4 + Math.random() * 11,
          rot: Math.random() * 360,
          c: ["#d49a50", "#b9823f", "#e8c48a", "#8a6131"][i % 4],
          br: `${40 + Math.random() * 25}% ${50 + Math.random() * 20}% ${40 + Math.random() * 25}% ${55 + Math.random() * 20}%`,
        }
      }),
    []
  )

  useGSAP(
    () => {
      const q = gsap.utils.selector(root)
      const words = q(".r-word"), cups = q(".r-cup"), copies = q(".r-copy"), bgs = q(".r-bg"), segs = q(".r-seg"), names = q(".r-name")

      gsap.set(words, { y: 0 })
      gsap.set(words.slice(1), { yPercent: 130 })
      gsap.set(cups.slice(1), { autoAlpha: 0, scale: 1.08, y: 30 })
      gsap.set(copies.slice(1), { autoAlpha: 0, y: 40 })
      gsap.set(bgs.slice(1), { autoAlpha: 0 })
      gsap.set(segs, { scaleX: 0 })
      gsap.set(q(".r-crumb"), { x: 0, y: 0, scale: 0, opacity: 0 })

      const tl = gsap.timeline({
        defaults: { ease: "power2.inOut", duration: 0.6 },
        scrollTrigger: { trigger: root.current, start: "top top", end: "+=320%", pin: true, scrub: 0.9, anticipatePin: 1 },
      })

      tl.to(cups[0], { scale: 1.04, duration: 1, ease: "none" }, 0)
        .to(segs[0], { scaleX: 1, duration: 1.3, ease: "none" }, 0)

      const swap = (from: number, to: number, at: number) => {
        tl.to(words[from], { yPercent: -130, y: 0 }, at)
          .fromTo(words[to], { yPercent: 130, y: 0 }, { yPercent: 0, y: 0 }, at)
          .to(cups[from], { autoAlpha: 0, scale: 0.92, y: -30 }, at)
          .to(cups[to], { autoAlpha: 1, scale: 1, y: 0 }, at + 0.1)
          .to(copies[from], { autoAlpha: 0, y: -40 }, at)
          .to(copies[to], { autoAlpha: 1, y: 0 }, at + 0.15)
          .to(bgs[to], { autoAlpha: 1 }, at)
          .to(q(".r-digits"), { yPercent: (-100 / 3) * to, y: 0 }, at)
          .to(names[from], { opacity: 0.35 }, at)
          .to(names[to], { opacity: 1 }, at)
      }
      swap(0, 1, 1)
      tl.to(segs[1], { scaleX: 1, duration: 1.6, ease: "none" }, 1.3)
      swap(1, 2, 2.6)
      tl.to(segs[2], { scaleX: 1, duration: 1.1, ease: "none" }, 2.9)
        .to(q(".r-crumb"), {
          x: (i) => crumbs[i].x * 2.2, y: (i) => crumbs[i].y * 1.6, rotate: (i) => crumbs[i].rot,
          scale: 1, opacity: 1, duration: 0.8, ease: "power3.out", stagger: { each: 0.008, from: "random" },
        }, 2.75)
        .to(q(".r-cup-wrap"), { rotate: -3, duration: 0.4, ease: "power1.inOut", yoyo: true, repeat: 1 }, 2.7)
        .to({}, { duration: 0.4 })
    },
    { scope: root }
  )

  return (
    <section ref={root} id="ritual" className="relative h-[100svh] overflow-hidden">
      {BGS.map((bg, i) => (
        <div key={i} className="r-bg absolute inset-0" style={{ background: bg }} />
      ))}

      {/* giant outline word */}
      <div className="pointer-events-none absolute inset-x-0 top-[22svh] flex justify-center overflow-hidden md:top-1/2 md:-translate-y-1/2" aria-hidden>
        <div className="relative h-[1.08em] w-full text-center text-[clamp(120px,36vw,560px)] leading-[0.9]">
          {STEPS.map((s) => (
            <span key={s.word} className="r-word display text-outline absolute inset-x-0 top-0 italic">{s.word}</span>
          ))}
        </div>
      </div>

      {/* header */}
      <div className="gutter absolute inset-x-0 top-24 flex items-center justify-between md:top-28">
        <span className="eyebrow text-gold">(02) — The ritual</span>
        <span className="eyebrow hidden gap-3 text-cream/60 md:flex">
          {STEPS.map((s, i) => (
            <span key={s.word} className="r-name transition-opacity" style={{ opacity: i === 0 ? 1 : 0.35 }}>{s.word}{i < 2 ? " ·" : ""}</span>
          ))}
        </span>
      </div>

      {/* cup stage */}
      <div className="absolute inset-x-0 bottom-[27svh] flex justify-center md:bottom-[9svh]">
        <div className="r-cup-wrap relative w-[min(46vw,26svh)] md:w-[min(24vw,34svh)]" style={{ aspectRatio: "590 / 1137" }}>
          <div className="absolute -bottom-2 left-1/2 h-6 w-[85%] -translate-x-1/2 rounded-[50%] bg-black/70 blur-xl" />
          {STEPS.map((s, i) => (
            <img key={s.word} src={s.img} alt={s.alt} loading={i ? "lazy" : "eager"} className="r-cup absolute bottom-0 left-0 w-full drop-shadow-[0_30px_50px_rgba(0,0,0,.5)]" />
          ))}
          <div className="absolute bottom-[12%] left-1/2 size-0">
            {crumbs.map((c, i) => (
              <span
                key={i}
                className="r-crumb absolute block"
                style={{ width: c.s, height: c.s * 0.8, background: c.c, borderRadius: c.br, boxShadow: "inset -1px -2px 2px rgba(0,0,0,.35)" }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* counter */}
      <div className="gutter absolute bottom-[9svh] left-0 hidden md:block">
        <div className="flex items-end gap-3">
          <div className="display h-[1em] overflow-hidden text-[clamp(90px,9vw,150px)] leading-none text-gold-hi">
            <div className="r-digits">
              {["01", "02", "03"].map((d) => <div key={d} className="h-[1em]">{d}</div>)}
            </div>
          </div>
          <span className="display mb-3 text-3xl text-cream/35">/03</span>
        </div>
      </div>

      {/* copy */}
      <div className="gutter absolute inset-x-0 bottom-[6svh] md:bottom-[11svh] md:left-auto md:w-[min(420px,34vw)] md:px-0 md:pr-[clamp(20px,4vw,64px)]">
        <div className="relative h-[150px] md:h-[170px]">
          {STEPS.map((s) => (
            <div key={s.word} className="r-copy absolute inset-0 text-center md:text-left">
              <h3 className="display text-[clamp(34px,3.4vw,52px)] leading-none">{s.title}</h3>
              <p className="mx-auto mt-4 max-w-[34ch] text-[16px] font-light leading-relaxed text-cream/65 md:mx-0">{s.copy}</p>
            </div>
          ))}
        </div>
      </div>

      {/* progress */}
      <div className="gutter absolute inset-x-0 bottom-6 flex justify-center gap-2 md:bottom-8">
        {STEPS.map((s) => (
          <span key={s.word} className="relative h-[2px] w-16 overflow-hidden rounded-full bg-cream/15 md:w-24">
            <span className="r-seg absolute inset-0 origin-left bg-gold" />
          </span>
        ))}
      </div>
    </section>
  )
}
