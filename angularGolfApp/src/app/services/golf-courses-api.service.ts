import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { HttpClient } from '@angular/common/http';
import { Course } from '../interfaces/course'

@Injectable({
	providedIn: 'root'
})
export class GolfCoursesApiService {

	constructor(
		private http: HttpClient,
	) { }
	getCourses(): Observable<object> {
		return this.http.get("https://golf-courses-api.herokuapp.com/courses")
	}
	getCourse(c: string): Observable<object> {
		return this.http.get("https://golf-courses-api.herokuapp.com/courses/" + c)
	}
}
