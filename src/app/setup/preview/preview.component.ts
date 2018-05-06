import {Component, Input, OnInit} from '@angular/core';

import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.css']
})
export class PreviewComponent implements OnInit {
  @Input() file: any;

  constructor(private sanitizer: DomSanitizer, private modalService: NgbModal) { }

  ngOnInit() {
  }

  openVerticallyCentered(content) {
    // this.modalService.open(content);
    this.modalService.open(content, { centered: true, size: 'lg'  });
  }

  forgetIt(evt) {
    evt.stopPropagation();
    evt.preventDefault();
  }
}
