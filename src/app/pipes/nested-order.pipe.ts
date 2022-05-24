import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'nestedOrder'
})
export class NestedOrderPipe implements PipeTransform {

  transform(array: Array<any>, field1: string, field2: string, order?: string) {
    if (array && field1 && field2) {
      if (order === 'asc') {
        return array.sort( (a, b) => {
          if (a[field1][field2] < b[field1][field2]) { return -1; }
          if (a[field1][field2] > b[field1][field2]) { return 1; }
          return 0;
        });
      } else {
        return array.sort( (a, b) => {
          if (a[field1][field2] > b[field1][field2]) { return -1; }
          if (a[field1][field2] < b[field1][field2]) { return 1; }
          return 0;
        });
      }
    } else {
      return array;
    }
  }

}
