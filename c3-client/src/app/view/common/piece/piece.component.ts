import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Piece } from '@shared/game/engine/player/piece';

@Component({
  selector: 'app-piece',
  templateUrl: './piece.component.html',
  styleUrls: ['./piece.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PieceComponent implements OnInit {

  @Input() pieceSize!: number;
  @Input() pieceId!: number;
  @Input() rotation!: number;

  piece: Piece;

  constructor() {
    this.piece = new Piece(this.pieceSize, this.pieceId, this.rotation);
  }

  ngOnInit(): void {
  }

}
