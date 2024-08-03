import { Easing, interpolate, continueRender, delayRender, useCurrentFrame } from 'remotion';
import type { HighlightedCode, AnnotationHandler } from 'codehike/code';
import { Pre } from 'codehike/code';
import { useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from 'react';

import type { TokenTransitionsSnapshot } from 'codehike/utils/token-transitions';
import { calculateTransitions, getStartingSnapshot } from 'codehike/utils/token-transitions';
import { applyStyle } from './utils/apply-style';
import { callout } from './annotations/Callout';

import { loadFont } from '@remotion/google-fonts/RobotoMono';
import { tokenTransitions } from './annotations/InlineToken';
import { errorInline, errorMessage } from './annotations/Error';

const { fontFamily } = loadFont();

type CodeTransitionProps = {
  oldCode: HighlightedCode | null;
  newCode: HighlightedCode;
  durationInFrames?: number;
};

export const CodeTransition = ({ oldCode, newCode, durationInFrames = 30 }: CodeTransitionProps) => {
  const frame = useCurrentFrame();

  const ref = useRef<HTMLPreElement>(null);
  const [oldSnapshot, setOldSnapshot] = useState<TokenTransitionsSnapshot | null>(null);
  const [handle] = useState(() => delayRender());

  const prevCode: HighlightedCode = useMemo(() => {
    return oldCode || { ...newCode, tokens: [], annotations: [] };
  }, [newCode, oldCode]);

  const code = useMemo(() => {
    return oldSnapshot ? newCode : prevCode;
  }, [newCode, prevCode, oldSnapshot]);

  useEffect(() => {
    if (!oldSnapshot) {
      setOldSnapshot(getStartingSnapshot(ref.current!));
    }
  }, [oldSnapshot]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useLayoutEffect(() => {
    if (!oldSnapshot) {
      setOldSnapshot(getStartingSnapshot(ref.current!));
      return;
    }

    const transitions = calculateTransitions(ref.current!, oldSnapshot);
    transitions.forEach(({ element, keyframes, options }) => {
      const delay = durationInFrames * options.delay;
      const duration = durationInFrames * options.duration;
      const progress = interpolate(frame, [delay, delay + duration], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        easing: Easing.inOut(Easing.ease),
      });

      applyStyle({
        element,
        keyframes,
        progress,
      });
    });
    continueRender(handle);
  });

  const handlers: AnnotationHandler[] = useMemo(() => [tokenTransitions, callout, errorInline, errorMessage], []);

  const style: CSSProperties = useMemo(
    () => ({
      position: 'relative',
      fontSize: 40,
      lineHeight: 1.5,
      fontFamily,
      tabSize: 3,
    }),
    [],
  );

  return <Pre ref={ref} code={code} handlers={handlers} style={style} />;
};
