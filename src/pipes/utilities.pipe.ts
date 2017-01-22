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
