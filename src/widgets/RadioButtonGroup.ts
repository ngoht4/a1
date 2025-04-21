// src/widgets/RadioButtonGroup.ts

import { Window, Widget, RoleType } from "../core/ui";
import { Circle, Text } from "@svgdotjs/svg.js";

export class RadioButtonGroup extends Widget {
  private options: string[];
  private circles: Circle[] = [];
  private dots: Circle[] = [];
  private labels: Text[] = [];
  private _onChange: ((sender: RadioButtonGroup, idx: number) => void) | null = null;

  private readonly radius = 8;
  private readonly spacing = 8;
  private selectedIndex = 0;

  constructor(parent: Window, options: string[]) {
    super(parent);
    if (options.length < 2) {
      throw new Error("RadioButtonGroup requires at least two options");
    }
    this.options = options;
    this.role = RoleType.group;
    this.selectable = true;
    this.render();
  }

  /** Subscribe to selection changes */
  public onChange(fn: (sender: RadioButtonGroup, idx: number) => void): void {
    this._onChange = fn;
  }

  /** Draw all circles + labels */
  public override render(): void {
    const parentSvg = (this.parent as Window).outerSvg;
    this._group = parentSvg.group();
    this.circles = [];
    this.dots = [];
    this.labels = [];

    this.options.forEach((opt, idx) => {
      const y = idx * (this.radius * 2 + this.spacing);

      // Outer circle
      const outer = this._group
        .circle(this.radius * 2)
        .stroke({ width: 1 })
        .fill(this.backcolor)
        .move(0, y);
      this.registerEvent(outer);
      this.circles.push(outer);

      // Inner dot (hidden initially)
      const inner = this._group
        .circle(this.radius)
        .fill("black")
        .move(this.radius / 2, y + this.radius / 2)
        .hide();
      this.registerEvent(inner);
      this.dots.push(inner);

      // Label text
      const txt = this._group
        .text(opt)
        .font({ size: 12 })
        .fill("black");
      const { height } = txt.bbox();
      txt.move(
        this.radius * 2 + this.spacing,
        y + (this.radius * 2 - height) / 2
      );
      this.registerEvent(txt);
      this.labels.push(txt);

      // Click handlers
      outer.click(() => this.select(idx));
      txt.click(() => this.select(idx));
    });

    // Apply initial selection
    this.applySelection();

    // Allow .move() on this widget to shift the entire group
    this.outerSvg = this._group;
  }

  private applySelection(): void {
    this.dots.forEach((dot, i) => {
      i === this.selectedIndex ? dot.show() : dot.hide();
    });
  }

  private select(idx: number): void {
    if (idx === this.selectedIndex) return;
    this.selectedIndex = idx;
    this.applySelection();
    this._onChange?.(this, idx);
    this.update();
  }

  // State-machine visual updates
  public normal(): void { this.backcolor = "#ffffff"; }
  public hover(): void  { this.backcolor = "#f0f0f0"; }
  public down(): void   { this.backcolor = "#e0e0e0"; }

  public override idleupState(): void       { this.normal(); }
  public override idledownState(): void     { this.down(); }
  public override pressedState(): void      { this.down(); }
  public override hoverState(): void        { this.hover(); }
  public override hoverPressedState(): void { this.down(); }
  public override pressedoutState(): void   { this.normal(); }
  public override moveState(): void         { this.hover(); }
  public override keyupState(_?: KeyboardEvent): void { this.normal(); }
  public override pressReleaseState(): void { /* no-op */ }
}
