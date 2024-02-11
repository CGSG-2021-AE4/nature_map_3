const resolve = require("@rollup/plugin-node-resolve");
const commonjs = require('@rollup/plugin-commonjs');
const typescript = require('@rollup/plugin-typescript');
const external = require('rollup-plugin-peer-deps-external');
const babel = require("@rollup/plugin-babel");
const replace = require("@rollup/plugin-replace");

module.exports = [
  {
    input: "src/components/map.ts",
    output: {
      file: "dist/scripts/map.js",
      format: "es",
      moduleName: 'Map',
      sourcemap: "inline",
    },
    plugins: [
      resolve(),
      commonjs(),
      typescript({ tsconfig: './tsconfig.json' }),
    ],
  },
  {
    input: "src/components/overlay.tsx",
    output: {
      file: "dist/scripts/overlay.js",
      format: "cjs",
      sourcemap: "inline",
    },
    plugins: [
      replace({
        preventAssignment: true,
		    'process.env.NODE_ENV': JSON.stringify( 'production' )
      }),
      external(),
      resolve(),
      babel({ 
        exclude: 'node_modules/**',
        babelHelpers: 'bundled',
        presets: ["react", "env", "stage-0"]
      }),
      commonjs(),
      typescript({ tsconfig: './tsconfig.json' }),
    ],
  },
];
