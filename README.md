# CALC//

A sleek, monochromatic black calculator built with vanilla HTML, CSS, and JavaScript no frameworks, no dependencies, just clean code.

---

## Preview

> A refined dark-themed calculator with three modes: Standard, Scientific, and Unit Converter. Designed with a brutalist-minimal aesthetic using a monochromatic black palette, noise texture overlay, and sharp typographic choices.

---

## Features

### Three Modes
- **Standard** — Core arithmetic with full memory support (MC, MR, M+, M−)
- **Scientific** — Advanced math functions including trig, logarithms, roots, powers, and more
- **Converter** — Unit conversion across five categories with a swap button

### Standard Mode
- Addition, subtraction, multiplication, division
- Percentage and sign toggle (±)
- Memory: clear, recall, add, subtract
- Chained operations with live expression display

### Scientific Mode
- Trigonometric functions: `sin`, `cos`, `tan` and their inverses (`asin`, `acos`, `atan`)
- Logarithms: `log` (base 10) and `ln` (natural log)
- Roots: square root `√`, cube root `∛`
- Powers: `x²`, `x³`, `xʸ` (custom exponent)
- `1/x` (reciprocal), `|x|` (absolute value), `n!` (factorial)
- Constants: `π` and `e`
- Parentheses support `( )`
- Modulo operator
- Scientific notation entry (`EE`)
- DEG / RAD angle mode toggle

### Unit Converter
| Category | Units |
|----------|-------|
| Length   | Meter, Kilometer, Centimeter, Millimeter, Mile, Yard, Foot, Inch, Nautical Mile |
| Weight   | Kilogram, Gram, Milligram, Pound, Ounce, Ton, Stone |
| Temperature | Celsius, Fahrenheit, Kelvin |
| Area     | sq Meter, sq Kilometer, sq Mile, sq Yard, sq Foot, Hectare, Acre |
| Speed    | m/s, km/h, mph, Knot, ft/s |

### Extra
- **Calculation History** — stores your last 20 calculations; click any entry to reuse the result
- **Keyboard Support** — type numbers, operators, `Enter`, `Backspace`, `Escape` directly
- **Smart Display** — auto-shrinks font for long numbers; shows running expression above the result
- **Floating-point precision** — results are rounded to 10 significant figures to avoid noise (e.g. `0.1 + 0.2 = 0.3`)

---

## Design

| Detail | Choice |
|--------|--------|
| Color palette | Monochromatic black (`#0a0a0a` → `#f0f0f0`) |
| Display font | [Bebas Neue](https://fonts.google.com/specimen/Bebas+Neue) |
| Mono font | [Share Tech Mono](https://fonts.google.com/specimen/Share+Tech+Mono) |
| UI font | [DM Sans](https://fonts.google.com/specimen/DM+Sans) |
| Texture | SVG noise overlay for depth |
| Animation | CSS entrance animation + button press feedback |

---

## File Structure

```
calc/
├── index.html   # Markup & layout
├── styles.css   # All styling, CSS variables, animations
└── main.js      # Calculator logic, mode switching, converter
```

---

## Usage

No build step required. Just clone and open.

```bash
git clone https://github.com/your-username/calc.git
cd calc
open index.html
```

Or serve it locally:

```bash
# Python
python -m http.server 8000

# Node (npx)
npx serve .
```

Then visit `http://localhost:8000`.

---

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `0–9` | Input digit |
| `.` | Decimal point |
| `+` `-` `*` `/` | Operators |
| `%` | Percent |
| `Enter` or `=` | Evaluate |
| `Backspace` | Delete last character |
| `Escape` | Clear / reset |
| `(` `)` | Parentheses (scientific mode) |

---

## Browser Support

Works in all modern browsers. No polyfills needed.

| Browser | Support |
|---------|---------|
| Chrome / Edge | ✅ |
| Firefox | ✅ |
| Safari | ✅ |
| Mobile (iOS / Android) | ✅ |

---

## License

MIT — free to use, modify, and distribute.
