import * as esbuild from 'esbuild-wasm';
import { useState, useEffect, useRef } from 'react';
import { unpkgPathPlugin } from './plugins/unpkg-path-plugin';

const App = () => {
  const ref = useRef<any>();
  const [input, setInput] = useState('');
  const [code, setCode] = useState('');

  const startservice = async () => {
    esbuild
      .initialize({
        worker: true,
        wasmURL: './node_modules/esbuild-wasm/esbuild.wasm',
      })
      .then(() => {
        console.log(`==== ESBUILD INITIALIZED ====`);
      });
  };

  useEffect(() => {
    startservice();
  }, []);

  const clickHandler = async () => {
    let result = esbuild.build({
      entryPoints: ['index.js'],
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin(input)],
      // define: {
      //   'process.env.NODE_ENV': '"production"',
      //   global: 'window',
      // },
    });
    // console.log(result)
    result.then((d) => {
      setCode(d.outputFiles[0].text);
      console.log(d);
    });
  };

  return (
    <div>
      <textarea
        value={input}
        onChange={({ target }) => setInput(target.value)}
      ></textarea>
      <div>
        <button onClick={clickHandler}>Submit</button>
      </div>
      <pre>{code}</pre>
    </div>
  );
};

export default App;
