import { Injectable } from '@angular/core';
import { FirebaseManager } from '../../providers/firebase-manager';
import { Player } from './player.model';
import { UIHelper } from '../../providers/uihelper';

@Injectable()
export class PlayerService {
  playersMap = {};
  teamPlayersMap = {};
  bRefreshTeamPlayers = false;

  constructor(private fm: FirebaseManager, private uiHelper: UIHelper) {
    document.addEventListener('playerready', e => {
      let id = e['detail'];

      let playerData = this.fm.getPlayer(id);
      let player = this.findOrCreatePlayer(id);
      player.id = playerData.$key;
      //player.points = playerData.points;
      player.name = playerData['basic-info'].displayName || "John Doe";
      player.photo = playerData['basic-info'].photoURL || "assets/img/none.png";
      
      player.points = playerData.points;
      player.photoLarge = playerData.photoLarge || "assets/img/forTest/messi_banner.png";
      player.wechatShareTime = playerData.wechatShareTime;
      player.fbShareTime = playerData.fbShareTime;
      if (playerData.photoMedium)
        player.photoMedium = playerData.photoMedium;
      if ('points' in playerData)
        player.points = playerData.points;
      else
        player.points = 0;

      if (playerData['detail-info'] && 'position' in playerData['detail-info'])
        player.position = playerData['detail-info'].position;
      if (playerData['detail-info'] && 'pushId' in playerData['detail-info'])
        player.pushId = playerData['detail-info'].pushId;
      if (playerData['detail-info'] && 'height' in playerData['detail-info'])
        player.height = playerData['detail-info'].height;
      if (playerData['detail-info'] && 'weight' in playerData['detail-info'])
        player.weight = playerData['detail-info'].weight;
      if (playerData['detail-info'] && 'foot' in playerData['detail-info'])
        player.foot = playerData['detail-info'].foot;
      if (playerData['detail-info'] && 'description' in playerData['detail-info'])
        player.description = playerData['detail-info'].description;

      let currentTeamFound = false;
      if (playerData.teams) {
        player.teams = [];
        for (let tId in playerData.teams) {
          player.teams.push(tId);
          if (tId === playerData['basic-info'].teamId)
            currentTeamFound = true;
        }
      }

      //fix issue is currentTeam is not found
      if (currentTeamFound) 
        player.teamId = playerData['basic-info'].teamId;
      else {
        if (player.teams && player.teams.length)
          player.teamId = player.teams[0];
        else
          player.teamId = null;
      }

      if (playerData.cheerleaders) {
        player.cheerleaders = [];
        for (let id in playerData.cheerleaders)
          player.cheerleaders.push(id);
      }

      player.role = "player";
      if (playerData.role)
        player.role = playerData.role;

      if (playerData.joinTime)
        player.joinTime = playerData.joinTime;

      this.playersMap[id] = player;
      if (player.role && player.role === 'cheerleader') {
        //this.fm. getCheerleaderPublicAsync(id);
      }
      else
        this.fm.getPlayerPublicAsync(id);

      this.fm.FireCustomEvent('serviceplayerready', id);
    });

    document.addEventListener('playerpublicready', e => {
      let id = e['detail'];
      let playerPublicData = this.fm.getPlayerPublic(id);
      let player = this.getPlayer(id);
      if (player) {
        player.popularity = playerPublicData.popularity;
      }
    });

    document.addEventListener('teamready', e => {
      if (this.bRefreshTeamPlayers) {
        let id = e['detail'];
        let team = this.fm.getTeam(id);
        //console.log(team);

        let players;
        if (this.teamPlayersMap[id]) {
          players = this.teamPlayersMap[id];
          players = [];
        }
        else {
          players = [];
          this.teamPlayersMap[id] = players;
        }

        for (let pId in team.players) {
          let player = this.findOrCreatePlayerAndPull(pId);
          players.push(player);
        }
        this.bRefreshTeamPlayers = false;
        this.fm.FireCustomEvent('serviceteamplayersready', id);
      }
    });

    document.addEventListener('playersocialready', e => {
      let playerId = e['detail'];
      let player = this.findOrCreatePlayer(playerId);
      player.social = this.fm.getPlayerSocial(playerId);
    });

    document.addEventListener('playerstatsready', e => {
      let playerId = e['detail'];
      let player = this.findOrCreatePlayer(playerId);
      player.stats = this.fm.getPlayerStats(playerId);
      console.log('player stats', player.stats);
    })
  }

