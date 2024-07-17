export type TAny =
  | string
  | number
  | boolean
  | undefined
  | null
  | Array<TAny>
  | { [x: string]: TAny };

export type TObjectAny = { [x: string]: TAny | TObjectAny };

export declare type AnyObject = Record<string, any>;
