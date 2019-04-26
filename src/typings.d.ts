/* SystemJS module definition */
interface String {
  format(...args: any[]): string;
}


interface Array<T> {
  sum(func: (this: Array<T>, element: T) => number): number;
  count(func: (this: Array<T>, element: T) => number): number;
  avr(func: (this: Array<T>, element: T) => number): number;
  max(func: (this: Array<T>, element: T) => number): number;
  min(func: (this: Array<T>, element: T) => number): number;
  last(): T;
  sortByField(func: (this: Array<T>, element: T) => any): Array<T>;
  clone(): Array<T>;
  cloneDeep(): Array<T>;
}
