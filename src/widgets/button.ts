import { IdleUpWidgetState, PressedWidgetState } from "../core/ui";
import { Window, Widget, RoleType, EventArgs } from "../core/ui";
import { Rect, Text, Box } from "../core/ui";

class Button extends Widget 
{
    private _rect: Rect;
    private _text: Text;
    private _input: string;
    private _fontSize: number;
    private _text_y: number;
    private _text_x: number;
    private defaultText: string = "Button";
    private defaultFontSize: number = 18;
    private defaultWidth: number = 2000;
    private defaultHeight: number = 400;
    private _clickCallback: ((sender: Button) => void) | null = null;

    constructor(parent: Window) 
    {
        super(parent);
        this.height = this.defaultHeight;
        this.width = this.defaultWidth;
        this._input = this.defaultText;
        this._fontSize = this.defaultFontSize;
        this.role = RoleType.button;
        this.render();
        this.normal();
        this.selectable = false;
    }

    set fontSize(size: number) 
    {
        this._fontSize = size;
        this.update();
    }

    private positionText() 
    {
        let box: Box = this._text.bbox();
        this._text_y = (+this._rect.y() + (+this._rect.height() / 2)) - (box.height / 2);
        this._text.x(+this._rect.x() + 4);
        if (this._text_y > 0) 
        {
            this._text.y(this._text_y);
        }
    }

    render(): void 
    {
        this._group = (this.parent as Window).window.group();
        this._rect = this._group.rect(this.width, this.height);
        this._rect.stroke("black");
        this._text = this._group.text(this._input);
        this.outerSvg = this._group;
        let eventrect = this._group.rect(this.width, this.height).opacity(0).attr("id", 0);
        this.registerEvent(eventrect);
        eventrect.mouseover(() => 
        {
            this.hover();
        });
        eventrect.mouseout(() => 
        {
            this.normal();
        });
    }

    override update(): void 
    {
        if (this._text != null) 
        {
            this._text.font("size", this._fontSize);
            this._text.text(this._input);
            this.positionText();
        }
        if (this._rect != null) 
        {
            this._rect.fill(this.backcolor);
        }
        super.update();
    }
    
    pressReleaseState(): void {
        if (this.previousState instanceof PressedWidgetState) 
        {
            this.raise(new EventArgs(this));
            if (this._clickCallback) 
            {
                this._clickCallback(this);
            } else 
            {
                let msg = document.getElementById("message");
                if (!msg) 
                {
                    msg = document.createElement("div");
                    msg.setAttribute("id", "message");
                    msg.style.fontSize = "24px";
                    msg.style.marginTop = "20px";
                    document.body.appendChild(msg);
                }
                msg.innerText = "button has been pressed";
            }
        }
    }
    
    public onClick(callback: (sender: Button) => void): void 
    {
        this._clickCallback = callback;
    }
    
    normal(): void 
    {
        this.backcolor = "red";
        this.update();
    }
    
    down(): void 
    {
        this.backcolor = "#ff6666";
        this.update();
    }
    
    pressed(): void 
    {
        this.backcolor = "#cc0000";
        this.update();
    }
    
    hover(): void
    {
        this.backcolor = "#ff3333";
        this.update();
    }
    
    hoverPress(): void 
    {
        this.backcolor = "#cc3333";
        this.update();
    }
    
    released(): void 
    {
        this.normal();
    }
    
    move(): void 
    {
        this.hover();
    }
    
    keyUp(keyEvent?: KeyboardEvent): void 
    {
        this.normal();
    }

    override idleupState(): void 
    {
        this.normal();
    }

    override idledownState(): void 
    {
        this.down();
    }

    override pressedState(): void 
    {
        this.pressed();
    }

    override hoverState(): void 
    {
        this.hover();
    }

    override hoverPressedState(): void 
    {
        this.hoverPress();
    }

    override pressedoutState(): void 
    {
        this.released();
    }

    override moveState(): void 
    {
        this.move();
    }

    override keyupState(keyEvent?: KeyboardEvent): void 
    {
        this.keyUp(keyEvent);
    }
}

export { Button };
