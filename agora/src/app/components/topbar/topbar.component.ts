import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
})
export class TopbarComponent implements OnInit {

  // find out whether page is a 'root' page and => does not need a back button
  @Input() root: boolean;

  constructor() { }

  ngOnInit() {
    if (!this.root) {
      this.root = false;
    }
  }

}
