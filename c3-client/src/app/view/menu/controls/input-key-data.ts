import { InputKey } from "@shared/game/network/model/input-key";

export interface InputKeyData {
  inputKey: InputKey;
  name: string;
  description: string;
  default: string;
}

export const inputKeyDataArray: InputKeyData[] = [
  {
    inputKey: InputKey.LEFT,
    name: 'Move piece left',
    description: 'This key will move the piece one square to the left. If held down, the piece will start to slide automatically.',
    default: 'ArrowLeft',
  },
  {
    inputKey: InputKey.RIGHT,
    name: 'Move piece right',
    description: 'This key will move the piece one square to the right. If held down, the piece will start to slide automatically.',
    default: 'ArrowRight',
  },
  {
    inputKey: InputKey.SOFT_DROP,
    name: 'Move piece down',
    description: 'Holding this key will cause the piece the fall down much faster. This move is also called "soft drop".',
    default: 'ArrowDown',
  },
  {
    inputKey: InputKey.HARD_DROP,
    name: 'Drop piece',
    description: 'This key will drop the piece all the way and lock it in place immediately.',
    default: 'Space',
  },
  {
    inputKey: InputKey.RCCW,
    name: 'Rotate piece counter clockwise (left)',
    description: 'This key will rotate the current piece. If the piece collides with something, the rotation may fail or the piece may get pushed to a nearby location.',
    default: 'KeyZ',
  },
  {
    inputKey: InputKey.RCW,
    name: 'Rotate piece clockwise (right)',
    description: 'This key will rotate the current piece. If the piece collides with something, the rotation may fail or the piece may get pushed to a nearby location.',
    default: 'ArrowUp',
  },
  {
    inputKey: InputKey.R180,
    name: 'Rotate piece 180°',
    description: 'This key will rotate the current piece 180 degrees, if allowed by the game rule. If the piece collides with something, the rotation may fail or the piece may get pushed to a nearby location.',
    default: 'KeyX',
  },
];
