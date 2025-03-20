import { Diagnostic } from '@codemirror/lint';
import type { EditorView } from '@codemirror/view';
import * as YAML from '@std/yaml';
import * as TOML from '@std/toml';

export function JsonLinter(view: EditorView) {
  const diagnostics: Diagnostic[] = [];
  const content = view.state.doc.toString();

  try {
    JSON.parse(content);
  } catch (e) {
    if (e instanceof Error) {
      diagnostics.push({
        from: 0,
        to: content.length,
        severity: 'error',
        message: e.message,
      });
    }
  }

  return diagnostics;
}

export function YamlLinter(view: EditorView) {
  const diagnostics: Diagnostic[] = [];
  const content = view.state.doc.toString();

  try {
    YAML.parse(content);
  } catch (e) {
    if (e instanceof Error) {
      diagnostics.push({
        from: 0,
        to: content.length,
        severity: 'error',
        message: e.message,
      });
    }
  }

  return diagnostics;
}

export function TomlLinter(view: EditorView) {
  const diagnostics: Diagnostic[] = [];
  const content = view.state.doc.toString();

  try {
    TOML.parse(content);
  } catch (e) {
    if (e instanceof Error) {
      diagnostics.push({
        from: 0,
        to: content.length,
        severity: 'error',
        message: e.message,
      });
    }
  }

  return diagnostics;
}