  findOrCreatePlayer(id): Player {
    let player;
    if (this.playersMap[id])
      player = this.playersMap[id];
    else {
      player = new Player();
      this.playersMap[id] = player;
    }
    return player;
  }

  findOrCreatePlayerAndPull(id): Player {
    let player;
    if (this.playersMap[id])
      player = this.playersMap[id];
    else {
      player = new Player();
      this.playersMap[id] = player;
      this.fm.getPlayerAsync(id);
    }
    return player;
  }

  getPlayerAsync(id, pullSocial = false, pullStats = false) {
    if (this.getPlayer(id)) {
      this.fm.FireCustomEvent('serviceplayerready', id);
    }
    else {
      this.fm.getPlayerAsync(id);
    }

    if (pullSocial)
      this.getPlayerSocialAsync(id);
    
    if (pullStats)
      this.fm.getPlayerStatsAsync(id);
  }

  getSelfPlayer(): Player {
    return this.getPlayer(this.selfId());
  }

  getPlayer(id): Player {
    return this.playersMap[id];
  }

  updatePlayerBasic(property: string, value) {
    this.fm.updatePlayerBasic(property, value);
  }

  updatePlayerDetail(property: string, value) {
    this.fm.updatePlayerDetail(property, value);
  }

  increasePopularity(id) {
    this.fm.increasePlayerPopularity(id);
  }

  selfId() {
    return this.fm.selfId();
  }

  unlockCheerleader(cheerleaderId: string, newPoints: number, newUnlockPoints: number, selfNewPoints: number) {
    this.fm.unlockCheerleader(cheerleaderId, newPoints, newUnlockPoints, selfNewPoints);
  }

  isAdmin() {
    if (this.fm.admins && this.selfId() && this.fm.admins[this.selfId()])
      return true;
    return false;
  }

  getAdmins() {
    let admins = [];
    if (this.fm.admins) {
      for (let adminId in this.fm.admins) {
        let admin = this.getPlayer(adminId);
        if (admin)
          admins.push(admin);
      }
    }
    return admins;
  }

  isAuthenticated() {
    return this.fm.auth && this.fm.auth.uid;
  }

  amIPlayer() {
    let player = this.getPlayer(this.selfId());
    if (!player)
      return false;
    return player.role !== 'cheerleader';
  }

  checkLogin() {
    this.fm.checkLogin();
  }

  setDefaultTeam(id: string) {
    this.fm.setDefaultTeam(id);
  }

  quitTeam(id: string) {
    this.fm.quitTeam(id);
  }

  getTeamPlayers(id) {
    return this.teamPlayersMap[id];
  }

  getTeamPlayersAsync(id) {
    this.bRefreshTeamPlayers = true;

    if (this.getTeamPlayers(id))
      this.fm.FireCustomEvent('serviceteamplayersready', id);
    else
      this.fm.getTeamAsync(id);
  }

  amICaptain() {
    let pId = this.selfId();
    if (!pId)
      return false;

    let tId = this.getPlayer(pId).teamId;
    let fmTeam = this.fm.getTeam(tId);
    //console.log(fmTeam);
    if (fmTeam && 'basic-info' in fmTeam) {
      //console.log(pId, fmTeam['basic-info'].captain, tId);
      return pId === fmTeam['basic-info'].captain;
    }

    return false;
  }

  amIMemberOfCurrentTeam(teamId) {
    let player = this.myself();
    if (!player)
      return false;

    return player.teamId === teamId;
  }

  isMemberOfTeam(playerId, teamId) {
    let team = this.fm.getTeam(teamId);
    if (team && team.players) {
      let teamPlayer = team.players[playerId];
      if (!teamPlayer)
        return false;
      //check legacy code where ismember is not there
      if (teamPlayer.hasOwnProperty('isMember') && false == teamPlayer.isMember)
        return false;

      return true;
    }
    return false;
  }

  amIMemberOfTeam(teamId) {
    return this.isMemberOfTeam(this.selfId(), teamId);
  }

  myself() {
    return this.getPlayer(this.selfId());
  }

