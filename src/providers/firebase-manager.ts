import { Injectable } from '@angular/core';
import { OneSignal } from 'ionic-native';
import { AngularFire, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2';
import { LoginPage } from '../pages/login/login';
import { Localization } from './localization'
import { NavController, ModalController, Platform } from 'ionic-angular';
import { Subject } from 'rxjs/Subject';
import { Camera, CameraOptions } from '@ionic-native/camera';
import * as firebase from 'firebase';
import * as moment from 'moment';

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
  cachedPlayerStatsMap = {};
  //pushIdsMap = {};
  cachedAllPublicTeams;
  //matches 
  matchDatesMap = {};
  matchesByDateMap = {};
  cachedMatchesMap = {};
  teamMatchesMap = {};
  //cachedMatchSquadMap = {};
  _afTournamentList;
  cachedTournamentTablesMap = {};
  //cachedEliminationMap = {};
  cachedRegisteredTeamsMap = {};
  //squads
  cachedSquads: any = {};
  cachedTeamSquads = {};
  //player social
  cachedPlayersSocialMap = {};
  //cheerleader
  cachedPendingCheerleaders;
  cachedApprovedCheerleaders;
  sortedPublicCheerleadersMap = {};
  //admins
  admins;
  //tournaments
  cachedTournaments;
  cachedTournamentsMap = {};

  ratePlayerPoints = 100;
  teamInitialPoints = 100;
  smallImageSize = 192;
  unsubscribeTimeout = 500;
  defaultSmallImage = "assets/img/none.png";
  defaultPlayerLargeImage = "assets/img/forTest/messi_banner.png";
  defaultTeamLargeImage = "assets/img/team/court.png";
  constructor(private modalCtrl: ModalController,
    private af: AngularFire,
    private platform: Platform,
    private camera: Camera,
    private local: Localization) {
    document.addEventListener('playernotregistered', e => {
      let id = e['detail'];
      if (this.auth && id === this.auth.uid) {
        this.registerPlayer();
      }
    });

    this.getAdminsAsync();
    this.getAllPublicTeamsAsync();
  }

  initialize() {
    this.af.auth.subscribe(auth => {
      //console.log(auth);
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

  afTournamentMatchDate(id, day) {
    return this.af.database.object('/tournaments/list/' + id + '/dates/' + day);
  }


  popupLoginPage() {
    //console.log('popupLoginPage');

    let loginPage = this.modalCtrl.create(LoginPage);
    //console.log(loginPage);

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

  getBlackList() {
    return this.af.database.list(`/chats/${this.auth.uid}/black-list/`);
  }

  deleteMessage(playerId: string) {
    this.af.database.object(`/chats/${this.auth.uid}/basic-info/${playerId}`).remove();
    this.af.database.object(`/chats/${this.auth.uid}/${playerId}`).remove();
  }

  block(playerId: string) {
    this.af.database.object(`/chats/${this.auth.uid}/black-list/${playerId}`).set(true);
    OneSignal.sendTag("block-cheerleader", "true");
  }

  unblock(playerId: string) {
    this.af.database.object(`/chats/${this.auth.uid}/black-list/${playerId}`).remove();
    OneSignal.deleteTag("block-cheerleader");
  }

  isBlockedBy(userId: string) {
    return this.af.database.object(`/chats/${userId}/black-list/${this.auth.uid}`);
  }






  /****************************** Chat Room ******************************/
  updateUnread(userId: string, isUnread: boolean) {
    this.af.database.object(`/chats/${this.auth.uid}/basic-info/${userId}`).update({
      isUnread: isUnread,
    })
  }

  getChatsWithUser(userId: string, subject: any, isUnread: boolean) {
    if (isUnread) {
      this.updateUnread(userId, false);
    }

    return this.af.database.list(`/chats/${this.auth.uid}/${userId}`, {
      query: {
        limitToLast: subject
      }
    });
  }

  getClGroupChats(subject: any, isUnread: boolean) {
    if (isUnread) {
      this.updateUnread("1", false);
    }

    return this.af.database.list(`/cheerleaders/chats`, {
      query: {
        limitToLast: subject
      }
    });
  }

  addChatToUser(userId: string, content, isSystem: boolean = false, action: any = null) {
    if (!isSystem) {
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
    }

    // add to other
    let fromId = isSystem ? "0" : this.auth.uid;
    this.af.database.list(`/chats/${userId}/${fromId}`).push({
      createdAt: firebase.database.ServerValue.TIMESTAMP,
      content: content,
      isFromSelf: false,
      action: action
    })

    this.af.database.object(`/chats/${userId}/basic-info/${fromId}`).set({
      isSystem: isSystem,
      isUnread: true,
      lastContent: content,
      lastTimestamp: firebase.database.ServerValue.TIMESTAMP,
    })
  }

  addClGroupChat(content: string) {
    this.af.database.list(`/cheerleaders/chats`).push({
      createdAt: firebase.database.ServerValue.TIMESTAMP,
      content: content,
      senderId: this.auth.uid
    })

    let onApprovedCheerleadersReady = e => {
      this.getApprovedCheerleaders().forEach(cl => {
        this.af.database.object(`/chats/${cl.$key}/basic-info/1`).set({
          isUnread: true,
          lastContent: content,
          lastTimestamp: firebase.database.ServerValue.TIMESTAMP,
          senderId: this.auth.uid,
          groupName: "cheerleaders"
        })
      })
      document.removeEventListener('approvedcheerleadersready', onApprovedCheerleadersReady);
    }
    document.addEventListener('approvedcheerleadersready', onApprovedCheerleadersReady);
    this.getApprovedCheerleadersAsync();
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
        console.log('getTeamStatsAsync', snapshot);
        this.cachedTeamStatsMap[id] = snapshot;
        this.FireCustomEvent('teamstatsdataready', id);
      });
    }
  }

  getAllPublicTeams() {
    return this.cachedAllPublicTeams;
  }

  getAllPublicTeamsAsync() {
    if (!this.getAllPublicTeams()) {
      this.af.database.list(`/public/teams/`, {
        query: { orderByChild: 'name' }
      }).subscribe(snapshots => {
        this.cachedAllPublicTeams = snapshots;
        //console.log('allpublicteamsready');
      });
    }
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
      setTimeout(() => {
        sub.unsubscribe();
        this.sortedPublicTeams = snapshots.reverse();
        for (let i = 0; i < snapshots.length; ++i) {
          this.sortedPublicTeamsMap[snapshots[i].$key] = snapshots[i];
        }
        this.FireEvent('publicteamschanged');
      }, this.unsubscribeTimeout);
    });

    if (this.queryTeams)
      this.queryTeams.off();

    let ref = firebase.database().ref(`/public/teams/`);
    this.queryTeams = ref.orderByChild(orderby).limitToLast(count);

    let self = this;
    this.queryTeams.on("child_changed", function (snapshot) {
      let val = snapshot.val();
      //console.log('TeamPublicDataChanged', val);
      val['$key'] = snapshot.key;
      self.sortedPublicTeamsMap[snapshot.key] = val;
      self.FireCustomEvent('teampublicready', snapshot.key);
      //console.log("child_changed", snapshot.key);
    });
  }

  getTeamAsync(teamId) {
    if (this.getTeam(teamId))
      this.FireCustomEvent('teamready', teamId);
    else {
      this.af.database.object(`/teams/${teamId}`).subscribe(snapshot => {
        if (snapshot.$exists()) {
          //console.log(snapshot);
          if ('$value' in snapshot && null == snapshot.$value) {
            //team deleted
            delete this.cachedTeamsMap[teamId];
          }
          else {
            if ('points' in snapshot) {
              if ('img/none.png' === snapshot['basic-info'].logo)
                snapshot['basic-info'].logo = 'assets/img/none.png';
              this.cachedTeamsMap[teamId] = snapshot;
              this.FireCustomEvent('teamready', teamId);
            }
            else {
              //fix all missing properties
              this.af.database.object(`/teams/${teamId}`).update(
                {
                  yearBuilt: 2016,
                  points: this.teamInitialPoints
                });
            }
          }
        }
      })
    }
  }

  getTeam(teamId) {
    return this.cachedTeamsMap[teamId];
  }

  increaseTeamPopularity(teamId) {
    //cause pulic team changed to fire multiple times, need a fix
    let teamPublicData = this.sortedPublicTeamsMap[teamId];
    if (teamPublicData) {
      this.af.database.object(`public/teams/${teamId}`).update({ popularity: teamPublicData.popularity + 1 });
    };
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
      //setTimeout(() => {
      sub.unsubscribe();
      //}, this.unsubscribeTimeout);

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
    //set default team if no team
    if (isDefault || !this.selfTeamId())
      this.setDefaultTeam(id);
  }

  afTeam(teamId: string) {
    return this.af.database.object(`/teams/${teamId}`);
  }

  afTeamPublic(teamId: string) {
    return this.af.database.object(`public/teams/${teamId}`);
  }

  quitTeam(teamId) {
    //remove from self teams
    //this.af.database.list(`players/${this.selfId()}/teams/${id}`).remove();
    //this.af.database.list(`teams/${id}/players/${this.selfId()}`).remove();
    this.removeFromTeam(this.selfId(), teamId);
  }

  saveTeamNickName(playerId, teamId, nickName) {
    this.af.database.object(`teams/${teamId}/players/${playerId}/nickName`).set(nickName);
  }

  removeFromTeam(playerId, teamId) {
    this.af.database.object(`players/${playerId}/teams/${teamId}`).remove();
    this.af.database.object(`teams/${teamId}/players/${playerId}`).remove();
  }

  deleteTeam(id) {
    this.afTeam(id).remove();
    this.afTeamPublic(id).remove();
  }

  setDefaultTeam(id) {
    this.afPlayerBasic(this.selfId()).update({ teamId: id });
  }

  updateTeamName(id: string, name: string) {
    this.af.database.object(`teams/${id}/basic-info/name`).set(name);
    this.getAfTeamPublicName(id).set(name);
  }

  updateTeamLogo(id: string, logo: string) {
    console.log('updateTeamLogo', id, logo);
    this.af.database.object(`teams/${id}/basic-info/logo`).set(logo);
  }

  updateTeamPhotoLarge(teamId, photoUrl) {
    this.af.database.object(`/teams/${teamId}/photoLarge`).set(photoUrl);
  }

  promoteNewCaptain(teamId: string, playerId: string) {
    this.af.database.object(`teams/${teamId}/basic-info/captain`).set(playerId);
  }

  // for check team from clipboard
  getAfTeamPublicName(teamId: string) {
    return this.af.database.object(`/public/teams/${teamId}/name`);
  }

  setTeamRole(teamId, playerId, role) {
    this.af.database.object(`teams/${teamId}/players/${playerId}/teamRole`).set(role);
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
        //this.pushIdsMap[this.auth.uid] = ids.userId;
      });
    }
  }

  updateWechatShareTime(playerId) {
    if (playerId) {
      let now = moment().unix() * 1000;
      this.af.database.object(`/players/${playerId}/wechatShareTime`).set(now);
    }
  }

  updateFacebookShareTime(playerId) {
    if (playerId) {
      let now = moment().unix() * 1000;
      this.af.database.object(`/players/${playerId}/fbShareTime`).set(now);
    }
  }

  updatePlayerPhoto(id: string, photoUrl) {
    console.log('updatePlayerPhoto', id, photoUrl);
    this.af.database.object(`/players/${id}/basic-info/photoURL`).set(photoUrl);
  }

  updatePlayerPhotoMedium(id: string, photoUrl) {
    this.af.database.object(`/players/${id}/photoMedium`).set(photoUrl);
  }

  updatePlayerPhotoLarge(id: string, photoUrl) {
    this.af.database.object(`/players/${id}/photoLarge`).set(photoUrl);
  }

  increasePlayerPopularity(id) {
    let publicData = this.sortedPublicPlayersMap[id];
    if (publicData) {
      let p = publicData.popularity ? publicData.popularity + 1 : 1;
      this.af.database.object(`public/players/${id}/popularity`).set(p);
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
    if (this.getPlayer(id)) {
      this.FireCustomEvent('playerready', id);
    }
    else {
      this.af.database.object(`/players/${id}`).subscribe(snapshot => {
        if (snapshot && snapshot['basic-info']) {
          if ('points' in snapshot) {
            if ('img/none.png' === snapshot['basic-info'].photoURL)
              snapshot['basic-info'].photoURL = 'assets/img/none.png';
            this.cachedPlayersMap[id] = snapshot;
            this.FireCustomEvent('playerready', id);
          }
          else {
            //fix all missing properties
            this.af.database.object(`/players/${id}`).update(
              {
                joinTime: firebase.database.ServerValue.TIMESTAMP,
                points: this.ratePlayerPoints
              });
          }
        }
        else
          this.FireCustomEvent('playernotregistered', id);
      });
    }
  }

  getPlayer(id) {
    return this.cachedPlayersMap[id];
  }

  getPlayerStats(playerId) {
    return this.cachedPlayerStatsMap[playerId];
  }

  getPlayerStatsAsync(playerId) {
    if (this.getPlayerStats(playerId))
      this.FireCustomEvent('playerstatsready', playerId);
    else {
      this.af.database.object(`/player_stats/${playerId}`).subscribe(snapshot => {
        if (snapshot.$exists()) {
          this.cachedPlayerStatsMap[playerId] = snapshot;
          this.FireCustomEvent('playerstatsready', playerId);
        }
      });
    }
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
      setTimeout(() => {
        sub.unsubscribe();
        this.sortedPublicPlayers = snapshots.reverse();
        for (let i = 0; i < snapshots.length; ++i) {
          this.sortedPublicPlayersMap[snapshots[i].$key] = snapshots[i];
        }
        this.FireEvent('publicplayerschanged');
      }, this.unsubscribeTimeout);
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

  getPlayerSocial(playerId) {
    return this.cachedPlayersSocialMap[playerId];
  }

  getPlayerSocialAsync(playerId) {
    if (this.getPlayerSocial(playerId))
      this.FireCustomEvent('playersocialready', playerId);
    else {
      this.af.database.object(this.getPlayerSocialRef(playerId)).subscribe(snapshot => {
        this.cachedPlayersSocialMap[playerId] = snapshot;
        this.FireCustomEvent('playersocialready', playerId);
      });
    }
  }

  getPlayerSocialRef(playerId) {
    return `/player_social/${playerId}/`;
  }

  getPlayerSocialVotesRef(playerId) {
    return this.getPlayerSocialRef(playerId) + 'votes/' + this.selfId() + '/';
  }

  likePlayer(playerId, val, tag) {
    this.af.database.object(this.getPlayerSocialVotesRef(playerId) + tag + '/').set(val);
  }

  //Fire document events 
  FireEvent(name) {
    //  console.log(name);
    var event = new Event(name);
    document.dispatchEvent(event);
  }

  FireCustomEvent(name, data) {
    //console.log(name, data);
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

    //remove @
    let userName = user.email;
    if (userName) {
      let len = userName.indexOf('@');
      if (len != -1)
        userName = userName.substr(0, len);
    }
    //todo
    this.afPlayerBasic(this.auth.uid).update({
      photoURL: photoURL,
      displayName: user.displayName || userName,
      created: true
    });
    //update player public
    this.af.database.object(this.playerPublicRef(this.auth.uid)).update({ popularity: 1 });
  }





  /****************************** Matches ******************************/
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

  getTournaments() {
    return this.cachedTournaments;
  }

  getTournamentsAsync() {
    if (this.getTournaments())
      this.FireEvent('tournamentsready');
    else {
      this.afTournamentList().subscribe(snapshots => {
        if (this.cachedTournaments) {
          this.cachedTournaments.splice(0);
          snapshots.forEach(snapshot => {
            this.cachedTournamentsMap[snapshot.$key] = snapshot;
            this.cachedTournaments.push(snapshot);
          });
        }
        else {
          this.cachedTournaments = snapshots;
          snapshots.forEach(snapshot => {
            this.cachedTournamentsMap[snapshot.$key] = snapshot;
          });
        }
        this.FireEvent('tournamentsready');
      });
    }
  }

  getTournament(tournamentId): any {
    //console.log(this.cachedTournamentsMap);
    return this.cachedTournamentsMap[tournamentId];
  }

  afTournamentAdmin(tournamentId) {
    return this.af.database.object('/tournaments/list/' + tournamentId + '/whitelist/' + this.selfId());
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
        this.afMatchDates().subscribe(snapshots => {
          this.matchDatesMap[id] = [];
          snapshots.forEach(snapshot => {
            this.matchDatesMap[id].push(Number(snapshot.$key));
          });
          this.matchDatesMap[id].sort((a, b) => { return b - a });
          //console.log(this.matchDatesMap[id]);
          this.FireCustomEvent('matchdatesready', id);
        });
      }
      else {
        this.afTournamentDates(id).subscribe(snapshots => {
          this.matchDatesMap[id] = [];
          snapshots.forEach(snapshot => {
            this.matchDatesMap[id].push(Number(snapshot.$key));
          });
          this.matchDatesMap[id].sort((a, b) => { return b - a });
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

  getMatchesByDateAsync(date, tournamentId) {
    let afQuery = this.af.database.list(this.matchListRef(), {
      query: {
        orderByChild: 'date',
        equalTo: date
      }
    });

    let sub = afQuery.subscribe(snapshots => {
      //console.log('pull', snapshots);
      setTimeout(() => {
        sub.unsubscribe();
        this.matchesByDateMap[date] = snapshots.filter(m => {
          return tournamentId === 'all' || m.tournamentId === tournamentId;
        });

        //this.matchesByDateMap[date].forEach(snapshot => {
        //monitor match change
        //this.getMatchAsync(snapshot.$key);
        //});
        //this.matchesByDateMap[date] = matches;
        this.FireCustomEvent('matchesbydateready', date);
      }, this.unsubscribeTimeout);
    });
  }

  getMatch(id) {
    return this.cachedMatchesMap[id];
  }

  setMatchInformed(matchId, teamId) {
    this.af.database.object(`/matches/list/${matchId}/informed/${teamId}`).set(true);
  }

  getMatchAsync(id) {
    if (this.getMatch(id))
      this.FireCustomEvent('matchready', id);
    else {
      this.afMatch(id).subscribe(snapshot => {
        if (snapshot.$exists()) {
          this.cachedMatchesMap[id] = snapshot;
          this.FireCustomEvent('matchready', id);
        }
      });
    }
  }

  deleteTeamSquad(teamId, squadId) {
    this.af.database.object(`/team_squads/${teamId}/squads/${squadId}/`).remove();
  }

  getTeamSquads(teamId) {
    return this.cachedTeamSquads[teamId];
  }

  getTeamSquadsAsync(teamId) {
    console.log('getTeamSquadsAsync', teamId);

    if (this.getTeamSquads(teamId))
      this.FireCustomEvent('teamsquadsready', teamId);
    else {
      this.af.database.list(`/team_squads/${teamId}/squads/`).subscribe(squads => {
        this.cachedTeamSquads[teamId] = squads;
        this.FireCustomEvent('teamsquadsready', teamId);
      });
    }
  }

  getTeamMatches(teamId) {
    return this.teamMatchesMap[teamId];
  }

  getTeamMatchesAsync(teamId) {
    if (this.getTeamMatches(teamId))
      this.FireCustomEvent('teammatchesready', teamId);
    else {
      this.af.database.list('/team_squads/' + teamId + '/matches').subscribe(snapshots => {
        snapshots.sort((a, b) => { return b.time - a.time });
        this.teamMatchesMap[teamId] = snapshots;
        this.FireCustomEvent('teammatchesready', teamId);
      });
    }

    // let sub = this.af.database.list('/team_squads/' + teamId + '/matches', {
    //   query: {
    //     orderByChild: 'time'
    //   }
    // }).subscribe(snapshots => {
    //   setTimeout(() => {
    //     sub.unsubscribe();
    //     snapshots.sort((a, b) => { return b.time - a.time });
    //     console.log(snapshots);

    //     let result = {
    //       id: teamId,
    //       matches: snapshots
    //     };
    //     this.FireCustomEvent('teammatchesready', result);
    //   }, this.unsubscribeTimeout);
    // })
  }

  afMatchList() {
    return this.af.database.list('/matches/list');
  }

  afMatchDate(day) {
    return this.af.database.object('/matches/dates/' + day);
  }

  deleteMatchSquad(teamId, matchId) {
    this.af.database.object(this.getMatchSquadRef(teamId, matchId)).remove();
  }

  deleteMatch(matchId) {
    let match = this.cachedMatchesMap[matchId];
    let homeId, awayId;
    let date = match.date;
    if ('homeId' in match) {
      this.deleteMatchSquad(match.homeId, matchId);
      homeId = match.homeId;
    }
    if ('awayId' in match) {
      this.deleteMatchSquad(match.awayId, matchId);
      awayId = match.awayId;
    }

    this.afMatch(matchId).remove().then(() => {
      this.FireCustomEvent('matcheschanged', date);
      if (homeId)
        this.FireCustomEvent('teammatcheschanged', homeId);
      if (awayId)
        this.FireCustomEvent('teammatcheschanged', awayId);
    });
  }

  updateTeamMatches(matchId, matchObj) {
    console.log('updateTeamMatches', matchId, matchObj);

    //update team matches list
    if ('time' in matchObj && 'homeId' in matchObj && 'awayId' in matchObj) {
      this.af.database.object(this.getMatchSquadRef(matchObj.homeId, matchId) + 'time').set(matchObj.time);
      this.af.database.object(this.getMatchSquadRef(matchObj.awayId, matchId) + 'time').set(matchObj.time);
    }
  }

  scheduleMatch(matchObj) {
    console.log('scheduleMatch', matchObj);
    this.afMatchList().push(matchObj).then(newMatch => {
      this.updateTeamMatches(newMatch.key, matchObj);
    });
    this.afMatchDate(matchObj.date).set(true);
    if (matchObj.tournamentId)
      this.afTournamentMatchDate(matchObj.tournamentId, matchObj.date).set(true);
  }

  updateMatch(id, matchObj) {
    let now = moment().unix() * 1000;
    matchObj['updateTime'] = now;
    console.log('updateMatch', matchObj);
    let date = matchObj.date;
    this.afMatch(id).update(matchObj).then(() => {
      this.FireCustomEvent('matcheschanged', date);
    });;
    if (matchObj.date) {
      this.afMatchDate(matchObj.date).set(true);
      if (matchObj.tournamentId)
        this.afTournamentMatchDate(matchObj.tournamentId, matchObj.date).set(true);
      this.updateTeamMatches(id, matchObj);
    }
  }

  setJerseyColor(matchId, teamId, color) {
    this.af.database.object(`/matches/list/${matchId}/colors/${teamId}`).set(color);
  }

  createTeamSquad(teamId, squadObj) {
    console.log('createTeamSquad', teamId, squadObj);
    this.af.database.list(`/team_squads/${teamId}/squads/`).push(squadObj);
  }

  updateTeamSquad(teamId, squadId, squadObj) {
    this.af.database.object(`/team_squads/${teamId}/squads/${squadId}`).set(squadObj);
  }

  saveMatchSquad(teamId, matchId, squadObj) {
    console.log('updateMatch', teamId, matchId, squadObj);
    this.af.database.object(`/team_squads/${teamId}/matches/${matchId}`).update(squadObj);
  }

  getMatchSquad(teamId, matchId) {
    if (this.cachedSquads[teamId])
      return this.cachedSquads[teamId][matchId];
    return null;
  }

  getMatchSquadAsync(teamId, matchId) {
    let detail = {
      teamId: teamId,
      matchId: matchId
    };
    if (this.getMatchSquad(teamId, matchId)) {
      this.FireCustomEvent('matchsquadready', detail);
    }
    else {
      this.af.database.object(this.getMatchSquadRef(teamId, matchId)).subscribe(snapshot => {
        if (snapshot.$exists()) {
          this.cachedSquads[teamId] = {};
          this.cachedSquads[teamId][matchId] = snapshot;
          this.FireCustomEvent('matchsquadready', detail);
        }
      });
    }
  }

  updateMatchParticipants(teamId, matchId, participants) {
    this.af.database.object(this.getMatchSquadRef(teamId, matchId) + 'participants').set(participants);
    this.af.database.object(this.getMatchSquadRef(teamId, matchId) + 'participantsConfirmed').set(true);
  }

  getMatchSquadRef(teamId, matchId) {
    return `/team_squads/${teamId}/matches/${matchId}/`;
  }


  attendMatch(teamId: string, matchId: string) {
    this.af.database.object(this.getMatchSquadRef(teamId, matchId) + 'attendance/' + this.selfId()).set(1);
  }

  absentMatch(teamId: string, matchId: string) {
    this.af.database.object(this.getMatchSquadRef(teamId, matchId) + 'attendance/' + this.selfId()).set(0);
  }

  TBDMatch(teamId: string, matchId: string) {
    this.af.database.object(this.getMatchSquadRef(teamId, matchId) + 'attendance/' + this.selfId()).set(2);
  }

  ratePlayers(teamId, matchId, ratings) {
    this.af.database.object(this.getMatchSquadRef(teamId, matchId) + 'ratings/' + this.selfId()).set(ratings);
    this.playerEarnPoints(this.selfId(), this.ratePlayerPoints, this.getPlayer(this.selfId()).points + this.ratePlayerPoints);
  }

  getTournamentTableList(id) {
    return this.af.database.list('/tournaments/list/' + id + '/table',
      { query: { orderByChild: 'rank' } });
  }

  getEliminationList(id) {
    return this.af.database.list('/tournaments/list/' + id + '/eliminations');
  }


  getTournamentTable(tournamentId, groupId = null) {
    //return this.cachedTournamentTablesMap[id];
    let tournament = this.getTournament(tournamentId);
    if (!tournament)
      return null;

    if (tournament.table) {
      //console.log('getTournamentTable', tournament.table);

      if (groupId != null) {
        //console.log('group getTournamentTable', groupId, tournament.table);
        return tournament.table[groupId];
      }

      return tournament.table;
    }

    return null;
  }

  //  // getTournamentTableAsync(tournamentId, groupId = null) {
  //  //   let obj = {
  //   ////    tournamentId: tournamentId,
  //       groupId: groupId
  //   //  };
  //     //if (this.getTournamentTable(id))
  //       this.FireCustomEvent('tournamenttableready', obj);
  //     // else {
  //     //   this.getTournamentTableList(id).subscribe(snapshots => {
  //     //     this.cachedTournamentTablesMap[id] = snapshots;
  //     //     this.FireCustomEvent('tournamenttableready', id);
  //     //   });
  //     // }
  //   }

  getEliminations(tournamentId) {
    let tournament = this.getTournament(tournamentId);
    //console.log('getEliminations', tournament);

    if (tournament && tournament.eliminations)
      return tournament.eliminations;
    return null;
    //return this.cachedEliminationMap[id];
  }


  getEliminationsAsync(id) {
    if (this.getEliminations(id))
      this.FireCustomEvent('eliminationsready', id);
    // else {
    //   this.getEliminationList(id).subscribe(snapshots => {
    //     this.cachedEliminationMap[id] = snapshots;
    //     this.FireCustomEvent('eliminationsready', id);
    //   });
    // }
  }

  registerLeague(teamId: string, leagueId: string) {
    this.af.database.object(`/tournaments/list/${leagueId}/registered/${teamId}`).set({
      timestamp: firebase.database.ServerValue.TIMESTAMP
    })
  }

  getRegisteredTeamList(leagueId: string) {
    return this.af.database.list('/tournaments/list/' + leagueId + '/registered',
      { query: { orderByChild: 'timestamp' } });
  }

  getRegisteredTeams(leagueId: string) {
    return this.cachedRegisteredTeamsMap[leagueId];
  }

  getRegisteredTeamsAsync(leagueId: string) {
    if (this.getRegisteredTeams(leagueId))
      this.FireCustomEvent('registeredteamsready', leagueId);
    else {
      this.getRegisteredTeamList(leagueId).subscribe(snapshots => {
        this.cachedRegisteredTeamsMap[leagueId] = snapshots;
        this.FireCustomEvent('registeredteamsready', leagueId);
      });
    }
  }





  /****************************** Points ******************************/
  /*
  updatePlayerPoints(targetId: string, usedPoint: number, newPoints: number) {
    console.log(this.auth);

    this.af.database.object(`/players/${this.auth.uid}/points`).update({ total: newPoints });
    this.af.database.object(`/players/${this.auth.uid}/points/to/${targetId}`).set(usedPoint);
    this.af.database.object(`/players/${targetId}/points/from/${this.auth.uid}`).set(usedPoint);
  }
  */

  // DONOT use this, use playerEarnPoints instead
  updatePlayerPoints(playerId: string, newPoints: number) {
    this.af.database.object(`/players/${playerId}/points`).set(newPoints);
  }

  // DONOT use this, use teamEarnPoints instead
  updateTeamPoints(teamId: string, newPoints: number) {
    this.af.database.object(`/teams/${teamId}/points`).set(newPoints);
  }

  placeOrder(fromId: string, toId: string, amount: number) {
    this.af.database.list(`/orders`).push({
      from: fromId,
      to: toId,
      amount: amount,
      timestamp: firebase.database.ServerValue.TIMESTAMP
    })
  }

  unlockCheerleader(cheerleaderId: string, newPoints: number, newUnlockPoints: number, selfNewPoints: number) {
    this.placeOrder(this.auth.uid, cheerleaderId, newUnlockPoints - 10);
    this.updatePlayerPoints(cheerleaderId, newPoints);
    this.af.database.object(`/public/cheerleaders/${cheerleaderId}/unlockPoints`).set(newUnlockPoints);

    this.updatePlayerPoints(this.auth.uid, selfNewPoints);
    this.af.database.object(`/players/${this.auth.uid}/cheerleaders/${cheerleaderId}`).set(true);
  }

  playerEarnPoints(playerId: string, amount: number, newPoints: number) {
    this.placeOrder("0-to-player", playerId, amount);
    this.updatePlayerPoints(playerId, newPoints);
  }

  teamEarnPoints(teamId: string, amount: number, newPoints: number) {
    //console.log('teamEarnPoints', teamId, amount, newPoints);
    this.placeOrder("0-to-team", teamId, amount);
    this.updateTeamPoints(teamId, newPoints);
  }







  /****************************** Misc ******************************/
  /*
  postNotification(senderId: string, targetId: string) {
    let notificationObj = {
      app_id: "f6268d9c-3503-4696-8e4e-a6cf2c028fc6",
      contents: "user name",
      include_player_ids: [targetId]
    };

    OneSignal.postNotification(notificationObj);

  }
  */

  sendFeedback(content: string) {
    this.af.database.list(`misc/feedbacks/`).push({
      content: content,
      creator: this.auth.uid,
      timestamp: firebase.database.ServerValue.TIMESTAMP
    })
  }


  b64toBlob(b64Data, contentType, sliceSize) {
    contentType = contentType || '';
    sliceSize = sliceSize || 256;

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

  selectImgUploadGetUrl(imgId, width, height, success, error) {
    let getImgSuccess = data => {
      this.updateImgGetUrl(data, imgId, width, height, success, error);
    }

    let getImgFail = err => { };

    this.selectImgGetData(width, height, getImgSuccess, getImgFail);
  }

  selectImgGetData(width, height, success, error) {
    let self = this;
    const options: CameraOptions = {
      allowEdit: true,
      quality: 75,
      encodingType: this.camera.EncodingType.JPEG,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.DATA_URL,
      targetWidth: width,
      targetHeight: height
    };

    this.camera.getPicture(options).then(imageData => {
      success(imageData);
    }, (err) => {
      error(err);
    });
  }

  updateImgGetUrl(imageData, imgId, width, height, success, error) {
    let self = this;

    // imageData is either a base64 encoded string or a file URI
    // If it's base64:
    let contentType = 'image/jpg';
    let b64Data = imageData;

    let blob = this.b64toBlob(b64Data, contentType, width);

    let metadata = {
      contentType: 'image/jpg',
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
  pendingCheerleadersRef() {
    return '/cheerleaders/pending/';
  }

  approvedCheerleadersRef() {
    return '/cheerleaders/approved/';
  }

  submitCheerleaderInfo(url) {
    this.af.database.object(this.pendingCheerleadersRef() + this.auth.uid).set({ photo: url });
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
      role: 'cheerleader',
      photoMedium: cheerleader.photoMedium
    });
    this.af.database.object(this.pendingCheerleadersRef() + id).remove();
    this.af.database.object(this.approvedCheerleadersRef() + id).set(true);

    let cheerleaderPublic = this.getPlayerPublic(id);
    //console.log(cheerleaderPublic);
    this.af.database.object(this.cheerleaderPublicRef(id)).set({
      popularity: cheerleaderPublic.popularity || 1,
      unlockPoints: 100,
      received: 0,
      responsed: 0,
      responseRate: 0
    });
    this.af.database.object(this.playerPublicRef(id)).remove();

    // add group chat entry
    let content = {
      en: this.local.getString('welcomeToClGroup', 'en'),
      zh: this.local.getString('welcomeToClGroup', 'zh')
    }
    this.af.database.object(`/chats/${id}/basic-info/1/`).set({
      groupName: "cheerleaders",
      isSystem: false,
      isUnread: true,
      lastContent: content,
      lastTimestamp: firebase.database.ServerValue.TIMESTAMP
    })
  }

  getCheerleaderPublic(id) {
    return this.sortedPublicCheerleadersMap[id];
  }

  getCheerleaderPublicAsync(id) {
    if (this.sortedPublicCheerleadersMap[id])
      this.FireCustomEvent('cheerleaderpublicready', id);
    else {
      this.af.database.object(`/public/cheerleaders/${id}`).subscribe(snapshot => {
        this.sortedPublicCheerleadersMap[id] = snapshot;
        this.FireCustomEvent('cheerleaderpublicready', id);
      });
    }
  }

  afPendingCheerleaderSelf() {
    if (this.selfId())
      return this.af.database.object(this.pendingCheerleadersRef() + this.selfId());
    return null;
  }

  //admins 
  getAdminsAsync() {
    if (!this.admins) {
      this.af.database.object('/admins/').subscribe(snapshot => {
        this.admins = snapshot;
        for (let adminId in snapshot) {
          this.getPlayerAsync(adminId);
        }
      });
    }
  }

  logout() {
    this.af.auth.logout();
  }

  migrateData() {
    //match time for sorting
    let sub = this.af.database.list(this.matchListRef()).subscribe(matches => {
      sub.unsubscribe();
      matches.forEach(match => {
        if ('homeId' in match && 'awayId' in match && 'time' in match) {
          this.af.database.object(this.getMatchSquadRef(match.homeId, match.$key) + 'time').set(match.time);
          this.af.database.object(this.getMatchSquadRef(match.awayId, match.$key) + 'time').set(match.time);
        }
      });
    })
  }

  //compute
  afTournamentTable(tournamentId, groupId) {
    let path = `/tournaments/list/${tournamentId}/table/`;
    if (groupId) {
      path += groupId;
    }
    return this.af.database.object(path);
  }

  computeTournamentTable(tournamentId) {
    let tournament = this.getTournament(tournamentId);
    if (!tournament)
      return;

    //console.log('computeTournamentTable');
    let sub = this.af.database.list('/matches/list', {
      query: {
        orderByChild: 'tournamentId',
        equalTo: tournamentId
      }
    }).subscribe(rawData => {
      sub.unsubscribe();

      if (tournament.groups) {
        tournament.groups.forEach(groupId => {
          let groupData = rawData.filter(match => {
            return groupId == match.groupId;
          });
          //console.log('compute group table', groupData);

          let tableData = {};
          groupData.forEach(match => {
            if ("homeScore" in match && "awayScore" in match) {
              this.computeOneMatch(tableData, match.homeId, match.awayId, match.homeScore, match.awayScore);
              this.computeOneMatch(tableData, match.awayId, match.homeId, match.awayScore, match.homeScore);
            }
          });

          this.computeRank(tableData);
          //console.log(tableData);
          this.afTournamentTable(tournamentId, groupId).set(tableData).then(() => console.log('computeTournamentTable done'));
        });
      }
    });
  }

  computeRank(tableData) {
    let arr = [];
    for (let key in tableData) {
      arr.push(tableData[key]);
      arr[arr.length - 1]["id"] = key;
    }
    arr.sort(function (a, b) {
      if (a.PTS == b.PTS) {
        let GDA = a.GS - a.GA;
        let GDB = b.GS - b.GA;

        if (GDA == GDB) {
          return b.GS - a.GS;
        }

        return GDB - GDA;
      }

      return b.PTS - a.PTS;
    });

    for (let i = 0; i < arr.length; ++i) {
      tableData[arr[i].id]["rank"] = i + 1;
    }
  }

  computeOneMatch(result, teamId1, teamId2, score1, score2) {
    //console.log('compute one match', teamId1, teamId2);
    if (!(teamId1 in result)) {
      result[teamId1] = {
        W: 0,
        L: 0,
        D: 0,
        P: 0,
        PTS: 0,
        GA: 0,
        GS: 0,
        winList: {},
      }
    }

    ++result[teamId1].P;
    result[teamId1].GS = result[teamId1].GS + score1;
    result[teamId1].GA = result[teamId1].GA + score2;
    if (score1 > score2) {
      ++result[teamId1].W;
      result[teamId1].PTS = result[teamId1].PTS + 3;
      result[teamId1].winList[teamId2] = true;
    }
    else if (score1 < score2) {
      ++result[teamId1].L;
    }
    else {
      ++result[teamId1].D;
      result[teamId1].PTS = result[teamId1].PTS + 1;
    }
  }
}
