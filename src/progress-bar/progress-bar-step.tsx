import { type CSSProperties, useMemo } from 'react';
import { useThemeColors } from '../calculate-metadata/theme';

type ProgressBarStepProps = {
  index: number;
  currentStep: number;
  currentStepProgress: number;
};

export const ProgressBarStep = ({ index, currentStep, currentStepProgress }: ProgressBarStepProps) => {
  const themeColors = useThemeColors();

  const outer: CSSProperties = useMemo(() => {
    return {
      backgroundColor: themeColors.editor.lineHighlightBackground ?? themeColors.editor.rangeHighlightBackground,
      borderRadius: 6,
      overflow: 'hidden',
      height: '100%',
      flex: 1,
    };
  }, [themeColors]);

  const inner: CSSProperties = useMemo(() => {
    const width = {
      COMING_STEP: `0`,
      CURRENT_STEP: `${currentStepProgress * 100}%`,
      PAST_STEP: `100%`,
    };

    const getWidthKey = (index: number, currentStep: number) => {
      if (index > currentStep) return 'COMING_STEP';
      if (index === currentStep) return 'CURRENT_STEP';
      if (index < currentStep) return 'PAST_STEP';
      throw new Error('Invalid step');
    };

    return {
      height: '100%',
      backgroundColor: themeColors.icon.foreground,
      width: width[getWidthKey(index, currentStep)],
    };
  }, [themeColors.icon.foreground, index, currentStep, currentStepProgress]);

  return (
    <div style={outer}>
      <div style={inner} />
    </div>
  );
};
