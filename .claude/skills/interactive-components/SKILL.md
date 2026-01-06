---
name: interactive-components
description: Design and build interactive components for articles with seamless visual integration, light/dark mode support, touch responsiveness, SVG layering, and performance optimization. Use when creating new interactive components, debugging component behavior, reviewing component code, or working with SVG-based visualizations.
---

# Interactive Component Design Standards

When building interactive components for articles/essays, follow these quality standards:

## Visual Integration

- **No borders or containers** - components should flow seamlessly with the article
- **Background should match the page** - use transparent or page background color
- **Light/dark mode support** - use Tailwind's `dark:` variants throughout
- **No separate status displays** - remove buttons, cards, or panels showing state. All state should be shown visually within the component itself

## Minimal but Informative

- Only include **essential visual elements** - remove anything that doesn't directly serve understanding
- **State changes shown through color, position, and subtle animations** - not through text labels
- Use a **consistent color scheme** throughout (e.g., yellow/amber for "active/electricity", grey for "inactive")
- Add **small, subtle interaction hints** (e.g., "click the switches" in muted, low-opacity text)

## Animation & Interactivity

- Use **CSS transitions** for smooth state changes (300-500ms duration, ease-out easing)
- For particle/flow effects, use **requestAnimationFrame with vanilla React state** - avoid heavy libraries like Three.js unless truly needed
- Add **invisible hit areas** (transparent rects in SVG) for better click targets
- **Hover states should preview** the interaction (e.g., elements highlight on hover with `group-hover:`)

## Touch & Input Support

- **Support both mouse and touch** - use `onClick` which works for both, avoid hover-only interactions for critical functionality
- **Make touch targets at least 44x44px** - invisible hit areas should be large enough for fingers
- **No hover-dependent features** - hover states are enhancements only, all functionality must work without hover
- Add **`touch-action: manipulation`** to prevent double-tap zoom delays on interactive elements
- Consider **`user-select: none`** on interactive elements to prevent text selection on touch

## Mobile Responsiveness

- **Test at mobile widths** (320px, 375px, 414px) - components must remain usable
- Use **responsive viewBox** - SVG should scale down gracefully
- **Reduce complexity on small screens** if needed - fewer particles, simpler animations
- Use **`-mx-4 sm:mx-0`** pattern to let components bleed to edges on mobile for more space
- **Text and labels must remain readable** at small sizes - use `clamp()` or responsive font sizes
- Ensure **touch targets don't overlap** when scaled down
- Test with **actual touch devices** or browser DevTools touch simulation

## SVG Layering (Critical!)

Render order in SVG determines what appears on top. Elements rendered **later** appear **on top**.

**Correct render order (first to last):**
1. **Background/inactive elements** (pull-down resistors, ground symbols, inactive wires)
2. **Active wire segments**
3. **Particle/flow animations**
4. **Component fills** (e.g., transistor circle fills)
5. **Component internals** (e.g., transistor collector, emitter, base lines)
6. **Component strokes/outlines** (rendered LAST so nothing crosses over them)
7. **Interactive indicators** (output lights, input dots)

**Common layering mistakes to avoid:**
- Drawing component outline with fill together - split into separate fill and stroke elements
- Rendering inactive elements after active ones (gray wires appearing on top of yellow)
- Particles rendering behind wires they should flow along

## SVG Best Practices

- Use **viewBox** for responsive scaling, let width be 100%
- **Segment wires at component boundaries** - don't draw wires through components, stop at edges
- **Avoid blur/glow filters on main elements** - they wash out colors on light backgrounds. Reserve glow for accent elements only (like output indicators)
- Use **strokeWidth and fill changes** for state indication, not opacity
- Use **`transition-all duration-300`** classes on SVG elements for smooth state changes
- **Avoid transparency in fills** (e.g., `fill-amber-950/30`) - elements behind will show through

## Wire & Connection Consistency

- **All connected wires must have matching strokeWidth** - mismatched widths create visible "bumps" at junctions
- **When active state changes thickness, ALL connected wires should change together** - use the same dynamic strokeWidth: `strokeWidth={isActive ? 3 : 2}`
- **Use `strokeLinecap="round"`** for clean wire ends
- **No unnecessary junction circles** - simple wire intersections don't need visible dots
- **Wires from voltage sources should match the main wire thickness**

## Circuit/Electrical Component Standards

### Voltage Sources
- Use **standard battery symbol** (two parallel lines of different lengths with + symbol), not abstract circles with "V"
- Battery should be **yellow/amber colored** since it's always "on" and providing power
- Ensure battery terminal thickness matches connecting wire thickness

### Transistors
- **Match reference implementations exactly** - copy coordinates from working examples
- Include **arrow on emitter** (pointing outward for NPN)
- **Separate circle fill and stroke** - fill renders first, stroke renders LAST (on top of all internal elements)
- Internal structure: vertical bar, collector-to-bar diagonal, emitter-from-bar diagonal, base horizontal
- **Circle outline must be on top** so wires don't visually cross it

### Current Flow Visualization
- Current flows to the **OUTPUT**, not through pull-down resistors to ground
- **Particles should follow the actual signal path** (e.g., V → transistors → output, not V → transistors → ground)
- Pull-down resistors remain gray/inactive - they just hold the output low when transistors are off

## Color Strategy

When showing "flow" or "active" states (like electricity):

- Use **warm colors** (amber/yellow) for active/flowing states
- Use **neutral colors** (grey) for inactive states
- **All connected elements should share the color** - wire, contact points, labels, output indicator
- Colors should **propagate logically** (e.g., electricity colors elements only up to an open switch)
- **Voltage sources are always active** - battery symbols should always be yellow

## Code Quality

- **Explicit TypeScript interfaces** for component state
- **Separate concerns**: state logic, animation logic (useEffect), rendering
- **Clean up animations** in useEffect return functions (cancelAnimationFrame)
- Use **useRef** for animation frame IDs and counters that don't need to trigger re-renders
- **Match existing component patterns** - when similar components exist, copy their structure exactly before customizing
