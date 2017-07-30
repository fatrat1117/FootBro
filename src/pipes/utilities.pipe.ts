import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer} from '@angular/platform-browser';

@Pipe({
  name: 'reversePipe'
})

export class ReversePipe implements PipeTransform {
  constructor() {
  }

  transform(arr) {
    if (arr) {
      return arr.reverse();
    }
  }
}

@Pipe({
  name: 'mapToArrayPipe'
})

export class MapToArrayPipe implements PipeTransform {
  constructor() {
  }

  transform(map) {
    if (map) {
      let arr = [];
      for (let key in map) {
        arr.push(map[key])
      }

      console.log(arr);
      return arr;
    }
  }
}


@Pipe({
  name: 'groupThreePipe'
})

export class GroupThreePipe implements PipeTransform {
  constructor() {
  }

  transform(arr) {

    let newArr = [];
    if (arr) {
      let a = [];
      for (let i = 1; i <= arr.length; ++i) {
        a.push(arr[i-1]);
        if (i % 3 == 0) {
          newArr.push(a);
          a = [];
        }
      }
      if (a.length > 0){
        newArr.push(a);
      }
    console.log(newArr);
      return newArr;
    }
  }
}

@Pipe({
  name: 'groupNPipe',
  pure: false
})

export class GroupNPipe implements PipeTransform {
  constructor() {
  }

  transform(arr,numPerRow) {
    let rowArray = [];
    if (arr) {
     let rowItem = [];
      for (let i = 0; i < arr.length; i++) {
        rowItem.push(arr[i]);
        //rowItem.push(i);
        if (( i + 1) % numPerRow == 0) {
          rowArray.push(rowItem);
          rowItem = [];
        }
      }
      if(rowItem.length > 0){
         rowArray.push(rowItem);
      }
    }
    return rowArray;
  }
}

@Pipe({
  name: 'ifNullThenZeroPipe',
})

export class IfNullThenZeroPipe implements PipeTransform{
  constructor(){
  }
  transform(data){
    if (!data && data!=0){
      return 0;
    }else{
      return data;
    }
  }
}

@Pipe({ name: 'safe' })
export class SafePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}
  transform(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
} 
