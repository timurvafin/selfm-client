import React from 'react';
import cs from 'classnames';
import styles from './radial-progress-bar.scss';
import { Motion, spring } from 'react-motion';


const radians = (degrees) => degrees / 180 * Math.PI;

const getArc = (r, center, angle) => {
  const x = center + r * Math.cos(radians(angle));
  const y = center + r * Math.sin(radians(angle));

  return `A${r},${r} 1 0 1 ${x},${y}`;
};

const getDimensions = (r, center, angle, y0) => {
  // Arc angles
  const firstAngle = angle > 180 ? 90 : angle - 90;
  const secondAngle = -270 + angle - 180;

  // Arcs
  const firstArc = getArc(r, center, firstAngle);
  const secondArc = angle > 180 ? getArc(r, center, secondAngle) : '';

  const start = `M${center},${center} L${center}, ${y0}`;
  const end = 'Z';

  return `${start} ${firstArc} ${secondArc} ${end}`;
};

const Sector = ({ radius, center, y0, color, angle, className }) => {
  const d = getDimensions(radius, center, angle, y0);

  return (
    <path
      className={className}
      fill={color}
      d={d}
    />
  );
};

const RadialProgressBar = ({ size, className, progress, color }: { size: number; className?: string; progress: number; color: string }) => {
  const cls = cs(className, 'radial-progress-bar');

  const parentR = size / 2;
  const center = parentR;
  const outerStrokeWidth = size / 12;
  const outerR = parentR - outerStrokeWidth / 2;
  const innerMargin = 2;
  const innerR = parentR - innerMargin - outerStrokeWidth;

  const angle = progress * 360 / 100;
  const y0 = outerStrokeWidth + innerMargin;
  const motionStyle = { angle: spring(angle, { stiffness: 260, damping: 26, precision: 5 }) };

  return (
    <span
      className={cls}
      style={{ width: size + 'px', height: size + 'px' }}>
      <svg
        className={styles['rpb__svg']}
        width={size}
        height={size}
        version="1.1"
        viewBox={`0 0 ${size} ${size}`}
        xmlns="http://www.w3.org/2000/svg">
        <circle
          className={styles['rpb__svg__outline']}
          cx={center}
          cy={center}
          r={outerR}
          stroke={color}
          strokeWidth={outerStrokeWidth}
        />

        <Motion
          defaultStyle={{ angle: 0 }}
          style={motionStyle}>
          {style => (
            <Sector
              className={styles['rpb__svg__sector']}
              radius={innerR}
              center={center}
              angle={style.angle}
              y0={y0}
              color={color}
            />
          )}
        </Motion>
      </svg>
    </span>
  );
};

export default RadialProgressBar;