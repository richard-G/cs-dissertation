import { Component, OnInit } from '@angular/core';
import { NavPayloadService } from 'src/app/services/nav-payload.service';
import { HttpClient } from '@angular/common/http';
import { UtilsService } from 'src/app/services/utils.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSheetController, AlertController, ModalController } from '@ionic/angular';
import { TextModalPage } from './text-modal/text-modal.page';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-thread',
  templateUrl: './thread.page.html',
  styleUrls: ['./thread.page.scss'],
})
export class ThreadPage implements OnInit {
  course: any;
  threadID: string;
  comments: any;
  thread: any;
  role: string;
  bookmarked: boolean;    // if thread is bookmarked, initialised to false

  constructor(public navPayload: NavPayloadService,
              private http: HttpClient,
              public utils: UtilsService,
              public route: ActivatedRoute,
              public modalController: ModalController,
              public router: Router,
              public actionSheetController: ActionSheetController,
              public alertController: AlertController,
              public storage: StorageService) {

                // activatedRoute.params.subscribe(id => {
                //   this.threadID = id;
                // })
  }

  ngOnInit() {
    this.http.get('http://192.168.1.175:3000/token/').subscribe(res =>{
      this.role = res['role'];
    })
  }

  async ionViewWillEnter() {
    this.threadID = this.route.snapshot.paramMap.get('id');
    const payload = this.navPayload.get();
    const courseID = payload.courseID;
    this.course = await this.storage.getCourse(courseID);
    this.thread = payload.thread;
    this.bookmarked = this.thread.bookmarked;
    const url = 'http://192.168.1.175:3000/comments/' + this.threadID;

    this.http.get(url).subscribe(res => {
      this.comments = this.transformComments(res);
    });
  }


  // transforms the comments [object] into a new [object] with parent/child hierarchy
  transformComments(comments: any) {
    comments.forEach(comment => {
      if (comment.parentID) {
        // find parent of comment, add child to parent object in the array "children"
        const parent = comments.find(parent => parent.commentID === comment.parentID);
        if (parent.children) {
          parent.children.push(comment);
        } else {
          parent.children = [comment];
        }
      }
    });
    const top = comments.filter(comment => comment.parentID === null);
    return top;
  }

  async constructComment(parentComment) {
    console.log('post comment button pressed');

    // construct nav payload to be sent to child page
    this.navPayload.set({
      courseID: this.course.moduleID,
      thread: this.thread,
      parentComment
    });

    // this.router.navigate(['users/courses/course/forum/thread/' + this.thread.threadID + '/text-modal/']);
    // this.router.navigate(['users/courses/course/forum/thread/text-modal/']);
    this.router.navigate(['../text-modal'], { relativeTo: this.route });

  }

  // brings up an action sheet when a comment is selected, options: reply, give kudos, cancel
  async triggerActionSheet(comment: any) {
    const actionSheet = await this.actionSheetController.create({
      buttons: [
        {
          text: 'Reply',
          handler: () => {
            console.log('reply clicked');
            this.constructComment(comment);
          }
        },
        {
          text: 'Give Kudos',
          handler: () => {
            this.giveKudos(comment);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }]
    });
    await actionSheet.present();
  }

  async giveKudos(comment) {
    const url = 'http://192.168.1.175:3000/votes/';
    const payload = {commentID: comment.commentID};
    this.http.post(url, payload).subscribe(res => {
      // updates the comment score after giving/removing kudos
      if (res['message'] === 'comment upvoted') {
        comment.score += 1;
      } else {
        comment.score -= 1;
      }
    });
  }

  async bookmarkThread(thread) {
    const url = 'http://192.168.1.175:3000/bookmark-thread/';
    const payload = {threadID: thread.threadID};
    this.http.post(url, payload).subscribe(async res => {
      console.log('response: ', res);
      // toggle bookmark
      this.bookmarked = !this.bookmarked;
      const alert = await this.alertController.create({
        header: 'Success',
        message: res['message'],
        buttons: [{
          text: 'Okay'
        }]
      });
      await alert.present();
    });
  }

  async initDeleteThread() {
    console.log('init delete thread pressed');
    const alert = await this.alertController.create({
      header: 'Warning',
      message: 'Are you sure you want to delete this thread?',
      buttons: [{
        text: 'Yes',
        handler: () => {
          const url = 'http://192.168.1.175:3000/delete-thread/';
          const payload = {threadID: this.threadID};
          this.http.post(url, payload).subscribe(res => {
            console.log('response: ', res);
          });
          this.navPayload.set({
            courseID: this.course.moduleID
          });
          this.router.navigate(['users/courses/course/forum/']);
        }
      }, {
        text: 'No',
        role: 'cancel'
      }]
    });
    await alert.present();
  }

}
