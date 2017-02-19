import {Pipe, PipeTransform} from '@angular/core';

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
    if (map)
    {
      let arr = [];
      for (let key in map)
      {
        arr.push(map[key])
      }

      console.log(arr);
      return arr;
    }
  }
}
