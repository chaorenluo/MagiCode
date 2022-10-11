// @ts-nocheck
import { readFile } from 'fs/promises'
import fs from 'fs';
import path from 'path'
import babelRender from './vue-babel'
import { options } from './config';
import {initMixin} from './vue-babel/template-mixin'

const {scriptRender,vueRender } = babelRender;

const init = async (path: string) => {

  const code = await readFile(path, { encoding: 'utf-8' });
  if (path.indexOf('.vue') > -1) {
    vueRender(code,options)
  } else {
    const scriptCode = await scriptRender(code,options);
    console.log(scriptCode)
  }
}




export default init