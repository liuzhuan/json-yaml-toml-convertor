const KEY = '$JYT-CONVERTOR$';

export function write(obj: object) {
  const val = JSON.stringify(obj);
  localStorage.setItem(KEY, val);
}

export function read(): object {
  const val = localStorage.getItem(KEY) || '';
  try {
    return JSON.parse(val);
  } catch (e) {
    return {};
  }
}
