import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { shuffle } from '@shared/util/random';
import { AccountService, Configuration } from 'app/main-server/api/v1';
import { GameAppService } from 'app/game-server/app.service';
import { musicService } from 'app/pixi/display/sound/music-service';
import { soundService } from 'app/pixi/display/sound/sound-service';
import { SocketService } from 'app/service/socket.service';
import { getLocalSettings, UserSettingsService } from 'app/service/user-settings/user-settings.service';
import { clientVersion } from 'app/service/version';
import { MainScreen } from 'app/view/main/main-screen';
import { MainService } from 'app/view/main/main.service';
import { AuthService } from 'app/main-server/api/v1/api/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Params, Router } from '@angular/router';

enum LoginPhase {
  SUBMIT_USERNAME,
  CONFIRM_REGISTER,
  SUBMIT_PASSWORD,
  SUBMIT_ACCOUNT,
  RESET_PASSWORD,
  CHANGE_PASSWORD,
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
  inpNewPassword = '';
  passwordResetCode?: string;

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

  @ViewChild('inpNewPasswordRef')
  inpNewPasswordRef!: ElementRef<HTMLInputElement>;
  
  loading = false;

  phase = LoginPhase.SUBMIT_USERNAME;

  username?: string;

  autoFocusUsername = true;

  errorMessage?: string;

  constructor(
    private mainService: MainService,
    private gameAppService: GameAppService,
    private cd: ChangeDetectorRef,

    private socketService: SocketService,
    private userSettingsService: UserSettingsService,

    private accountService: AccountService,
    private authService: AuthService,
    private configuration: Configuration,
    private snackBar: MatSnackBar,
    private router: Router,
  ) { }

  async ngOnInit() {
    this.setRandomName();
  }

  onShow(queryParams: Params = {}) {
    this.loading = false;
    this.inpPassword = "";
    this.inpEmail = "";
    this.errorMessage = "";
    this.inpNewPassword = "";
    this.phase = this.passwordResetCode ? LoginPhase.CHANGE_PASSWORD : LoginPhase.SUBMIT_USERNAME;
    this.cd.detectChanges();
    
    this.passwordResetCode = queryParams['passwordResetCode'];
    if (this.passwordResetCode) {
      this.phase = LoginPhase.CHANGE_PASSWORD;
      setTimeout(() => this.inpNewPasswordRef.nativeElement.focus());
    } else {
      this.phase = LoginPhase.SUBMIT_USERNAME;
      setTimeout(() => {
        this.inpUsernameRef?.nativeElement.focus();
        this.inpUsernameRef?.nativeElement.select();
      });
    }
    this.cd.detectChanges();
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
        this.snackBar.open('We will send an email to confirm your email address.', 'Game on', { duration: 7000 });
      } else {
        this.errorMessage = registerResult.error;
        this.cd.detectChanges();
      }
    }
  }

  async onLoginAsGuest() {
    this.loading = true;
    this.cd.detectChanges();

    await this.finishLogin(undefined, this.inpUsername);
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
      await this.finishLogin(loginResult.jwtToken);
    } catch (e: any) {
      console.error(e);
      this.inpPassword = '';
      this.errorMessage = 'Login failed';
      this.loading = false;
    }
    this.cd.detectChanges();
  }

  private async finishLogin(jwtToken?: string, guestName?: string) {
    const debugResponse = await this.authService.getInfo();
    await this.socketService.connect(debugResponse.gameServerUrl, jwtToken, guestName);

    this.mainService.sessionInfo = await this.gameAppService.getSessionInfo();

    // user settings
    await this.userSettingsService.init();
    this.gameAppService.updateUserRule(getLocalSettings().userRule);
    
    // enter game menu
    this.loading = false;
    this.mainService.openScreen(MainScreen.MENU);
    this.cd.detectChanges();
    soundService.play('button', 0, 0);
    musicService.start();
  }

  async onSubmitChangePassword() {
    const result = await this.authService.changePassword({
      passwordResetCode: this.passwordResetCode!,
      newPassword: this.inpNewPassword,
    });

    this.passwordResetCode = undefined;
    
    if (result) {
      this.snackBar.open('The new password has been saved!', 'Finally');
      this.router.navigate(['']);
      this.onShow();
    } else {
      this.snackBar.open('Something went wrong. Maybe try again?', ':-(');
      this.router.navigate(['']);
    }
  }
}
