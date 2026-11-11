import { useEffect, useRef, type ReactNode } from "react"
import { ArrowUpRight } from "@phosphor-icons/react"
import { gsap, isFinePointer } from "@/lib/motion"
import { cn } from "@/lib/utils"

/** Custom cursor: dot + trailing ring. Elements with data-cursor="Label" grow it into a labelled disc. */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null)
  const ring = useRef<HTMLDivElement>(null)
  const label = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!isFinePointer() || !dot.current || !ring.current) return
    const root = document.documentElement
    root.classList.add("has-cursor", "cursor-hide")
    const xd = gsap.quickTo(dot.current, "x", { duration: 0.1, ease: "power3" })
    const yd = gsap.quickTo(dot.current, "y", { duration: 0.1, ease: "power3" })
    const xr = gsap.quickTo(ring.current, "x", { duration: 0.55, ease: "power3" })
    const yr = gsap.quickTo(ring.current, "y", { duration: 0.55, ease: "power3" })

    const move = (e: PointerEvent) => {
      root.classList.remove("cursor-hide")
      xd(e.clientX); yd(e.clientY); xr(e.clientX); yr(e.clientY)
    }
    const over = (e: PointerEvent) => {
      const t = (e.target as HTMLElement).closest<HTMLElement>("[data-cursor], a, button")
      const txt = t?.dataset.cursor ?? ""
      ring.current!.classList.toggle("is-active", !!t)
      ring.current!.classList.toggle("has-label", !!txt)
      if (label.current) label.current.textContent = txt
      dot.current!.style.opacity = txt ? "0" : "1"
    }
    const leave = () => root.classList.add("cursor-hide")
    window.addEventListener("pointermove", move, { passive: true })
    window.addEventListener("pointerover", over, { passive: true })
    document.addEventListener("mouseleave", leave)
    return () => {
      window.removeEventListener("pointermove", move)
      window.removeEventListener("pointerover", over)
      document.removeEventListener("mouseleave", leave)
      root.classList.remove("has-cursor", "cursor-hide")
    }
  }, [])

  return (
    <>
      <div ref={ring} className="cursor-ring" aria-hidden><span ref={label} /></div>
      <div ref={dot} className="cursor-dot" aria-hidden />
    </>
  )
}

/** Magnetic pull towards the pointer, elastic return. */
export function Magnetic({ children, strength = 0.32, className }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el || !isFinePointer()) return
    const xTo = gsap.quickTo(el, "x", { duration: 0.9, ease: "elastic.out(1, 0.45)" })
    const yTo = gsap.quickTo(el, "y", { duration: 0.9, ease: "elastic.out(1, 0.45)" })
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      xTo((e.clientX - r.left - r.width / 2) * strength)
      yTo((e.clientY - r.top - r.height / 2) * strength)
    }
    const leave = () => { xTo(0); yTo(0) }
    el.addEventListener("pointermove", move)
    el.addEventListener("pointerleave", leave)
    return () => {
      el.removeEventListener("pointermove", move)
      el.removeEventListener("pointerleave", leave)
    }
  }, [strength])
  return <div ref={ref} className={cn("inline-block will-change-transform", className)}>{children}</div>
}

/** Arrow that slides out and back in on hover of the parent .group/btn */
export function ArrowSwap({ className }: { className?: string }) {
  return (
    <span className={cn("relative inline-flex size-[1.15em] overflow-hidden", className)} aria-hidden>
      <ArrowUpRight weight="bold" className="size-full transition-transform duration-500 ease-[var(--ease-expo)] group-hover/btn:translate-x-full group-hover/btn:-translate-y-full" />
      <ArrowUpRight weight="bold" className="absolute inset-0 size-full -translate-x-full translate-y-full transition-transform duration-500 ease-[var(--ease-expo)] group-hover/btn:translate-x-0 group-hover/btn:translate-y-0" />
    </span>
  )
}

/** Rolling text: duplicates label and rolls it up on hover. */
export function RollText({ children, className }: { children: string; className?: string }) {
  return (
    <span className={cn("relative inline-block overflow-hidden align-bottom", className)}>
      <span className="block transition-transform duration-500 ease-[var(--ease-expo)] group-hover/btn:-translate-y-full">{children}</span>
      <span className="absolute inset-0 block translate-y-full transition-transform duration-500 ease-[var(--ease-expo)] group-hover/btn:translate-y-0" aria-hidden>{children}</span>
    </span>
  )
}
