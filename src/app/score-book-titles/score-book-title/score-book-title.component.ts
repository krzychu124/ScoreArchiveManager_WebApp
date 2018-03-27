import { Component, OnInit, Output, Input } from '@angular/core';
import { ScoreBookTitle } from '../../shared/scoreBookTitle';

@Component({
  selector: 'app-score-book-title',
  templateUrl: './score-book-title.component.html',
  styleUrls: ['./score-book-title.component.css']
})
export class ScoreBookTitleComponent implements OnInit {
  @Input() title = new ScoreBookTitle('');
  constructor() {
    const int = 0;
   }

  ngOnInit() {
  }

}
