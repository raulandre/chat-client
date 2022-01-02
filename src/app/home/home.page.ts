import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import Message from 'src/app/models/message.model';
import { ChatService } from '../services/chat.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  private userCount: number;
  private messages: Message[];
  public message = '';

  constructor(private cs: ChatService) {
    this.cs.conn.on('UserCount', (count) => {
      this.userCount = count;
    })

    this.cs.conn.on('AllMessages', (messages) => {
      this.messages = messages;
    });

    this.cs.conn.on('NewMessage', (message) => {
      this.messages.push(message);
      if (this.messages.length >= 18) {
        this.messages.shift();
      }
    })
  }

  public sendMessage() {
    this.cs.sendMessage(this.message);
    this.message = '';
  }
}
