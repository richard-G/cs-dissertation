import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, NavController } from '@ionic/angular';
import { NavPayloadService } from 'src/app/services/nav-payload.service';
import { StorageService } from 'src/app/services/storage.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-text-modal',
  templateUrl: './text-modal.page.html',
  styleUrls: ['./text-modal.page.scss'],
})
export class TextModalPage implements OnInit {
  course: any;
  thread: any;
  threadID: string;
  parentComment: any;
  private form: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private http: HttpClient,
              public activatedRoute: ActivatedRoute,
              public utils: UtilsService,
              public navPayload: NavPayloadService,
              public alertController: AlertController,
              public router: Router,
              public storage: StorageService,
              public navCtrl: NavController) {
    this.form = this.formBuilder.group({
      text: ['', Validators.required]
    });
  }

  async ngOnInit() {
    this.threadID = this.activatedRoute.snapshot.paramMap.get('id');
    // console.log('thread id: ', this.threadID);
    const payload = this.navPayload.get();
    const courseID = payload['courseID'];
    this.course = await this.storage.getCourse(courseID);
    this.thread = payload['thread'];
    this.parentComment = payload['parentComment'];
    console.log('parent comment: ', this.parentComment);
  }

  postComment() {
    // construct payload
    const payload = this.form.value;
    // trim comment whitespace
    payload.text = payload.text.trim();
    payload.threadID = this.threadID;
    // set parent comment id in payload if there is one
    if (this.parentComment) {
      payload.parentID = this.parentComment.commentID;
    }

    const url = 'http://192.168.1.175:3000/comments/';
    this.http.post(url, payload).subscribe(
      res => {
        this.handleSuccess();
      },
      err => {
        this.handleError(err);
      });
  }

  async handleSuccess() {
    const alert = await this.alertController.create({
      header: 'Success',
      message: 'Your comment has been successfully submitted.',
      buttons: [{
        text: 'Return to thread',
        handler: () => {
          this.navPayload.set({
            courseID: this.course.moduleID,
            thread: this.thread
          });
          this.router.navigate(['users/courses/course/forum/thread/' + this.thread.threadID]);
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
