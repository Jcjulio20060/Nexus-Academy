---
name: Coffee & Code
description: A warm, glassmorphic student console where coffee culture meets code craft
colors:
  primary: "#f2a63b"
  primary-hover: "#ffbe5c"
  primary-glow: "rgba(242, 166, 59, 0.18)"
  secondary: "#2dd4bf"
  secondary-glow: "rgba(45, 212, 191, 0.15)"
  accent: "#e8c396"
  background: "#171109"
  foreground: "#f6efe3"
  foreground-muted: "#a89a86"
  surface: "rgba(43, 34, 22, 0.55)"
  surface-hover: "rgba(43, 34, 22, 0.85)"
  surface-card: "rgba(26, 19, 12, 0.6)"
  surface-border: "rgba(255, 255, 255, 0.08)"
  success: "#34d399"
  warning: "#fbbf24"
  error: "#f87171"
typography:
  display:
    fontFamily: "Space Grotesk, Inter, -apple-system, sans-serif"
    fontWeight: 700
    letterSpacing: "-0.03em"
  body:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif"
    fontWeight: 400
    fontSize: "0.9rem"
  mono:
    fontFamily: "JetBrains Mono, ui-monospace, SFMono-Regular, monospace"
    fontWeight: 500
    fontSize: "0.72rem"
    letterSpacing: "0.08em"
rounded:
  sm: "8px"
  md: "10px"
  lg: "12px"
  xl: "16px"
  full: "999px"
spacing:
  xs: "0.25rem"
  sm: "0.5rem"
  md: "1rem"
  lg: "1.5rem"
  xl: "2rem"
  "2xl": "2.5rem"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#1a130d"
    rounded: "{rounded.md}"
    padding: "0.75rem 1.4rem"
  button-ghost:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.md}"
    padding: "0.75rem 1.4rem"
  button-danger:
    backgroundColor: "rgba(248, 113, 113, 0.12)"
    textColor: "{colors.error}"
    rounded: "{rounded.md}"
    padding: "0.75rem 1.4rem"
  badge-amber:
    backgroundColor: "{colors.primary-glow}"
    textColor: "{colors.primary}"
    rounded: "{rounded.full}"
    padding: "0.18rem 0.6rem"
  badge-teal:
    backgroundColor: "{colors.secondary-glow}"
    textColor: "{colors.secondary}"
    rounded: "{rounded.full}"
    padding: "0.18rem 0.6rem"
---

# Design System: Coffee & Code

## Overview

**Creative North Star: "The Code Café"**

Coffee & Code is a student console that feels like opening your laptop at a premium indie café: warm amber light filtering through glass, the quiet hum of a terminal in the background, and every surface within arm's reach. The design marries coffee-culture warmth (caramel, espresso, cream) with developer-tool precision (monospace labels, terminal-green accents, a console-like shell). Glassmorphism provides depth through translucent layers that let the ambient background glow through, while subtle shadows ground interactive elements and signal hover states.

The system is deliberately dual-natured: a dark espresso mode that feels like a late-night coding session, and a light cream mode that feels like a sunlit study afternoon. Both share the same amber-teal accent pair and glass material, differing only in their neutral ramp. The console metaphor — status bar, side rail, tab bar, monospace section headers with `//` prefixes — is not decoration; it is the product's identity. Every element should feel like it belongs in a well-crafted developer tool that happens to serve students instead of engineers.

**Key Characteristics:**
- Coffee-caramel-amber primary with terminal-teal secondary — a warm/cool accent pair that never competes
- Glassmorphic surfaces with backdrop-filter blur as the primary depth language, grounded by subtle shadows on interactive elements
- Console shell metaphor: status bar, side rail (desktop), tab bar (mobile), monospace `// section` headers
- Tactile, confident interactions — clear hover states, visible focus rings, responsive press feedback
- Dual-theme: dark espresso default with light cream fallback, both sharing the same accent vocabulary

## Colors

The palette is anchored by a warm amber primary and a cool teal secondary — coffee and code, side by side. The neutral ramp is espresso-brown in dark mode and warm cream in light mode, never pure black or pure white.

