import { Window, Widget, RoleType } from "../core/ui";
import { Rect, Text } from "../core/ui";

export class CheckBox extends Widget {
    private _box: Rect;
    private _checkMark: Text;
    private _labelText: Text;
    private _checked = false;
    private _label: string;
    private _changeCallback: ((sender: CheckBox, checked: boolean) => void) | null = null;
    private readonly defaultSize = 20;
    private readonly spacing = 6;

    constructor(parent: Window, label = "") {
        super(parent);
        this.height = this.defaultSize;
        this._label = label;
        this.role = RoleType.group;
        this.render();
        this.normal();
        this.selectable = true;
    }

    public override render(): void {
        this._group = (this.parent as Window).window.group();

        // Draw box, checkmark placeholder, and label
        this._box = this._group
            .rect(this.defaultSize, this.defaultSize)
            .stroke("black");

        this._checkMark = this._group
            .text("")
            .font("size", this.defaultSize)
            .fill("black");

        this._labelText = this._group
            .text(this._label)
            .font("size", this.defaultSize)
            .fill("black");

        // Transparent hit area covers box + label
        const labelBBox = this._labelText.bbox();
        const hitWidth = this.defaultSize + this.spacing + Number(labelBBox.width);
        const hitRect = this._group
            .rect(hitWidth, this.defaultSize)
            .opacity(0)
            .attr("id", 0);

        this.outerSvg = this._group;
        this.registerEvent(hitRect);

        // Interaction callbacks
        hitRect.click(() => this.toggle());
        hitRect.mouseover(() => this.hover());
        hitRect.mouseout(() => this.normal());
    }

    public override update(): void {
        // Update checkmark display
        this._checkMark.text(this._checked ? "✔" : "");

        // Center checkmark in box
        const markBBox = this._checkMark.bbox();
        const cx = Number(this._box.x()) + (this.defaultSize - Number(markBBox.width)) / 2;
        const cy = Number(this._box.y()) + (this.defaultSize - Number(markBBox.height)) / 2;
        this._checkMark.x(cx).y(cy);

        // Position label
        const labelX = this.defaultSize + this.spacing;
        this._labelText.x(labelX).y(this._box.y().valueOf());

        // Fill box background
        this._box.fill(this.backcolor);
        super.update();
    }

    public toggle(): void {
        this.checked = !this._checked;
    }

    public set label(text: string) {
        this._label = text;
        this.update();
    }
    public get label(): string {
        return this._label;
    }

    public get checked(): boolean {
        return this._checked;
    }
    public set checked(value: boolean) {
        if (this._checked !== value) {
            this._checked = value;
            this.update();
            this._changeCallback?.(this, this._checked);
        }
    }

    public onChange(callback: (sender: CheckBox, checked: boolean) => void): void {
        this._changeCallback = callback;
    }

    public override pressReleaseState(): void {
        this.toggle();
    }

    // Visual states
    public normal(): void {
        this.backcolor = "white";
        this.update();
    }
    public hover(): void {
        this.backcolor = "#f0f0f0";
        this.update();
    }
    public down(): void {
        this.backcolor = "#dddddd";
        this.update();
    }

    // State‐machine hooks
    public override idleupState(): void { this.normal(); }
    public override idledownState(): void { this.down(); }
    public override pressedState(): void { this.down(); }
    public override hoverState(): void { this.hover(); }
    public override hoverPressedState(): void { this.down(); }
    public override pressedoutState(): void { this.normal(); }
    public override moveState(): void { this.hover(); }
    public override keyupState(_?: KeyboardEvent): void { this.normal(); }
}
