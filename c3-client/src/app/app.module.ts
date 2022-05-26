import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';

import { DebugComponent } from 'app/view/debug/debug.component';
import { MainComponent } from 'app/view/main/main.component';
import { PixiComponent } from 'app/view/pixi/pixi.component';
import { environment } from 'environments/environment';
import { ApiModule, Configuration, ConfigurationParameters } from 'app/main-server/api/v1';
import { LobbyComponent } from './view/menu/lobby/lobby.component';
import { RoomComponent } from './view/menu/room/room.component';
import { AppComponent } from './app.component';

export function apiConfigFactory(): Configuration {
  const params: ConfigurationParameters = {
    basePath: environment.mainServerUrl,
  };
  return new Configuration(params);
}

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    PixiComponent,
    DebugComponent,
    LobbyComponent,
    RoomComponent,
  ],
  imports: [
    ApiModule.forRoot(apiConfigFactory),
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
