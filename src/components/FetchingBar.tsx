import React from "react";
import styled, { keyframes } from "styled-components";

const sweep = keyframes`
  0%   { transform: translateX(-120%); }
  100% { transform: translateX(120%); }
`;

export interface FetchingBarProps {
  /** True while the next page is being fetched. The bar is fully unmounted
   *  when false so it costs nothing in steady-state layout. */
  active: boolean;
}

/**
 * Thin top-of-viewport progress strip that signals "more products are
 * streaming in" while `useInfiniteQuery` is fetching the next page.
 *
 * Renders an indeterminate sweep over a soft brand-toned track — when
 * the page request is in flight, an accent gradient slides from left to
 * right indefinitely. When `active` flips back to false, the bar is
 * fully unmounted (no leftover DOM, no extra layout box).
 *
 * Respects `prefers-reduced-motion` via the global rule in index.css
 * that collapses all animation-durations to ~0 — the sweep turns into
 * a static accent strip instead, so the cue stays visible without
 * motion.
 */
const FetchingBar: React.FC<FetchingBarProps> = ({ active }) => {
  if (!active) return null;
  return (
    <Bar role="status" aria-live="polite" aria-label="Loading more products">
      <Track />
    </Bar>
  );
};

const Bar = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  z-index: var(--z-overlay);
  pointer-events: none;
  overflow: hidden;
  /* Soft brand-tinted track so the bar reads even when the sweep is
     paused by prefers-reduced-motion. */
  background: rgba(204, 152, 110, 0.12);
`;

const Track = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 35%;
  background: var(--gradient-accent);
  border-radius: 0 999px 999px 0;
  box-shadow: 0 0 8px rgba(204, 152, 110, 0.45);
  animation: ${sweep} 1.2s cubic-bezier(0.65, 0, 0.35, 1) infinite;
  will-change: transform;
`;

export default FetchingBar;
