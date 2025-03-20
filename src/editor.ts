import { basicSetup } from 'codemirror';
import { EditorView, placeholder } from '@codemirror/view';
import type { Extension } from '@codemirror/state';
import { linter, type LintSource } from '@codemirror/lint';
import { debounce } from './utils';

interface EditorConfig {
  el: HTMLElement;
  placeholder: string;
  extensions: Extension[];
  processor: {
    parse: (str: any) => object;
    stringify: (obj: object) => string;
  };
  onUpdate: (editor: Editor, obj: object) => void;
  lintSource?: LintSource;
}

export class Editor {
  config: EditorConfig;
  view: EditorView;
  isUpdating: boolean;

  constructor(config: EditorConfig) {
    this.config = config;
    this.isUpdating = false;

    const onUpdateHandler = EditorView.updateListener.of((update) => {
      if (update.docChanged && this.isUpdating === false) {
        const content = update.state.doc.toString();
        debouncedUpdateContent(content);
      }
    });

    const debouncedUpdateContent = debounce((content) => {
      if (this.view.composing) return;

      try {
        const result = config.processor.parse(content);
        config.onUpdate(this, result);
      } catch (e) {
        if (e instanceof Error) {
          console.log('invalid syntax', e.message);
        }
      }
    }, 500);

    this.view = new EditorView({
      doc: '',
      parent: config.el,
      extensions: [
        basicSetup,
        EditorView.lineWrapping,
        placeholder(config.placeholder || 'Input something'),
        onUpdateHandler,
        ...config.extensions,
        linter(config.lintSource || null),
      ],
    });
  }

  update(obj: object) {
    this.isUpdating = true;

    this.view.dispatch({
      changes: {
        from: 0,
        to: this.view.state.doc.length,
        insert: this.config.processor.stringify(obj),
      },
    });

    this.isUpdating = false;
  }
}
