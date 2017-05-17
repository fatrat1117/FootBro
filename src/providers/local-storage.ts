import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Observable';
import { Transfer, TransferObject } from '@ionic-native/transfer';
import { Platform } from 'ionic-angular';
import { File } from '@ionic-native/file';

import * as firebase from 'firebase';

@Injectable()
export class LocalStorage {

  constructor(private storage: Storage, private transfer: Transfer, private file: File, private platform: Platform) {

  }

  getImage(url: string, success, fail) {
    // null
    if (!url) {
      console.log("URL is null");
      //success("assets/img/none.png");
      fail(-1)
      return;
    }

    // non-mobile
    if (this.platform.is('mobileweb') || this.platform.is('core')) {
      console.log("Non-mobile");
      success(url);
      return;
    }

    // is local path
    if (!url.startsWith("http") && !url.startsWith("https")) {
      console.log("URL is local path: " + url);
      success(url)
      return;
    }

    this.storage.ready().then(() => {
      this.storage.get(url).then((path: string) => {
        //console.log('storage get', url, path);
        // found key-value
        if (path && path.includes(this.file.cacheDirectory)) {
          // file name = 36(UUID) + 4 (.jpg)
          var fileName = path.substr(path.length - 40);
          console.log("Try to get from cache: " + path + "\nFile name: " + fileName);

          // check if file exist in cache
          this.file.checkFile(this.file.cacheDirectory, fileName).then(_ => {
            console.log("Found file in cache.")
            success(path);
          }).catch(_ => {
            console.log('File doesnt exist in cache')
            this.download(url, success, fail);
          })
        }
        else {
          this.download(url, success, fail);
        }
      });
    });
  }

  download(url, success, fail) {
    console.log("Download from server: " + url);
    
    let fileTransfer: TransferObject = this.transfer.create();
    let name = this.generateUUID() + '.jpg';
    fileTransfer.download(url, this.file.cacheDirectory + name).then((entry) => {
      this.saveToLocal(url, entry.toURL(), success);
    }, (error) => {
      // handle error
      fail(error['http_status'])
      console.log("Download error: " + error['http_status'])
    });
  }

  saveToLocal(url, path, success) {
    this.storage.ready().then(() => {
      this.storage.set(url, path);
      console.log("Saved to cache:" + path);
      success(path);
    })
  }

  generateUUID() { // Public Domain/MIT
    var d = new Date().getTime();
    if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
      d += performance.now(); //use high-precision timer if available
    }
    // length = 36
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
  }
}