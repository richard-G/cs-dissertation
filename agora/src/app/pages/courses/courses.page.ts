import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { NavPayloadService } from 'src/app/services/nav-payload.service';
import { UtilsService } from 'src/app/services/utils.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.page.html',
  styleUrls: ['./courses.page.scss'],
})
export class CoursesPage implements OnInit {

  courses: any;

  constructor(private http: HttpClient,
              public navCtrl: NavController,
              public router: Router,
              public navPayload: NavPayloadService,
              public utils: UtilsService,
              public storage: StorageService) { }

  async ngOnInit() {
    // attempt to get courses from storage, then make server request for courses array
    this.courses = await this.storage.getCourses();
    const url = 'http://192.168.1.175:3000/courses';
    this.http.get(url).subscribe(
      response => {
        if (response) {
          if (this.courses !== response) {
            this.courses = response;
            this.storage.updateCache(this.courses);
          }
        }
      },
      err => {
        if (err.status === 401) {
          this.navCtrl.navigateRoot(['login']);
        } else {
          // user is offline (or server error)
          console.log('server error, error: ', err);
        }
      }
    );
  }

  // passes course object to child component (course page)
  navigateCourse(course) {
    this.navPayload.set({courseID: course.moduleID});
    this.navCtrl.navigateForward('users/courses/course');
  }

}
