import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { FilesService } from '../files.service';
import { DomSanitizer } from '@angular/platform-browser'; // required on Windows (else it shows unsafe file)
import { NgZone } from '@angular/core';
import {ElectronService} from 'ngx-electron';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.css'],
})
export class SetupComponent implements OnInit {

  files = [];
  playlists: any = [];
  selected = '';

  constructor(private sanitizer: DomSanitizer,
              private _ngZone: NgZone,
              private _files: FilesService,
              private route: ActivatedRoute,
              private router: Router,
              private _electronService: ElectronService) {

  }

  ngOnInit() {
    // retrieve saved playlists
    if (this._electronService.isElectronApp) {
      this.playlists = this._electronService.ipcRenderer.sendSync('getAll', '');
    }

    this._files.file.subscribe(res => this.files = res);
  }

  handleDragOver(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
  }

  handleDrop(evt) {
    evt.stopPropagation();
    evt.preventDefault();

    const files = evt.dataTransfer.files; // FileList object.

    if (files.length > 0) {
      this.addFiles(files);
    }
  }

  handleFileButton(evt) {
    const files = evt.target.files; // FileList object

    if (files.length > 0) {
      this.addFiles(files);
    }
  }

  addFiles(files) {
    for (let i = 0, f; f = files[i]; i++) {
      console.log(f);

      // This is really hacky... this is a way to get video duration.
      // found on https://stackoverflow.com/questions/35228348/get-duration-of-local-video-selected-using-angular
      if (f.type.indexOf('video') !== -1) {
        const video = document.createElement('video');
        video.preload = 'metadata';
        video.onloadedmetadata = () =>  {
          window.URL.revokeObjectURL(video.src);

          // Create file object with the needed properties
          const file = {
            duration: video.duration,
            name: f.name,
            path: f.path,
            type: f.type,
            size: f.size,
            lastModified : f.lastModified
          };

          this.files.push(file);
          this._files.changeFiles(this.files);
          this._ngZone.run(() => {}); // update the view

          console.log('loading');
        };
        video.src = f.path;
      } else {

        const file = {
          duration: 5,
          name: f.name,
          path: f.path,
          type: f.type,
          size: f.size,
          lastModified : f.lastModified
        };

        this.files.push(file);
        this._files.changeFiles(this.files);
      }
    }
    console.log('files added');
  }

  removefile(i) {
    this.files.splice(i, 1);
    this._files.changeFiles(this.files);
  }

  changeSecs(evt, i) {
    this.files[i].duration = +evt.target.value;
    this._files.changeFiles(this.files);
  }

  playMedias() {
    this.router.navigate(['/player']);
  }

  // Save the playlist (use electron-json-storage)
  save(evt) {
    if (this._electronService.isElectronApp) {
      this._electronService.ipcRenderer.sendSync('save', {name: evt, data: this.files});

      // Don't add the playlist to the array if it already exists
      const index = this.playlists.indexOf(evt, 0);
      if (index === -1) {
        this.playlists.push(evt);
        this.selected = evt;
      }
    }
  }

  changeSavedPlaylist(evt) {
    if (this._electronService.isElectronApp) {
      if (evt.target.value !== '') {
        this.selected = evt.target.value;
        this.files = this._electronService.ipcRenderer.sendSync('get', evt.target.value);
        this._files.changeFiles(this.files);
      } else {
        if (this.selected !== '') { // Don't erase playlist if user has not requested it.
          this.selected = '';
          this.files = [];
          this._files.changeFiles(this.files);
        }
      }

      console.log(this.selected);
    }
  }

  removeSavedPlaylist() {
    if (this._electronService.isElectronApp && this.selected !== '') {
      this._electronService.ipcRenderer.sendSync('remove', this.selected);

      const index = this.playlists.indexOf(this.selected, 0);
      this.playlists.splice(index, 1);
      this.selected = '';
      this.files = [];
      this._files.changeFiles(this.files);
    }
  }

  emptyPlaylist() {
    this.files = [];
    this._files.changeFiles(this.files);
  }
}
