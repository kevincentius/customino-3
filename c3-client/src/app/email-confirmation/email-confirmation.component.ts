import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'app/main-server/api/v1';

@Component({
  selector: 'app-email-confirmation',
  templateUrl: './email-confirmation.component.html',
  styleUrls: ['./email-confirmation.component.scss']
})
export class EmailConfirmationComponent implements OnInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
  ) {}

  async ngOnInit() {
    this.route.queryParams.subscribe(async queryParams => {
      console.log(queryParams['emailCode']);
      const success = await this.authService.confirmEmailByCode({
        emailConfirmationCode: queryParams['emailCode'] as string,
      });
      if (success) {
        this.router.navigate(['']);
      }
    });
  }

}
