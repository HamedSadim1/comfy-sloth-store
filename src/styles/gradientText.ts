import { css } from "styled-components";

/**
 * Brand-gradient text effect, used for highlighted prices, headings and
 * accent words. Applies the legacy `-webkit-background-clip` prefix in
 * addition to the standard `background-clip` so the text-clip behaviour
 * still works in older WebKit-based browsers.
 */
export const gradientText = css`
  background: var(--gradient-text);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
`;
