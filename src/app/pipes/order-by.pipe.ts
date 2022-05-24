import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderBy'
})
export class OrderByPipe implements PipeTransform {

  transform(array: Array<any>, type: string, order?: string) {
    if (array) {
      if (order === 'asc') {
        return array.sort( (a, b) => {
          if (a[type] < b[type]) { return -1; }
          if (a[type] > b[type]) { return 1; }
          return 0;
        });
      } else {
        return array.sort( (a, b) => {
          if (a[type] > b[type]) { return -1; }
          if (a[type] < b[type]) { return 1; }
          return 0;
        });
      }
    }
  }

}
