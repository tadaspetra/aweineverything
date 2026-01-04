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

## SVG Best Practices

- Use **viewBox** for responsive scaling, let width be 100%
- **Layer elements correctly**: base/inactive elements first, active/highlighted elements on top
- **Avoid blur/glow filters on main elements** - they wash out colors on light backgrounds. Reserve glow for accent elements only (like output indicators)
- Use **strokeWidth and fill changes** for state indication, not opacity
- Use **`transition-all duration-300`** classes on SVG elements for smooth state changes

## Color Strategy

When showing "flow" or "active" states (like electricity):

- Use **warm colors** (amber/yellow) for active/flowing states
- Use **neutral colors** (grey) for inactive states  
- **All connected elements should share the color** - wire, contact points, labels, output indicator
- Colors should **propagate logically** (e.g., electricity colors elements only up to an open switch)

## Code Quality

- **Explicit TypeScript interfaces** for component state
- **Separate concerns**: state logic, animation logic (useEffect), rendering
- **Clean up animations** in useEffect return functions (cancelAnimationFrame)
- Use **useRef** for animation frame IDs and counters that don't need to trigger re-renders
