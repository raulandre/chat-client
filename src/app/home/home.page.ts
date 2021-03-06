import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IonContent, ToastController } from '@ionic/angular';
import Message from 'src/app/models/message.model';
import { ChatService } from '../services/chat.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  @ViewChild('list', { read: ElementRef, static: false }) public ref: ElementRef;

  public userCount: number;
  public messages: Message[];
  public message = '';
  public mobile = false;

  constructor(public cs: ChatService, public toastCtrl: ToastController) {
    this.cs.conn.on('UserCount', (count) => {
      this.userCount = count;
    })

    this.cs.conn.on('AllMessages', (messages: Message[]) => {
      messages.forEach(message => {
        message.timestamp = new Date(message.timestamp);
      });
      this.messages = messages;
      this.scrollBottom();
    });

    this.cs.conn.on('NewMessage', (message) => {
      message.timestamp = new Date(message.timestamp);
      this.messages.push(message);
      this.scrollBottom();
    });

    this.cs.conn.on('Connected', (username) => {
      this.displayToast(`${username} entered the room.`, 'person-add-sharp', 'success');
    });

    this.cs.conn.on('Disconnected', (username) => {
      this.displayToast(`${username} left.`, 'person-remove-sharp', 'danger');
    });

    this.cs.conn.on('UsernameChange', (oldUsername, newUsername) => {
      this.displayToast(`${oldUsername} is now ${newUsername}.`, 'people-sharp', 'medium');
    });
  }
  ngOnInit(): void {
    this.mobile = window.screen.width < 1366;
  }

  public sendMessage() {
    this.cs.sendMessage(this.message);
    this.message = '';
  }

  private scrollBottom() {

    if(this.ref == null) return;

    setTimeout(() => {
      this.ref.nativeElement.scrollTop = this.ref.nativeElement.scrollHeight;
    }, 1);
  }

  private async displayToast(message, icon, color) {
    const toast = await this.toastCtrl.create({
      message: message,
      icon: icon,
      position: 'top',
      duration: 1000,
      color: color
    });

    await toast.present();
  }
}
