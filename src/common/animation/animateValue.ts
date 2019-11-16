import { getTimingFunction } from './easing';


const animateValue = (from, to, duration, easingOrBezier, cb, onFinish) => {
  const timingFn = getTimingFunction(easingOrBezier);

  let startTime;
  const rafIdRef = { current: null };

  const animate = (time) => {
    if (!startTime) {
      startTime = time;
    }

    const delta = time - startTime;

    if (delta >= duration) {
      cb && cb(to);
      return onFinish && onFinish();
    }

    const value = timingFn(from, to, delta, duration);
    cb(value);

    rafIdRef.current = requestAnimationFrame(animate);
  };

  rafIdRef.current = requestAnimationFrame(animate);

  return () => cancelAnimationFrame(rafIdRef.current);
};

export default animateValue;