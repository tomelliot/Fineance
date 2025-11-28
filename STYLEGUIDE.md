# Style Guide

## Typography

- **Heading Font**: Boldonse
  - A bold, distinctive display typeface with strong character
  - Used for all headings (h1-h6) to create a striking visual presence
  - Available weight: 400 (Regular)
  - The bold, confident forms complement the neumorphic design aesthetic

- **Body Font**: Bricolage Grotesque
  - A distinctive geometric sans-serif used for all body text and UI elements
  - Available weights: 200 (ExtraLight), 400 (Regular), 600 (SemiBold), 800 (ExtraBold)
  - Use weight extremes for hierarchy: 200 for light text, 800 for bold emphasis
  - Base weight: 400 for body text
  - Creates excellent readability while maintaining visual interest

- Both fonts are loaded via Next.js Google Fonts optimization for optimal performance

## Color Palette

- **Primary Accent**: Purple `#534271`
- **Lime Green**: `#C3F787`
- **Salmon**: `#FCCE9C`
- **Rose**: `#FD9C90`
- **Background**: Light with subtle gradient (light purple to light orange/pink)

## Key UX Features

### Neumorphic Styling
- Use neumorphic shadows to create depth and highlight elements as either protruding or indented
- Creates a soft, tactile appearance with subtle highlights and shadows

#### Protruding Elements (Raised)
- Elements that appear to rise from the surface
- Shadow pattern: `20px 20px 60px [dark shadow], -20px -20px 60px [light highlight]`
- For dark purple cards (`#534271`): 
  ```css
  box-shadow: 20px 20px 60px rgba(65, 51, 88, 1), -20px -20px 60px rgba(101, 81, 138, 1);
  ```
- The light highlight creates a subtle glow on the top-left, suggesting a light source from above-left

#### Indented Elements (Pressed)
- Elements that appear pressed into the surface
- Shadow pattern: `inset 20px 20px 60px [dark shadow], inset -20px -20px 60px [light highlight]`
- Inverted from protruding - dark shadow on top-left, light highlight on bottom-right

### Drop Shadows
- Primary buttons use prominent drop shadows as a key visual feature
- Creates depth and hierarchy
- Use `box-shadow` for elevated button styling
- Can be combined with neumorphic styling for enhanced depth

### Spacing
- Generous padding on cards (16-24px)
- Clear separation between sections (16-24px)
- Comfortable spacing between interactive elements

### Rounding
- Cards: 12-16px border-radius
- Buttons: Rounded corners (12-16px)
- Input fields: Rounded corners (8-12px)

## Component Patterns

### Cards
- Rounded corners (12-16px)
- Purple background for primary cards (`#534271`)
- Generous padding
- Use neumorphic protruding shadow for raised appearance
- Creates depth with subtle top-left highlight from shadow

### Buttons
- Large, rounded rectangular buttons
- Prominent drop shadow for primary actions
- Full-width or prominent placement
- Rounded corners (12-16px)

### Input Fields
- Rounded corners (8-12px)
- Clear labels above inputs
- Color-coded values (orange-yellow for amounts/dates)
