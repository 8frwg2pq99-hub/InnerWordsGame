# InnerWords Game - Design Guidelines

## Design Approach

**Selected Approach**: Enhanced Utility Design with Game Personality

Building on the existing dark-themed interface while elevating visual polish and user engagement. The design prioritizes gameplay clarity and ease of use while incorporating subtle game-like elements that make the experience enjoyable without distraction.

**Reference Inspiration**: Linear (typography & spacing), Duolingo (game feedback), Notion (input aesthetics)

---

## Core Design Elements

### A. Color Palette

**Dark Mode (Primary)**
- Background: `222 14% 7%` (deep charcoal, slightly warmer than pure black)
- Surface/Panel: `223 18% 11%` (elevated panel background)
- Border: `223 25% 18%` (subtle panel borders)
- Text Primary: `220 13% 91%` (crisp white-gray)
- Text Muted: `220 9% 46%` (readable secondary text)

**Accent Colors**
- Primary Accent: `199 89% 48%` (vibrant sky blue for interactive elements)
- Success/Correct: `142 71% 45%` (satisfying green for valid moves)
- Error/Invalid: `0 72% 51%` (clear red for validation errors)
- Warning/Edge: `38 92% 50%` (amber for edge sequence indicators)

**Semantic Game Colors**
- Inner Sequence: `142 76% 36%` with `142 71% 85%` text (green theme for premium moves)
- Edge Sequence: `38 92% 50%` with `45 93% 84%` text (amber theme for standard moves)
- Score Highlight: Gradient from primary accent to success green

### B. Typography

**Font Stack**: `system-ui, -apple-system, 'Segoe UI', Roboto, 'Inter', sans-serif`

**Type Scale**
- Current Word Display: 48px/900 weight, 3px letter-spacing, uppercase
- Score Counter: 28px/800 weight
- Input Labels: 13px/600 weight, uppercase, letter-spacing 0.5px
- Input Text: 16px/500 weight
- Turn Log Items: 14px/500 weight
- Helper Text: 13px/400 weight
- Button Text: 15px/700 weight, letter-spacing 0.3px

**Hierarchy Principle**: Oversized word display as focal point, medium-weight inputs for readability, compact but legible logs

### C. Layout System

**Spacing Primitives**: Tailwind units of 2, 4, 6, and 8 for consistency
- Component padding: `p-6` (24px) for main container
- Section spacing: `mb-6` and `mt-8` between major sections
- Input/button gaps: `gap-3` (12px)
- Turn log items: `mb-2` (8px) stacking

**Container System**
- Main app container: `max-w-3xl` (768px) centered
- Single column layout for focused gameplay
- Full-width inputs and displays within container

### D. Component Library

**1. Header Bar**
- Flex layout with space-between alignment
- Left: Game title (18px, muted color, letter-spaced)
- Right: Score badge with dark background, accent border, and bold number

**2. Current Word Display**
- Massive centered text (48px, ultra-bold)
- Dark inset background with subtle border
- 2-3px letter spacing for readability
- Rounded corners (16px radius)
- Vertical padding of 20px

**3. Hint/Instructions Panel**
- Centered text, muted color
- Max-width of 90% for readability
- Italic emphasis on key terms (start/end)
- Small size (13px) to not compete with inputs

**4. Input Fields**
- Two-column grid layout on desktop (1fr + 2fr ratio for sequence/word inputs)
- Labels above inputs: uppercase, small, muted
- Dark input backgrounds with lighter borders
- 12px padding, 10px border radius
- Focus state: brighter border in accent color
- Placeholder text in subtle gray
- Full-width stack on mobile

**5. Action Buttons**
- Primary (Submit): Accent background with white text, prominent
- Secondary (Reset): Ghost style with border, muted appearance
- Rounded corners (10px)
- Padding: 12px vertical, 16px horizontal
- Hover: Slight brightness increase + border glow
- Min-width of 120px for primary button

**6. Feedback Messages**
- Positioned below inputs with min-height to prevent layout shift
- Success: Green text with checkmark icon prefix
- Error: Red text with X icon prefix
- Default: Muted text for neutral info
- 13px size, regular weight

**7. Turn Log**
- Border-top separator from main game area
- Scrollable container (max-height: 280px)
- Individual turn cards with 3-column grid: Word transition | Sequence used | Points pill
- Pills for Inner/Edge with semantic colors (border + text)
- Newest turns appear at top (reverse chronological)
- Each card: subtle background, border, rounded (10px)

**8. Scoring Display**
- Small helper text explaining scoring rules
- Positioned in footer area
- Muted color, 12px size
- Multi-line layout acceptable

### E. Visual Enhancements

**Micro-interactions** (use sparingly)
- Button hover: 100ms border color transition
- Input focus: 150ms border accent fade-in
- New turn log entry: 200ms fade-in from top
- Score update: subtle number change animation (optional)

**Shadows & Depth**
- Main container: soft shadow `0 10px 30px rgba(0, 0, 0, 0.35)`
- Input fields: subtle inset appearance
- No shadows on internal components

**Borders & Separators**
- Consistent 1px borders throughout
- Border radius: 10-16px range (larger for hero elements, smaller for inputs)
- Separator lines between major sections

---

## Layout Specifications

**Desktop Layout** (768px+)
- Centered container with generous side margins
- Two-column input grid
- Horizontal score/title arrangement
- Visible turn log (5-6 entries)

**Mobile Layout** (<768px)
- Single column stacking
- Full-width inputs
- Reduced font sizes (current word: 36px, score: 24px)
- Collapsible turn log or reduced height

**Spacing Rhythm**
- Header to word display: 24px
- Word display to hint: 12px
- Hint to inputs: 16px
- Inputs to footer: 16px
- Footer to turn log: 24px

---

## Images

No images required for this utility-focused game interface. The design relies on typography, color, and clear information hierarchy.

---

## Accessibility & Quality

- High contrast ratios (WCAG AA minimum)
- Clear focus indicators on all interactive elements
- Keyboard navigation support (Enter to submit)
- Error messages with both color and text indicators
- Readable font sizes (minimum 13px)