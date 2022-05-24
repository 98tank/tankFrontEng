import { Pipe, PipeTransform } from '@angular/core';
import { MissionData } from '../models';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
    // this pipe is used to filter categories
  transform(arr: MissionData[], prop: string, value: string): MissionData[] {
      if ( value === 'all' ) { return arr; }
      return arr.filter( filtrado => filtrado[prop] === value);
    }
  }


