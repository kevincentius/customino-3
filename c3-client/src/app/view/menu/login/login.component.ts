import { Component, OnInit } from '@angular/core';
import { SessionInfo } from '@shared/model/session/session-info';
import { shuffle } from '@shared/util/random';
import { AccountService } from 'app/game-server/account.service';
import { LobbyService } from 'app/game-server/lobby.service';
import { musicService } from 'app/pixi/display/sound/music-service';
import { soundService } from 'app/pixi/display/sound/sound-service';
import { MainScreen } from 'app/view/main/main-screen';
import { MainService } from 'app/view/main/main.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  
  private randomNames = shuffle(['Alligator','Anteater','Antelope','Ape','Armadillo','Donkey','Baboon','Badger','Barracuda','Bat','Bear','Beaver','Bee','Bison','Bluebird','Boar','Buffalo','Butterfly','Camel','Cassowary','Cat','Caterpillar','Cheetah','Chicken','Chimpanzee','Chinchilla','Cobra','Coyote','Crab','Cricket','Crocodile','Crow','Deer','Dog','Dolphin','Donkey','Dragonfly','Duck','Eagle','Eel','Elephant','Falcon','Flamingo','Fox','Frog','Gazelle','Gecko','Giraffe','Goat','Goose','Gorilla','Grasshopper','Hamster','Hawk','Hedgehog','Hippopotamus','Horse','Hyena','Iguana','Jaguar','Jellyfish','Kangaroo','Koala','Komodo','Leopard','Lion','Lizard','Mammoth','Meerkat','Mole','Mongoose','Mouse','Ocelot','Octopus','Orangutan','Ostrich','Otter','Ox','Owl','Oyster','Panther','Parrot','Panda','Penguin','Rabbit','Raccoon','Reindeer','Rhinoceros','Salamander','Seahorse','Seal','Shark','Snake','Spider','Squirrel','Swan','Tiger','Weasel','Wolf','Zebra']);
  private nextRandomNameId = 0;

  inpData = '';

  constructor(
    private accountService: AccountService,
    private mainService: MainService,
  ) { }

  ngOnInit(): void {
    this.setRandomName();
  }

  setRandomName() {
    this.inpData = this.randomNames[this.nextRandomNameId];
    this.nextRandomNameId = (this.nextRandomNameId + 1) % this.randomNames.length;
  }

  async onSubmit() {
    // TODO: disable gui
    const sessionInfo: SessionInfo | null = await this.accountService.loginAsGuest(this.inpData);

    if (sessionInfo == null) {
      // TODO: enable gui & show error
    } else {
      this.mainService.sessionInfo = sessionInfo;
      this.mainService.openScreen(MainScreen.MENU);
    
      soundService.play('login');
      musicService.start();
    }
  }
}