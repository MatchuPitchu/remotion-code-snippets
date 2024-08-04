import { getStaticFiles, reevaluateComposition, watchPublicFolder } from '@remotion/studio';
import { useState, useEffect } from 'react';

const getCurrentHash = () => {
  const files = getStaticFiles();
  const codeFiles = files.filter((file) => file.name.startsWith('code'));
  const contents = codeFiles.map((file) => `${file.src}${file.lastModified}`);
  return contents.join('');
};

export const useReloadOnCodeChange = () => {
  const [filesHash, setFilesHash] = useState(getCurrentHash);

  useEffect(() => {
    const { cancel } = watchPublicFolder(() => {
      const hash = getCurrentHash();
      if (hash === filesHash) return;

      setFilesHash(hash);
      reevaluateComposition();
    });

    return () => cancel();
  }, [filesHash]);
};
