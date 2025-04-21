import { Window } from "./core/ui";
import { Heading } from "./widgets/heading";
import { Button } from "./widgets/button";
import { CheckBox } from "./widgets/CheckBox";
import { RadioButtonGroup } from "./widgets/RadioButtonGroup";
import { ScrollBar } from "./widgets/ScrollBar";

// create the main window, full width, height = viewport height − 10px
let w = new Window(window.innerHeight - 10, "100%");

// — FORCE a native vertical scrollbar on the SVG container —
// by querying specifically for SVGSVGElement so TypeScript knows `style` is available
const svg = document.querySelector<SVGSVGElement>("svg");
if (svg) {
  svg.style.overflowY = "scroll";
  svg.style.overflowX = "hidden";
}

// If your UI renders into a <div id="app"> instead, you could do:
// const app = document.getElementById("app");
// if (app) {
//   app.style.overflowY = "scroll";
//   app.style.overflowX = "hidden";
// }

// Heading
const lbl1 = new Heading(w);
lbl1.text     = "Widget Demo";
lbl1.tabindex = 1;
lbl1.fontSize = 16;
lbl1.move(10, 20);

// Button
const btn = new Button(w);
btn.tabindex = 2;
btn.fontSize = 14;
btn.move(10, 60);
btn.onClick(() => console.log("✅ Button was clicked"));

// CheckBox

const cb = new CheckBox(w, "Enable feature");
cb.tabindex = 3;
cb.move(10, 100);
cb.onChange((_, checked) => {
  console.log(`🔲 CheckBox is now ${checked}`);
});

// RadioButtonGroup
console.log("👉 about to add RadioButtonGroup");
const rg = new RadioButtonGroup(w, ["Option A", "Option B", "Option C"]);
console.log(" RadioButtonGroup created:", rg);
rg.tabindex = 4;
rg.move(10, 40);
rg.onChange((_, idx) => {
  console.log(`🔘 RadioButtonGroup selected index: ${idx}`);
});

// ScrollBar (always visible thanks to native CSS override)
console.log("👉 about to add ScrollBar");
const sb = new ScrollBar(w);
console.log("👉 ScrollBar created:", sb);
sb.tabindex     = 5;
sb.scrollHeight = 120;
sb.move(10, 80);
sb.onScroll((_, direction, pos) => {
  console.log(`🔽 ScrollBar scrolled ${direction}, thumb at ${pos}px`);
});
