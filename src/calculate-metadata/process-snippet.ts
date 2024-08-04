import { highlight } from 'codehike/code';
import { createTwoslashFromCDN } from 'twoslash-cdn';
import type { PublicFolderFile } from './get-files';
import type { Theme } from './theme';
import { type CompilerOptions, JsxEmit, ScriptTarget } from 'typescript';
import { createStorage } from 'unstorage';
import indexedDbDriver from 'unstorage/drivers/indexedb';

const compilerOptions: CompilerOptions = {
  target: ScriptTarget.ES2022,
  lib: ['dom', 'es2022'],
  jsx: JsxEmit.ReactJSX,
};

// An example of using unstorage with IndexedDB to cache the virtual file system
// Docu: https://unstorage.unjs.io/drivers/browser#indexeddb
const storage = createStorage({
  driver: indexedDbDriver({ base: 'twoslash-cdn' }),
});

const twoslash = createTwoslashFromCDN({ compilerOptions, storage });

const getTwoslashResult = async ({ stepValue, extension }: { stepValue: string; extension: string }) => {
  try {
    const twoslashResult =
      extension === 'ts' || extension === 'tsx'
        ? await twoslash.run(stepValue, extension, {
            compilerOptions,
          })
        : null;

    return twoslashResult;
  } catch (error) {
    console.log('Error while fetching with twoslash-cdn', stepValue, error);
  }

  return null;
};

export const processSnippet = async (step: PublicFolderFile, theme: Theme) => {
  const splitted = step.filename.split('.');
  const extension = splitted[splitted.length - 1];

  const twoslashResult = await getTwoslashResult({ stepValue: step.value, extension });

  const highlighted = await highlight(
    {
      lang: extension,
      meta: '',
      value: twoslashResult ? twoslashResult.code : step.value,
    },
    theme,
  );

  if (!twoslashResult) {
    return highlighted;
  }

  // If it is TypeScript code, let's also generate callouts (^?) and errors
  for (const { text, line, character, length } of twoslashResult.queries) {
    const codeblock = await highlight({ value: text, lang: 'ts', meta: 'callout' }, theme);
    highlighted.annotations.push({
      name: 'callout',
      query: text,
      lineNumber: line + 1,
      data: {
        character,
        codeblock,
      },
      fromColumn: character,
      toColumn: character + length,
    });
  }

  for (const { text, line, character, length } of twoslashResult.errors) {
    highlighted.annotations.push({
      name: 'error',
      query: text,
      lineNumber: line + 1,
      data: { character },
      fromColumn: character,
      toColumn: character + length,
    });
  }

  return highlighted;
};
