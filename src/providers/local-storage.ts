import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Observable';
import { Transfer, FileUploadOptions, TransferObject } from '@ionic-native/transfer';
import { File } from '@ionic-native/file';

import * as firebase from 'firebase';

@Injectable()
export class LocalStorage {

  constructor(private storage: Storage, private transfer: Transfer, private file: File) {

  }

  getImage(url, id, success) {
    this.storage.ready().then(() => {
       // Or to get a key/value pair
       this.storage.get(url).then((path) => {
         if (path) {
           success(path);
         }
         else {
           this.download(url, id, success);
         }
       });
    });
  }

  download(url, id, success) {
    let fileTransfer: TransferObject = this.transfer.create();
    fileTransfer.download(url, this.file.cacheDirectory + id +'.png').then((entry) => {
      console.log('download complete: ' + entry.toURL());
      this.saveToLocal(url, entry.toURL(), success);
    }, (error) => {
      // handle error
      console.log(error);
    });
    this.file.getFile
  }

  saveToLocal(url, path, success) {
     this.storage.ready().then(() => {
       this.storage.set(url, path);
       success(path);
     })
  }
}