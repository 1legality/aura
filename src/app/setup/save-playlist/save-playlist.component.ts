import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-save-playlist',
  templateUrl: './save-playlist.component.html',
  styleUrls: ['./save-playlist.component.css']
})
export class SavePlaylistComponent implements OnInit {
  @Input() title: string;
  @Input() disabled: boolean;
  @Output() titleGiven = new EventEmitter<String>();

  constructor(private modalService: NgbModal) { }

  ngOnInit() {
  }

  openVerticallyCentered(content) {
    // this.modalService.open(content);
    const modalRef = this.modalService.open(content, { centered: true, size: 'lg'  });

    modalRef.result.then((userResponse) => {

      if (userResponse === 'title') {
        this.titleGiven.emit(this.title);
      }
      this.title = '';
    }, (reason) => {
      // Dismissed
    });
  }
}
