import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'addArray'
})
export class AddArrayPipe implements PipeTransform {
	transform(value: number[], begin?: number, end?: number): number {
		let num: number = 0
		let newArray: number[] = value.slice(begin ? begin : 0, end ? end : value.length)
		newArray.forEach(e => num += Number(e))
		return num
	}

}
