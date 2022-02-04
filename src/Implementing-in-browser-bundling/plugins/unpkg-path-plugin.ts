import * as esbuild from 'esbuild-wasm';
import axios from 'axios';
import localForage from 'localforage';

const fileCache = localForage.createInstance({
  name: 'filecache',
});

export const unpkgPathPlugin = (input: string) => {
  return {
    name: 'unpkg-path-plugin',
    setup(build: esbuild.PluginBuild) {
      build.onResolve({ filter: /.*/ }, async (args: any) => {
        console.log('onResolve', args);

        if (args.path === 'index.js') {
          return { path: args.path, namespace: 'a' };
        }

        if (args.path.includes('./') || args.path.includes('../')) {
          return {
            namespace: 'a',
            path: new URL(
              args.path,
              'https://unpkg.com' + args.resolveDir + '/'
            ).href,
          };
        }

        return {
          namespace: 'a',
          path: `https://unpkg.com/${args.path}`,
        };
      });

      build.onLoad(
        { filter: /.*/ },
        async (args: esbuild.OnLoadArgs): Promise<esbuild.OnLoadResult> => {
          console.log('onLoad', args);

          if (args.path === 'index.js') {
            // const message = require('nested-test-pkg')
            const data = input;
            return {
              loader: 'jsx',
              contents: data,
            };
          }

          // Проверка, есть ли файл в кеше (уже запрашивался раннее)
          const cachedResult: esbuild.OnLoadResult | null =
            await fileCache.getItem<esbuild.OnLoadResult>(args.path);
          if (cachedResult) {
            return cachedResult;
          }

          const { data, request } = await axios.get(args.path);
          // console.log(data);
          const result: esbuild.OnLoadResult = {
            loader: 'jsx',
            contents: data,
            resolveDir: new URL('./', request.responseURL).pathname,
          };
          await fileCache.setItem(args.path, result);
          return result;
        }
      );
    },
  };
};
