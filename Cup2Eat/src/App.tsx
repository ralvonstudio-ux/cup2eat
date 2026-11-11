import { useEffect, useState } from "react"
import { Cursor } from "@/components/Interaction"
import { initLenis, getLenis, ScrollTrigger } from "@/lib/motion"
import { Preloader } from "@/sections/Preloader"
import { Nav } from "@/sections/Nav"
import { Hero } from "@/sections/Hero"
import { Marquee } from "@/sections/Marquee"
import { Idea } from "@/sections/Idea"
import { Ritual } from "@/sections/Ritual"
import { WhyEdible } from "@/sections/WhyEdible"
import { Occasions } from "@/sections/Occasions"
import { Mission } from "@/sections/Mission"
import { Order } from "@/sections/Order"
import { Footer } from "@/sections/Footer"

export default function App() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual"
    window.scrollTo(0, 0)
    const lenis = initLenis()
    lenis?.stop()
    document.documentElement.style.overflow = "hidden"
    const refresh = () => ScrollTrigger.refresh()
    window.addEventListener("load", refresh)
    return () => window.removeEventListener("load", refresh)
  }, [])

  const onLoaded = () => {
    document.documentElement.style.overflow = ""
    getLenis()?.start()
    setReady(true)
    ScrollTrigger.refresh()
  }

  return (
    <>
      <Preloader onDone={onLoaded} />
      <Cursor />
      <div className="grain" aria-hidden />
      <Nav ready={ready} />
      <main>
        <Hero ready={ready} />
        <Marquee />
        <Idea />
        <Ritual />
        <WhyEdible />
        <Occasions />
        <Mission />
        <Order />
      </main>
      <Footer />
    </>
  )
}
