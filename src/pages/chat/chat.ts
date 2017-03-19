import { Component, Directive, ViewChild } from '@angular/core';
import { Keyboard } from 'ionic-native';
import { NavController, NavParams, Content } from 'ionic-angular';

import { MomentPipe } from '../../pipes/moment.pipe'
import * as moment from 'moment';
import { FirebaseListObservable } from 'angularfire2';

import { Localization } from '../../providers/localization';
import { Chat } from '../../app/chats/shared/chat.model'
import { ChatService } from '../../app/chats/chat.service'
import { Player } from '../../app/players/player.model';



@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
  providers: [ChatService]
})

@Directive({
  selector: '[keyboardAttach]'
})
export class ChatPage {
  @ViewChild('content') content: Content;
  //chats: FirebaseListObservable<any[]>;
  chats: any[];
  user: Player;
  isSystem: boolean;
  isUnread: boolean;
  newMessage: string;
  isRefreshing: boolean;

  constructor(private navCtrl: NavController, private navParams: NavParams, private chatService: ChatService, private loacal: Localization) {
  }

  ionViewDidLoad() {
    this.isRefreshing = false;
    //this.content.resize();
    
    this.isSystem = this.navParams.get('isSystem');
    this.isUnread = this.navParams.get('isUnread');
    this.user = this.navParams.get('user');

    this.chatService.getRecentChats(this.user.id, this.isUnread).subscribe(chats => {
      this.chats = chats;
      this.scrollView();
    })

    this.chatService.loadMoreChats();
  }

  ionViewWillLeave() {
    this.chatService.updateUnread(this.user.id, false);
  }

  ionViewDidEnter() {
    //this.scrollView();
    /*
    this.showSub = Keyboard.onKeyboardShow().subscribe(e => {
      console.log("showkeyboard");
      //this.scrollToBottom(); 
      //this.content.resize();
      let keyboardHeight: number = e.keyboardHeight || (e.detail && e.detail.keyboardHeight);
      this.setElementPosition(keyboardHeight);
    })
    this.hideSub = Keyboard.onKeyboardHide().subscribe(e => {
      console.log("hidekeyboard");
      //this.scrollToBottom(); 
      //this.content.resize();
      this.setElementPosition(0);
    })
    //this.scrollToBottom();
    */
  }

  scrollView() {
    if (this.content && this.content._scroll) {
      if (this.isRefreshing) {
        setTimeout(_ => this.content.scrollToTop(), 100);
        this.isRefreshing = false;
      }
      else {
        setTimeout(_ => this.content.scrollToBottom(), 100);
      }
    }
  }

  sendMessage(input) {
    this.chatService.sendChat(this.user.id, this.user.pushId, this.newMessage);
    input.focus();
    this.newMessage = '';
    //input.setFocus();
  }

  doRefresh(refresher) {
    this.isRefreshing = true;
    this.chatService.loadMoreChats();
    setTimeout(() => {
      refresher.complete();
    }, 500);
  }

  shouldShowTime(index: number) {
    if (index == 0)
      return true;

    return (this.chats[index].createdAt - this.chats[index - 1].createdAt > 300000);
  }

  getDisplayTime(index: number) {
    var isTheSameDay: boolean;
    var current = this.chats[index].createdAt;
    if (index == 0)
      isTheSameDay = false;
    else if (moment(current).diff(moment(this.chats[index - 1].createdAt), 'days') < 1)
      isTheSameDay = true;
    else
      isTheSameDay = false;

    var newTime: string;
    if (!isTheSameDay) {
      newTime = new MomentPipe(this.loacal).transform(current);
    }
    else {
      newTime = moment(current).format('HH:mm');
    }

    return newTime;
  }
}
