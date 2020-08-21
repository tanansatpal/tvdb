import { Injectable } from '@nestjs/common';

interface SortData {
  [key: string]: any;
}

@Injectable()
export class SortService {

  mergeSort(originalArray, key) {

    function sort(array) {
      if (array.length <= 1) {
        return array;
      }
      const middle = Math.floor(array.length / 2);
      const leftArray = array.slice(0, middle);
      const rightArray = array.slice(middle, array.length);
      return mergeSortedArrays(sort(leftArray), sort(rightArray), key);
    }

    function mergeSortedArrays(leftArray, rightArray, key) {
      const sortedArray = [];
      while (leftArray.length && rightArray.length) {
        if (leftArray[0][key] < rightArray[0][key]) {
          sortedArray.push(leftArray.shift());
        } else {
          sortedArray.push(rightArray.shift());
        }
      }
      return sortedArray.concat(leftArray).concat(rightArray);
    }

    return sort(originalArray);

  }

  public sortData(data: SortData[], key: string): any[] {
    return this.mergeSort(data, key);
  }
}
