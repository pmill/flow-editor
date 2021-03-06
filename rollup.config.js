import typescript from 'rollup-plugin-typescript2'
import resolve from 'rollup-plugin-node-resolve';
import globals from 'rollup-plugin-node-globals';
import commonJS from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
import builtins from 'rollup-plugin-node-builtins';

import pkg from './package.json'

export default {
    input: 'src/index.ts',
    output: [
        {
            file: pkg.main,
            format: 'umd',
            name: 'Flow'
        },
    ],
    plugins: [
        resolve({
            browser: true,
            preferBuiltins: true
        }),
        commonJS(),
        globals(),
        builtins(),
        json(),
        typescript({
            typescript: require('typescript'),
        }),
    ],
}