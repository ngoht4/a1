// src/widgets/ScrollBar.ts

import { Window, Widget, RoleType } from "../core/ui";
import { Rect, Text } from "@svgdotjs/svg.js"


export class ScrollBar extends Widget {
  private _upBtn: Rect;
  private _downBtn: Rect;
  private _track: Rect;
  private _thumb: Rect;
  private _upArrow: Text;
  private _downArrow: Text;
  private _scrollHeight = 200;
  private _thumbY       = 0;
  private readonly _arrowH = 20;
  private readonly _thumbH = 40;
  private readonly _width  = 20;
  private readonly _step   = 20;
  private _scrollCallback: ((s: ScrollBar, dir: "up"|"down"|"track", pos: number) => void) | null = null;

  constructor(parent: Window) {
    super(parent);
    this.width      = this._width;
    this.height     = this._scrollHeight;
    this.role       = RoleType.group;
    this.render();
    this.normal();
    this.selectable = true;
  }

  public set scrollHeight(h: number) {
    this._scrollHeight = h;
    this.height        = h;
    this.update();
  }
  public get scrollHeight(): number {
    return this._scrollHeight;
  }
  public get thumbPosition(): number {
    return this._thumbY;
  }
  public onScroll(fn: (s: ScrollBar, dir: "up"|"down"|"track", pos: number) => void): void {
    this._scrollCallback = fn;
  }

  public override render(): void {
    console.log("🎨 [ScrollBar] render()");
    this._group = (this.parent as Window).window.group();

    // Up button
    this._upBtn = this._group
      .rect(this._width, this._arrowH)
      .stroke("black")
      .fill(this.backcolor);
    this.registerEvent(this._upBtn);

    // ▲ arrow
    this._upArrow = this._group
      .text("▲")
      .font({ size: this._arrowH - 4 })
      .fill("black");
    {
      const b = this._upArrow.bbox();
      this._upArrow.move((this._width - b.width)/2, (this._arrowH - b.height)/2);
    }
    this._upBtn.click(() => this.moveUp());

    // Track
    const trackY = this._arrowH;
    const trackH = this._scrollHeight - 2 * this._arrowH;
    this._track = this._group
      .rect(this._width, trackH)
      .fill("#e8f5e9")
      .y(trackY);
    this.registerEvent(this._track);
    this._track.click((e: any) => {
      const offsetY = e.offsetY - this._arrowH;
      this.setThumbY(offsetY - this._thumbH / 2);
      this._scrollCallback?.(this, "track", this._thumbY);
    });

    // Thumb
    this._thumb = this._group
      .rect(this._width, this._thumbH)
      .fill("#66bb6a")
      .y(trackY);
    this.registerEvent(this._thumb);

    // Down button
    const downY = this._scrollHeight - this._arrowH;
    this._downBtn = this._group
      .rect(this._width, this._arrowH)
      .stroke("black")
      .fill(this.backcolor)
      .y(downY);
    this.registerEvent(this._downBtn);

    // ▼ arrow
    this._downArrow = this._group
      .text("▼")
      .font({ size: this._arrowH - 4 })
      .fill("black");
    {
      const b = this._downArrow.bbox();
      this._downArrow.move((this._width - b.width)/2, downY + (this._arrowH - b.height)/2);
    }
    this._downBtn.click(() => this.moveDown());

    // **CRUCIAL**: so super.update() can position the whole group
    this.outerSvg = this._group;
  }

  public override update(): void {
    // Resize buttons
    this._upBtn.size(this._width, this._arrowH);
    this._downBtn.size(this._width, this._arrowH).y(this._scrollHeight - this._arrowH);

    // Resize track
    const trackH = this._scrollHeight - 2 * this._arrowH;
    this._track.size(this._width, trackH);

    // Constrain & position thumb
    this._thumbY = Math.max(0, Math.min(this._thumbY, trackH - this._thumbH));
    this._thumb.y(this._arrowH + this._thumbY);

    // Update button fills
    this._upBtn.fill(this.backcolor);
    this._downBtn.fill(this.backcolor);

    super.update();
  }

  private moveUp() {
    this.setThumbY(this._thumbY - this._step);
    this._scrollCallback?.(this, "up", this._thumbY);
  }
  private moveDown() {
    this.setThumbY(this._thumbY + this._step);
    this._scrollCallback?.(this, "down", this._thumbY);
  }
  private setThumbY(y: number) {
    const maxY = this._scrollHeight - 2 * this._arrowH - this._thumbH;
    this._thumbY = Math.max(0, Math.min(y, maxY));
    this.update();
  }

  // State‑machine visuals
  public normal(): void { this.backcolor = "#81c784"; this.update(); }
  public hover(): void  { this.backcolor = "#a5d6a7"; this.update(); }
  public down(): void   { this.backcolor = "#66bb6a"; this.update(); }

  public override idleupState(): void     { this.normal(); }
  public override idledownState(): void   { this.down(); }
  public override pressedState(): void    { this.down(); }
  public override hoverState(): void      { this.hover(); }
  public override hoverPressedState(): void { this.down(); }
  public override pressedoutState(): void { this.normal(); }
  public override moveState(): void       { this.hover(); }
  public override keyupState(_?: KeyboardEvent): void { this.normal(); }
  public override pressReleaseState(): void { /* no-op */ }
}