### Primary
- **Caramel Amber** (#f2a63b): The dominant accent. Used on primary buttons, active navigation states, time displays, section header `//` decorators, and the brand logo cup. It is the "coffee" in Coffee & Code.
- **Amber Hover** (#ffbe5c): One step lighter for hover states on primary-accented elements.
- **Amber Glow** (rgba(242, 166, 59, 0.18)): Translucent amber fill for badge backgrounds, active tab highlights, and primary button hover tints.

### Secondary
- **Terminal Teal** (#2dd4bf): The "code" accent. Used on the live-dot pulse, current-class indicator, brand logo steam curls and braces, progress bar gradient endpoint, and secondary badges. It signals liveness and system status.
- **Teal Glow** (rgba(45, 212, 191, 0.15)): Translucent teal fill for teal badge backgrounds and weather ambience.

### Neutral
- **Espresso Black** (#171109): Dark mode background. Never pure #000 — it carries a warm brown undertone.
- **Warm Cream** (#f6efe3): Dark mode foreground text. Never pure #fff — it softens to match the coffee palette.
- **Muted Tan** (#a89a86): Secondary text, labels, and placeholders in dark mode. Tinted toward the warm neutral, never gray.
- **Cream Surface** (rgba(43, 34, 22, 0.55)): Glassmorphic surface background. Semi-transparent brown that lets the background gradient glow through.
- **Cream Surface Hover** (rgba(43, 34, 22, 0.85)): Opaque variant for hovered glass panels.
- **Deep Espresso** (rgba(26, 19, 12, 0.6)): Card background within glass panels — one step darker than the surface.
- **Glass Border** (rgba(255, 255, 255, 0.08)): Subtle white border on glass surfaces. Invisible at rest, catches light on hover.

### Semantic
- **Success Green** (#34d399): Approved states, free-now indicators, positive confirmations.
- **Warning Amber** (#fbbf24): Notice icons, pending states, caution badges.
- **Error Rose** (#f87171): Destructive actions, error states, rejected absences.

### Named Rules
**The Warmth Rule.** No neutral in the system is achromatic. Backgrounds carry brown, text carries cream, borders carry warm white. Pure black, pure white, and pure gray appear nowhere in the palette.

**The Two-Accent Ceiling.** Amber and teal are the only accent hues. Status colors (success, warning, error) are functional, not decorative — they appear only in their semantic context and never as a third accent.

## Typography

**Display Font:** Space Grotesk (with Inter fallback)
**Body Font:** Inter (with system sans-serif fallback)
**Mono Font:** JetBrains Mono (with ui-monospace fallback)

**Character:** The pairing is "developer who reads design blogs" — Space Grotesk has the geometric confidence of a display face without the coldness of a pure geometric sans, while Inter is the invisible workhorse that gets out of the way. JetBrains Mono grounds data, labels, and code in a monospace that feels native to the console metaphor, not costume.

### Hierarchy
- **Display** (700, clamp(2rem, 5vw, 2.6rem), 1.15): Page titles and greeting headlines. Tight letter-spacing (-0.03em) to feel dense and confident. Appears once per page at the top.
- **Headline** (700, 2rem, 1.2): Section-level headings within pages (e.g., current class subject name at 2.2rem). Slightly looser tracking (-0.02em).
- **Body** (400, 0.9rem, 1.5): All running text, descriptions, and paragraph content. Max comfortable measure around 65ch.
- **Label / Mono** (500, 0.72rem, 0.08em, uppercase): Section headers (`// AGORA`, `// PRAZOS`), timestamps, countdown text, badge text, metadata. Always uppercase, always letter-spaced. The `//` prefix in amber is a signature element — it makes every section feel like a code comment.

### Named Rules
**The Comment Prefix Rule.** Every section header uses the `// label` monospace pattern with `//` in amber. This is not decoration — it is the visual signature that makes the console feel like a codebase. Never drop the `//`, never change its color from amber, never use it on non-section-header text.

**The Tabular Numerals Rule.** All time displays, countdowns, and numeric data use `font-variant-numeric: tabular-nums` via the `.mono` utility. Numbers in columns must align.

## Layout

The console uses a fixed shell pattern: a sticky status bar at the top, a fixed side rail on desktop (64px wide), a fixed bottom tab bar on mobile, and a scrollable main content area centered at max-width 920px.

**Desktop (≥768px):** Status bar (56px) + side rail (64px left) + main content (padded to 920px centered, with left offset for the rail). The tab bar is hidden.

**Mobile (<768px):** Status bar (56px, condensed padding) + main content (full width, padded 1.25rem) + fixed bottom tab bar (with safe-area-inset-bottom padding). The side rail is hidden. Brand name in the status bar is hidden.

**Spacing rhythm:** Sections are separated by 2.5rem vertical gaps. Within a section, items use 0.75rem–1rem gaps. More space appears above a heading (2.4rem via SectionHeader marginTop) than below it (0.9rem via marginBottom), creating a clear "this belongs to the section above" rhythm.

**Background treatment:** The console shell background is a layered composition — two radial gradients (primary glow top-left, secondary glow bottom-right) over the solid background color, creating an ambient warmth that glassmorphic surfaces float over. A dot-grid pattern at 0.35 opacity adds subtle texture. Weather ambience overlays shift these gradients based on real-time conditions.

## Elevation & Depth

Depth is a hybrid of glassmorphism and subtle shadows. Glass panels use `backdrop-filter: blur(12px)` with semi-transparent backgrounds to create the feeling of frosted glass floating over the ambient background. Shadows ground interactive elements and signal state changes.

### Shadow Vocabulary
- **Panel resting** (`box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)`): Default shadow on all `.glass-panel` elements. Subtle, ambient — makes glass feel lifted without drawing attention.
- **Card hover lift** (`box-shadow: 0 10px 28px -10px var(--primary-glow)`): Appears on `.glass-card-hover:hover`. Amber-tinted, wider spread — signals interactivity and draws the eye to the hovered card.
- **Modal overlay** (`rgba(0, 0, 0, 0.7)` with `backdrop-filter: blur(4px)`): Full-screen dark overlay with blur. Heavier than glass panels to create clear focus isolation.

### Named Rules
**The Glass-First Rule.** Surfaces are glass by default. Shadows appear only as a response to state (hover, elevation, focus) or as the resting panel shadow. Glass is the material; shadow is the signal.

## Shapes

The system uses generous, consistent border radii that feel rounded and approachable without being bubbly. The 10px radius is the workhorse — used on buttons, inputs, modals, and interactive surfaces. Cards and panels use 16px for a softer container feel. Badges and live dots use full pill rounding (999px).

- **Interactive elements** (buttons, inputs, toggles): 10px radius
- **Containers** (glass panels, cards, modals): 16px radius
- **Tab bar segments**: 9px radius (slightly tighter for dense nav)
- **Badges, pills, dots**: 999px (full round)
- **Icon containers** (40×40 action boxes on home cards): 12px radius

Borders are always 1px solid using `var(--surface-border)` — warm white at 8% opacity in dark mode, black at 10% in light mode. They catch light rather than define edges.

## Components

### Buttons
- **Shape:** 10px radius, inline-flex with centered content and 0.5rem icon-text gap.
- **Primary:** Amber background (#f2a63b), dark text (#1a130d), bold 700 weight. Padding 0.75rem 1.4rem (md) or 0.45rem 0.85rem (sm). Transform: translateY(-2px) on hover with amber glow shadow.
- **Ghost:** Glass surface background, foreground text, 1px surface-border. Same radius and sizing as primary. Used for secondary actions.
- **Danger:** Translucent rose background (rgba(248, 113, 113, 0.12)), rose text, rose-tinted border. For destructive actions.
- **States:** Disabled at 0.5 opacity with not-allowed cursor. Transition: transform 0.15s, opacity 0.15s, background 0.15s.

### Cards / Glass Panels
- **Corner Style:** 16px radius via `.glass-panel`.
- **Background:** Semi-transparent surface color with `backdrop-filter: blur(12px)`.
- **Shadow:** Resting panel shadow (see Elevation). Hover variant adds amber-tinted glow shadow and translateY(-2px).
- **Border:** 1px solid surface-border. On hover, transitions to amber-tinted border via `color-mix`.
- **Internal Padding:** 1.5rem standard, 2rem for featured panels (current class).
- **Accent variant:** 3px left border in a semantic color (teal for current class, amber for upcoming).

### Badges / Chips
- **Style:** Full pill shape (999px radius), monospace 0.66rem uppercase with 0.06em letter-spacing. Background is a translucent glow of the badge's tone color.
- **Tones:** amber (primary), teal (secondary), success, warning, error, neutral. Each maps to a color + glow background pair.
- **Usage:** Status labels, category tags, period indicators.

### Inputs / Fields
- **Style:** 10px radius, surface background, 1px surface-border, foreground text, 0.9rem font. Padding 0.7rem 0.85rem.
- **Focus:** Border transitions to amber (primary), background shifts to surface-hover.
- **Labels:** Block, 0.78rem, 600 weight, uppercase, letter-spaced, muted foreground. 0.4rem bottom margin.
- **Textarea:** Resizable vertical, min-height 90px.

### Navigation
- **Side Rail (Desktop):** Fixed 64px left, 42×42px link targets with 12px radius. Default: muted foreground on transparent. Hover: foreground on surface background. Active: amber text on amber glow with amber-tinted border.
- **Tab Bar (Mobile):** Fixed bottom, full width, flex justify-around. Links are column-flex with 20px icon + 0.62rem label. Active: amber on amber glow. Hidden on desktop.
- **Status Bar:** Sticky top, 56px height, glass background with blur. Brand logo (30px) + name on left, utilities (clock, weather, push, command palette, theme toggle, student badge) on right.

### Section Headers
- **Pattern:** Flex row with `// LABEL` in monospace (JetBrains Mono, 0.72rem, uppercase, 0.08em spacing). The `//` prefix is always amber; the label text is muted foreground. Optional action link on the right side in primary color.
- **Spacing:** 2.4rem top margin, 0.9rem bottom margin — more space above than below to visually attach the header to the section above.

### Current Class Panel
- **Signature component.** A featured glass panel with 2rem padding and a 3px teal left border. Contains a live-dot pulse, monospace time range, 2.2rem subject name, metadata chips (room, professor, period in pill shapes), a progress bar (gradient from teal to amber), and remaining-time countdown.
- **Empty state:** Coffee icon in a 42×42 amber-tinted container, "Livre agora" heading in success green.

### Modal
- **Overlay:** Fixed full-screen, rgba(0,0,0,0.7) with 4px blur. Click-outside and Escape to close.
- **Panel:** Glass panel, max-width 500px, max-height 90vh with overflow scroll. Header with `// title` and close button (30×30, 8px radius, surface background). Body padding 1.5rem.

## Do's and Don'ts

### Do:
- **Do** use the `//` comment prefix on every section header — it is the signature visual element.
- **Do** keep the amber-teal accent pair exclusive. Status colors are functional, never decorative.
- **Do** use glassmorphism for surfaces that float over the ambient background gradient.
- **Do** add the resting panel shadow to all glass panels — depth without shadows reads as flat.
- **Do** use `font-variant-numeric: tabular-nums` on all time and number displays.
- **Do** maintain the warm neutral ramp — no achromatic blacks, whites, or grays.
- **Do** use the 10px radius for interactive elements, 16px for containers, 999px for pills.

### Don't:
- **Don't** use pure black (#000) or pure white (#fff) anywhere — the palette is always warm.
- **Don't** use gray for secondary text — tint it toward the warm neutral (muted tan in dark, muted brown in light).
- **Don't** drop the `//` prefix from section headers or change its color.
- **Don't** add a third accent color — amber and teal are the complete accent vocabulary.
- **Don't** use glassmorphism as pure decoration on elements that don't float over a background gradient.
- **Don't** use border-left above 1px on cards or list items (the 3px accent border on CurrentClass is a featured-panel exception).
- **Don't** mix font families — Space Grotesk is display-only, Inter is body-only, JetBrains Mono is data/label-only.
- **Don't** use modals for tasks that don't need interruption or protected focus.
