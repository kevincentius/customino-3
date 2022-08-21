import { Component, ElementRef, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AccountService } from "app/game-server/account.service";
import { UserSettingsService } from "app/service/user-settings/user-settings.service";
import { MainScreen } from "app/view/main/main-screen";
import { MainService } from "app/view/main/main.service";
import { ControlsComponent } from "app/view/menu/controls/controls.component";
import { LobbyComponent } from "app/view/menu/lobby/lobby.component";
import { MenuComponent } from "app/view/menu/menu/menu.component";
import { PersonalizationComponent } from "app/view/menu/personalization/personalization.component";
import { RoomComponent } from "app/view/menu/room/room.component";
import { PixiComponent } from "app/view/pixi/pixi.component";
import { ReplayComponent } from "app/view/replay/replay.component";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
  providers: [MainService],
})
export class MainComponent {
  MainScreen = MainScreen;

  @ViewChild('menu', { static: true })
  private menu!: MenuComponent;
  
  @ViewChild('lobby', { static: true })
  private lobby!: LobbyComponent;
  
  @ViewChild('room', { static: true })
  private room!: RoomComponent;
  
  @ViewChild('replay', { static: true })
  private replay!: ReplayComponent;

  @ViewChild('controls', { static: true })
  private controls!: ControlsComponent;

  @ViewChild('personalization', { static: true })
  private personalization!: PersonalizationComponent;

  @ViewChild('pixi', { static: true })
  private pixi!: PixiComponent;

  @ViewChild('pixiOverlay', { static: true })
  private pixiOverlay!: ElementRef<HTMLDivElement>;

  // view model
  screen = MainScreen.PRELOADER;
  initialized = false;

  // icon bar
  prevScreen!: MainScreen;

  constructor(
    public mainService: MainService,
    private route: ActivatedRoute,
  ) {
    this.openScreen(MainScreen.PRELOADER);

    this.route.params.subscribe(params => {
      this.openScreen(params['component'] ?? MainScreen.LOGIN);
    });
  }
  
  ngAfterViewInit() {
    this.mainService.init(this);

    this.mainService.pixi = this.pixi.pixiApplication;
  }

  onEnterRoom(roomId: number) {
    this.screen = MainScreen.ROOM;
    this.room.show(roomId);
  }

  openScreen(screen: MainScreen) {
    if (this.screen != MainScreen.CONTROLS) {
      this.prevScreen = this.screen;
    }
    this.screen = screen;

    if (screen == MainScreen.LOBBY) {
      this.lobby.onRefresh();
    }
  }

  back() {
    if (this.screen == MainScreen.PERSONALIZATION) {
      this.screen = MainScreen.CONTROLS;
    } else {
      this.screen = this.prevScreen;
    }
  }



  // icon bar
  onLeaveRoom() {
    this.room.onBackClick();
  }

  onDebugClick() {
    this.room.downloadDebug();
  }
}
