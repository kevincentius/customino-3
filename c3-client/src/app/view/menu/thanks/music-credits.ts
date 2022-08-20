import { CreditGroup } from "app/view/menu/thanks/thanks.component";

export const musicCredits: CreditGroup =
{
  name: 'freesfx.co.uk',
  description: 'The source of the musics of the base game.',
  url: 'https://www.freesfx.co.uk',
  items: [
    'A Will to Win',
    'Atoms and Particles',
    'Break Through',
    'Cool Storm',
    'Corporate Heat',
    'Distressed',
    'Exploration',
    'First Quarter',
    'Super Sunday',
    'Street Heat',
    'The Environment',
  ].map(str => ({ name: str })),
};
