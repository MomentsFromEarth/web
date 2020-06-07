import { Component, OnInit, OnDestroy, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { FileDropModule } from 'ngx-file-drop/lib/ngx-drop';
import * as AWS from 'aws-sdk';

import { AuthService } from '../services/auth/auth.service';
import { MomentService } from '../services/moment/moment.service';
import { StoreService } from '../services/store/store.service';
import { StoreActions as Actions } from '../services/store/store.actions';
import { StoreProps as Props } from '../services/store/store.props';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit, OnDestroy {
  file: any;
  fileUploadProgress: number = 0;
  fileUploadTotal: number = 0;
  notification: any;
  notificationTimer: any;
  momentTitle: string;
  momentDescription: string;
  @ViewChild('momentInput') momentInput: ElementRef;

  constructor (
    private changeDetectorRef: ChangeDetectorRef,
    private authService: AuthService,
    private momentService: MomentService,
    private storeService: StoreService
  ) { }

  ngOnInit() {
  }

  ngOnDestroy () {
    this.clearNotification();
  }

  public droppedMoment (evt) {
    let files = evt.files;
    let fileEntry = files && files[0] && files[0].fileEntry;
    if (fileEntry) {
      fileEntry.file(info => {
        this.file = info;
        console.log('droppedMoment', 'size', this.file.size);
        console.log('droppedMoment', 'name', this.file.name);
        console.log('droppedMoment', 'type', this.file.type);
        this.changeDetectorRef.markForCheck();
      });
    }
  }

  public fileSize () {
    return this.file && this.file.size;
  }

  public fileName () {
    return this.file && this.file.name;
  }

  public fileType () {
    return this.file && this.file.type;
  }

  public selectedMoment (file) {
    if (file) {
      this.file = file;
      console.log('selectedMoment', 'size', this.file.size);
      console.log('selectedMoment', 'name', this.file.name);
      console.log('selectedMoment', 'type', this.file.type);
      let reader = new FileReader();
      reader.readAsBinaryString(this.file); 
      this.changeDetectorRef.markForCheck();
    }
  }

  public notify (type: string, message: string) {
    this.notification = { type: type, message: message };
    this.notificationTimer = setTimeout(() => this.notification = null, 10000);
  }

  public clearNotification () {
    this.notification = null;
    clearTimeout(this.notificationTimer);
  }

  s3Client (awsCreds) {
    return new AWS.S3({ 
      apiVersion: '2006-03-01',
      accessKeyId: awsCreds.accessKeyId,
      secretAccessKey: awsCreds.secretAccessKey,
      sessionToken: awsCreds.sessionToken
    });
  }

  ext (filename) {
    return filename && filename.split('.').pop().toLowerCase();
  }

  queueMomentName () {
    let profile = this.storeService.get(Props.App.Profile);
    return `${profile.user_id}.${(new Date()).valueOf()}.${this.ext(this.file.name)}`;
  }

  getProgress (progress) {
    return Math.round((progress.loaded / progress.total) * 100);
  }

  momentCreator () {
    let profile = this.storeService.get(Props.App.Profile);
    return profile && profile.user_id;
  }

  formatMoment (filename) {
    return {
      queue_id: filename,
      title: this.momentTitle,
      description: this.momentDescription,
      original_filename: this.file.name,
      size: this.file.size,
      type: this.file.type,
      creator: this.momentCreator()
    };
  }

  addMoment () {
    let filename = this.queueMomentName();
    this.authService.login().then(awsCreds => {

      this.s3Client(awsCreds).upload({
        Bucket: 'upload.momentsfrom.earth',
        Key: filename,
        Body: this.file,
        ACL: 'public-read'
      }, (err, data) => {
        if (err) {
          console.error(err);
          return this.notify('danger', 'There was an problem uploading your moment. Please try again.');
        }
        
        this.momentService.add(this.formatMoment(filename)).then(moment => {
          this.notify('success', 'Thank you. Moment was added.');
          console.log(moment);
        }).catch(err => {
          this.notify('danger', 'There was a problem adding your moment. Please try again.');
          console.error(err);
        });

      }).on('httpUploadProgress', progress => {
        if (progress.loaded && progress.total) this.fileUploadProgress = this.getProgress(progress);
      });

    }).catch(console.error);
  }

  uploadMoment () {
    this.addMoment();
  }

}
