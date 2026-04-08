import { useEffect, useRef } from 'react';

/**
 * AnimateOnScroll — wraps children and plays a CSS animation
 * when the element scrolls into view via IntersectionObserver.
 *
 * @param {string} animation  - CSS class: fade-up | fade-down | fade-left | fade-right | scale-in | blur-in | zoom-rotate
 * @param {number} delay      - Stagger group index (1-6), maps to delay-1..delay-6
 * @param {number} threshold  - 0-1, how much of the element must be visible (default: 0.15)
 * @param {string} className  - extra classes
 * @param {string} as         - HTML tag to render (default: 'div')
 */
const AnimateOnScroll = ({
  children,
  animation = 'fade-up',
  delay = 0,
  threshold = 0.15,
  className = '',
  as: Tag = 'div',
  ...rest
}) => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('is-visible');
          observer.unobserve(el); // animate only once
        }
      },
      { threshold, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  const delayClass = delay ? `delay-${delay}` : '';

  return (
    <Tag
      ref={ref}
      className={`animate-on-scroll ${animation} ${delayClass} ${className}`}
      {...rest}
    >
      {children}
    </Tag>
  );
};

export default AnimateOnScroll;
