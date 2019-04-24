/* SystemJS module definition */
interface String {
  format(...args: any[]): string;
}

interface Array<T> {
  sum(func: Function): number;
  count(func: Function): number;
  avr(func: Function): number;
  max(func: Function): number;
  min(func: Function): number;
  last(): T;
  sortByField(func: Function): Array<T>;
  clone(): Array<T>;
  cloneDeep(): Array<T>;
}
