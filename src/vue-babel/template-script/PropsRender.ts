import t from '@babel/types';
import { createFnVariable } from './utils';
import traverse from "@babel/traverse";
export default class PropsRender{
  propsNode: Array<any> = [];
  propsKey: Set<string> = new Set();
  isArrayExpression=false;
  options: any;
  newAst: t.File;
  oldAst: t.File;
  constructor(propsNode:any,options:any,_newAst:t.File,ast:t.File) {
    this.propsNode = propsNode;
    this.options = options;
    this.newAst = _newAst;
    this.oldAst = ast;
    this.init();
  }

  hasPropsKey(key:string): boolean {
    return this.propsKey.has(key)
  }
 
  init() {
    this.isArrayExpression = this.propsNode.type === 'ArrayExpression'
    if(this.isArrayExpression){
      this.propsNode.elements.forEach((node: any) => {
        this.propsKey.add(node.value)
      })
    } else {
      const _this = this;
      this.propsNode.properties.forEach((node: any) => {
        if (t.isSpreadElement(node)) {
          traverse.default(this.oldAst, {
            Identifier(path) {
              if (node.argument.name === path.node.name && !t.isSpreadElement(path.parent)) {
                path.parent.init.properties.forEach((v) => {
                  if(v.key){
                    _this.propsKey.add(v.key.name)  
                  }
                })
              }
            }
          })
        } else {
          this.propsKey.add(node.key.name) 
        }
      })
    }
  }


  async render() {
    const propsNode = createFnVariable('props','defineProps',[this.propsNode])
    this.newAst.program.body.push(propsNode)
  }
}