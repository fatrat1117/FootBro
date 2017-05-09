import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Observable';
import { Http, Response } from '@angular/http'

import * as firebase from 'firebase';

@Injectable()
export class LocalStorage {
  constructor(private storage: Storage, private http: Http) {

  }

  getImage(url: string) {

  }

  saveToLocal() {
  }

  download() {
    let url = "https://firebasestorage.googleapis.com/v0/b/project-3416565325366537224.appspot.com/o/images%2F1kLb7Vs6G9aVum1PHZ6DWElk4nB2.png?alt=media&token=22f157cd-23e8-4c43-bc9a-1b30174f6a44";
  }
}