import bezierFunction from 'bezier-easing';


type BezierArgs = [number, number, number, number];

export enum Easing {
  EASE = 'ease',
  LINEAR = 'linear',
  EASE_IN = 'ease-in',
  EASE_OUT = 'ease-out',
  EASE_IN_OUT = 'ease-in-out',
}

const BEZIER_MAP: { [easingName: string]: BezierArgs } = {
  [Easing.EASE]: [.25, .1, .25, 1],
  [Easing.LINEAR]: [0, 0, 1, 1],
  [Easing.EASE_IN]: [.42, 0, 1, 1],
  [Easing.EASE_OUT]: [0, 0, .58, 1],
  [Easing.EASE_IN_OUT]: [.42, 0, .58, 1],
};

const getBezierArgs = (easingNameOrBezierArgs: Easing | BezierArgs) => {
  if (typeof easingNameOrBezierArgs === 'string') {
    if (!Object.values(Easing).includes(easingNameOrBezierArgs)) {
      return null;
    }

    return BEZIER_MAP[easingNameOrBezierArgs];
  }

  if (!Array.isArray(easingNameOrBezierArgs)) {
    return null;
  }

  return easingNameOrBezierArgs;
};

export const getTimingFunction = (easingNameOrBezierArgs: Easing | BezierArgs) => {
  const bezierArgs = getBezierArgs(easingNameOrBezierArgs);

  if (!bezierArgs) {
    return null;
  }

  const easing = bezierFunction(...bezierArgs);

  return (from, to, deltaTime, duration) => {
    const timePosition = deltaTime / duration;
    const position = easing(timePosition);

    return from + position * (to - from);
  };
};