import { InputKey } from "@shared/game/network/model/input-key";

export enum MenuKey {
  BACK,
  LOBBY,
  
}

export interface InputKeyData {
  inputKey?: InputKey;
  name: string;
  default: string;
}

export const inputKeyDataArray: InputKeyData[] = [
  {
    inputKey: InputKey.LEFT,
    name: 'Move piece left',
    default: 'ArrowLeft',
  },
  {
    inputKey: InputKey.RIGHT,
    name: 'Move piece right',
    default: 'ArrowRight',
  },
  {
    inputKey: InputKey.SOFT_DROP,
    name: 'Move piece down',
    default: 'ArrowDown',
  },
  {
    inputKey: InputKey.RCCW,
    name: 'Rotate piece counter clockwise (left)',
    default: 'KeyZ',
  },
  {
    inputKey: InputKey.RCW,
    name: 'Rotate piece clockwise (right)',
    default: 'ArrowUp',
  },
  {
    inputKey: InputKey.R180,
    name: 'Rotate piece 180°',
    default: 'KeyX',
  },
  {
    inputKey: InputKey.HARD_DROP,
    name: 'Drop piece',
    default: 'Space',
  },
];
