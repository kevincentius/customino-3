import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';

import { DebugComponent } from 'app/view/debug/debug.component';
import { MainComponent } from 'app/view/main/main.component';
import { PixiComponent } from 'app/view/pixi/pixi.component';
import { ApiModule, Configuration, ConfigurationParameters } from 'app/core/api/v1';
import { environment } from 'environments/environment';

export function apiConfigFactory(): Configuration {
  const params: ConfigurationParameters = {
    basePath: environment.mainServerUrl,
  };
  return new Configuration(params);
}

@NgModule({
  declarations: [
    MainComponent,
    PixiComponent,
    DebugComponent,
  ],
  imports: [
    ApiModule.forRoot(apiConfigFactory),
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [MainComponent],
})
export class AppModule { }
