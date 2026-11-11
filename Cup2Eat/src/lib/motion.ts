import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { SplitText } from "gsap/SplitText"
import { useGSAP } from "@gsap/react"
import Lenis from "lenis"

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP)
gsap.defaults({ ease: "power3.out" })

export { gsap, ScrollTrigger, SplitText, useGSAP }

export const prefersReduced = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches

export const isFinePointer = () =>
  typeof window !== "undefined" && window.matchMedia("(hover: hover) and (pointer: fine)").matches

let lenis: Lenis | null = null

export function initLenis() {
  if (lenis || prefersReduced()) return lenis
  lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.95, touchMultiplier: 1.4 })
  lenis.on("scroll", ScrollTrigger.update)
  gsap.ticker.add((t) => lenis?.raf(t * 1000))
  gsap.ticker.lagSmoothing(0)
  if (import.meta.env.DEV) Object.assign(window, { __lenis: lenis, __ST: ScrollTrigger })
  return lenis
}

export const getLenis = () => lenis

export function scrollToTarget(target: string | number) {
  const el = typeof target === "string" ? document.querySelector<HTMLElement>(target) : null
  if (lenis) {
    lenis.scrollTo(el ?? (target as number), { duration: 1.8, easing: (t) => 1 - Math.pow(1 - t, 4) })
  } else if (el) {
    el.scrollIntoView({ behavior: prefersReduced() ? "auto" : "smooth" })
  } else if (typeof target === "number") {
    window.scrollTo({ top: target, behavior: "smooth" })
  }
}

/**
 * After splitting gradient text into transformed chars, background-clip:text breaks.
 * Give every char the parent's gradient, sized to the parent and offset to its own position.
 */
export function continuousGradient(parent: HTMLElement, chars: Element[]) {
  const apply = () => {
    const w = parent.offsetWidth
    chars.forEach((c) => {
      const el = c as HTMLElement
      el.classList.add("text-gold-grad")
      el.style.backgroundSize = `${w}px 100%`
      el.style.backgroundPosition = `${-el.offsetLeft}px 0`
    })
  }
  apply()
  document.fonts?.ready.then(apply)
}

/** Masked line reveal for headings, triggered on scroll. */
export function revealLines(el: Element | null, opts: { delay?: number; start?: string } = {}) {
  if (!el) return
  SplitText.create(el, {
    type: "lines",
    mask: "lines",
    linesClass: "split-line",
    autoSplit: true,
    onSplit(self) {
      return gsap.from(self.lines, {
        yPercent: 110,
        duration: 1.25,
        stagger: 0.09,
        ease: "expo.out",
        delay: opts.delay ?? 0,
        scrollTrigger: { trigger: el, start: opts.start ?? "top 85%", once: true },
      })
    },
  })
}
