import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'app-icon-button',
    templateUrl: './icon-button.component.html',
    styleUrls: ['./icon-button.component.scss']
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
