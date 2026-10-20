/**
 * Fallback for browsers without scroll-driven animations: each scene takes
 * its own ground once it is well inside the viewport. Only runs when the
 * inline head script has set `ground-io` (motion allowed, no native support).
 */
export function mountGround() {
  const root = document.documentElement;
  if (!root.classList.contains('ground-io')) return;
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        e.target.classList.add('is-lit');
        io.unobserve(e.target);
      }
    },
    { rootMargin: '0px 0px -30% 0px' },
  );
  document.querySelectorAll('.scene, .lift').forEach((el) => io.observe(el));
}
