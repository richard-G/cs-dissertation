import { Injectable } from '@angular/core';
import { Plugins } from '@capacitor/core';
const { Storage } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }


  // GET list of courses from phone storage. return either this or an empty list if empty
  async getCourses() {
    const ret = await Storage.get({key: 'courses'});
    return JSON.parse(ret.value) || [];
  }

  // updates list of courses in storage, call if there is an inconsistency with the server response
  async updateCache(courses: any) {
    await Storage.set({
      key: 'courses',
      value: JSON.stringify(courses)
    });
  }

  // clears the courses array from storage, called on logout
  async clearCache() {
    await Storage.remove({key: 'courses'});
  }

  // returns a course object from storage on being given the course ID
  async getCourse(id: string) {
    const courses = await this.getCourses();
    const course = courses.find(course => {
      return course.moduleID === id;     // maybe double equals here? might be INT : STR
    });

    return course;
  }
}
