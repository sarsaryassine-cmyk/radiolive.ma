/**
 * SlidingNumber — 21st Magic (motion-primitives)
 * https://21st.dev (sliding-number)
 *
 * Slot-machine style integer counter. Each digit is a stack of 0–9
 * panels translated vertically by a Framer Motion spring.
 * Adapted to JSX with a fixed line-height (no react-use-measure dep).
 */
import { motion, useSpring, useTransform } from 'framer-motion';
import { useEffect } from 'react';

const SPRING = { type: 'spring', stiffness: 220, damping: 22, mass: 0.4 };

export default function SlidingNumber({ value, fontSize = 14 }) {
  const intValue = Math.max(0, Math.floor(value || 0));
  const digits = intValue.toString().split('');
  const places = digits.map((_, i) => Math.pow(10, digits.length - i - 1));
  const height = fontSize * 1.15;

  return (
    <span
      className="inline-flex items-center leading-none tabular-nums"
      style={{ fontSize, height }}
    >
      {digits.map((_, i) => (
        <Digit
          key={`${places.length}-${i}`}
          value={intValue}
          place={places[i]}
          height={height}
        />
      ))}
    </span>
  );
}

function Digit({ value, place, height }) {
  const target = Math.floor(value / place) % 10;
  const animated = useSpring(target, SPRING);

  useEffect(() => {
    animated.set(target);
  }, [animated, target]);

  return (
    <span
      className="relative inline-block w-[1ch] overflow-hidden"
      style={{ height }}
    >
      {/* invisible placeholder to size the cell */}
      <span className="invisible">0</span>
      {Array.from({ length: 10 }).map((_, n) => (
        <Number key={n} mv={animated} number={n} height={height} />
      ))}
    </span>
  );
}

function Number({ mv, number, height }) {
  const y = useTransform(mv, (latest) => {
    const placeValue = latest % 10;
    const offset = (10 + number - placeValue) % 10;
    let memo = offset * height;
    if (offset > 5) memo -= 10 * height;
    return memo;
  });

  return (
    <motion.span
      style={{ y }}
      className="absolute inset-0 flex items-center justify-center"
    >
      {number}
    </motion.span>
  );
}
