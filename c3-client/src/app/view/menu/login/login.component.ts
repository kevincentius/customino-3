import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SessionInfo } from '@shared/model/session/session-info';
import { shuffle } from '@shared/util/random';
import { AccountService, Configuration } from 'app/main-server/api/v1';
import { GameAppService } from 'app/game-server/app.service';
import { DebugService } from 'app/main-server/api/v1';
import { musicService } from 'app/pixi/display/sound/music-service';
import { soundService } from 'app/pixi/display/sound/sound-service';
import { SocketService } from 'app/service/socket.service';
import { getLocalSettings, UserSettingsService } from 'app/service/user-settings/user-settings.service';
import { clientVersion } from 'app/service/version';
import { MainScreen } from 'app/view/main/main-screen';
import { MainService } from 'app/view/main/main.service';
import { AuthService } from 'app/main-server/api/v1/api/auth.service';

enum LoginPhase {
  SUBMIT_USERNAME,
  CONFIRM_REGISTER,
  SUBMIT_PASSWORD,
  SUBMIT_ACCOUNT,
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit {
  LoginPhase = LoginPhase;

  clientVersion = clientVersion;
  
  private randomNames = shuffle(['Alligator','Anteater','Antelope','Ape','Armadillo','Donkey','Baboon','Badger','Barracuda','Bat','Bear','Beaver','Bee','Bison','Bluebird','Boar','Buffalo','Butterfly','Camel','Cassowary','Cat','Caterpillar','Cheetah','Chicken','Chimpanzee','Chinchilla','Cobra','Coyote','Crab','Cricket','Crocodile','Crow','Deer','Dog','Dolphin','Donkey','Dragonfly','Duck','Eagle','Eel','Elephant','Falcon','Flamingo','Fox','Frog','Gazelle','Gecko','Giraffe','Goat','Goose','Gorilla','Grasshopper','Hamster','Hawk','Hedgehog','Hippopotamus','Horse','Hyena','Iguana','Jaguar','Jellyfish','Kangaroo','Koala','Komodo','Leopard','Lion','Lizard','Mammoth','Meerkat','Mole','Mongoose','Mouse','Ocelot','Octopus','Orangutan','Ostrich','Otter','Ox','Owl','Oyster','Panther','Parrot','Panda','Penguin','Rabbit','Raccoon','Reindeer','Rhinoceros','Salamander','Seahorse','Seal','Shark','Snake','Spider','Squirrel','Swan','Tiger','Weasel','Wolf','Zebra']);
  private nextRandomNameId = 0;

  inpUsername = '';
  inpPassword = '';

  loading = false;

  phase = LoginPhase.SUBMIT_USERNAME;

  username?: string;

  constructor(
    private mainService: MainService,
    private appService: GameAppService,
    private cd: ChangeDetectorRef,

    private debugService: DebugService,
    private socketService: SocketService,
    private userSettingsService: UserSettingsService,

    private accountService: AccountService,
    private authService: AuthService,
    private configuration: Configuration,
  ) { }

  ngOnInit(): void {
    this.setRandomName();
  }

  setRandomName() {
    this.inpUsername = this.randomNames[this.nextRandomNameId];
    this.nextRandomNameId = (this.nextRandomNameId + 1) % this.randomNames.length;
  }

  isGuestName() {
    return this.randomNames.indexOf(this.inpUsername) != -1;
  }

  async onSubmitUsername() {
    this.loading = true;
    this.cd.detectChanges();

    const accountInfo: any = await this.accountService.findByUsername(this.inpUsername.trim());
    console.log(accountInfo);

    if (accountInfo) {
      this.username = accountInfo.username;
      this.phase = LoginPhase.SUBMIT_PASSWORD;
    } else {
      this.phase = LoginPhase.CONFIRM_REGISTER;
    }
    this.loading = false;
    this.cd.detectChanges();

    // const sessionInfo: SessionInfo | null = await this.accountService.loginAsGuest(this.inpUsername);

    // if (sessionInfo == null) {
    //   // TODO: enable gui & show error
    // } else {
    //   // connect websocket
    //   const debugResponse = await this.debugService.test();
    //   await this.socketService.connect(debugResponse.gameServerUrl);
    //   // -----------------

    //   this.appService.updateUserRule(getLocalSettings().userRule);

    //   this.mainService.sessionInfo = sessionInfo;
    //   this.mainService.openScreen(MainScreen.MENU);
    
    //   soundService.play('button', 0, 0);
    //   musicService.start();
    // }
  }

  async onSubmitPassword() {
    this.loading = true;
    this.cd.detectChanges();

    try {
      // attempt login - will throw an error if password is false
      const loginResult: any = await this.authService.login({
        username: this.inpUsername,
        password: this.inpPassword,
      });
      this.configuration.accessToken = loginResult.jwtToken;

      // connect to game server
      const debugResponse = await this.debugService.test();
      await this.socketService.connect(debugResponse.gameServerUrl, loginResult.jwtToken);
      this.mainService.sessionInfo = await this.appService.getSessionInfo();

      // user settings
      await this.userSettingsService.init();
      this.appService.updateUserRule(getLocalSettings().userRule);
      
      // enter menu
      this.mainService.openScreen(MainScreen.MENU);
      this.cd.detectChanges();
      soundService.play('button', 0, 0);
      musicService.start();
    } catch (e: any) {
      this.inpPassword = '';
    }
    this.cd.detectChanges();

  }
}
