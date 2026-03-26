# Design System Specification: The Ephemeral Lens

## 1. Overview & Creative North Star
**Creative North Star: "The Digital Curator"**

This design system is built on the philosophy that "Nothing Lasts." In an anti-hoarding context, the UI must not feel like a storage bin, but rather a temporary viewing gallery. We achieve a high-end, editorial feel by rejecting the "boxed-in" layout of traditional apps in favor of **Intentional Asymmetry** and **Tonal Depth**.

The aesthetic is "Vapor Premium OLED"—optimized for deep blacks where content appears to float in a void. We break the template look by using aggressive typographic scales and overlapping frosted elements that suggest a fleeting, layered existence. Surfaces should never feel heavy; they should feel like light caught in a dark room.

---

## 2. Color Strategy
Our palette is anchored in the abyss of `surface` (#0e0e10), using `primary` (Electric Violet) only for moments of critical intent.

### The "No-Line" Rule
**Borders are a failure of hierarchy.** Designers are prohibited from using 1px solid strokes to section content. Boundaries must be defined through:
- **Background Shifts:** Placing a `surface-container-low` (#131315) element against the `background` (#0e0e10).
- **Negative Space:** Using the Spacing Scale (specifically `8` and `12`) to create "islands" of content.

### Surface Hierarchy & Nesting
Treat the UI as physical layers of smoked glass. 
- **Base Layer:** `surface` (#0e0e10)
- **Secondary Content:** `surface-container` (#19191c)
- **Floating Cards:** `surface-variant` (#262528) with 50% opacity and `backdrop-blur-xl`.

### Signature Textures
To avoid a "flat" digital feel, all primary CTAs must use a linear gradient:
- **Direction:** 135deg
- **From:** `primary` (#ba9eff) 
- **To:** `primary_dim` (#8455ef)
This subtle transition provides a "soul" to the interactive elements that a flat hex code cannot achieve.

---

## 3. Typography: Editorial Authority
We use **Inter** with a specific focus on weight and tracking to convey a sense of premium urgency.

- **Display & Headline (The Statement):** Use `display-lg` to `headline-sm`. These must be **Bold** with `tracking-tight` (-0.02em). This creates a "compact" power that feels intentional and curated.
- **Body (The Utility):** Use `body-md` for high readability. Increase line-height to 1.6 to provide "breathing room" against the dense, dark background.
- **Labels (The Metadata):** Use `label-sm` in `on-surface-variant` (#adaaad) for ephemeral data (timestamps, counts).

The contrast between a massive `display-lg` heading and a tiny, wide-spaced `label-sm` creates the "Editorial" tension required for a high-end experience.

---

## 4. Elevation & Depth: Tonal Layering
Traditional drop shadows are too "dirty" for an OLED experience. We move away from structural lines toward light-based depth.

- **The Layering Principle:** Depth is achieved by stacking. Place a `surface-container-lowest` (#000000) element inside a `surface-container-high` (#1f1f22) wrapper to create a "recessed" look.
- **Ambient Glows:** When an element must "float," use a shadow with a blur of `24px` and an opacity of `6%`. The shadow color must be `primary` (#ba9eff) rather than black, creating a subtle violet "aura" around active items.
- **The Ghost Border Fallback:** If a container needs a definition (e.g., in high-glare environments), use a "Ghost Border": `outline-variant` (#48474a) at **15% opacity**.
- **Glassmorphism:** Use `surface-variant` at 50% opacity with a `backdrop-blur-xl`. This "OLED Frost" allows underlying content to bleed through as soft smears of violet and slate.

---

## 5. Components

### Buttons
- **Primary:** Gradient (`primary` to `primary_dim`), `rounded-md` (0.375rem). Text should be `on-primary_fixed` (#000000) for maximum punch.
- **Secondary:** Transparent background with a "Ghost Border." On hover, scale to `105%`.
- **Tertiary:** Ghost text using `primary`. No background or border.

### Interactive "Nothing Lasts" Chips
- **Status:** Use `secondary_container` (#5e2c91) with `on-secondary_container` (#e3c4ff) text.
- **Interaction:** On tap, these should "dissolve" (fade out with a scale-95) to reinforce the anti-hoarding philosophy.

### Selection & Inputs
- **Input Fields:** `surface-container-highest` background. No border. On focus, a subtle 1px "Ghost Border" of `primary` at 40% opacity appears.
- **Cards & Lists:** **Strictly forbid dividers.** Use `spacing-6` (2rem) of vertical white space to separate list items. If separation is visually required, use a 10% opacity `surface-bright` fill for every second item (zebra striping) rather than a line.

### Progress Bars (The "Decay" Bar)
- **Track:** `surface-container-highest`
- **Indicator:** `primary` (#ba9eff)
- **Effect:** Add a subtle outer glow (0px 0px 8px) to the indicator to make it look like a neon filament.

---

## 6. Do's and Don'ts

### Do
- **Do** embrace "The Void." Leave large areas of `background` (#0e0e10) empty to focus the user's eye.
- **Do** use `scale-105` micro-interactions on all interactive cards to make the UI feel responsive to touch.
- **Do** use asymmetric layouts. Align a heading to the far left and a CTA to the far right with significant vertical offset.

### Don't
- **Don't** use 100% white (#ffffff). Use `on-surface` (#f9f5f8) to prevent eye strain on OLED screens.
- **Don't** use "Card-on-Card" layouts with borders. If you need a nested container, use a tonal shift (e.g., `surface-container-low` to `surface-container-high`).
- **Don't** use standard easing. All transitions should use `cubic-bezier(0.2, 0, 0, 1)` for a "heavy" premium feel.