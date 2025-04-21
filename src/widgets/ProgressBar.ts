import { IdleUpWidgetState, PressedWidgetState } from "../core/ui";
import { Window, Widget, RoleType, EventArgs } from "../core/ui";
import { Rect, Text } from "@svgdotjs/svg.js"


class ProgressBar extends Widget {
    private _track: Rect;
    private _fill: Rect;
    private _width: number;
    private _height: number;
    private _progress: number;
    private _increment: number;
    private _incrementCallbacks: Array<(sender: ProgressBar, newValue: number) => void> = [];
    private _stateChangedCallbacks: Array<(sender: ProgressBar, newState: string) => void> = [];

    private readonly defaultWidth = 300;
    private readonly defaultHeight = 20;
    private readonly defaultIncrement = 10;

    constructor(parent: Window) {
        super(parent);
        //this.role = RoleType.progressbar;
        this._width = this.defaultWidth;
        this._height = this.defaultHeight;
        this._increment = this.defaultIncrement;
        this._progress = 0;
        this.render();
        this.normal();
        this.selectable = true;
    }
    public set barWidth(w: number) {
        this._width = w;
        this.update();
    }
    public get barWidth(): number {
        return this._width;
    }
    public set incrementValue(val: number) {
        this._increment = val;
    }
    public get incrementValue(): number {
        return this._increment;
    }
    public increment(value: number = this._increment): void {
        const next = Math.min(100, Math.max(0, this._progress + value));
        this._progress = next;
        this.update();
        this._incrementCallbacks.forEach(cb => cb(this, this._progress));
    }

    public onIncrement(callback: (sender: ProgressBar, newValue: number) => void): void {
        this._incrementCallbacks.push(callback);
    }
    public onStateChanged(callback: (sender: ProgressBar, newState: string) => void): void {
        this._stateChangedCallbacks.push(callback);
    }

    private raiseStateChanged(): void {
        const stateName = this.state?.constructor.name || '';
        this._stateChangedCallbacks.forEach(cb => cb(this, stateName));
    }

    public override render(): void {
        this._group = (this.parent as Window).window.group();
        // draw background track
        this._track = this._group
            .rect(this._width, this._height)
            .fill('#ddd')
            .stroke('#aaa');
        // draw fill bar
        this._fill = this._group
            .rect((this._progress / 100) * this._width, this._height)
            .fill('#76c7c0')
            .stroke('none');
        this.outerSvg = this._group;
    }

    public override update(): void {
        // update sizes
        this._track.size(this._width, this._height);
        this._fill.size((this._progress / 100) * this._width, this._height);
        super.update();
    }

    public override pressReleaseState(): void {
        if (this.previousState instanceof PressedWidgetState) {
            this.increment();
            this.raiseStateChanged();
        }
    }

    // visual state handlers
    public normal(): void {
        this._track.fill('#ddd');
        this._fill.fill('#76c7c0');
    }
    public down(): void {
        this._track.fill('#ccc');
        this._fill.fill('#5bb6b0');
    }
    public hover(): void {
        this._track.fill('#eee');
        this._fill.fill('#8bd1ca');
    }

    // state‑machine overrides
    public override idleupState(): void    { this.normal(); this.raiseStateChanged(); }
    public override idledownState(): void  { this.down();   this.raiseStateChanged(); }
    public override pressedState(): void   { this.down();   this.raiseStateChanged(); }
    public override hoverState(): void     { this.hover();  this.raiseStateChanged(); }
    public override hoverPressedState(): void { this.down(); this.raiseStateChanged(); }
    public override pressedoutState(): void   { this.normal(); this.raiseStateChanged(); }
    public override moveState(): void         { this.hover();  this.raiseStateChanged(); }
    public override keyupState(_?: KeyboardEvent): void { this.normal(); this.raiseStateChanged(); }
}

export { ProgressBar };
