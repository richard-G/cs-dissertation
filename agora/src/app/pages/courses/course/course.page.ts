import { Component, OnInit, Input } from '@angular/core';
import { NavPayloadService } from 'src/app/services/nav-payload.service';
import { UtilsService } from 'src/app/services/utils.service';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/services/storage.service';
import { HttpClient } from '@angular/common/http';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-course',
  templateUrl: './course.page.html',
  styleUrls: ['./course.page.scss'],
})
export class CoursePage implements OnInit {

  // courseID: string;
  course: any;
  toggled: boolean = false;
  toggledParticipants: boolean = true;
  participants: any;
  user: any;

  constructor(public navPayload: NavPayloadService,
              public utils: UtilsService,
              public router: Router,
              public storage: StorageService,
              public http: HttpClient,
              public modalController: ModalController) {
  }

  async ngOnInit() {
    const courseID = this.navPayload.get().courseID;
    this.course = await this.storage.getCourse(courseID);

    // if course description exists, expand the accordion
    if (this.course.description) {
      this.toggled = !this.toggled;
    }
    const url = 'http://192.168.1.175:3000/participants/' + this.course.moduleID;

    this.http.get(url).subscribe(res => {
      console.log('response: ', res);
      // sort students by last name, then first name
      this.participants = this.utils.sortNames(res);
    });
  }

  navigateToForum() {
    this.navPayload.set({courseID: this.course.moduleID});
    this.router.navigate(['users/courses/course/forum']);
  }

  // triggers when module description is clicked, toggles the accordion for module description
  toggleDescription() {
    this.toggled = !this.toggled;
  }

  toggleParticipants() {
    this.toggledParticipants = !this.toggledParticipants;
  }

}
