import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';

import { MainComponent } from './views/main/main.component';
import { PixiComponent } from './views/pixi/pixi.component';
import { MenuComponent } from './views/menu/menu.component';
@NgModule({
  declarations: [
    MainComponent,
    PixiComponent,
    MenuComponent,
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
