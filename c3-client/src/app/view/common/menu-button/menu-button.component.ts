import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu-button',
  templateUrl: './menu-button.component.html',
  styleUrls: ['./menu-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuButtonComponent implements OnInit {
  
  constructor() { }

  ngOnInit(): void {
  }

}
