# IWC Website Design System

This document outlines the design rules and patterns used throughout the IWC website.

## Color Palette

The site uses Galaxy project brand colors defined in `tailwind.config.ts`:

| Role           | Token         | Hex       | Usage                           |
| -------------- | ------------- | --------- | ------------------------------- |
| Primary dark   | `ebony-clay`  | `#2C3143` | Text, dark backgrounds, borders |
| Secondary text | `chicago`     | `#58585a` | Body text, muted content        |
| Accent/links   | `bay-of-many` | `#25537B` | Links, interactive elements     |
| Highlight      | `hokey-pokey` | `#D0BD2A` | Active states, accents, CTAs    |
| Bright accent  | `gold`        | `#ffd700` | Filter highlights               |

### Rule: No Generic Grays

Always use brand colors instead of Tailwind's default `gray-*`:

```diff
- text-gray-700
+ text-chicago-700

- bg-gray-100
+ bg-ebony-clay-50

- border-gray-200
+ border-ebony-clay-100
```

## Text Hierarchy

| Level       | Classes                                  | Example                      |
| ----------- | ---------------------------------------- | ---------------------------- |
| Headings    | `text-ebony-clay-900 font-bold`          | Page titles, section headers |
| Subheadings | `text-ebony-clay-800 font-medium`        | Step labels, card titles     |
| Body        | `text-chicago-700`                       | Paragraphs, descriptions     |
| Muted       | `text-chicago-500` or `text-chicago-600` | Help text, metadata          |
| Links       | `text-bay-of-many-700 hover:underline`   | All hyperlinks               |

## The Gold Accent

The `hokey-pokey-500` gold is the signature accent color. Use it for:

- **Active tab underlines**: `border-b-4 border-hokey-pokey-500`
- **Hover accent bars**: `border-l-4 border-hokey-pokey-500` (animated from left)
- **Primary buttons**: `bg-hokey-pokey-600 hover:bg-hokey-pokey-700`
- **Section heading accents**: `border-l-4 border-hokey-pokey-500 pl-3`

## Interactive Elements

### Hover Accent Bars

List items and cards use a gold accent bar that animates in from the left:

```html
<div class="group relative">
    <div
        class="absolute left-0 top-0 bottom-0 w-1 bg-hokey-pokey-500
                transform origin-left scale-x-0 group-hover:scale-x-100
                transition-transform duration-200" />
    <!-- content -->
</div>
```

### Transitions

All interactive elements should have smooth transitions:

```
transition-all duration-200
transition-colors duration-200
transition-transform duration-200
```

## Containers & Cards

### Standard Card

```html
<div class="bg-white border border-ebony-clay-100 rounded-lg shadow-sm"></div>
```

### Section Backgrounds

Use tinted backgrounds to create visual separation:

| Background          | Usage                                |
| ------------------- | ------------------------------------ |
| `bg-bay-of-many-50` | Primary actions, highlighted content |
| `bg-ebony-clay-50`  | Secondary/technical content          |

### Code Blocks

```html
<pre class="bg-ebony-clay-900 text-ebony-clay-100 rounded"></pre>
```

## Components

### Tabs

Clean underline style (not pills):

- **List**: `border-b border-ebony-clay-100`
- **Trigger**: `text-base font-medium text-chicago-600`
- **Active**: `text-ebony-clay-900 border-b-4 border-hokey-pokey-500`

### Buttons

| Variant | Style                                                              |
| ------- | ------------------------------------------------------------------ |
| Primary | `bg-hokey-pokey-600 text-white hover:bg-hokey-pokey-700`           |
| Outline | `border-ebony-clay-200 text-ebony-clay-800 hover:bg-ebony-clay-50` |
| Ghost   | `hover:bg-ebony-clay-100`                                          |
| Link    | `text-bay-of-many-700 hover:underline`                             |

### Badges

```html
<span
    class="border border-bay-of-many-200 text-bay-of-many-700
             hover:bg-hokey-pokey-500 hover:text-ebony-clay-950
             hover:border-hokey-pokey-500"></span>
```

## Layout Patterns

### Sidebar with Accent

```html
<div class="bg-white border border-ebony-clay-100 rounded-lg p-6 shadow-sm">
    <h2
        class="font-bold text-xl text-ebony-clay-900
               border-l-4 border-hokey-pokey-500 pl-3 -ml-3">
        Title
    </h2>
</div>
```

### Results Header

```html
<p class="text-chicago-600 text-sm">
    Found <span class="font-semibold">X</span> <span class="font-bold text-ebony-clay-900"> Category </span> workflows
</p>
```

## Typography

The site uses **Atkinson Hyperlegible** as the primary font (defined in `tailwind.config.ts`), chosen for its readability and accessibility.

## Principles

1. **Consistency over novelty** - Use established patterns rather than inventing new ones
2. **Subtle over heavy** - Prefer light borders, small shadows, understated backgrounds
3. **Clean lines** - Underlines over pills, consistent spacing, aligned elements
4. **Gold is special** - Reserve the gold accent for active/highlighted states only
5. **Accessibility** - Sufficient color contrast, clear focus states, readable fonts
