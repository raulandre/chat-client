import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';

@Injectable({
    providedIn: 'root'
})
export class ChatService {
    
    public readonly url = '';
    public conn: signalR.HubConnection;
    public connected: boolean;
    public username: string;
    public usernameSet: boolean;

    public oldUsername: string;

    constructor() {
        this.connect();
    }

    public async connect() {
        this.conn = new signalR.HubConnectionBuilder()
            .configureLogging(signalR.LogLevel.None)
            .withUrl(this.url, {
                skipNegotiation: true,
                transport: signalR.HttpTransportType.WebSockets
            })
            .build();

        await this.conn.start()
            .then(
                () => {
                    this.connected = true;
                    this.conn.send('GetAllMessages');
                },
                () => {
                    this.connected = false;
                     alert('failed to connect! D:');
                }
            );

        this.loadUsername();
    }

    public loadUsername() {
        if (localStorage.getItem('username')) {
            this.username = localStorage.getItem('username');
            this.usernameSet = true;
            this.conn.send("UserConnected", this.username);
        }
    }

    public setUsername() {
        if(this.username.trim()) {
            if(this.oldUsername) {
                this.conn.send('UsernameChange', this.oldUsername, this.username.trim());
            }
            else {
                this.conn.send("UserConnected", this.username);
            }
            localStorage.setItem('username', this.username);
            this.usernameSet = true;
        }
    }

    public sendMessage(message: string) {
        if(this.connected && message.trim()) {
            this.conn.send('PostMessage', this.username, message);
        }
    }

    public clearUsername() {
        this.oldUsername = this.username;
        this.conn.send("UsernameChange", this.username);
        localStorage.removeItem('username');
        this.username = '';
        this.usernameSet = false;
    }
}