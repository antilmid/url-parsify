import ts from '@rollup/plugin-typescript';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';
import fs from 'fs';
import { babel } from '@rollup/plugin-babel';

const { ENV = 'dev' } = process.env;

const specConf = {
  // 测试
  dev: {
    plugins: [
      babel({
        babelHelpers: 'bundled',
        extensions: ['.ts'],
      }),
      ts({
        tsconfig: './tsconfig.json',
      }),
      serve({
        contentBase: ['dist', 'debug'],
        port: 1000,
        https: {
          key: fs.readFileSync('./ca/Local-proxy.key'),
          cert: fs.readFileSync('./ca/Local-proxy.crt'),
        },
      }),
      livereload({
        https: {
          key: fs.readFileSync('./ca/Local-proxy.key'),
          cert: fs.readFileSync('./ca/Local-proxy.crt'),
        },
      }),
    ],
    watch: {
      exclude: 'node_modules/**',
      include: 'src/**',
    },
  },
  // 正式
  prod: {
    plugins: [
      babel({
        babelHelpers: 'bundled',
        extensions: ['.ts'],
      }),
      ts({
        tsconfig: './tsconfig.json',
      }),
    ],
    watch: false,
  },
};

export default {
  input: './src/index.ts',
  output: {
    file: './dist/index.js',
    format: 'umd',
    globals: 'urlParsify',
    name: 'urlParsify',
  },
  ...specConf[ENV],
};
