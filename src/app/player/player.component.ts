import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { HostListener } from '@angular/core';
import {FilesService} from '../files.service';
import { DomSanitizer } from '@angular/platform-browser';
import {ElectronService} from 'ngx-electron';
import {Subject} from 'rxjs/Subject';
import {debounceTime} from 'rxjs/operator/debounceTime';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit {

  files: any;
  window = {
    one: {
      visible: true,
      file : null,
      innerHTML : ''
    },
    two: {
      visible: false,
      file : null,
      innerHTML : ''
    }
  };
  iterator = 0;
  timer: any;

  private _notification = new Subject<string>();
  notificationClosed = false;
  notificationMessage: string;

  constructor(private sanitizer: DomSanitizer,
              private route: ActivatedRoute,
              private router: Router,
              private _files: FilesService,
              private _electronService: ElectronService) {

  }

  ngOnInit() {
    // put app into full screen mode
    if (this._electronService.isElectronApp) {
      this._electronService.ipcRenderer.send('fullscreen', true);
    }

    this._files.file.subscribe(res => this.files = res);

    console.log(this.files);

    let canPlay = false;
    for (let i = 0; i < this.files.length; i++) {
      if (this.files[i].duration >= 0) {
        canPlay = true;
      }
    }

    if (this.files.length > 0 && canPlay) {
      this.window.one.file = this.files[0];

      this.updateInnerText('one');
    }

    this.prepareNextFile();



    setTimeout(() => this.notificationClosed = true, 20000);

    this._notification.subscribe((message) => this.notificationMessage = <string>this.sanitizer.bypassSecurityTrustHtml(message));
    debounceTime.call(this._notification, 5000).subscribe(() => this.notificationMessage = null);

    this.sendNotification();
  }


  prepareNextFile() {
    // get the hidden view
    let update = '';
    let current = '';
    if (!this.window.one.visible) {
      update = 'one';
      current = 'two';
    } else {
      update = 'two';
      current = 'one';
    }

    // set the timer
    clearTimeout(this.timer);


    if (this.window[current].file.duration !== 0) { // Start timer only is duration is bigger than zero
      this.timer = setTimeout(() => {
        this.window.one.visible = !this.window.one.visible;
        this.window.two.visible = !this.window.two.visible;
        this.prepareNextFile();
      }, this.window[current].file.duration * 1000);
    }

    do {
      this.iterator++;
      if (this.iterator === this.files.length) {
        this.iterator = 0;
      }
    } while (this.files[this.iterator].duration < 0);

    this.window[update].file = this.files[this.iterator];
    this.updateInnerText(update);
  }

  goToNextFileNow() {
    this.window.one.visible = !this.window.one.visible;
    this.window.two.visible = !this.window.two.visible;
    this.prepareNextFile();
  }

  updateInnerText(numWindow) {
    if (this.window[numWindow].file.type.indexOf('image') !== -1) {
      this.window[numWindow].innerHTML =
        <string>this.sanitizer.bypassSecurityTrustHtml(
          `<img src="${this.window[numWindow].file.path}" class="img-fluid mx-auto d-block" style="height: 100%;">`
        );
    } else if (this.window[numWindow].file.type.indexOf('video') !== -1) {
      this.window[numWindow].innerHTML =
        <string>this.sanitizer.bypassSecurityTrustHtml(`
        <vg-player>
          <video
            [vgMedia]="media" #media id="singleVideo"
            id="${numWindow}"
            preload="auto" autoplay>
            <source src="${this.window[numWindow].file.path}" type="${this.window[numWindow].file.type}">
          </video>
        </vg-player>
        `
        );
    } else if (this.window[numWindow].file.type.indexOf('text') !== -1) {
      this.window[numWindow].innerHTML =
        <string>this.sanitizer.bypassSecurityTrustHtml(`
            <iframe *ngIf="file.type.indexOf('text') !== -1"
            style="position: absolute; height: 100%; width: 100%; border: none"
            allowtransparency="true" style="background: #FFFFFF;"
            src="${this.window[numWindow].file.path}"
            frameborder="0"
            scrolling="no">
        </iframe>
      `);
    }
  }

  public sendNotification() {
    this._notification.next(`Press <strong>1</strong> to quit full screen mode`);
  }

  forgetIt(evt) {
    evt.stopPropagation();
    evt.preventDefault();
  }

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    /*this.key = event.key;
    */
    console.log(event.key);
    if (event.key === `1`) {
      clearTimeout(this.timer );
      this._electronService.ipcRenderer.send('fullscreen', false);
      this.router.navigate(['/']);
    }
    if (event.key === `2`) {
      this.goToNextFileNow();
    }
  }

}
