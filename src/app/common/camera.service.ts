import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { Camera, Crop } from 'ionic-native';

@Injectable()
export class CameraService {

  public options: any = {
        allowEdit: true,
        quality: 75,
        sourceType: Camera.PictureSourceType.SAVEDPHOTOALBUM,
        mediaType: Camera.MediaType.ALLMEDIA,
        destinationType: Camera.DestinationType.FILE_URI
  }
  
  constructor(public platform: Platform) {}

  // Return a promise to catch errors while loading image
  getMedia(): Promise<any> {
    // Get Image from ionic-native's built in camera plugin
    return Camera.getPicture(this.options)
      .then((fileUri) => {
        // Crop Image, on android this returns something like, '/storage/emulated/0/Android/...'
        // Only giving an android example as ionic-native camera has built in cropping ability
        if (this.platform.is('ios')) {
          return fileUri
        } else if (this.platform.is('android')) {
          // Modify fileUri format, may not always be necessary
          fileUri = 'file://' + fileUri;

          /* Using cordova-plugin-crop starts here */
          return Crop.crop(fileUri);
        }
      })
      .then((path) => {
        // path looks like 'file:///storage/emulated/0/Android/data/com.foo.bar/cache/1477008080626-cropped.jpg?1477008106566'
        //console.log('Cropped Image Path!: ' + path);
        return path;
      })
  }
}  