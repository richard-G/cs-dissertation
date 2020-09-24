import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilsService } from 'src/app/services/utils.service';
import { Router } from '@angular/router';
import { NavPayloadService } from 'src/app/services/nav-payload.service';
import { StorageService } from 'src/app/services/storage.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  user: any;
  achievements: any;
  threads: any;

  toggled: boolean = true;
  toggledBookmarks: boolean = true;


  constructor(public http: HttpClient,
              public utils: UtilsService,
              public router: Router,
              public navPayload: NavPayloadService,
              public storage: StorageService,
              public alertController: AlertController) { }

  ngOnInit() {

  }

  ionViewWillEnter() {
    // get user info from server
    const url = 'http://192.168.1.175:3000/users';
    this.http.get(url).subscribe(
      res => {
        this.user = res;
      },
      err => {
        this.handleError(err);
      });
    // get achievements from server
    const urlAchievements = 'http://192.168.1.175:3000/achievements';
    this.http.get(urlAchievements).subscribe(
      res => {
        this.achievements = res;
      },
      err => {
        //this.handleError(err);
      });
    // get bookmarks from server
    const urlBookmarks = 'http://192.168.1.175:3000/bookmark-thread/';
    this.http.get(urlBookmarks).subscribe(
      async res => {
        this.threads = await this.appendCourseName(res);
      },
      err => {
        //this.handleError(err);
      });
  }

  async handleError(error) {
    let message;
    if (error.status === 401) {
      this.router.navigate(['login'], { replaceUrl: true });
    } else {
      message = 'Network error. Please check your internet connection.';
    }
    const alert = await this.alertController.create({
      header: 'Error',
      message,
      buttons: [{
        text: 'Okay',
        role: 'cancel'
      }]
    });
    await alert.present();
  }

  toggleAchievements() {
    this.toggled = !this.toggled;
  }

  toggleBookmarks() {
    this.toggledBookmarks = !this.toggledBookmarks;
  }

  navigateToThread(thread) {
    this.navPayload.set({
      thread,
      courseID: thread.moduleID
    });
    this.router.navigate(['users/courses/course/forum/thread/' + thread.threadID]);
  }

  // appends course name to each thread
  async appendCourseName(threads) {
    threads.forEach(async (thread, index) => {
      const course = await this.storage.getCourse(thread.moduleID);
      threads[index].name = course.name;
    });

    return threads;
  }

}
