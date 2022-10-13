import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Params } from "@angular/router";
import { SystemKey } from "@shared/game/network/model/system-key";
import { soundService } from "app/pixi/display/sound/sound-service";
import { isSystemKey } from "app/service/user-settings/user-settings.service";
import { LeaderboardComponent } from "app/view/leaderboard/leaderboard/leaderboard.component";
import { MainScreen } from "app/view/main/main-screen";
import { MainService } from "app/view/main/main.service";
import { ControlsComponent } from "app/view/menu/controls/controls.component";
import { LobbyComponent } from "app/view/menu/lobby/lobby.component";
import { LoginComponent } from "app/view/menu/login/login.component";
import { MenuComponent } from "app/view/menu/menu/menu.component";
import { PersonalizationComponent } from "app/view/menu/personalization/personalization.component";
import { RoomComponent } from "app/view/menu/room/room.component";
import { PixiComponent } from "app/view/pixi/pixi.component";
import { ReplayComponent } from "app/view/replay/replay.component";
import { ThanksComponent } from "../menu/thanks/thanks.component";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MainService],
})
export class MainComponent implements OnInit {
  MainScreen = MainScreen;

  @ViewChild('login', { static: true })
  private login!: LoginComponent;

  @ViewChild('menu', { static: true })
  private menu!: MenuComponent;
  
  @ViewChild('lobby', { static: true })
  private lobby!: LobbyComponent;
  
  @ViewChild('room', { static: true })
  private room!: RoomComponent;
  
  @ViewChild('replay', { static: true })
  private replay!: ReplayComponent;

  @ViewChild('thanks', { static: true })
  private thanks!: ThanksComponent;

  @ViewChild('controls', { static: true })
  private controls!: ControlsComponent;

  @ViewChild('leaderboard', { static: true })
  private leaderboard!: LeaderboardComponent;

  @ViewChild('personalization', { static: true })
  private personalization!: PersonalizationComponent;

  @ViewChild('pixi', { static: true })
  private pixi!: PixiComponent;

  @ViewChild('pixiOverlay', { static: true })
  private pixiOverlay!: ElementRef<HTMLDivElement>;

  // view model
  screen = MainScreen.PRELOGIN;
  initialized = false;
  fullscreen = false;

  // icon bar
  prevScreen!: MainScreen;

  constructor(
    public mainService: MainService,
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef,
  ) {}

ngOnInit() {
    history.pushState(null, '', location.href);
    window.onpopstate = function () {
      history.go(1);
    };

    this.openScreen(MainScreen.PRELOGIN);

    this.route.params.subscribe(params => {
      this.route.queryParams.subscribe(queryParams => {
        this.mainService.runOnServerInfoLoaded(() => {
          this.openScreen(params['component'] ?? MainScreen.LOGIN, queryParams);
        });
      });
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    const oldFullscreen = this.fullscreen;
    this.fullscreen = 1 >= outerHeight - innerHeight;

    if (oldFullscreen != this.fullscreen) {
      this.cd.detectChanges();
    }
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(ev: KeyboardEvent) {
    let handled = true;
    
    if (isSystemKey(ev, SystemKey.EXIT)) {
      if (this.screen == MainScreen.ROOM) {
        this.room.onBackClick();
      } else if (this.screen == MainScreen.LOBBY) {
        this.lobby.onBackClick();
      } else if (this.screen == MainScreen.PERSONALIZATION) {
        this.personalization.onBackClick();
      } else if (this.screen == MainScreen.CONTROLS) {
        this.controls.onBackClick();
      } else if (this.screen == MainScreen.LEADERBOARD) {
        this.leaderboard.onBackClick();
      } else if (this.screen == MainScreen.REPLAY) {
        this.replay.onBackClick();
      } else if (this.screen == MainScreen.THANKS) {
        this.thanks.onBackClick();
      }
    } else {
      handled = false;
    }

    if (handled) {
      ev.stopPropagation();
      ev.preventDefault();
    }
  }

  ngAfterViewInit() {
    this.mainService.init(this);

    this.mainService.pixi = this.pixi.pixiApplication;
  }

  onEnterRoom(roomId: number) {
    this.screen = MainScreen.ROOM;
    this.room.show(roomId);
  }

  openScreen(screen: MainScreen, queryParams: Params = {}) {
    if (this.screen != MainScreen.CONTROLS) {
      this.prevScreen = this.screen;
    }
    this.screen = screen;

    if (screen == MainScreen.LOBBY) {
      this.lobby.onRefresh();
    }

    if (screen == MainScreen.LOGIN) {
      this.login.onShow(queryParams);
    }

    this.cd.detectChanges();
  }

  back() {
    if (this.screen == MainScreen.PERSONALIZATION) {
      this.screen = MainScreen.CONTROLS;
      this.cd.detectChanges();
    } else {
      this.screen = this.prevScreen;
      this.cd.detectChanges();
    }
  }



  // icon bar
  onLeaveRoom() {
    this.room.onBackClick();
    soundService.play('back');
  }

  onDownloadClick() {
    window.open('https://drive.google.com/drive/u/0/folders/1QxwCxVj39-53hTvEiYJIEHKDdktgoPAf', '_blank')!.focus();
  }

  onDebugClick() {
    this.room.downloadDebug();
  }

  onToggleFullscreenClick() {
    if (this.fullscreen) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen()
    }
  }
}
