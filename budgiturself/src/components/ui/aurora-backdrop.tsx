/**
 * The page's ambient backdrop: a themed radial wash, a fine grain, and a fade
 * into the page colour at the bottom. Pure CSS and no client component, so it
 * costs nothing to render and has nothing to repaint.
 */
export function AuroraBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
      <div className="aurora-base absolute inset-0" />
      <div className="grain absolute inset-0" />
      <div className="aurora-fade absolute inset-x-0 bottom-0 h-64" />
    </div>
  );
}
