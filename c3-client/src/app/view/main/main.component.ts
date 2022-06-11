import { Component, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { LobbyService } from "app/game-server/lobby.service";
import { MainScreen } from "app/view/main/main-screen";
import { MainService } from "app/view/main/main.service";
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

  @ViewChild('pixi', { static: true })
  private pixi!: PixiComponent;

  // view model
  screen = MainScreen.PRELOADER;

  constructor(
    public mainService: MainService,
    private lobbyService: LobbyService,
    private route: ActivatedRoute,
  ) {
    this.route.params.subscribe(params => {
      this.screen = params['component'] ?? MainScreen.CONTROLS;
    });

    this.mainService.init(this);
    this.lobbyService.clientInfoSubject.subscribe(sessionInfo => this.mainService.sessionInfo = sessionInfo);
  }

  ngAfterViewInit() {
    this.mainService.pixi = this.pixi.pixiApplication;
  }

  onEnterRoom(roomId: number) {
    this.screen = MainScreen.ROOM;
    this.room.show(roomId);

    this.mainService.pixiEnabled = true;
  }

  openScreen(screen: MainScreen) {
    this.screen = screen;
  }
}
