// template.ts

// Import necessary base classes and components from the core UI framework
// Make sure these paths and class names match your project structure exactly.
import { Window, Widget, RoleType, EventArgs, IdleUpWidgetState } from "../core/ui";
// Import SVG elements from the core UI framework or SVG.js directly
import { Rect } from "../core/ui"; // Or: import { Rect } from '@svgdotjs/svg.js'; if using directly

/**
 * Template Class - A starting point for creating new UI widgets.
 * Inherits from the base Widget class and provides default implementations
 * for required methods and basic rendering.
 */
class Template extends Widget {
    // Private members for SVG elements specific to this template/widget
    private _rect: Rect; // The visible background rectangle

    // Default dimensions for the template widget
    private defaultWidth: number = 80;
    private defaultHeight: number = 30;

    /**
     * Creates an instance of the Template widget.
     * @param parent The parent window or widget this widget belongs to.
     */
    constructor(parent: Window) {
        super(parent); // Call the base Widget constructor

        // Set default dimensions
        this.height = this.defaultHeight;
        this.width = this.defaultWidth;

        // Set a default ARIA role.
        // IMPORTANT: This should be overridden by specific widget implementations
        // (e.g., RoleType.checkbox, RoleType.progressbar)
        this.role = RoleType.none;

        // Render the SVG elements for the widget
        this.render();

        // Set the initial state (e.g., IdleUp) AFTER elements are created.
        // Assumes IdleUpWidgetState constructor takes no arguments.
        this.setState(new IdleUpWidgetState());

        // Set a default background color (will be applied by update)
        this.backcolor = "silver";

        // Apply initial visual properties (like backcolor, size) defined above
        this.update();
    }

    /**
     * Renders the basic SVG elements for the widget.
     * Creates a visible rectangle and a transparent hit area.
     * This method is called once during the constructor.
     */
    render(): void {
        // Create the main SVG group element for this widget within the parent window
        this._group = (this.parent as Window).window.group();

        // Assign the group as the main SVG container for the base Widget class logic
        this.outerSvg = this._group;

        // Create the visible background rectangle for the widget
        this._rect = this._group.rect(this.width, this.height)
            .stroke({ color: 'black', width: 1 }); // Default black border, 1px wide

        // Create a transparent rectangle covering the widget area.
        // This acts as the primary target for mouse/touch events (hit area).
        // Using a separate hit area prevents issues if the visible _rect changes style (e.g., fill='none').
        const hitArea = this._group.rect(this.width, this.height)
            .opacity(0); // Make it invisible
            // *** REMOVED LINE TO FIX ERROR ***
            // .attr('id', this.id + '_hit'); // This line caused error because 'this.id' doesn't exist on base Widget

        // Register the hit area with the base Widget's event handling system.
        // This connects user interactions (mousedown, mouseup, mouseover, etc.)
        // on the hitArea to the widget's state machine.
        this.registerEvent(hitArea);
    }

    /**
     * Updates the visual appearance of the widget based on its current state properties
     * (e.g., backcolor, width, height). This method should be called whenever a
     * property affecting the visual appearance changes.
     */
    update(): void {
        // Check if the rectangle element exists before manipulating it
        if (this._rect) {
            // Apply the current background color
            this._rect.fill(this.backcolor);
            // Apply the current width and height
            this._rect.size(this.width, this.height);

            // TODO: In specific widgets, update other elements like text, icons, etc. here.
        }
        // Call the base class update method. It might handle things like applying transforms (position).
        super.update();
    }

    /**
     * Moves the widget's main group to the specified (x, y) coordinates
     * within the parent's coordinate system. Required by the assignment/base class.
     * @param x The new X coordinate.
     * @param y The new Y coordinate.
     */
    move(x: number, y: number): void {
        // Check if the main group element exists
        if (this._group) {
            // Use SVG.js's move method to position the group
            this._group.move(x, y);
        }
        // Call the base class move method. It might update internal x/y properties.
        super.move(x, y);
    }

    // --- State Handling Methods ---
    // These methods define the visual appearance or actions for each state
    // in the widget's state machine. Provide basic default implementations here.
    // Override these in your specific derived widget classes (Checkbox, Button, etc.)
    // to implement their unique visual styles and behaviors for each state.

    /** Defines appearance in the default, non-interacting state. */
    idleupState(): void {
        this.backcolor = "silver"; // Default idle color
        this.update(); // Apply changes
    }

    /** Defines appearance when the mouse button is pressed down over the widget (but not yet released). */
    idledownState(): void {
        this.backcolor = "#a0a0a0"; // Slightly darker silver
        this.update();
    }

    /** Defines appearance when the widget is actively pressed (e.g., holding mouse down). */
    pressedState(): void {
        this.backcolor = "#808080"; // Darker silver
        this.update();
    }

    /**
     * Called when the widget transitions from a pressed state to a released state
     * (e.g., mouseup occurs over the widget after a mousedown).
     * This is the ideal place to trigger the widget's primary action (like a click).
     */
    pressReleaseState(): void {
        // Example: Raise a generic 'state change' event.
        // You might want to define more specific events in derived classes.
        this.raise(new EventArgs(this));

        // TODO: Implement specific click/action logic in derived widgets here.
        // (e.g., toggle checkbox state, select radio button, trigger button callback).
    }

    /** Defines appearance when the mouse pointer is hovering over the widget. */
    hoverState(): void {
        this.backcolor = "#e0e0e0"; // Lighter silver (provides hover feedback)
        this.update();
    }

    /** Defines appearance when hovering while the mouse button is also pressed down. */
    hoverPressedState(): void {
        this.backcolor = "#909090"; // Mix of hover and pressed look
        this.update();
    }

    /** Called when the pointer moves out of the widget boundary while it was in a pressed state. */
    pressedoutState(): void {
        // Typically revert to the normal idle appearance if the press is 'cancelled' by moving out.
        this.idleupState();
    }

    /**
     * Called when the pointer moves while over the widget.
     * Useful for implementing drag operations (like scrollbar thumbs).
     */
    moveState(): void {
        // Default behavior: No visual change during move, rely on hover/pressed states.
        // Override in specific widgets (like Scrollbar thumb) if drag behavior is needed.
    }

    /** Called when a keyboard key is released, potentially ending a keyboard interaction. */
    keyupState(): void {
        // Default behavior: Revert to idle state on key up.
        // Override if specific keyboard interactions need different handling.
        this.idleupState();
    }

    // --- Custom Properties & Methods Placeholder ---
    // Add widget-specific properties (like 'label', 'value', 'isChecked')
    // and methods (like 'increment', 'check') in the derived widget classes, not here in the template.
    /*
    Example placeholder for a derived class:
    private _label: Text; // SVG Text element
    private _labelText: string = "";

    public set label(text: string) {
        this._labelText = text;
        // Code to create/update this._label SVG element
        this.update(); // May need more specific update logic
    }
    public get label(): string {
        return this._labelText;
    }
    */

}

// Export the Template class so it can be imported and extended by other widget files.
export { Template };