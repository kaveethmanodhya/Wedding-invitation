# Performance Optimization Log: Restoring 60FPS

This document details the critical performance bottlenecks encountered within the wedding invitation platform and the systematic architecture changes implemented to restore and maintain a stable **60FPS smooth scrolling** experience.

## 1. Background / The Problem

As the application grew to support dynamic event types, multiple customizable layouts, and deeply nested labels passed down the component tree, severe scroll lag and main-thread stuttering began occurring on both high-end PCs and mobile devices.

The user interface felt heavy and unresponsive during scroll events, indicating that the browser's main thread was being blocked by expensive React reconciliation cycles and complex JavaScript animation loops competing with the native scroll engine.

## 2. The Debugging Process (Isolation Testing)

To avoid guessing the root cause, we implemented a **Component Isolation Test**.

By temporarily injecting "kill switches" (boolean state toggles) into `ClientHome.jsx`, we could systematically disable heavy sections of the application in real-time (e.g., toggling off the Navbar, the Hero layout, the Gallery, and the background animations).

This isolation UI revealed two distinct culprits:
1.  **Scroll-Bound State Updates**: The Navbar was updating state on every single scroll tick.
2.  **JavaScript-Driven Particles**: The Framer Motion-based `FallingPetals` component was recalculating physics and layout within the main thread, thrashing the CPU.

## 3. Core Fix 1: Eliminating Main-Thread Render Thrashing

**The Bottleneck:**
Components utilizing `window.addEventListener('scroll', ...)` or Framer Motion's `useScroll` were frequently calling React `setState` (e.g., updating active sections or header opacity) hundreds of times per scroll interaction. This forced the entire DOM tree—including heavy components and deep prop-drilled subtrees—to re-render up to 60 times a second.

**The Solution:**
We completely eradicated scroll-bound state updates. We migrated scroll-detection logic to the **`IntersectionObserver` API**. By observing physical DOM elements entering or leaving the viewport, React state updates were reduced from dozens per scroll tick to exactly **two** (when crossing the visibility threshold).

## 4. Core Fix 2: Compositor-Thread Animations (GPU Acceleration)

**The Bottleneck:**
The background `FallingPetals` animation relied on JavaScript animation loops (Framer Motion) which continuously modified component layout. Because JS runs on the main thread alongside React rendering and DOM painting, this caused severe jank when the user scrolled.

**The Solution:**
We rebuilt the animation system to offload work entirely to the browser's **GPU compositor thread**.

1.  **Pure CSS & GPU Only**: Replaced JS loops with pure CSS `@keyframes` (`pureFall`, `pureSway`) defined in `globals.css`. We strictly limited animations to `transform` (translate/rotate) and `opacity` to prevent costly layout repaints.
2.  **Zero-Re-Render Policy**: Wrapped the new lightweight SVG petal component in `export default React.memo(FallingPetals, () => true);`. This guarantees the component initializes once and **never re-renders** for the lifetime of the application, regardless of parent state changes.
3.  **SSR Hydration Fix**: To support random petal generation without causing Server-Side Rendering (SSR) crashes (since `Math.random()` differs between server and client), we implemented a `useEffect` hook. Randomization and DOM injection now occur safely only on the client after the initial paint.

## 5. Golden Rules for Future Development

To prevent regressions and maintain the 60FPS standard, all future development must adhere to the following rules:

> [!WARNING]
> **1. NO Scroll-Bound State Updates**
> Never use `window.addEventListener('scroll')` to trigger a React state change (`setState`). Use `IntersectionObserver` or pure CSS sticky/scroll-snap logic for scroll-triggered UI changes.

> [!WARNING]
> **2. Heavy Animations Must Be Pure CSS/GPU-Accelerated**
> Continuous, multi-element particle animations (like falling petals, rain, or floating bubbles) must never use JS animation loops. They must be built using CSS `@keyframes` and animate only `transform` and `opacity`.

> [!WARNING]
> **3. Enforce React.memo on Background Elements**
> Any static background effect or animation container must be strictly isolated using `React.memo(Component, () => true)` to ensure it opts out of the React rendering cycle entirely.

> [!WARNING]
> **4. Memoize Prop-Drilled Data**
> When passing heavy configuration objects or label dictionaries down the component tree, ensure they are stable references or properly memoized using `useMemo` to prevent cascading re-renders in deeply nested layouts.
