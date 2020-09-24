import { Component, OnInit } from '@angular/core';
import { NavPayloadService } from 'src/app/services/nav-payload.service';
import { HttpClient } from '@angular/common/http';
import { UtilsService } from 'src/app/services/utils.service';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-forum',
  templateUrl: './forum.page.html',
  styleUrls: ['./forum.page.scss'],
})
export class ForumPage implements OnInit {
  course: any;
  threads: any;
  role: string;

  constructor(public navPayload: NavPayloadService,
              private http: HttpClient,
              public utils: UtilsService,
              public router: Router,
              public storage: StorageService) { }

  async ngOnInit() {
    // get courseID from parent, then get course from storage
    const courseID = this.navPayload.get().courseID;
    this.course = await this.storage.getCourse(courseID);
    // get user role
    this.http.get('http://192.168.1.175:3000/token/').subscribe(res => {
      this.role = res[`role`];
    });

  }
  async ionViewWillEnter() {
    const courseID = this.navPayload.get().courseID;
    this.course = await this.storage.getCourse(courseID);
    const url = 'http://192.168.1.175:3000/threads/' + this.course.moduleID;
    this.http.get(url).subscribe(res => {
      this.threads = res;
    });
  }

  navigateToThread(thread) {
    this.navPayload.set({
      courseID: this.course.moduleID,
      thread
    });
    this.router.navigate(['users/courses/course/forum/thread/' + thread.threadID]);
  }


  constructThread() {
    this.navPayload.set({
      courseID: this.course.moduleID
    });
    this.router.navigate(['users/courses/course/forum/create-thread/']);
  }

}
