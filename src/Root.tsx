import { Composition } from 'remotion';
import { Main } from './Main';

import { calculateMetadata } from './calculate-metadata/calculate-metadata';
import { schema } from './calculate-metadata/schema';

export const RemotionRoot = () => {
  return (
    <Composition
      id='Main'
      component={Main}
      defaultProps={{
        steps: null,
        themeColors: null,
        theme: 'dark-plus' as const,
      }}
      fps={30}
      width={1080}
      height={1080}
      calculateMetadata={calculateMetadata}
      schema={schema}
    />
  );
};
