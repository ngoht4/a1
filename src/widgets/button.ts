import { IdleUpWidgetState, PressedWidgetState } from "../core/ui";
import { Window, Widget, RoleType, EventArgs } from "../core/ui";
import { Rect, Text, Box } from "../core/ui";

class Button extends Widget {
    private _rect: Rect;
    private _text: Text;
    private _input: string;
    private _fontSize: number;
    private _textY: number;
    private defaultText: string = "Button";
    private defaultFontSize: number = 18;
    private defaultWidth: number = 200;
    private defaultHeight: number = 200;
    private _clickCallback: ((sender: Button) => void) | null = null;

    constructor(parent: Window) {
        super(parent);
        this.width  = this.defaultWidth;
        this.height = this.defaultHeight;
        this._input   = this.defaultText;
        this._fontSize = this.defaultFontSize;
        this.role     = RoleType.button;
        this.render();
        this.normal();
        this.selectable = false;
    }

    public set fontSize(size: number) {
        this._fontSize = size;
        this.update();
    }

    private positionText(): void {
        const box   = this._text.bbox();
        const x0    = Number(this._rect.x().valueOf());
        const y0    = Number(this._rect.y().valueOf());
        const h0    = Number(this._rect.height().valueOf());
        // center vertically
        this._textY = (y0 + h0 / 2) - (box.height / 2);
        this._text
            .x(x0 + 4)
            .y(this._textY);
    }

    public override render(): void {
        this._group = (this.parent as Window).window.group();

        this._rect = this._group
            .rect(this.width, this.height)
            .stroke("black");

        this._text = this._group
            .text(this._input)
            .font("size", this._fontSize);

        this.outerSvg = this._group;

        // transparent hit area
        const hit = this._group
            .rect(this.width, this.height)
            .opacity(0)
            .attr("id", 0);

        this.registerEvent(hit);
        hit.mouseover(() => this.hover());
        hit.mouseout(()  => this.normal());
    }

    public override update(): void {
        this._text.font("size", this._fontSize).text(this._input);
        this.positionText();
        this._rect.fill(this.backcolor);
        super.update();
    }

    public override pressReleaseState(): void {
        if (this.previousState instanceof PressedWidgetState) {
            this.raise(new EventArgs(this));
            if (this._clickCallback) {
                this._clickCallback(this);
            } else {
                // fallback behavior
            }
        }
    }

    public onClick(callback: (sender: Button) => void): void {
        this._clickCallback = callback;
    }

    // visual state handlers
    public normal(): void        { this.backcolor = "red";       this.update(); }
    public down(): void          { this.backcolor = "#ff6666";   this.update(); }
    public pressed(): void       { this.backcolor = "#cc0000";   this.update(); }
    public hover(): void         { this.backcolor = "#ff3333";   this.update(); }
    public hoverPress(): void    { this.backcolor = "#cc3333";   this.update(); }
    public released(): void      { this.normal(); }

    // state‑machine overrides
    public override idleupState(): void         { this.normal(); }
    public override idledownState(): void       { this.down(); }
    public override pressedState(): void        { this.pressed(); }
    public override hoverState(): void          { this.hover(); }
    public override hoverPressedState(): void   { this.hoverPress(); }
    public override pressedoutState(): void     { this.released(); }
    public override moveState(): void           { this.hover(); }
    public override keyupState(_?: KeyboardEvent): void { this.normal(); }
}

export { Button };
