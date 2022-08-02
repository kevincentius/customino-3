import { Component, ElementRef, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { LobbyService } from "app/game-server/lobby.service";
import { MainScreen } from "app/view/main/main-screen";
import { MainService, Rect } from "app/view/main/main.service";
import { ControlsComponent } from "app/view/menu/controls/controls.component";
import { LobbyComponent } from "app/view/menu/lobby/lobby.component";
import { MenuComponent } from "app/view/menu/menu/menu.component";
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

  @ViewChild('pixi', { static: true })
  private pixi!: PixiComponent;

  @ViewChild('pixiOverlay', { static: true })
  private pixiOverlay!: ElementRef<HTMLDivElement>;

  // view model
  screen = MainScreen.PRELOADER;
  initialized = false;

  pixiPos: Rect;

  // icon bar
  prevScreen!: MainScreen;

  constructor(
    public mainService: MainService,
    private lobbyService: LobbyService,
    private route: ActivatedRoute,
  ) {
    this.pixiPos = this.mainService.pixiPos;

    this.openScreen(MainScreen.PRELOADER);

    this.route.params.subscribe(params => {
      this.openScreen(params['component'] ?? MainScreen.MENU);
    });

    this.lobbyService.clientInfoSubject.subscribe(sessionInfo => this.mainService.sessionInfo = sessionInfo);
  }
  
  ngAfterViewInit() {
    this.mainService.init(this);

    this.mainService.pixi = this.pixi.pixiApplication;
  }

  onEnterRoom(roomId: number) {
    this.screen = MainScreen.ROOM;
    this.room.show(roomId);

    this.mainService.pixiEnabled = true;
  }

  openScreen(screen: MainScreen) {
    this.prevScreen = this.screen;
    this.screen = screen;

    if (screen == MainScreen.LOBBY) {
      this.lobby.onRefresh();
    }
  }

  back() {
    this.screen = this.prevScreen;
  }



  // icon bar
  onSetGameView(gameView: boolean) {
    this.room.setGameView(gameView);
  }

  onDebugClick() {
    this.room.downloadDebug();
  }
}
