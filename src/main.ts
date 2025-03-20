import './style.css';
import { Editor } from './editor';
import { json } from '@codemirror/lang-json';
import { yaml } from '@codemirror/lang-yaml';
import * as YAML from '@std/yaml';
import * as TOML from '@std/toml';
import { JsonLinter, YamlLinter, TomlLinter } from './linters';
import * as cache from './cache';

function updateAllEditors(obj: object) {
  const allEditors = [jsonEditor, yamlEditor, tomlEditor];
  for (const e of allEditors) {
    e.update(obj);
  }
}

function onUpdate(editor: Editor, obj: object) {
  cache.write(obj);

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
  lintSource: JsonLinter,
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
  lintSource: YamlLinter,
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
  lintSource: TomlLinter,
  extensions: [],
  processor: {
    parse: (str: string) => TOML.parse(str) as any,
    stringify: (obj: object) => TOML.stringify(obj as Record<string, unknown>),
  },
  onUpdate,
});

updateAllEditors(cache.read());
