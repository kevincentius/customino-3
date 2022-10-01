import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
import { MatSnackBar } from '@angular/material/snack-bar';

enum LoginPhase {
  SUBMIT_USERNAME,
  CONFIRM_REGISTER,
  SUBMIT_PASSWORD,
  SUBMIT_ACCOUNT,
  RESET_PASSWORD,
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
  inpEmail = '';
  inpReset = '';

  @ViewChild('inpUsernameRef')
  inpUsernameRef!: ElementRef<HTMLInputElement>;

  @ViewChild('inpPasswordRef')
  inpPasswordRef!: ElementRef<HTMLInputElement>;
  
  @ViewChild('inpEmailRef')
  inpEmailRef!: ElementRef<HTMLInputElement>;

  @ViewChild('inpResetRef')
  inpResetRef!: ElementRef<HTMLInputElement>;

  @ViewChild('btnLoginAsGuestRef')
  btnLoginAsGuestRef!: ElementRef<HTMLButtonElement>;

  loading = false;

  phase = LoginPhase.SUBMIT_USERNAME;

  username?: string;

  autoFocusUsername = true;

  errorMessage?: string;

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
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.setRandomName();
  }

  onShow() {
    this.inpPassword = "";
    this.inpEmail = "";
    this.errorMessage = "";
    this.phase = LoginPhase.SUBMIT_USERNAME;
    this.cd.detectChanges();
    
    setTimeout(() => {
      this.inpUsernameRef.nativeElement.focus();
      this.inpUsernameRef.nativeElement.select();
    });
  }

  setRandomName() {
    this.inpUsername = this.randomNames[this.nextRandomNameId];
    this.nextRandomNameId = (this.nextRandomNameId + 1) % this.randomNames.length;
  }

  isGuestName() {
    return this.randomNames.indexOf(this.inpUsername) != -1;
  }

  async onSubmitUsername() {
    if (!this.inpUsername.match(/^[a-zA-Z][a-zA-Z0-9]{2,14}$/)) {
      this.errorMessage = 'Username must be alphanumeric and start with a letter.';
      this.cd.detectChanges();
      return;
    } else {
      this.errorMessage = undefined;
    }

    this.loading = true;
    this.cd.detectChanges();

    const accountInfo: any = await this.accountService.findByUsername(this.inpUsername.trim());
    
    if (accountInfo) {
      this.username = accountInfo.username;
      this.phase = LoginPhase.SUBMIT_PASSWORD;
      setTimeout(() => this.inpPasswordRef.nativeElement.focus());
    } else {
      this.phase = LoginPhase.CONFIRM_REGISTER;
      setTimeout(() => this.btnLoginAsGuestRef.nativeElement.focus());
    }
    this.loading = false;
    this.cd.detectChanges();
  }

  async onCreateAccount() {
    this.phase = LoginPhase.SUBMIT_ACCOUNT;
    this.cd.detectChanges();
    
    setTimeout(() => {
      this.inpEmailRef.nativeElement.focus();
    });
  }

  async onSubmitAccount() {
    if (this.inpPassword.trim() == '') {
      this.inpPasswordRef.nativeElement.focus();
    } else {
      const registerResult: any = await this.authService.register({
        username: this.inpUsername,
        passwordClearText: this.inpPassword,
        email: this.inpEmail ?? undefined,
      });
  
      if (registerResult.success) {
        await this.onSubmitPassword();
      } else {
        this.errorMessage = registerResult.error;
        this.cd.detectChanges();
      }
    }
  }

  async onLoginAsGuest() {
    this.loading = true;
    this.cd.detectChanges();

    // connect to game server
    const debugResponse = await this.debugService.test();
    await this.socketService.connect(debugResponse.gameServerUrl, undefined, this.inpUsername);
    this.mainService.sessionInfo = await this.appService.getSessionInfo();

    await this.finishLogin();    
  }

  onResetPassword() {
    this.phase = LoginPhase.RESET_PASSWORD;
    this.inpReset = '';
    this.cd.detectChanges();
    setTimeout(() => this.inpResetRef.nativeElement.focus());
  }

  async onSubmitResetPassword() {
    this.loading = true;
    this.cd.detectChanges();

    const result = await this.authService.forgotPassword(
      this.inpReset.indexOf('@') == -1
      ? { username: this.inpReset }
      : { email: this.inpReset }
      );
    
    this.snackBar.open('If the username or email exists, an email containing further instructions will be sent shortly.', 'Grumble');
    this.onShow();
  }

  async onSubmitPassword() {
    this.loading = true;
    this.cd.detectChanges();

    try {
      // login to main server - will throw an error if password is false
      const loginResult: any = await this.authService.login({
        username: this.inpUsername,
        password: this.inpPassword,
      });
      this.configuration.accessToken = loginResult.jwtToken;

      // connect to game server
      const debugResponse = await this.debugService.test();
      await this.socketService.connect(debugResponse.gameServerUrl, loginResult.jwtToken);
      this.mainService.sessionInfo = await this.appService.getSessionInfo();

      await this.finishLogin();
    } catch (e: any) {
      this.inpPassword = '';
      this.errorMessage = 'Password seems to be invalid';
    }
    this.cd.detectChanges();
  }

  private async finishLogin() {
    // user settings
    await this.userSettingsService.init();
    this.appService.updateUserRule(getLocalSettings().userRule);
    
    // enter game menu
    this.loading = false;
    this.mainService.openScreen(MainScreen.MENU);
    this.cd.detectChanges();
    soundService.play('button', 0, 0);
    musicService.start();
  }
}
