const resolve = require("@rollup/plugin-node-resolve");
const commonjs = require('@rollup/plugin-commonjs');
const typescript = require('rollup-plugin-typescript2');
const external = require('rollup-plugin-peer-deps-external');
const babel = require("@rollup/plugin-babel");
const replace = require("@rollup/plugin-replace");


module.exports = [
  {
    input: "src/map.ts",
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
    input: "src/overlay.ts",
    output: {
      file: "dist/scripts/overlay.js",
      format: "es",
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
  {
    input: "src/test.ts",
    output: {
      file: "dist/scripts/test.js",
      format: "es",
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
      typescript({
        tsconfig: './tsconfig.json' }),
    ],
  },
];
