import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-storage-file',
  templateUrl: './storage-file.component.html',
  styleUrls: ['./storage-file.component.css']
})
export class StorageFileComponent implements OnInit {
  @Input() info: string;
  constructor() { }

  ngOnInit() {
  }

}
