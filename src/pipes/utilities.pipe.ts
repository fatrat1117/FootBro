import { Pipe, PipeTransform } from '@angular/core';

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
    
    if (arr) {
      let newArr = [];
      let a = [];
      for (let i = 1; i <= arr.length; ++i) {
        a.push(arr[i]);
        if (i % 3 == 0) {
          newArr.push(a);
          a = []
        }
      }
    console.log(newArr);
      return newArr;
    }
  }
}