  amICaptainOf(teamId) {
    return this.isCaptain(this.selfId(), teamId);
  }

  amIMemberCaptainOrAdmin(teamId) {
    return this.amIMemberOfCurrentTeam(teamId) && this.amICaptainOrAdmin(teamId);
  }

  
  isCaptain(pId, tId) {
    //console.log('isCaptain', pId, tId);
    if (!pId || !tId)
      return false;

    let fmTeam = this.fm.getTeam(tId);
    //console.log(fmTeam);
    if (fmTeam && 'basic-info' in fmTeam)
      return pId === fmTeam['basic-info'].captain;

    return false;
  }

  like(playerId, val, tag) {
    this.fm.likePlayer(playerId, val, tag);
  }

  getPlayerSocial(playerId) {
    let player = this.getPlayer(playerId);
    if (player)
      return player.social;
    return null;
  }

  getPlayerSocialAsync(playerId) {
    if (this.getPlayerSocial(playerId)) {
    } else {
      this.fm.getPlayerSocialAsync(playerId);
    }
  }

  updatePlayerPhoto(playerId, photoUrl) {
    this.fm.updatePlayerPhoto(playerId, photoUrl);
  }

  updatePlayerPhotoLarge(playerId, photoUrl) {
    this.fm.updatePlayerPhotoLarge(playerId, photoUrl);
  }

  earnPoints(playerId, amount) {
    let player = this.getPlayer(playerId);
    if (player) {
      let newPoints = player.points ? player.points + amount : amount;
      this.fm.playerEarnPoints(playerId, amount, newPoints);
      if (playerId == this.selfId())
        this.uiHelper.showPointsToastMessage(amount);
    }
  }

  updateWechatShareTime() {
    this.fm.updateWechatShareTime(this.selfId());
  }

  updateFacebookShareTime() {
    this.fm.updateFacebookShareTime(this.selfId());
  }

  getTeamPlayers2(teamId) {
    let players = [];
    let team = this.fm.getTeam(teamId);
    if (team && team.players) {
      for (let pId in team.players) {
        let teamPlayer = team.players[pId];

        if (!(teamPlayer.hasOwnProperty('isMember') && false == teamPlayer.isMember)) {
          let player = this.findOrCreatePlayerAndPull(pId);
          if (this.isCaptain(pId, teamId))
            player['teamRole'] = 'captain';
          else
            player['teamRole'] = teamPlayer.teamRole || 'player';

          if (this.amIMemberOfCurrentTeam(teamId)) {
            //show nick name for teamembers
            player.name = teamPlayer.nickName || player.name;
            //player.photo = teamPlayer.photo || player.photo;
          }
          players.push(player);
        }
      }
    }

    return players;
  }

  isTeamAdmin(playerId, teamId) {
    let team = this.fm.getTeam(teamId);
    if (team && team.players) {
      let teamPlayer = team.players[playerId];
      if (teamPlayer && teamPlayer.teamRole)
        return "admin" === teamPlayer.teamRole;
    }
    return false;
  }

  amITeamAdmin(teamId) {
    return this.isTeamAdmin(this.selfId(), teamId);
  }
  
  amICaptainOrAdminOfCurrentTeam() {
    let pId = this.selfId();
    if (!pId)
      return false;

    let tId = this.getPlayer(pId).teamId;
    return this.amICaptainOrAdmin(tId);
  }

  amICaptainOrAdmin(teamId) {
    return this.isCaptainOrAdmin(this.selfId(), teamId);
  }

  isCaptainOrAdmin(playerId, teamId) {
    return this.isCaptain(playerId, teamId) || this.isTeamAdmin(playerId, teamId);
  }

  setTeamRole(teamId, playerId, role) {
    this.fm.setTeamRole(teamId, playerId, role);
  }

  appointTeamAdmin(teamId, playerId) {
    this.setTeamRole(teamId, playerId, 'admin');
  }

  removeTeamAdmin(teamId, playerId) {
    this.setTeamRole(teamId, playerId, 'player');
  }

  removeFromTeam(playerId, teamId) {
    this.fm.removeFromTeam(playerId, teamId);
  }

  saveTeamNickName(playerId, teamId, nickName) {
    this.fm.saveTeamNickName(playerId, teamId, nickName);
  } 
}