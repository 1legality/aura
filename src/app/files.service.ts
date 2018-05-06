import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Injectable()
export class FilesService {

  private files = new BehaviorSubject(<any>([]));
  file = this.files.asObservable();

  constructor() { }

  changeFiles(file) {
    this.files.next(file);
  }

}
