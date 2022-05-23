import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DebugComponent } from 'app/view/debug/debug.component';
import { MainComponent } from 'app/view/main/main.component';
import { LobbyComponent } from 'app/view/menu/lobby/lobby.component';
import { RoomComponent } from 'app/view/menu/room/room.component';

const routes: Routes = [
  { path: '', component: MainComponent },
  { path: 'debug', component: DebugComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
