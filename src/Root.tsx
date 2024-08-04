import { Composition } from 'remotion';
import { Main } from './Main';

import { calculateMetadata } from './calculate-metadata/calculate-metadata';
import { schema } from './calculate-metadata/schema';

export const RemotionRoot = () => {
  return (
    <Composition
      id="Main"
      component={Main}
      defaultProps={{
        steps: null,
        themeColors: null,
        theme: 'dark-plus' as const,
      }}
      fps={30}
      // width={1920}
      // height={1080}
      width={1280}
      height={700}
      calculateMetadata={calculateMetadata}
      schema={schema}
    />
  );
};
