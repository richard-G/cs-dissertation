import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { NavPayloadService } from 'src/app/services/nav-payload.service';
import { StorageService } from 'src/app/services/storage.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-create-thread',
  templateUrl: './create-thread.page.html',
  styleUrls: ['./create-thread.page.scss'],
})
export class CreateThreadPage implements OnInit {
  course: any;
  private form: FormGroup;


  constructor(private formBuilder: FormBuilder,
              private http: HttpClient,
              public activatedRoute: ActivatedRoute,
              public utils: UtilsService,
              public navPayload: NavPayloadService,
              public alertController: AlertController,
              public router: Router,
              public storage: StorageService) {
                this.form = this.formBuilder.group({
                  title: ['', Validators.required]
                });
              }

  async ngOnInit() {
    const payload = this.navPayload.get();
    const courseID = payload.courseID;
    this.course = await this.storage.getCourse(courseID);
  }

  postThread() {
    console.log(this.form.value);
    const payload = this.form.value;
    payload.moduleID = this.course.moduleID;
    // make network request
    const url = 'http://192.168.1.175:3000/threads/';
    this.http.post(url, payload).subscribe(
      res => {
        this.handleSuccess();
      },
      err => {
        this.handleError(err);
      }
    );
  }

  async handleSuccess() {
    const alert = await this.alertController.create({
      header: 'Success',
      message: 'New thread created.',
      buttons: [{
        text: 'Return to course forum',
        handler: () => {
          this.navPayload.set({courseID: this.course.moduleID});
          this.router.navigate(['users/courses/course/forum/']);
        }
      }]
    });
    await alert.present();
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

}
