// Single registration point for GSAP + plugins + the house ease.
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Observer } from "gsap/Observer";
import { CustomEase } from "gsap/CustomEase";

const g = gsap.core as unknown as { globals: () => Record<string, unknown> };
if (typeof window !== "undefined" && !g.globals().ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger, Observer, CustomEase);
  // matches --ease-cloth: cubic-bezier(0.16, 1, 0.3, 1)
  CustomEase.create("cloth", "M0,0 C0.16,1 0.3,1 1,1");
}

export { gsap, ScrollTrigger, Observer, CustomEase };
