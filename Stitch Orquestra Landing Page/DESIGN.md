---
name: Orquestra OS Design System
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#3a3939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#bbc9cd'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#859397'
  outline-variant: '#3c494c'
  surface-tint: '#2fd9f4'
  primary: '#8aebff'
  on-primary: '#00363e'
  primary-container: '#22d3ee'
  on-primary-container: '#005763'
  inverse-primary: '#006877'
  secondary: '#c0c1ff'
  on-secondary: '#1000a9'
  secondary-container: '#3131c0'
  on-secondary-container: '#b0b2ff'
  tertiary: '#ffd6a3'
  on-tertiary: '#462b00'
  tertiary-container: '#ffb13b'
  on-tertiary-container: '#6e4600'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#a2eeff'
  primary-fixed-dim: '#2fd9f4'
  on-primary-fixed: '#001f25'
  on-primary-fixed-variant: '#004e5a'
  secondary-fixed: '#e1e0ff'
  secondary-fixed-dim: '#c0c1ff'
  on-secondary-fixed: '#07006c'
  on-secondary-fixed-variant: '#2f2ebe'
  tertiary-fixed: '#ffddb5'
  tertiary-fixed-dim: '#ffb957'
  on-tertiary-fixed: '#2a1800'
  on-tertiary-fixed-variant: '#643f00'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '600'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '500'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.05em
  mono-sm:
    fontFamily: Geist
    fontSize: 13px
    fontWeight: '400'
    lineHeight: '1.5'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 4px
  xs: 8px
  sm: 12px
  md: 24px
  lg: 48px
  xl: 80px
  gutter: 24px
  margin-safe: 32px
---

## Brand & Style

The design system is engineered for high-stakes AI orchestration. It targets technical decision-makers and engineers who require an environment reflecting stability, precision, and production-grade reliability. 

The aesthetic is **Sophisticated Minimalism**. It avoids the "neon-glow" tropes of consumer AI, instead opting for a "utility-first" premium feel inspired by modern engineering tools. The UI should evoke the feeling of a high-end physical server rack or a precise laboratory instrument—structured, cool-toned, and intentionally quiet. 

Key principles:
- **Authority through restraint:** Use color and motion only when it signifies state changes or critical data.
- **Infrastructure-grade:** Every element must feel deliberate and structurally sound.
- **Technical Clarity:** Dense information is managed through rigorous spacing and typographic hierarchy rather than visual clutter.

## Colors

The palette is strictly dark-mode, rooted in a "Deep Charcoal" foundation. 

- **Primary (#22D3EE):** A surgical cyan used exclusively for active states, focus rings, and primary action buttons.
- **Secondary (#6366F1):** A muted indigo used for secondary data visualizations or subtle brand accents in complex node diagrams.
- **Neutral System:** The core of the UI is built on a scale of neutral grays. `#0A0A0A` serves as the canvas, while `#111111` and `#1C1C1C` define the layered surfaces.
- **Functional Colors:** Success, Warning, and Error states should be desaturated to maintain the professional tone (e.g., use a "muted emerald" rather than "bright green").

## Typography

This design system utilizes **Inter** for all standard UI communication to ensure maximum legibility and a neutral, professional tone. **Geist** (or a similar high-quality monospace font) is introduced for labels, metadata, and technical readouts to reinforce the platform's developer-centric nature.

- **Weight usage:** Stick to Medium (500) and SemiBold (600) for headers. Regular (400) is used for all long-form body text to maintain a light, airy feel against the dark background.
- **Contrast:** Use high-contrast white (#F5F5F5) for headings and mid-grey (#A3A3A3) for body text to reduce eye strain and establish a clear hierarchy.
- **Case:** Use Uppercase for `label` roles to differentiate system metadata from user content.

## Layout & Spacing

The layout follows a **Fluid Grid** model with strict adherence to an 8px (base 4px) rhythmic system.

- **Desktop:** A 12-column grid with a 24px gutter. The layout often utilizes a "Sidebar + Main Stage" pattern typical of IDEs and workflow tools.
- **Negative Space:** Generous padding is applied to container elements to prevent the technical density from feeling overwhelming. Use `lg` (48px) or `xl` (80px) spacing between major sections.
- **Node-Link Geometry:** For the orchestration canvas, use a background dot-grid with 24px spacing to guide manual placement of nodes.
- **Reflow:** On mobile/tablet, the sidebar collapses into a bottom drawer or a hidden hamburger menu, prioritizing the "Main Stage" canvas or data tables.

## Elevation & Depth

Hierarchy is established through **Tonal Layering** and subtle **Interiors Borders** rather than aggressive shadows.

- **Base Layer:** #0A0A0A (The void).
- **Surface Layer:** #111111 (Cards, sidebars). Defined by a 1px solid border of #262626.
- **Elevated Layer:** #1C1C1C (Modals, popovers). These elements use a soft, diffused black shadow (0px 10px 30px rgba(0,0,0,0.5)) and a slightly brighter border (#333333).
- **Interactive States:** Hovering over a card should not move it (no "lift" effect); instead, the border color should transition to #444444 or the Primary Cyan at low opacity.

## Shapes

The design system uses a **Soft (0.25rem)** corner radius for standard elements like buttons and inputs. This provides a precise, modern feel that isn't as "organic" as fully rounded systems or as "harsh" as sharp-edged brutalism.

- **Buttons/Inputs:** 4px (0.25rem).
- **Cards/Nodes:** 8px (0.5rem).
- **Modals/Large Containers:** 12px (0.75rem).
- **Selection Indicators:** Use sharp vertical pips (0px radius) for sidebar active states to emphasize the "technical" grid.

## Components

### Buttons
- **Primary:** Background #22D3EE, text #0A0A0A. No gradient. High-contrast.
- **Secondary:** Transparent background, 1px border #262626. On hover, background becomes #1C1C1C and border #444444.
- **Ghost:** No border or background. Text #A3A3A3. On hover, text becomes #F5F5F5.

### Nodes (Workflow Elements)
- Use a "Header + Body" structure. The header has a subtle 5% opacity tint of the node's category color (e.g., Cyan for AI, Purple for Logic).
- Input/Output ports are 8px circles, hollow with a 2px stroke. They glow slightly when a connection is valid.

### Input Fields
- Dark background (#0A0A0A), 1px border (#262626). 
- Focus state: Border changes to #22D3EE with a subtle 2px outer glow (0 0 0 2px rgba(34, 211, 238, 0.2)).
- Monospace font (Geist) for technical input/parameters.

### Lists & Tables
- Minimalist rows separated by 1px borders (#262626). 
- No alternating row colors. Instead, use a subtle #161616 background on hover.
- Column headers use `label-md` typography with #525252 color.

### Chips/Tags
- Small, 4px radius. 
- Background: #1C1C1C. 
- Border: 1px solid #262626. 
- Text: #A3A3A3.