export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timerId: number;

  return (...args: Parameters<T>) => {
    clearTimeout(timerId);
    timerId = window.setTimeout(() => {
      fn.apply(null, args);
    }, delay);
  };
}
