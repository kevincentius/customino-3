import { Howl } from 'howler';

export class SoundService {
  enabled = true;
  maps: Map<string, { howls: Howl[], variations: number }>[] = [];

  userSettingsVolume = 1;

  constructor() {
    let list: { name: string, variations?: number }[] = [
      { name: 'harddrop' },
      { name: 'locked' },
      
      { name: 'clear' },
      { name: 'cleardouble' },
      { name: 'clearmany' },
      { name: 'clearb2b' },
      { name: 'immobile' },
      { name: 'tspin' },
      { name: 'tspinmini' },
      { name: 'rotate', variations: 2 },
      { name: 'rotkick' },
      { name: 'stuck' },
      { name: 'receiveone' },
      { name: 'receivetwo' },
      { name: 'receivemany' },
      { name: 'receivespike' },
      { name: 'die' },
      { name: 'combo', variations: 5 },
      { name: 'high-combo-end' },
      { name: 'combotimerend' },
      { name: 'hold' },
      { name: 'colorclear' },
      { name: 'perfectclear' },
      { name: 'combolock' },
    ];

    for (let channel = 0; channel < 2; channel++) {
      let map = new Map<string, { howls: Howl[], variations: number }>();
      for (let item of list) {
        let entry: any = {
          howls: [],
          variations: item.variations ? item.variations : 1,
        };

        for (let i = 0; i < entry.variations; i++) {
          entry.howls.push(new Howl({
            src: 'assets/snd/' + [item.name] + (i + 1) + '.mp3',
          }));
        }

        map.set(item.name, entry);
      }
      this.maps.push(map);
    }

    this.updateVolumes();
  }

  play(name: string, channel: number, variation?: number, startPosRel=0) {
    if (!this.enabled) return;

    let entry = this.maps[channel].get(name)!;

    if (variation == null) {
      variation = Math.floor(Math.random() * entry.variations);
    }

    const id = entry.howls[variation].play();
    if (startPosRel != 0) {
      entry.howls[variation].seek(entry.howls[variation].duration() * startPosRel, id)
    }
  }

  toggle() {
    this.enabled = !this.enabled;
  }

  setVolume(channel: number, volume: number) {
    this.maps[channel].forEach((v, k) => {
      console.log(this.userSettingsVolume);
      v.howls.forEach(h => h.volume(volume * this.userSettingsVolume));
    });
  }
  
  setUserSoundVolume(volume: number) {
    this.userSettingsVolume = volume;

    this.updateVolumes();
  }
  
  private updateVolumes() {
    this.setVolume(0, 1);
    this.setVolume(1, 0.3);
  }
}

export const soundService = new SoundService();
