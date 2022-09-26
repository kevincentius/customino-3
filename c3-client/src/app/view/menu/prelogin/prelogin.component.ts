import { Component, OnInit } from '@angular/core';
import { GameAppService } from 'app/game-server/app.service';
import { AppService } from 'app/main-server/api/v1/api/app.service';
import { UserSettingsService } from 'app/service/user-settings/user-settings.service';
import { clientVersion } from 'app/service/version';
import { MainScreen } from 'app/view/main/main-screen';
import { MainService } from 'app/view/main/main.service';

@Component({
  selector: 'app-prelogin',
  templateUrl: './prelogin.component.html',
  styleUrls: ['./prelogin.component.scss']
})
export class PreloginComponent implements OnInit {
  updateRequired?: boolean = undefined;
  clientVersion!: string;
  serverVersion!: string;
  clientDownloadUrl!: string;

  mainServerConnected = false;

  constructor(
    private appService: AppService,
    private mainService: MainService,
  ) { }

  async ngOnInit() {
    const serverInfo = await this.appService.getInfo();
    this.mainServerConnected = true;

    if (clientVersion.startsWith(serverInfo.version)) {
      this.mainService.openScreen(MainScreen.LOGIN);
    } else {
      this.updateRequired = true;
      this.clientVersion = clientVersion;
      this.serverVersion = serverInfo.version;
      this.clientDownloadUrl = serverInfo.clientDownloadUrl;
    }
  }
}
