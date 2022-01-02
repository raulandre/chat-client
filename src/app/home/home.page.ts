import { Component } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import Message from 'src/models/message.model';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  private readonly url = '';
  private conn: signalR.HubConnection;
  private connected = false;

  private messages: Message[];
  public message = '';
  private username = '';
  private usernameSet = false;

  constructor() {

    if(localStorage.getItem('username')) {
      this.username = localStorage.getItem('username');
      this.usernameSet = true;
    }

    this.conn = new signalR.HubConnectionBuilder()
      .withUrl(this.url, {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets
      })
      .build();
    
    this.conn.on('AllMessages', (messages) => {
      this.messages = messages;
    });

    this.conn.on('NewMessage', (message) => {
      this.messages.push(message);
      if (this.messages.length >= 18) {
        this.messages.shift();
      }
    })

    this.conn.start()
      .then(
        () => {
          this.connected = true;
          this.conn.send('GetAllMessages');
        },
        () => {
          this.connected = false;
          alert('connection failed!');
        }
      );
  }

  public sendMessage() {
    if(this.connected && this.message.trim()) {
      this.conn.send('PostMessage', this.username, this.message);
      this.message = '';
    }
  }

  public setUsername() {
    if(this.username) {
      localStorage.setItem('username', this.username);
      this.usernameSet = true;
    }
  }
}
