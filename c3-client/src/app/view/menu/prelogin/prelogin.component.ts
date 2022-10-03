import { Component, OnInit } from '@angular/core';
import { AuthService } from 'app/main-server/api/v1';
import { clientVersion } from 'app/service/version';
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
    private authService: AuthService,
    private mainService: MainService,
  ) { }

  async ngOnInit() {
    const serverInfo = await this.authService.getInfo();
    this.mainServerConnected = true;

    if (clientVersion.startsWith(serverInfo.version)) {
      this.mainService.onServerInfoLoaded();
    } else {
      this.updateRequired = true;
      this.clientVersion = clientVersion;
      this.serverVersion = serverInfo.version;
      this.clientDownloadUrl = serverInfo.clientDownloadUrl;
    }
  }
}
