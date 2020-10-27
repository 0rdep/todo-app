export enum TodoTypeEnum {
  personal,
  work,
  home,
}

export interface Todo {
  _id: string;
  userId: string;
  name: string;
  date: string;
  type: TodoTypeEnum;
  done: boolean;
}
