import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';

import { DebugComponent } from 'app/view/debug/debug.component';
import { MainComponent } from 'app/view/main/main.component';
import { PixiComponent } from 'app/view/pixi/pixi.component';

@NgModule({
  declarations: [
    MainComponent,
    PixiComponent,
    DebugComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [MainComponent],
})
export class AppModule { }
