import { Injectable } from '@angular/core';
import { OneSignal } from 'ionic-native';
import { AngularFire, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2';
import { LoginPage } from '../pages/login/login';
import { NavController, ModalController, Platform } from 'ionic-angular';
import { Subject } from 'rxjs/Subject';
import { Camera, CameraOptions } from '@ionic-native/camera';
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
  cachedMatchesMap = {};
  //cachedMatchSquadMap = {};
  _afTournamentList;
  cachedTournamentTablesMap = {};
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

  ratePlayerPoints = 100;

  constructor(private modalCtrl: ModalController,
    private af: AngularFire,
    private platform: Platform,
    private camera: Camera) {
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
    console.log('popupLoginPage');

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

  deleteMessage(playerId: string) {
    this.af.database.object(`/chats/${this.auth.uid}/basic-info/${playerId}`).remove();
    this.af.database.object(`/chats/${this.auth.uid}/${playerId}`).remove();
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

  addChatToUser(userId: string, content: string, isSystem: boolean = false) {
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
      isFromSelf: false
    })

    this.af.database.object(`/chats/${userId}/basic-info/${fromId}`).set({
      isSystem: isSystem,
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
      let sub = this.af.database.list(`/public/teams/`, {
        query: { orderByChild: 'name' }
      }).subscribe(snapshots => {
        //sub.unsubscribe();
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
        if (snapshot.$exists()) {
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

  quitTeam(id) {
    //remove from self teams
    this.af.database.list(`players/${this.selfId()}/teams`).remove(id);
    this.af.database.list(`teams/${id}/players`).remove(this.selfId());
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

  promoteNewCaptain(teamId: string, playerId: string) {
    this.af.database.object(`teams/${teamId}/basic-info/captain`).set(playerId);
  }

  // for check team from clipboard
  getAfTeamPublicName(teamId: string) {
    return this.af.database.object(`/public/teams/${teamId}/name`);
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

  updatePlayerPhoto(id: string, photoUrl) {
    console.log('updatePlayerPhoto', id, photoUrl);
    this.af.database.object(`/players/${id}/basic-info/photoURL`).set(photoUrl);
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
    if (this.cachedPlayersMap[id]) {
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
      sub.unsubscribe();
      this.matchesByDateMap[date] = snapshots.filter(m => {
        return tournamentId === 'all' || m.tournamentId === tournamentId;
      });

      this.matchesByDateMap[date].forEach(snapshot => {
        //monitor match change
        //this.getMatchAsync(snapshot.$key);
      });
      //this.matchesByDateMap[date] = matches;
      this.FireCustomEvent('matchesbydateready', date);
    });
  }

  getMatch(id) {
    return this.cachedMatchesMap[id];
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

  getTeamSquads(teamId) {
    return this.cachedTeamSquads[teamId];
  }

  getTeamSquadsAsync(teamId) {
    if (this.getTeamSquads(teamId))
      this.FireCustomEvent('teamsquadsready', teamId);
    else {
      this.af.database.list(`/team_squads/${teamId}/squads/`).subscribe(squads => {
        this.cachedTeamSquads[teamId] = squads;
        this.FireCustomEvent('teamsquadsready', teamId);
      });
    }
  }

  getTeamMatchesAsync(teamId) {
    let sub = this.af.database.list('/team_squads/' + teamId + '/matches', {
      query: {
        orderByChild: 'time'
      }
    }).subscribe(snapshots => {
      sub.unsubscribe();
      snapshots.sort((a, b) => { return b.time - a.time });
      //console.log(snapshots);

      let result = {
        id: teamId,
        matches: snapshots
      };
      this.FireCustomEvent('teammatchesready', result);
    })
  }

  afMatchList() {
    return this.af.database.list('/matches/list');
  }

  afMatchDate(day) {
    return this.af.database.object('/matches/dates/' + day);
  }

  deleteMatch(id) {
    this.afMatch(id).remove().then(() => {
      this.FireEvent('matcheschanged')
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
    console.log('updateMatch', matchObj);
    this.afMatch(id).update(matchObj);
    if (matchObj.date) {
      this.afMatchDate(matchObj.date).set(true);
      if (matchObj.tournamentId)
        this.afTournamentMatchDate(matchObj.tournamentId, matchObj.date).set(true);
      this.updateTeamMatches(id, matchObj);
    }
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

  ratePlayers(teamId, matchId, ratings) {
    this.af.database.object(this.getMatchSquadRef(teamId, matchId) + 'ratings/' + this.selfId()).set(ratings);
    this.updatePlayerPoints(this.selfId(), this.getPlayer(this.selfId()).points + this.ratePlayerPoints);
  }

  getTournamentTableList(id) {
    return this.af.database.list('/tournaments/list/' + id + '/table',
      { query: { orderByChild: 'rank' } });
  }

  getTournamentTable(id) {
    return this.cachedTournamentTablesMap[id];
  }

  getTournamentTableAsync(id) {
    if (this.getTournamentTable(id))
      this.FireCustomEvent('tournamenttableready', id);
    else {
      this.getTournamentTableList(id).subscribe(snapshots => {
        this.cachedTournamentTablesMap[id] = snapshots;
        this.FireCustomEvent('tournamenttableready', id);
      });
    }
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

  updatePlayerPoints(playerId: string, newPoints: number) {
    this.af.database.object(`/players/${playerId}/points`).set(newPoints);
  }

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
    this.placeOrder(this.auth.uid, cheerleaderId, newUnlockPoints - 1);
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
    console.log('teamEarnPoints', teamId, amount, newPoints);
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
}
