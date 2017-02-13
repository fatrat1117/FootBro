import { Injectable } from '@angular/core';
import { OneSignal } from 'ionic-native';
import { AngularFire, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2';
import { LoginPage } from '../pages/login/login';
import { NavController, ModalController, Platform } from 'ionic-angular';
import { Subject } from 'rxjs/Subject';
import { Camera } from 'ionic-native';
import * as firebase from 'firebase';

@Injectable()
export class FirebaseManager {
  auth;
  afSortedPublicTeams;
  sortedPublicTeams;
  sortedPublicTeamsMap = {};
  cachedTeamStatsMap = {};
  cachedTeamsMap = {};
  queryTeams;
  cachedPlayersMap = {};
  sortedPublicPlayersMap = {};
  sortedPublicPlayers;
  queryPlayers;
  pushIdsMap = {};
  cachedAllPublicTeams;
  //matches 
  matchDatesMap = {};
  matchesByDateMap = {};
  cashedMatchesMap = {};
  _afTournamentList;
  //cheerleader
  cachedPendingCheerleaders;
  cachedApprovedCheerleaders;
  //admins
  admins;

  constructor(private modalCtrl: ModalController,
    private af: AngularFire,
    private platform: Platform) {
    document.addEventListener('playernotregistered', e => {
      let id = e['detail'];
      if (this.auth && id === this.auth.uid) {
        this.registerPlayer();
      }
    });

    this.getAdminsAsync();
  }

  initialize() {
    this.af.auth.subscribe(auth => {
      this.auth = auth;
      if (auth) {
        this.getPlayerAsync(auth.uid);
        //save push id for real device
        this.updatePushId();
        this.FireCustomEvent('userlogin', auth);
      } else {
        this.FireEvent('userlogout');
      }
    }
    );
  }


  popupLoginPage() {
    console.log('popupLoginPage');

    let loginPage = this.modalCtrl.create(LoginPage);
    console.log(loginPage);

    loginPage.present();
  }

  checkLogin() {
    //console.log('checkLogin', this.auth);
    if (null == this.auth) {
      this.popupLoginPage();
    }
  }

  /****************************** Messages ******************************/
  getAllMessages() {
    return this.af.database.list(`/chats/${this.auth.uid}/basic-info/`, {
      query: {
        orderByChild: 'lastTimestamp'
      }
    })
  }

  getAllUnreadMessages() {
    return this.af.database.list(`/chats/${this.auth.uid}/basic-info/`, {
      query: {
        orderByChild: 'isUnread',
        equalTo: true
      }
    })
  }





  /****************************** Chat Room ******************************/
  getChatsWithUser(userId: string, subject: any, isUnread: boolean) {
    if (isUnread) {
      this.af.database.object(`/chats/${this.auth.uid}/basic-info/${userId}`).update({
        isUnread: false,
      })
    }

    return this.af.database.list(`/chats/${this.auth.uid}/${userId}`, {
      query: {
        limitToLast: subject
      }
    });
  }

  addChatToUser(userId: string, content: string) {
    // add to self
    this.af.database.list(`/chats/${this.auth.uid}/${userId}`).push({
      createdAt: firebase.database.ServerValue.TIMESTAMP,
      content: content,
      isFromSelf: true
    })

    this.af.database.object(`/chats/${this.auth.uid}/basic-info/${userId}`).set({
      isSystem: false,
      isUnread: false,
      lastContent: content,
      lastTimestamp: firebase.database.ServerValue.TIMESTAMP,
    })

    // add to other
    this.af.database.list(`/chats/${userId}/${this.auth.uid}`).push({
      createdAt: firebase.database.ServerValue.TIMESTAMP,
      content: content,
      isFromSelf: false
    })

    this.af.database.object(`/chats/${userId}/basic-info/${this.auth.uid}`).set({
      isSystem: false,
      isUnread: true,
      lastContent: content,
      lastTimestamp: firebase.database.ServerValue.TIMESTAMP,
    })
  }






  /****************************** Teams ******************************/
  //ref
  publicTeamsRef() {
    return '/public/teams';
  }

  publicTeamRef(id) {
    return `public/teams/${id}`;
  }

  teamPlayerRef(pId, tId) {
    return "/teams/" + tId + '/players/' + pId;
  }

  playerTeamRef(pId, tId) {
    return "/players/" + pId + "/teams" + '/' + tId;
  }

  //af   
  afTeamBasic(teamId: string) {
    return this.af.database.object(`/teams/${teamId}/basic-info`);
  }

  getTeamPublic(id) {
    return this.sortedPublicTeamsMap[id];
  }

  getTeamPublicAsync(id) {
    if (this.sortedPublicTeamsMap[id])
      this.FireCustomEvent('teampublicready', id);
    else {
      this.af.database.object(`/public/teams/${id}`).subscribe(snapshot => {
        this.sortedPublicTeamsMap[id] = snapshot;
        this.FireCustomEvent('teampublicready', id);
      });
    }
  }

  getTeamStats(id) {
    return this.cachedTeamStatsMap[id];
  }

  getTeamStatsAsync(id) {
    if (this.cachedTeamStatsMap[id])
      this.FireCustomEvent('teamstatsdataready', id);
    else {
      this.af.database.object(`/teams_stats/${id}`).subscribe(snapshot => {
        this.cachedTeamStatsMap[id] = snapshot;
        this.FireCustomEvent('teamstatsdataready', id);
      });
    }
  }

  getAllPublicTeams() {
    return this.cachedAllPublicTeams;
  }

  getAllPublicTeamsAsync() {
    let sub = this.af.database.list(`/public/teams/`, {
      query: { orderByChild: 'name' }
    }).subscribe(snapshots => {
      sub.unsubscribe();
      this.cachedAllPublicTeams = snapshots;
      this.FireEvent('allpublicteamsready');
    });
  }

  getPublicTeams(orderby, count) {
    //console.log('getPublicTeams', orderby, count);
    //if (!this.afSortedPublicTeams) {
    //  console.log('subscribe sorted public teams')
    this.afSortedPublicTeams = this.af.database.list(`/public/teams/`, {
      query: {
        orderByChild: orderby,
        limitToLast: count
      }
    });

    let sub = this.afSortedPublicTeams.subscribe(snapshots => {
      sub.unsubscribe();
      this.sortedPublicTeams = snapshots.reverse();
      for (let i = 0; i < snapshots.length; ++i) {
        this.sortedPublicTeamsMap[snapshots[i].$key] = snapshots[i];
      }
      this.FireEvent('publicteamschanged');
    });

    if (this.queryTeams)
      this.queryTeams.off();

    let ref = firebase.database().ref(`/public/teams/`);
    this.queryTeams = ref.orderByChild(orderby).limitToLast(count);
    // query.on("child_added", function (snapshot) {
    //   console.log("child_added", snapshot.key);
    // });
    let self = this;
    this.queryTeams.on("child_changed", function (snapshot) {
      let val = snapshot.val();
      //console.log('TeamPublicDataChanged', val);
      val['$key'] = snapshot.key;
      self.sortedPublicTeamsMap[snapshot.key] = val;
      self.FireCustomEvent('teampublicready', snapshot.key);
      //console.log("child_changed", snapshot.key);
    });
    //}
    //this.subjectTeamSortBy.next(orderby);
    //this.subjectTeamLimitTo.next(count);
  }

  getTeamAsync(teamId) {
    if (!this.cachedTeamsMap[teamId]) {
      this.af.database.object(`/teams/${teamId}`).subscribe(snapshot => {
        //console.log(snapshot);
        if ('$value' in snapshot && null == snapshot.$value) {
          //team deleted
          delete this.cachedTeamsMap[teamId];
        }
        else {
          if ('img/none.png' === snapshot['basic-info'].logo)
            snapshot['basic-info'].logo = 'assets/img/none.png';
          this.cachedTeamsMap[teamId] = snapshot;
          this.FireCustomEvent('teamready', teamId);
        }
      })
    }
    else
      this.FireCustomEvent('teamready', teamId);
  }

  getTeam(teamId) {
    return this.cachedTeamsMap[teamId];
  }

  increaseTeamPopularity(teamId) {
    //setTimeout(() => {
    //cause pulic team changed to fire multiple times, need a fix
    let teamPublicData = this.sortedPublicTeamsMap[teamId];
    if (teamPublicData) {
      this.af.database.object(`public/teams/${teamId}`).update({ popularity: teamPublicData.popularity + 1 });
    };
    //}, 1000);
  }

  createTeam(teamObj, isDefault) {
    let self = this;
    console.log("createTeam", teamObj);
    const queryObservable = this.af.database.list(this.publicTeamsRef(), {
      query: {
        orderByChild: 'name',
        equalTo: teamObj.name
      }
    });

    let sub = queryObservable.subscribe(queriedItems => {
      //console.log("check team name", queriedItems);
      //stopping monitoring changes
      sub.unsubscribe();
      if (0 === queriedItems.length) {
        let teamData = {
          location: teamObj.location,
          "basic-info":
          {
            name: teamObj.name,
            captain: this.auth.uid,
            logo: 'assets/img/none.png',
            totalMatches: 0,
            totalPlayers: 0
          },
          "detail-info": {
            founder: this.auth.uid
          }
        };

        this.af.database.list('/teams').push(teamData).then(newTeam => {
          console.log('create team success', newTeam);
          let newTeamId = newTeam["key"];
          //joinTeam
          this.joinTeam(newTeamId, isDefault);
          //update public
          this.af.database.object(this.publicTeamRef(newTeamId)).update(
            {
              name: teamObj.name,
              popularity: 1,
              ability: 1000
            });
          this.FireCustomEvent('createteamsucceeded', newTeamId);
        });
      } else {
        this.FireCustomEvent('createteamfailed', 'Teamexists');
      }
    });
  }

  joinTeam(id, isDefault) {
    this.af.database.object(this.teamPlayerRef(this.selfId(), id)).set(true);
    this.af.database.object(this.playerTeamRef(this.selfId(), id)).set({ isMember: true });
    let player = this.cachedPlayersMap[this.auth.uid];
    //set default team if no team
    if (isDefault || !this.selfTeamId())
      this.afPlayerBasic(this.selfId()).update({ teamId: id });

    let afTeamBasic = this.afTeamBasic(id);
    let sub = afTeamBasic.subscribe(snapshot => {
      setTimeout(() => {
        sub.unsubscribe();
        //increase total by 1
        //trade-off: performance is better than updateTotalPlayers but might have bug when 2 players join at same time
        afTeamBasic.update({ totalPlayers: snapshot.totalPlayers + 1 });
      },
        250);
    });
  }






  /****************************** Players ******************************/
  publicPlayersRef() {
    return '/public/players/';
  }

  playerRef(id) {
    return `/players/${id}`;
  }

  playerBasicRef(id) {
    return `/players/${id}/basic-info`;
  }

  playerPublicRef(id) {
    return `public/players/${id}`;
  }

  cheerleaderPublicRef(id) {
    return `public/cheerleaders/${id}`;
  }
  //af
  afPlayerBasic(id) {
    return this.af.database.object(this.playerBasicRef(id));
  }

  selfId() {
    if (this.auth)
      return this.auth.uid;
    return null;
  }

  selfTeamId() {
    let player = this.cachedPlayersMap[this.selfId()];
    if (player && player['basic-info'])
      return player['basic-info'].teamId;
    return null;
  }

  updatePushId() {
    if (!(this.platform.is('mobileweb') ||
      this.platform.is('core'))) {
      OneSignal.getIds().then(ids => {
        console.log('push ids', ids);
        this.getPlayerDetail(this.auth.uid).update({ pushId: ids.userId });
        this.pushIdsMap[this.auth.uid] = ids.userId;
      });
    }
  }

  increasePlayerPopularity(id) {
    let publicData = this.sortedPublicPlayersMap[id];
    if (publicData) {
      this.af.database.object(`public/players/${id}`).update({ popularity: publicData.popularity + 1 });
    };
  }
  getPlayerDetail(id) {
    return this.af.database.object(`/players/${id}/detail-info`);
  }

  getPlayerPublic(id) {
    return this.sortedPublicPlayersMap[id];
  }

  getPlayerPublicAsync(id) {
    if (this.sortedPublicPlayersMap[id])
      this.FireCustomEvent('playerpublicready', id);
    else {
      this.af.database.object(`/public/players/${id}`).subscribe(snapshot => {
        this.sortedPublicPlayersMap[id] = snapshot;
        this.FireCustomEvent('playerpublicready', id);
      });
    }
  }

  getPlayerAsync(id) {
    if (this.cachedPlayersMap[id]) {
      this.FireCustomEvent('playerready', id);
    }
    else {
      this.af.database.object(`/players/${id}`).subscribe(snapshot => {
        if (snapshot && snapshot['basic-info']) {
          if ('img/none.png' === snapshot['basic-info'].photoURL)
            snapshot['basic-info'].photoURL = 'assets/img/none.png';
          this.cachedPlayersMap[id] = snapshot;
          this.FireCustomEvent('playerready', id);
        }
        else
          this.FireCustomEvent('playernotregistered', id);
      });
    }
  }

  getPlayer(id) {
    return this.cachedPlayersMap[id];
  }

  // public
  queryPublicPlayers(orderby, count) {
    console.log('queryPublicPlayers', orderby, count);
    let afQuery = this.af.database.list(this.publicPlayersRef(), {
      query: {
        orderByChild: orderby,
        limitToLast: count
      }
    });

    let sub = afQuery.subscribe(snapshots => {
      sub.unsubscribe();
      this.sortedPublicPlayers = snapshots.reverse();
      for (let i = 0; i < snapshots.length; ++i) {
        this.sortedPublicPlayersMap[snapshots[i].$key] = snapshots[i];
      }
      this.FireEvent('publicplayerschanged');
    });

    if (this.queryPlayers)
      this.queryPlayers.off();

    let ref = firebase.database().ref(this.publicPlayersRef());
    this.queryPlayers = ref.orderByChild(orderby).limitToLast(count);
    let self = this;

    this.queryPlayers.on("child_changed", function (snapshot) {
      let val = snapshot.val();
      val['$key'] = snapshot.key;
      self.sortedPublicPlayersMap[snapshot.key] = val;
      self.FireCustomEvent('playerpublicready', snapshot.key);
    });
  }
  //Fire document events 
  FireEvent(name) {
    console.log(name);
    var event = new Event(name);
    document.dispatchEvent(event);
  }

  FireCustomEvent(name, data) {
    console.log(name, data);
    var event = new CustomEvent(name, { detail: data });
    document.dispatchEvent(event);
  }

  updatePlayerBasic(property: string, value) {
    this.af.database.object(`players/${this.auth.uid}/basic-info/${property}`).set(value);
  }

  updatePlayerDetail(property: string, value) {
    this.af.database.object(`players/${this.auth.uid}/detail-info/${property}`).set(value);
  }

  registerPlayer() {
    console.log("first time login");
    let user = this.auth.auth;
    let photoURL = user.photoURL || 'assets/img/none.png';
    let providerData = user.providerData[0]
    if (providerData.providerId.toLowerCase().indexOf('facebook') != -1) {
      photoURL = 'https://graph.facebook.com/' + providerData.uid + '/picture';
    }
    //todo
    this.afPlayerBasic(this.auth.uid).update({
      photoURL: photoURL,
      displayName: user.displayName || user.email,
      created: true
    });
    //update player public
    this.af.database.object(this.playerPublicRef(this.auth.uid)).update({ popularity: 1 });
  }

  //matches
  afMatchDates() {
    return this.af.database.list('/matches/dates');
  }

  afTournamentDates(id) {
    return this.af.database.list('/tournaments/list/' + id + '/dates');
  }

  afTournamentList() {
    if (!this._afTournamentList)
      this._afTournamentList = this.af.database.list('/tournaments/list');
    return this._afTournamentList;
  }

  afMatch(id) {
    return this.af.database.object('/matches/list/' + id);
  }

  matchListRef() {
    return '/matches/list';
  }

  getMatchDatesAsync(id) {
    if (this.getMatchDates(id)) {
      this.FireCustomEvent('matchdatesready', id);
    } else {
      if (id == "all") {
        let sub = this.afMatchDates().subscribe(snapshots => {
          let dates = [];
          snapshots.forEach(snapshot => {
            dates.push(Number(snapshot.$key));
          })
          this.matchDatesMap[id] = dates;
          //sub.unsubscribe();
          this.FireCustomEvent('matchdatesready', id);
        });
      }
      else {
        let sub = this.afTournamentDates(id).subscribe(snapshots => {
          let dates = [];
          snapshots.forEach(snapshot => {
            dates.push(Number(snapshot.$key));
          })
          this.matchDatesMap[id] = dates;
          //sub.unsubscribe();
          this.FireCustomEvent('matchdatesready', id);
        });
      }
    }
  }

  getMatchDates(id) {
    return this.matchDatesMap[id];
  }

  getMatchesByDate(date) {
    return this.matchesByDateMap[date];
  }

  getMatchesByDateAsync(date) {
    let afQuery = this.af.database.list(this.matchListRef(), {
      query: {
        orderByChild: 'date',
        equalTo: date
      }
    });

    let sub = afQuery.subscribe(snapshots => {
      sub.unsubscribe();
      snapshots.forEach(snapshot => {
        //monitor match change
        this.getMatchAsync(snapshot.$key);
        //this.cashedMatchesMap[snapshot.$key] = snapshot;
      });
      this.matchesByDateMap[date] = snapshots;
      this.FireCustomEvent('matchesbydateready', date);
    });
  }

  getMatch(id) {
    return this.cashedMatchesMap[id];
  }

  getMatchAsync(id) {
    if (this.getMatch(id))
      this.FireCustomEvent('matchready', id);
    else {
      this.afMatch(id).subscribe(snapshot => {
        this.cashedMatchesMap[id] = snapshot;
        this.FireCustomEvent('matchready', id);
      });
    }
  }

  getTeamMatchesAsync(id) {
    let sub = this.af.database.list('/teams_matches/' + id + '/matches', {
      query: {
        orderByChild: 'date'
      }
    }).subscribe(snapshots => {
      sub.unsubscribe();
      let result = {
        id: id,
        matches: snapshots.reverse()
      };
      this.FireCustomEvent('teammatchesready', result);
    })
  }





  /****************************** Points ******************************/
  updatePoints(targetId: string, usedPoint: number, newPoints: number) {
    console.log(this.auth);

    this.af.database.object(`/players/${this.auth.uid}/points`).update({ total: newPoints });
    this.af.database.object(`/players/${this.auth.uid}/points/to/${targetId}`).set(usedPoint);
    this.af.database.object(`/players/${targetId}/points/from/${this.auth.uid}`).set(usedPoint);
  }





  /****************************** Misc ******************************/
  postNotification(senderId: string, targetId: string) {
    let notificationObj = {
      app_id: "f6268d9c-3503-4696-8e4e-a6cf2c028fc6",
      contents: "user name",
      include_player_ids: [targetId]
    };

    OneSignal.postNotification(notificationObj);

  }

  sendFeedback(content: string) {
    this.af.database.list(`misc/feedbacks/`).push({
      content: content,
      creatorId: this.auth.uid,
      timestamp: firebase.database.ServerValue.TIMESTAMP
    })
  }

  b64toBlob(b64Data, contentType, sliceSize) {
    contentType = contentType || '';
    sliceSize = sliceSize || 512;

    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);

      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      var byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

  selectImgGetData(width, height, success, error) {
    let self = this;
    let options = {
      quality: 75,
      encodingType: Camera.EncodingType.JPEG,
      sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: Camera.DestinationType.DATA_URL,
      targetWidth: width,
      targetHeight: height
    };

    Camera.getPicture(options).then(imageData => {
      success(imageData);
    }, (err) => {
      error(err);
    });
  }

  updateImgGetUrl(imageData, imgId, width, height, success, error) {
    let self = this;
    let options = {
      quality: 75,
      allowEdit: true,
      encodingType: Camera.EncodingType.JPEG,
      sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: Camera.DestinationType.DATA_URL,
      targetWidth: width,
      targetHeight: height
    };

    // imageData is either a base64 encoded string or a file URI
    // If it's base64:
    let contentType = 'image/jpg';
    let b64Data = imageData;

    let blob = this.b64toBlob(b64Data, contentType, width);

    let metadata = {
      contentType: 'image/jpeg',
    };
    let storageRef = firebase.storage().ref();
    let uploadTask = storageRef.child('images/' + imgId + '.jpg').put(blob, metadata);;
    uploadTask.on('state_changed', function (snapshot) {
      // Observe state change events such as progress, pause, and resume
      // See below for more detail
    }, error, function () {
      // Handle successful uploads on complete
      var downloadURL = uploadTask.snapshot.downloadURL;
      console.log('upload image done', downloadURL);
      success(downloadURL);
    });
  }

  //cheerleader
  pendingCheerleadersRef(){
    return '/cheerleaders/pending/';
  }

  approvedCheerleadersRef() {
    return '/cheerleaders/approved/';
  }

  submitCheerleaderInfo(url) {
    this.af.database.object(this.pendingCheerleadersRef() + this.auth.uid).set({photo: url});
  }

  getPendingCheerleaders() {
    return this.cachedPendingCheerleaders;
  }

  getPendingCheerleadersAsync() {
    if (this.getPendingCheerleaders()) 
      this.FireEvent('pendingcheerleadersready');
    else {
      this.af.database.list(this.pendingCheerleadersRef()).subscribe(snapshots => {
        this.cachedPendingCheerleaders = snapshots;
        this.FireEvent('pendingcheerleadersready');
      })
    }
  }

  getApprovedCheerleaders() {
    return this.cachedApprovedCheerleaders;
  }

  getApprovedCheerleadersAsync() {
    if (this.getApprovedCheerleaders()) 
      this.FireEvent('approvedcheerleadersready');
    else {
      this.af.database.list(this.approvedCheerleadersRef()).subscribe(snapshots => {
        this.cachedApprovedCheerleaders = snapshots;
        this.FireEvent('approvedcheerleadersready');
      })
    }
  }

  approveCheerleader(cheerleader) {
    let id = cheerleader.id;
    this.af.database.object(this.playerRef(id)).update({
      role : 'cheerleader', 
      photoMedium: cheerleader.photoMedium});
    this.af.database.object(this.pendingCheerleadersRef() + id).remove();
    this.af.database.object(this.approvedCheerleadersRef() + id).set(true);
    
    let cheerleaderPublic = this.getPlayerPublic(id);
    //console.log(cheerleaderPublic);
    this.af.database.object(this.cheerleaderPublicRef(id)).set({popularity: cheerleaderPublic.popularity || 1});
    this.af.database.object(this.playerPublicRef(id)).remove();
  }

  //admins 
  getAdminsAsync() {
    if (!this.admins) {
      this.af.database.object('/tournaments/whitelist/').subscribe(snapshot => {
        this.admins = snapshot;
      });
    }
  }
}



// @Injectable().
// export class FirebaseManager {
//   selfId: string;
//   selfTeamId: string;
//   totalPlayers = 0;
//   totalTeams = 0;

//   constructor(private af: AngularFire,
//   private loc : Localization) {
//   }

//   /********** All Players Operations ***********/
//   getPlayerDetail(playerId: string) {
//     return this.af.database.object(`/players/${playerId}/detail-info`);
//   }

//   getPlayerRole(id) {
//     return this.af.database.object(`/players/${id}/role`);
//   }

//   updatePlayer(p, success, error) {
//     let basic = {};
//     if (p.photo)
//       basic['photoURL'] = p.photo;
//     if (p.name)
//       basic['displayName'] = p.name.trim();

//     let detail = {};
//     if (p.foot)
//       detail['foot'] = p.foot;
//     if (p.height)
//       detail['height'] = p.height;
//     if (p.position)
//       detail['position'] = p.position;
//     if (p.weight)
//       detail['weight'] = p.weight;
//     if (p.description)
//       detail['description'] = p.description.trim();

//     console.log('updatePlayer', p, basic, detail);
//     this.getPlayerBasic(p.pId).update(basic).then(_ => success()).catch(err => error(err));
//     //concurrent update, return success when basic update is done.
//     //trade off: update performance exchange update integrity
//     this.getPlayerDetail(p.pId).update(detail);
//   }

//   validateTeamNumber(teamId, number, success, error) {
//     let subscription = this.getTeamPlayers(teamId).subscribe(players => {

//       let isValid = true;
//       players.forEach(p => {
//         if (p.number == number) {
//           if (p.$key == this.selfId) {
//             isValid = false;
//             success();
//           } else {
//             isValid = false;
//             error(this.loc.getString('Numberexists'));
//           }
//         }
//       })

//       subscription.unsubscribe();
//       if (isValid) {
//         this.updateTeamNumber(teamId, this.selfId, number);
//         success();
//       }
//     });
//   }

//   updateTeamNumber(teamId, playerId, number) {
//     this.af.database.object(`/players/${playerId}/teams/${teamId}`).set(number);
//     this.af.database.object(`/teams/${teamId}/players/${playerId}`).update({ number: number });
//   }

//   getSelfMatchNotifications() {
//     this.af.database.list(`/players/${this.selfId}/match-notifications`).subscribe(snapshots => {
//       let today = moment();
//       snapshots.forEach(s => {
//         if (today >= s.time) {
//           this.removeMatchNotification(this.selfId, s.$key);
//         }
//       });
//     });
//     return this.af.database.list(`/players/${this.selfId}/match-notifications`, {
//       query: { orderByChild: 'time' }
//     });
//   }

//   getSelfTeams() {
//     return this.af.database.list(`/players/${this.selfId}/teams`)
//   }

//   updateDefaultTeam(teamId: string) {
//     this.af.database.object(`/players/${this.selfId}`).set({ teamId: teamId });
//   }

//   setSelfCurrentTeam(teamId: string) {
//     this.af.database.object(`/players/${this.selfId}/teams/${this.selfTeamId}`).update('false');
//     this.af.database.object(`/players/${this.selfId}/teams/${teamId}`).update('true');
//     this.af.database.object(`/players/${this.selfId}/basic-info/teamId`).update(teamId);
//   }

//   addMatchNotification(playerId: string, matchID: string, notification: any) {
//     this.af.database.object(`/players/${playerId}/match-notifications/${matchID}`).set(notification);
//   }

//   removeMatchNotification(playerId: string, matchID: string) {
//     this.af.database.object(`/players/${playerId}/match-notifications/${matchID}`).remove();
//   }

//   changeNotificationStatus(matchId: string, isRead: boolean) {
//     this.af.database.object(`/players/${this.selfId}/match-notifications/${matchId}`).update({
//       isRead: isRead
//     });
//   }

//   getToVoteInfo() {
//     return this.af.database.list(`/players/${this.selfId}/to-vote`, {
//       query: {
//         orderByValue: true
//       }
//     });
//   }

//   removeToVote(matchId) {
//     this.af.database.object(`/players/${this.selfId}/to-vote/${matchId}`).remove();
//   }

//   //common
//   increasePopularity(afPublic, success = null) {
//     let sub = afPublic.subscribe(snapshot => {
//       setTimeout(() => {
//         //console.log(sub);
//         //use timeout to prevent deadloop and ensure sub is initialized
//         sub.unsubscribe();
//         afPublic.update({ popularity: snapshot.popularity + 1 });
//         if (success)
//           success(snapshot);
//       },
//         250);
//     });
//   }

//   /********** All Teams Operations ***********/
//   getRefTeams_Player(pId) {
//     return "/players/" + pId + "/teams";
//   }

//   getRefTeam_Player(pId, tId) {
//     return this.getRefTeams_Player(pId) + '/' + tId;
//   }

//   getTeamOfPlayer(pId, tId) {
//     return this.af.database.object(this.getRefTeam_Player(pId, tId));
//   }

//   getPlayerOfTeam(pId, tId) {
//     return this.af.database.object(this.getRefPlayer_Team(pId, tId));
//   }

//   getTeam(teamId: string) {
//     return this.af.database.object(`/teams/${teamId}`);
//   }

//   getTeamDetail(teamId: string) {
//     return this.af.database.object(`/teams/${teamId}/detail-info`);
//   }

//   getPlayersObj(teamId: string) {
//     return this.af.database.object(`/teams/${teamId}/players`);
//   }

//   getSelfChatMessages(teamId: string, subject: any) {
//     return this.af.database.list(`/teams/${teamId}/chatroom`, {
//       query: {
//         limitToLast: subject
//       }
//     });
//   }

//   getMatchInfo(teamId: string, matchId: string) {
//     return this.af.database.object(`/teams/${teamId}/matches/${matchId}`);
//   }

//   addSelfChatMessage(teamId: string, message: string) {
//     this.af.database.list(`/teams/${teamId}/chatroom`).push({
//       content: message,
//       createdAt: firebase.database.ServerValue.TIMESTAMP,
//       createdBy: this.selfId
//     });
//   }

//   addSelfMember(playerId: string, memberInfo: any) {
//     this.af.database.object(`/teams/${this.selfTeamId}/players/${playerId}}`).set(memberInfo);
//   }

//   deleteTeam(tId, success, error) {
//     this.getTeam(tId).remove().then(_ => {
//       this.getTeamPublic(tId).remove().then(_ => {
//         success();
//       }).catch(err => error(err));
//     }).catch(err => error(err));
//   }

//   getAllTeams() {
//     return this.af.database.list('/teams');
//   }

//   addSelfMatch(match: any) {
//     match.creator = this.selfId;
//     match.createdAt = firebase.database.ServerValue.TIMESTAMP;
//     const promise = this.af.database.list(`/teams/${this.selfTeamId}/matches`).push(match);
//     promise.then(newMatch => {
//       let id = newMatch["key"];
//       // add to team players
//       this.getPlayersObj(this.selfTeamId).subscribe(snapshots => {
//         console.log('addSelfMatch', snapshots);
//         for (let pId in snapshots) {
//           console.log('player id', pId);
//           if (pId != '$key') {
//             this.addMatchNotification(pId, id, {
//               isRead: false,
//               teamId: this.selfTeamId,
//               opponentId: match.opponentId,
//               time: match.time
//             });
//           }
//         }
//       });
//     }).catch(err => {
//       alert(err);
//     });

//     // update totalMatches
//     this.updateTotalMatches(this.selfTeamId);
//   }


//   withdrawSelfMatch(matchId: string) {
//     this.getTeamPlayers(this.selfTeamId).take(1).subscribe(snapshots => {
//       snapshots.forEach(snapshot => {
//         this.af.database.object(`/players/${snapshot.$key}/match-notifications/${matchId}`).remove();
//       });
//     });

//     this.getTeamMatch(this.selfTeamId, matchId).update({
//       isPosted: false
//     });
//   }

//   /*
//   withdrawSelfMatch(matchId: string) {
//     const promise = this.af.database.object(`/teams/${this.selfTeamId}/matches/${matchId}`).remove();
//     promise.then(_ => {
//       this.getTeamPlayers(this.selfTeamId).take(1).subscribe(snapshots => {
//         snapshots.forEach(snapshot => {
//           this.af.database.object(`/players/${snapshot.$key}/match-notifications/${matchId}`).remove();
//         });
//       });
//     });

//     // update totalMatches
//     this.updateTotalMatches(this.selfTeamId);
//   }
//   */

//   getMatchPlayers(teamId: string, matchId: string) {
//     return this.af.database.list(`/teams/${teamId}/matches/${matchId}/players`);
//   }

//   joinMatch(teamId: string, matchId: string) {
//     this.af.database.object(`/teams/${teamId}/matches/${matchId}/players/${this.selfId}`).set(true);
//   }

//   leaveMatch(teamId: string, matchId: string) {
//     this.af.database.object(`/teams/${teamId}/matches/${matchId}/players/${this.selfId}`).remove();
//   }

//   updateTotalPlayers(teamId: string) {
//     this.af.database.list(`/teams/${teamId}/players`).subscribe(snapshots => {
//       this.af.database.object(`/teams/${teamId}/basic-info`).update({ totalPlayers: snapshots.length });
//     })
//   }

//   updateTotalMatches(teamId: string) {
//     this.af.database.list(`/teams/${teamId}/matches`).subscribe(snapshots => {
//       this.af.database.object(`/teams/${teamId}/basic-info`).update({ totalMatches: snapshots.length });
//     })
//   }

//   getTeamPlayers(teamId: string) {
//     return this.af.database.list(`/teams/${teamId}/players`);
//   }

//   setNewCaptain(teamId: string, playerId: string) {
//     this.af.database.object(`/teams/${teamId}/basic-info`).update({ captain: playerId });
//   }

//   isTeamPlayer(playerId: string, teamId) {
//     return this.af.database.object(`/teams/${teamId}/players/${playerId}`);
//   }

//   setTeamPlayersToVote(teamId, matchId, date) {
//     this.af.database.list(`/teams/${teamId}/players`).take(1).subscribe(players => {
//       players.forEach(p => {
//         this.af.database.object(`/players/${p.$key}/to-vote/${matchId}`).set(date);
//       })
//     });
//   }





//   /********** All Public Operations ***********/

//   queryPublicPlayers(subject, limit) {
//     return this.af.database.list(`/public/players/`, {
//       query: {
//         orderByChild: subject,
//         limitToLast: limit
//       }
//     });
//   }

//   /********** All Matches Operations ***********/
//   exportMatchesData() {
//     let afMatchesExport = this.getMatchesExport();
//     this.getMatchList().subscribe(snapshots => {
//       let matches = [];
//       snapshots.forEach(m => {
//         if (m.homeId && m.awayId && "homeScore" in m && "awayScore" in m) {
//           var obj = {
//             homeId: m.homeId,
//             awayId: m.awayId,
//             homeScore: m.homeScore,
//             awayScore: m.awayScore,
//             type: m.type
//           };
//           matches.push(obj);
//         }
//       });
//       console.log('exportData', matches);
//       afMatchesExport.set({ "matches": matches });
//     });
//   }

//   getMatchList() {
//     return this.af.database.list('/matches/list');
//   }

//   getMatchesExport() {
//     return this.af.database.object('/matches/export');
//   }

//   getMatchDate(day) {
//     return this.af.database.object('/matches/dates/' + day);
//   }

//   getTournamentMatchDate(id, day) {
//     return this.af.database.object('/tournaments/list/' + id + '/dates/' + day);
//   }

//   getMatchesByTournamentId(id) {
//     return this.af.database.list('/matches/list', {
//       query: {
//         orderByChild: 'tournamentId',
//         equalTo: id
//       }
//     });
//   }


//   scheduleMatch(matchObj, success, error) {
//     console.log('scheduleMatch', matchObj);

//     this.getMatchList().push(matchObj)
//       .then(newMatch => {
//         this.getMatchDate(matchObj.date).set(true);
//         if (matchObj.tournamentId)
//           this.getTournamentMatchDate(matchObj.tournamentId, matchObj.date).set(true);

//         // add to team match
//         let matchId = newMatch["key"];
//         let teamData = {
//           time: matchObj.time,
//           locationName: matchObj.locationName,
//           locationAddress: matchObj.locationAddress,
//           isPosted: false
//         };
//         // add to home team
//         teamData["opponentId"] = matchObj.awayId;
//         this.updateTeamMatch(matchId, teamData, matchObj.homeId);
//         // add to away team
//         teamData["opponentId"] = matchObj.homeId;
//         this.updateTeamMatch(matchId, teamData, matchObj.awayId);

//         success();
//       })
//       .catch(err => error(err));
//   }

//   updateMatch(tournamentId, id, matchObj, oldDate, success, error) {
//     console.log('updateMatch', matchObj);
//     this.getMatch(id).update(matchObj)
//       .then(() => {
//         console.log('match updated tournament id', tournamentId);

//         this.getMatchDate(matchObj.date).set(true);
//         if (tournamentId)
//           this.getTournamentMatchDate(tournamentId, matchObj.date).set(true);
//         // update team match
//         let teamData = {
//           time: matchObj.time,
//           locationName: matchObj.locationName,
//           locationAddress: matchObj.locationAddress
//         };
//         // update home team
//         teamData["opponentId"] = matchObj.awayId;
//         this.updateTeamMatch(id, teamData, matchObj.homeId);
//         // update away team
//         teamData["opponentId"] = matchObj.homeId;
//         this.updateTeamMatch(id, teamData, matchObj.awayId);

//         // process raw data
//         if ("homeScore" in matchObj && "awayScore" in matchObj)
//           this.processMatchData(id, oldDate);

//         success();
//       })
//       .catch(err => error(err));

//   }

//   updateTeamMatch(matchId: string, match: any, teamId: string) {
//     match.createdAt = firebase.database.ServerValue.TIMESTAMP;
//     this.getTeamMatch(teamId, matchId).update(match);
//     this.getTeamMatch(teamId, matchId).take(1).subscribe(m => {
//       if (m.isPosted) {
//         // add to team players
//         this.addToPlayerNot(teamId, matchId, m.opponentId, m.time);
//       }
//     });
//     /*
//     const promise = this.af.database.list(`/teams/${this.selfTeamId}/matches`).push(match);
//     promise.then(newMatch => {
//       let id = newMatch["key"];
//       // add to team players
//       this.getPlayersObj(teamId).subscribe(snapshots => {
//         for (let pId in snapshots) {
//           if (pId != '$key') {
//             this.addMatchNotification(pId, id, {
//               isRead: false,
//               teamId: teamId,
//               opponentId: match.opponentId,
//               time: match.time
//             });
//           }
//         }
//       });
//     }).catch(err => {
//       alert(err);
//     });
//     */

//     // update totalMatches
//     this.updateTotalMatches(this.selfTeamId);
//   }

//   deleteTeamMatch(teamId: string, matchId: string) {
//     this.getTeamMatch(teamId, matchId).take(1).subscribe(m => {
//       if (m.isPosted) {
//         this.removePlayerNot(teamId, matchId);
//       }
//       this.getTeamMatch(teamId, matchId).remove();
//     });
//   }

//   deleteMatch(id) {
//     this.getMatch(id).take(1).subscribe(snapShot => {
//       this.deleteTeamMatch(snapShot.homeId, id);
//       this.deleteTeamMatch(snapShot.awayId, id);
//       this.getMatch(id).remove();
//     })
//   }


//   getTeamMatch(teamId: string, matchId: string) {
//     return this.af.database.object(`/teams/${teamId}/matches/${matchId}`);
//   }

//   getSelfUpcomingMatches() {
//     let now = moment().unix() * 1000
//     return this.af.database.list(`/teams/${this.selfTeamId}/matches`, {
//       query: {
//         orderByChild: 'time',
//         startAt: now
//       }
//     });
//   }

//   updateSelfMatch(matchId, color, notice, opponentId, time) {
//     this.getTeamMatch(this.selfTeamId, matchId).update({
//       isPosted: true,
//       color: color,
//       notice: notice
//     });

//     this.addToPlayerNot(this.selfTeamId, matchId, opponentId, time);
//   }

//   addToPlayerNot(teamId, matchId, opponentId, time) {
//     this.getPlayersObj(teamId).subscribe(snapshots => {
//       for (let pId in snapshots) {
//         if (pId != '$key') {
//           this.addMatchNotification(pId, matchId, {
//             isRead: false,
//             teamId: this.selfTeamId,
//             opponentId: opponentId,
//             time: time
//           });
//         }
//       }
//     });
//   }

//   removePlayerNot(teamId, matchId) {
//     this.getPlayersObj(teamId).subscribe(snapshots => {
//       for (let pId in snapshots) {
//         if (pId != '$key') {
//           this.removeMatchNotification(pId, matchId);
//         }
//       }
//     });
//   }


//   getMatchBasicData(id, date) {
//     return this.af.database.object(`/matches/data/${date}/${id}/basic`)
//   }

//   getMatchStats(id, date) {
//     return this.af.database.object(`/matches/data/${date}/${id}/statistic`)
//   }

//   getRefereeName(id, date) {
//     return this.af.database.object(`/matches/data/${date}/${id}/referee/name`)
//   }

//   // post-precess raw data
//   processMatchData(id, oldDate) {
//     // remove old data
//     this.af.database.object(`/matches/data/${oldDate}/${id}/`).remove();
//     this.getMatch(id).take(1).subscribe(data => {
//       let database = `/matches/data/${data.date}/${id}/`;
//       let n = 2;
//       let successCallback = () => {
//         if (--n == 0) {
//           this.updateMVP(database);
//           this.setTeamPlayersToVote(data.homeId, id, data.date);
//           this.setTeamPlayersToVote(data.awayId, id, data.date);
//         }
//       }
//       // update basic info
//       let basic: any = {};
//       basic.awayId = data.awayId;
//       basic.homeId = data.homeId;
//       basic.locationAddress = data.locationAddress;
//       basic.locationName = data.locationName;
//       basic.time = data.time;
//       if (data.refereeName)
//         basic.refereeName = data.refereeName;
//       if (data.tournamentId)
//         basic.tournamentId = data.tournamentId;
//       this.af.database.object(database + "basic").set(basic);
//       // referee
//       this.getRefereeName(id, data.date).set(data.refereeName);
//       // home
//       this.addProcessedData(successCallback, database + "statistic/home", data.homeId, data.homeScore, data.homeGoals,
//         data.homeAssists, data.homeRedCards, data.homeYellowCards);
//       // away
//       this.addProcessedData(successCallback, database + "statistic/away", data.awayId, data.awayScore, data.awayGoals,
//         data.awayAssists, data.awayRedCards, data.awayYellowCards);
//     });
//   }

//   addProcessedData(success, database: string, id: string, score: number, goals: Array<any>,
//     assists: Array<any>, red: Array<any>, yellow: Array<any>) {
//     let teamData: any = {};
//     teamData.teamId = id;
//     teamData.score = score;
//     teamData.red = 0;
//     teamData.yellow = 0;
//     // create player dictionary
//     let players: { [num: number]: any } = {};
//     if (goals != undefined) {
//       for (var p of goals) {
//         if (players[p.num] == undefined)
//           players[p.num] = {};
//         players[p.num].goals = p.goals;
//       }
//     }
//     if (assists != undefined) {
//       for (var p of assists) {
//         if (players[p.num] == undefined)
//           players[p.num] = {};
//         players[p.num].assists = p.assists;
//       }
//     }
//     if (red != undefined) {
//       for (var p of red) {
//         if (players[p.num] == undefined)
//           players[p.num] = {};
//         players[p.num].red = p.cards;
//         teamData.red += p.cards;
//       }
//     }
//     if (yellow != undefined) {
//       for (var p of yellow) {
//         if (players[p.num] == undefined)
//           players[p.num] = {};
//         players[p.num].yellow = p.cards;
//         teamData.yellow += p.cards;
//       }
//     }

//     // find player id
//     teamData.players = {};
//     this.getTeamPlayers(id).take(1).subscribe(snapshots => {
//       snapshots.forEach(p => {
//         if (players[p.number] != undefined)
//           teamData.players[p.$key] = players[p.number];
//       })
//       // add pocessed data
//       this.af.database.object(database).set(teamData)
//         .then(() => {
//           let successCallback = () => {
//             success();
//           }
//           this.addPlayersPosition(database, teamData.players, successCallback);
//         })
//         .catch(err => console.log(err));
//     });
//   }

//   addPlayersPosition(database: string, players: any, success) {
//     let n = Object.keys(players).length;
//     if (n == 0) {
//       success();
//       return;
//     }

//     for (let key in players) {
//       this.getPlayerDetail(key).take(1).subscribe(p => {
//         if (p.position != undefined) {
//           this.af.database.object(database + '/players/' + key).update({ position: p.position })
//             .then(() => {
//               if (--n == 0) {
//                 //done, add success callback here
//                 success();
//               }
//             });
//         } else {
//           if (--n == 0) {
//             //done, add success callback here
//             success();
//           }
//         }
//       })
//     }
//   }





//   /********** MVP ***********/
//   updateMVP(database: string) {
//     this.af.database.object(database + "statistic").take(1).subscribe(data => {
//       let homeStats = data.home;
//       let awayStats = data.away;
//       let isHomeWon = homeStats.score >= awayStats.score;
//       let wonStats = isHomeWon ? homeStats : awayStats;
//       let lostStats = isHomeWon ? awayStats : homeStats;
//       //this.calculateMVP(wonStats, lostStats);
//       let mvp = this.calculateMVP(wonStats, lostStats);
//       this.af.database.object(database + "/mvp/candidates").set(mvp);
//     })
//   }

//   calculateMVP(wonStats: any, lostStats: any) {
//     // filter out yellow/red cards
//     let candidates = Array<any>();
//     let spliter = 0;
//     for (let key in wonStats.players) {
//       let p = wonStats.players[key];
//       if (p.yellow > 0 || p.red > 0)
//         continue;
//       p.id = key;
//       candidates.push(p);
//       spliter++;
//     }
//     for (let key in lostStats.players) {
//       let p = lostStats.players[key];
//       if (p.yellow > 0 || p.red > 0)
//         continue;
//       p.id = key;
//       candidates.push(p);
//     }

//     // find mvp for different positions
//     // goals
//     let goalsMvp = this.getGoalsMvp(candidates);
//     // assists
//     let assistsMvp = this.getAssistsMvp(candidates);
//     // gk
//     let minScore = 2;
//     let gkMvp = Array<any>();
//     if (wonStats.score < minScore && lostStats.score < minScore)
//       gkMvp = this.getGkMvp(candidates);
//     else if (wonStats.score < minScore) // lost gk mvp
//       gkMvp = this.getGkMvp(candidates.slice(spliter));
//     else if (lostStats.score < minScore) // won gk mvp
//       gkMvp = this.getGkMvp(candidates.slice(0, spliter));
//     // def
//     let averageScore = 2;
//     let defMvp = Array<any>();
//     if (wonStats.score < averageScore && lostStats.score < averageScore)
//       defMvp = this.getDefMvp(candidates);
//     else if (wonStats.score < averageScore) // lost def mvp
//       defMvp = this.getDefMvp(candidates.slice(spliter));
//     else if (lostStats.score < averageScore) // won def mvp
//       defMvp = this.getDefMvp(candidates.slice(0, spliter));

//     // summarize
//     let mvp = {};
//     while (goalsMvp.length != 0 || assistsMvp.length != 0 || gkMvp.length != 0 || defMvp.length != 0) {
//       // best goals
//       if (goalsMvp.length > 0) {
//         let p = goalsMvp.shift();
//         mvp[p.id] = {};
//         mvp[p.id].description = p.goals + " Goals";
//       }
//       if (Object.keys(mvp).length > 3)
//         break;

//       // best assists
//       if (assistsMvp.length > 0) {
//         let p = assistsMvp.shift();
//         if (mvp[p.id] == undefined) {
//           mvp[p.id] = {};
//           mvp[p.id].description = p.assists + " Assists";
//         }
//         else
//           mvp[p.id].description += ", " + p.assists + "Assists";
//       }
//       if (Object.keys(mvp).length > 3)
//         break;

//       // best gk
//       if (gkMvp.length > 0) {
//         let p = gkMvp.shift();
//         if (mvp[p.id] == undefined) {
//           mvp[p.id] = {};
//           mvp[p.id].description = "? Saves";
//         }
//         else
//           mvp[p.id].description += ", " + "? Saves";
//       }
//       if (Object.keys(mvp).length > 3)
//         break;

//       // best def
//       if (defMvp.length > 0) {
//         let p = defMvp.shift();
//         if (mvp[p.id] == undefined) {
//           mvp[p.id] = {};
//           mvp[p.id].description = "? Blockings";
//         }
//         else
//           mvp[p.id].description += ", " + "? Blockings";
//       }
//       if (Object.keys(mvp).length > 3)
//         break;

//     }

//     return mvp;
//   }

//   getGoalsMvp(candidates: Array<any>) {
//     let minGoals = 2;
//     let result = Array<any>();
//     for (let p of candidates) {
//       if (p.goals != undefined && p.goals >= minGoals)
//         result.push(p);
//     }
//     result.sort((p1, p2) => p1.goals - p2.goals);
//     return result;
//   }

//   getAssistsMvp(candidates: Array<any>) {
//     let minAssists = 2;
//     let result = Array<any>();
//     for (let p of candidates) {
//       if (p.assists != undefined && p.assists >= minAssists)
//         result.push(p);
//     }
//     result.sort((p1, p2) => p1.assists - p2.assists);
//     return result;
//   }

//   getGkMvp(candidates: Array<any>) {
//     let result = Array<any>();
//     for (let p of candidates) {
//       if (p.position != undefined && p.position.toUpperCase() == "GK")
//         result.push(p);
//     }
//     this.shuffle(result);
//     return result;
//   }

//   getDefMvp(candidates: Array<any>) {
//     let result = Array<any>();
//     let positions = ["CB", "SB", "DMF"];
//     for (let p of candidates) {
//       if (p.position == undefined)
//         continue;
//       let pos = p.position.toUpperCase();
//       if (positions.indexOf(pos) >= 0)
//         result.push(p);
//     }
//     this.shuffle(result);
//     return result;
//   }

//   shuffle(a) {
//     for (let i = a.length; i; i--) {
//       let j = Math.floor(Math.random() * i);
//       [a[i - 1], a[j]] = [a[j], a[i - 1]];
//     }
//   }

//   getMVPCandidates(date: number, matchId: string) {
//     return this.af.database.list(`/matches/data/${date}/${matchId}/mvp/candidates`);
//   }

//   getMVPCandidateVotes(date: number, matchId: string, pId: string) {
//     return this.af.database.list(`/matches/data/${date}/${matchId}/mvp/candidates/${pId}/votes`);
//   }

//   getMVPWinner(date: number, matchId: string) {
//     return this.af.database.object(`/matches/data/${date}/${matchId}/mvp/winner`);
//   }

//   voteReferee(date, matchId, rating, tags) {
//     let data: any = {}
//     data.score = rating;
//     //this.af.database.object(`/matches/data/${date}/${matchId}/referee/ratings/${this.selfId}/score`).set(rating);
//     tags.forEach(t => {
//       data[t] = rating;
//     })
//     this.af.database.object(`/matches/data/${date}/${matchId}/referee/ratings/${this.selfId}`).set(data);
//   }

//   voteMvp(date: number, matchId: string, playerId: string) {
//     let promise = this.af.database.object(`/matches/data/${date}/${matchId}/mvp/candidates/${playerId}/votes/${this.selfId}`).set(true);
//     promise.then(_ => {
//       this.removeToVote(matchId);
//       this.updateMVPWinner(date, matchId);
//     })
//   }

//   updateMVPWinner(date: number, matchId: string) {
//     let minCount = 1;
//     let max = 0;
//     let winnerId = '';
//     let description = '';
//     this.getMVPCandidates(date, matchId).subscribe(snapshots => {
//       snapshots.forEach(s => {
//         this.getMVPCandidateVotes(date, matchId, s.$key).subscribe(votes => {
//           let count = votes.length;
//           if (count >= minCount && count > max) {
//             max = count;
//             winnerId = s.$key;
//             description = s.description;
//           }
//         })
//       })
//       if (max >= minCount)
//         this.getMVPWinner(date, matchId).set({
//           description: description,
//           id: winnerId,
//           votesCount: max
//         });
//     });
//   }





//   /********** All Tournament Operations ***********/

//   getTournamentTable(id) {
//     return this.af.database.object('/tournaments/list/' + id + '/table');
//   }

//   getTournamentTableList(id) {
//     return this.af.database.list('/tournaments/list/' + id + '/table',
//       { query: { orderByChild: 'rank' } });
//   }

//   getTournament(id) {
//     return this.af.database.object('/tournaments/list/' + id);
//   }

//   getTournamentInfo(id) {
//     return this.af.database.object('/tournaments/list/' + id + '/info');
//   }

//   getTournamentName(id) {
//     return this.af.database.object('/tournaments/list/' + id + '/name');
//   }

//   removeTournament(id) {
//     this.getTournament(id).remove();
//   }

//   getTournamentAdmin(id) {
//     return this.af.database.object('/tournaments/list/' + id + '/whitelist/' + this.selfId);
//   }

//   createTournament(tournamentObj, success, error) {
//     console.log('createTournament', tournamentObj);

//     this.getTournamentList().push({ name: tournamentObj.name })
//       .then(newTournament => success())
//       .catch(err => error(err));
//   }

//   computeTournamentTable(id) {
//     console.log('computeTournamentTable');
//     this.af.database.list('/matches/list', {
//       query: {
//         orderByChild: 'tournamentId',
//         equalTo: id
//       }
//     }).subscribe(rawData => {
//       console.log('raw data', rawData);
//       let tableData = {};
//       rawData.forEach(match => {
//         if ("homeScore" in match && "awayScore" in match) {
//           this.computeOneMatch(tableData, match.homeId, match.awayId, match.homeScore, match.awayScore);
//           this.computeOneMatch(tableData, match.awayId, match.homeId, match.awayScore, match.homeScore);
//         }
//       });

//       this.computeRank(tableData);
//       console.log(tableData);
//       this.getTournamentTable(id).set(tableData).then(() => console.log('computeTournamentTable done'));
//     });
//   }

//   computeRank(tableData) {
//     let arr = [];
//     for (let key in tableData) {
//       arr.push(tableData[key]);
//       arr[arr.length - 1]["id"] = key;
//     }
//     arr.sort(function (a, b) {
//       if (a.PTS == b.PTS) {
//         let GDA = a.GS - a.GA;
//         let GDB = b.GS - b.GA;

//         if (GDA == GDB) {
//           return b.GS - a.GS;
//         }

//         return GDB - GDA;
//       }

//       return b.PTS - a.PTS;
//     });

//     for (let i = 0; i < arr.length; ++i) {
//       tableData[arr[i].id]["rank"] = i + 1;
//     }
//   }

//   computeOneMatch(result, teamId1, teamId2, score1, score2) {
//     if (!(teamId1 in result)) {
//       result[teamId1] = {
//         W: 0,
//         L: 0,
//         D: 0,
//         P: 0,
//         PTS: 0,
//         GA: 0,
//         GS: 0,
//         winList: {},
//       }
//     }

//     ++result[teamId1].P;
//     result[teamId1].GS = result[teamId1].GS + score1;
//     result[teamId1].GA = result[teamId1].GA + score2;
//     if (score1 > score2) {
//       ++result[teamId1].W;
//       result[teamId1].PTS = result[teamId1].PTS + 3;
//       result[teamId1].winList[teamId2] = true;
//     }
//     else if (score1 < score2) {
//       ++result[teamId1].L;
//     }
//     else {
//       ++result[teamId1].D;
//       result[teamId1].PTS = result[teamId1].PTS + 1;
//     }
//   }

//   /********** All Misc Operations ***********/
//   sendFeedback(content: string) {
//     this.af.database.list(`/misc/feedbacks`).push({
//       content: content,
//       createdAt: firebase.database.ServerValue.TIMESTAMP,
//       createdBy: this.selfId
//     });
//   }


// }
