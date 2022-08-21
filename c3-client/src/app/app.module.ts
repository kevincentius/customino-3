import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import {MatIconModule} from '@angular/material/icon';
import {MatTabsModule} from '@angular/material/tabs';
import {MatMenuModule} from '@angular/material/menu';

import { DebugComponent } from 'app/view/debug/debug.component';
import { MainComponent } from 'app/view/main/main.component';
import { PixiComponent } from 'app/view/pixi/pixi.component';
import { environment } from 'environments/environment';
import { ApiModule, Configuration, ConfigurationParameters } from 'app/main-server/api/v1';
import { LobbyComponent } from './view/menu/lobby/lobby.component';
import { RoomComponent } from './view/menu/room/room.component';
import { AppComponent } from './app.component';
import { ReplayComponent } from './view/replay/replay.component';
import { FileDropAreaComponent } from 'app/view/common/file-drop-area/file-drop-area.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MenuComponent } from './view/menu/menu/menu.component';
import { ControlsComponent } from './view/menu/controls/controls.component';
import { BackgroundComponent } from './view/common/background/background.component';
import { ControlRowComponent } from './view/menu/controls/control-row/control-row.component';
import { MenuButtonComponent } from './view/common/menu-button/menu-button.component';
import { FormsModule } from '@angular/forms';
import { RoomSettingsComponent } from './view/menu/room-settings/room-settings.component';
import { RuleSettingsComponent } from './view/menu/rule-settings/rule-settings.component';
import { FieldInputComponent } from './view/menu/field-input/field-input.component';
import { FieldOutputComponent } from './view/menu/field-output/field-output.component';
import { ThanksComponent } from './view/menu/thanks/thanks.component';
import { PieceComponent } from './view/common/piece/piece.component';
import { PersonalizationComponent } from './view/menu/personalization/personalization.component';
import { LoginComponent } from './view/menu/login/login.component';
import { IconButtonComponent } from 'app/view/common/icon-button/icon-button.component';

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
    ReplayComponent,
    FileDropAreaComponent,
    MenuComponent,
    ControlsComponent,
    BackgroundComponent,
    ControlRowComponent,
    MenuButtonComponent,
    RoomSettingsComponent,
    RuleSettingsComponent,
    FieldInputComponent,
    FieldOutputComponent,
    ThanksComponent,
    PieceComponent,
    PersonalizationComponent,
    LoginComponent,
    IconButtonComponent,
  ],
  imports: [
    ApiModule.forRoot(apiConfigFactory),
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MatIconModule,
    BrowserAnimationsModule,
    FormsModule,
    MatTabsModule,
    MatMenuModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
