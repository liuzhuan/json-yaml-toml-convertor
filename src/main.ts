import './style.css';
import { Editor } from './editor';
import { json } from '@codemirror/lang-json';
import { yaml } from '@codemirror/lang-yaml';
import * as YAML from '@std/yaml';
import * as TOML from '@std/toml';

function onUpdate(editor: Editor, obj: object) {
  const allEditors = [jsonEditor, yamlEditor, tomlEditor];

  for (const e of allEditors) {
    if (editor !== e) {
      e.update(obj);
    }
  }
}

const jsonEditor = new Editor({
  el: document.querySelector('#json-box') as HTMLElement,
  placeholder: 'Input JSON',
  extensions: [json()],
  processor: {
    parse: (str: string) => JSON.parse(str),
    stringify: (obj: object) => JSON.stringify(obj, null, 2),
  },
  onUpdate,
});

const yamlEditor = new Editor({
  el: document.querySelector('#yaml-box') as HTMLElement,
  placeholder: 'Input YAML',
  extensions: [yaml()],
  processor: {
    parse: (str: string) => YAML.parse(str) as any,
    stringify: (obj: object) => YAML.stringify(obj),
  },
  onUpdate,
});

const tomlEditor = new Editor({
  el: document.querySelector('#toml-box') as HTMLElement,
  placeholder: 'Input TOML',
  extensions: [],
  processor: {
    parse: (str: string) => TOML.parse(str) as any,
    stringify: (obj: object) => TOML.stringify(obj as Record<string, unknown>),
  },
  onUpdate,
});
