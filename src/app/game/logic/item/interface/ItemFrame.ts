import { Item } from "./Item";

export interface ItemFrame {
  created: Item[];
  updated: Item[];
  deleted: Item[];
  catchedByFirstPlayer: Item[];
  catchedBySecondPlayer: Item[];
}
