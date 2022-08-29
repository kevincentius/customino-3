import { ChangeDetectionStrategy, Component, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'app-icon-button',
    templateUrl: './icon-button.component.html',
    styleUrls: ['./icon-button.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconButtonComponent implements OnInit {

    // @Output() click = new EventEmitter<void>();
    @Input() iconName!: string;
    @Input() disabled = false;
    @Input() notification: any;

    constructor() { }

    ngOnInit() {
    }

}
