import { type CSSProperties, useMemo } from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { ProgressBarStep } from './progress-bar-step';

export const ProgressBar = ({ steps }: { steps: unknown[] }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const stepDuration = durationInFrames / steps.length;
  const currentStep = Math.floor(frame / stepDuration);
  const currentStepProgress = (frame % stepDuration) / stepDuration;

  const container: CSSProperties = useMemo(
    () => ({
      position: 'absolute',
      top: 48,
      insetInline: 48,
      height: 6,
      display: 'flex',
      gap: 12,
    }),
    [],
  );

  return (
    <div style={container}>
      {steps.map((_, index) => (
        <ProgressBarStep
          key={index}
          currentStep={currentStep}
          currentStepProgress={currentStepProgress}
          index={index}
        />
      ))}
    </div>
  );
};
