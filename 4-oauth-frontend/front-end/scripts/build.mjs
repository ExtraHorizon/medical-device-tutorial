/* eslint-disable import/no-extraneous-dependencies */
import esbuild from 'esbuild';
import { config } from './config.mjs';

await esbuild.build(config());
