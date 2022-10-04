import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmailConfirmationComponent } from 'app/email-confirmation/email-confirmation.component';
import { DebugComponent } from 'app/view/debug/debug.component';
import { MainComponent } from 'app/view/main/main.component';

const routes: Routes = [
  { path: '', component: MainComponent },
  { path: 'debug', component: DebugComponent },
  { path: 'email-confirmation', component: EmailConfirmationComponent },
  { path: ':component', component: MainComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
