import { shuffle } from "@shared/util/random";
import { Howl } from "howler";

export class MusicService {
  gameBgmNames = [
    'exploration.mp3',
    'super-sunday.mp3',
    'a-will-to-win.mp3',
    'atoms.mp3',
    'break-through.mp3',
    'cool-storm.mp3',
    'corporate-heat.mp3',
    'distressed.mp3',
    'first-quarter.mp3',
    'street-heat.mp3',
    'the-environment.mp3',
  ];
  gameBgmHowls: Howl[];

  currentMusic = 0;
  isPlaying = false;

  volumeMenu = 0.5;
  volumeGame = 1.0;
  timeout: any;

  prevVolume: number = 0;
  currentVolume: number = 0;
  targetVolume: number = 0;
  volumeAdjustMs: number = 0;

  userSettingsVolume = 1;

  constructor() {
    this.gameBgmHowls = this.gameBgmNames.map(name => new Howl({
      src: 'assets/music/' + name,
      preload: false,
      html5: true,
    }));

    this.setVolumeMenu();
        
    // this is the first time
    console.log(localStorage['visited']);
    if (! localStorage['visited']) {
      localStorage['visited'] = 1;
    } else {
      shuffle(this.gameBgmHowls);
    }
    
    // this.gameBgmHowls.forEach(howl => howl.rate(1.25));
  }

  start() {
    if (!this.isPlaying) {
      this.isPlaying = true;
      
      this.playMusic(this.currentMusic);
    }
  }

  stop() {
    if (this.isPlaying) {
      this.isPlaying = false;
      
      this.gameBgmHowls[this.currentMusic].stop();
    }
  }

  skip() {
    const isPlaying = this.isPlaying;
    this.stop();

    this.currentMusic = (this.currentMusic + 1) % this.gameBgmHowls.length;

    if (isPlaying) {
      this.start();
    }
  }

  setVolumeMenu() { this.setTargetVolume( this.volumeMenu); }
  setVolumeGame() { this.setTargetVolume( this.volumeGame); }

  setUserMusicVolume(volume: number) {
    this.userSettingsVolume = volume;
    if (!this.timeout) {
      this.timeout = setTimeout(() => this.loop());
    }
  }

  private setTargetVolume(volume: number) {
    this.prevVolume = this.currentVolume;
    this.volumeAdjustMs = Date.now();
    this.targetVolume = volume;
    if (!this.timeout) {
      this.timeout = setTimeout(() => this.loop());
    }
  }

  private loop() {
    const p = (Date.now() - this.volumeAdjustMs) / 4000;
    if (p >= 1) {
      this.currentVolume = this.targetVolume;
      this.timeout = null;
    } else {
      this.currentVolume = p * this.targetVolume + (1-p) * this.prevVolume;
      this.timeout = setTimeout(() => this.loop(), 100);
    }
    this.setVolume(this.currentVolume * this.userSettingsVolume);
  }

  private setVolume(volume: number) {
    this.gameBgmHowls.forEach(howl => howl.volume(volume));
  }

  private onEnd(oldId: number) {
    console.log('onEnd', oldId);
    if (oldId == this.currentMusic && this.isPlaying) {
      this.currentMusic = (this.currentMusic + 1) % this.gameBgmHowls.length;

      this.playMusic(this.currentMusic);
    }
  }

  private playMusic(id: number) {
    console.log('playMusic', id);
    if (this.gameBgmHowls[id].state() == 'unloaded') {
      console.log('load', id);
      this.gameBgmHowls[id].load();
    }
    const nextId = (id + 1) % this.gameBgmHowls.length;
    if (this.gameBgmHowls[nextId].state() == 'unloaded') {
      console.log('loadx', nextId);
      this.gameBgmHowls[nextId].load();
    }
    setTimeout(() => {
      this.gameBgmHowls[id].play();
      this.gameBgmHowls[id].on('end', () => this.onEnd(id));
    });
  }
}

export const musicService = new MusicService();
