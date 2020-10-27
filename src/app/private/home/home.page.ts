import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {
  createAnimation,
  IonSlides,
  MenuController,
  ViewWillEnter,
} from '@ionic/angular';
import { TodoSummary } from 'src/app/dto/todo-summary.dto';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { TodoService } from 'src/app/services/todo.service';
import { Plugins, CameraResultType, CameraSource } from '@capacitor/core';
import { ProfileService } from 'src/app/services/profile.service';

const { Camera, Filesystem, Storage } = Plugins;

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit, ViewWillEnter {
  today = new Date();
  @ViewChild('slider') slider: IonSlides;
  @ViewChild('content', { read: ElementRef }) content: ElementRef;

  slideOpt = {
    direction: 'horizontal',
    speed: 200,
    spaceBetween: 1,
  };

  color = '#f77b67';
  colors = ['#f77b67', '#5a89e6', '#4ec5ac'];
  categories = ['personal', 'home', 'work'];
  summary: TodoSummary[];
  username: string;
  profileUrl: string;

  constructor(
    private router: Router,
    private todoService: TodoService,
    private authService: AuthenticationService,
    private menu: MenuController,
    private profileService: ProfileService
  ) {}

  ionViewWillEnter(): void {
    this.todoService
      .getTodoSummary()
      .subscribe((summary) => (this.summary = summary));

    this.loadProfileImage();
  }

  loadProfileImage() {
    this.profileService.getImage().subscribe(async (blob) => {
      this.profileUrl = await this.blobToBase64(blob);
    });
  }

  blobToBase64(blob): any {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    return new Promise((resolve) => {
      reader.onloadend = () => {
        resolve(reader.result);
      };
    });
  }

  async logout() {
    await this.authService.logout();
    this.router.navigate(['public', 'login']);
  }

  ngOnInit() {
    this.todoService
      .getTodoSummary()
      .subscribe((summary) => (this.summary = summary));

    this.authService.username.subscribe((username) => {
      this.username = username;
    });
  }

  async slideChanged() {
    const i = await this.slider.getActiveIndex();
    this.color = this.colors[i];
  }

  async openTodo() {
    const i = await this.slider.getActiveIndex();
    this.router.navigate(['private', 'todo', this.categories[i]]);
  }

  getTasksForCategory(category: string) {
    return (
      this.summary &&
      (this.summary.find((s) => s.category === category)?.total || 0)
    );
  }

  getTasksDoneForCategory(category: string) {
    return (
      this.summary &&
      (this.summary.find((s) => s.category === category)?.done || 0)
    );
  }

  getPercentageCategory(category: string) {
    if (!this.summary) {
      return 0;
    }
    const summary = this.summary.find((s) => s.category === category);
    if (!summary) {
      return 0;
    }
    const pct = (100 * summary.done) / summary.total / 100;
    return pct;
  }

  getIconForCategory(category: string) {
    switch (category) {
      case 'personal':
        return 'person';
      case 'work':
        return 'bag';
      case 'home':
        return 'home';
    }
  }

  getTodayTotalTasks() {
    return (
      this.summary &&
      this.summary.map((s) => s.total - s.done).reduce((a, b) => a + b, 0)
    );
  }

  dataURItoBlob(dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    let byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0) {
      byteString = atob(dataURI.split(',')[1]);
    } else {
      byteString = unescape(dataURI.split(',')[1]);
    }
    // separate out the mime component
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    // write the bytes of the string to a typed array
    const ia = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ia], { type: mimeString });
  }

  async changeAvatar() {
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera,
      quality: 100,
    });

    function b64toBlob(b64Data, contentType = '', sliceSize = 512) {
      const byteCharacters = atob(b64Data);
      const byteArrays = [];

      for (
        let offset = 0;
        offset < byteCharacters.length;
        offset += sliceSize
      ) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);

        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }

      const blob = new Blob(byteArrays, { type: contentType });
      return blob;
    }

    console.log(capturedPhoto);

    const data = b64toBlob(
      capturedPhoto.base64String,
      `image/${capturedPhoto.format}`
    );

    const formData = new FormData();
    formData.append('file', data, 'image.jpg');
    this.profileService
      .uploadImage(formData)
      .subscribe(() => this.loadProfileImage());
  }
}
