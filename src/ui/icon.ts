/**
 * SVG icon creation module
 */

/**
 * Helper function to create SVG elements with attributes
 */
function createSVGElement<K extends keyof SVGElementTagNameMap>(
  tag: K,
  attrs: Record<string, string> = {}
): SVGElementTagNameMap[K] {
  const element = document.createElementNS('http://www.w3.org/2000/svg', tag);
  Object.entries(attrs).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
  return element;
}

/**
 * Create the SVG icon element for the button
 */
export function createIconSVG(): SVGSVGElement {
  const svg = createSVGElement('svg', {
    width: '16',
    height: '16',
    viewBox: '0 0 96 96'
  });
  svg.style.display = 'inline-block';
  svg.style.verticalAlign = 'middle';
  svg.style.marginRight = '6px';

  // Background circle
  const circle = createSVGElement('circle', {
    cx: '48',
    cy: '48',
    r: '46',
    fill: '#FF5500',
    stroke: '#FF3300',
    'stroke-width': '2'
  });
  svg.appendChild(circle);

  // Playlist tracks group
  const tracksGroup = createSVGElement('g', {
    fill: 'white',
    opacity: '0.9'
  });

  // Add 5 track lines with play buttons
  const tracks = [
    { x: 22, y: 20, width: 32, cx: 58, cy: 22 },
    { x: 22, y: 32, width: 28, cx: 54, cy: 34 },
    { x: 22, y: 44, width: 35, cx: 61, cy: 46 },
    { x: 22, y: 56, width: 30, cx: 56, cy: 58 },
    { x: 22, y: 68, width: 26, cx: 52, cy: 70 }
  ];

  tracks.forEach(track => {
    const rect = createSVGElement('rect', {
      x: track.x.toString(),
      y: track.y.toString(),
      width: track.width.toString(),
      height: '4',
      rx: '2'
    });
    tracksGroup.appendChild(rect);

    const playCircle = createSVGElement('circle', {
      cx: track.cx.toString(),
      cy: track.cy.toString(),
      r: '3'
    });
    tracksGroup.appendChild(playCircle);
  });

  svg.appendChild(tracksGroup);

  // Export arrow
  const arrowGroup = createSVGElement('g', {
    fill: 'white'
  });

  const arrowRect = createSVGElement('path', {
    d: 'M 68 50 L 68 72 L 78 72 L 78 50 Z',
    opacity: '0.95'
  });
  arrowGroup.appendChild(arrowRect);

  const arrowHead = createSVGElement('path', {
    d: 'M 73 72 L 83 62 L 73 52 L 63 62 Z',
    opacity: '0.95'
  });
  arrowGroup.appendChild(arrowHead);

  svg.appendChild(arrowGroup);

  return svg;
}
