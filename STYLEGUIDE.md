# Style Guide

## Visual Aesthetic

The design uses a **liquid glass** (glassmorphism) aesthetic with dark cards featuring frosted transparency over light backgrounds. Cards use dark grey backgrounds with subtle transparency, rounded corners, and clear visual hierarchy. The palette centers on dark greys with bright green accents for data visualization, interactive elements, and primary actions.

## Typography

Use distinctive, non-generic fonts. Avoid Inter, Roboto, Arial, and system fonts. Prefer fonts like Clash Display, Satoshi, Cabinet Grotesk, or Bricolage Grotesque. Use extreme weight contrasts (100/200 vs 800/900) and large size jumps (3x+). Establish clear hierarchy with large headings and smaller supporting text.

## Color Palette

- **Background**: Light grey (#f5f5f5 or similar)
- **Cards**: Dark grey with transparency (glassmorphism effect)
- **Accent**: Bright green/lime green (#00ff00 or similar) for:
  - Data visualization (graphs, charts, route lines)
  - Primary buttons and CTAs
  - Active states and highlights
- **Text**: High contrast on cards (white/light on dark cards, dark on light backgrounds)
- **Borders**: Subtle, minimal borders or none

## Spacing & Layout

- **Generous padding**: Cards use ample internal padding (16-24px)
- **Rounded corners**: Consistent border-radius (12-16px for cards)
- **Clear separation**: Generous spacing between cards and sections (16-24px)
- **Card spacing**: 12-16px between stacked cards

## Component Patterns

### Cards
- Dark grey background with `backdrop-filter: blur()` for glassmorphism
- Rounded corners (12-16px)
- Subtle transparency (rgba with opacity 0.8-0.9)
- Generous padding (16-24px)
- Hover states with slight brightness/opacity changes

### Data Visualization
- Bright green for graphs, charts, and route lines
- Clear metric displays with large numbers and descriptive labels
- Bar charts and line graphs with green accents

### Buttons
- Primary: Bright green, rounded, prominent
- Secondary: Transparent or outlined variants
- Generous padding and touch targets

## Motion

Use subtle animations for page loads with staggered reveals. Prioritize CSS-only solutions. Focus on high-impact moments rather than scattered micro-interactions.

