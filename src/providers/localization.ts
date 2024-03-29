import {Injectable, Pipe, PipeTransform} from '@angular/core';

@Injectable()
export class Localization {
  langCode = 'en';

  setLang(lang) {
    let lowerLang = lang.toLowerCase();
    let l = lowerLang.split('-')[0];
    if (lowerLang != 'zh-tw' && 'zh' == l)
      this.langCode = 'zh';
    else
      this.langCode = 'en';
    console.log('lang', lang, l, this.langCode);
  }


  getString(id, lang = null) {
    let s = this.translation[lang ? lang : this.langCode][id];
    return s ? s : id;
  }

  translation = {
    en: {
      Description: 'Motto',
      West: 'West',
      East: 'East',
      Central: 'Central',
      North: 'North',
      South: 'South',
      Book: 'Book',
      Team: 'Team',
      Teams: 'Teams',
      MyTeam: 'My Team',
      NewTeam: 'New Team',
      NoTeamPrompt: 'You have not joined a team',
      JoinTeam: 'Join a Team',
      Home: 'Home',
      Settings: 'Settings',
      ChatRoom: 'Chats',
      Create: 'Create',
      CreateAccount: 'Create Account',
      Quit: 'Quit',
      players: 'players',
      Players: 'Players',
      Player: 'Player',
      PromoteToCaptain: 'Promote to captain',
      Date: 'Date',
      Time: 'Time',
      Opponent: 'Opponent',
      Location: 'Location',
      JerseyColor: 'Jersey color',
      Details: 'Details',
      Post: 'Post',
      Cancel: 'Cancel',
      MatchNotice: 'Match Notice',
      MyProfile: 'My Profile',
      Height: 'Height',
      Weight: 'Weight',
      Foot: 'Foot',
      left: 'Left',
      right: 'Right',
      RightFoot: 'Right Foot',
      LeftFoot: 'Left Foot',
      Position: 'Position',
      gk: 'GK',
      cb: 'CB',
      sb: 'SB',
      dmf: 'DMF',
      amf: 'AMF',
      cf: 'CF',
      sf: 'SF',
      Feedback: 'Feedback',
      Submit: 'Submit',
      Logout: 'Logout',
      PleaseLogin: 'Please Login',
      Login: 'Login',
      createteamsucceededly: 'Create team successfully',
      Schedulematchsuccessfully: 'Schedule match successfully',
      Youcannotquitdefaultteam: 'You can not quit default team',
      Captaincannotquit: 'Captain can not quit',
      Thanksforyourfeedback: 'Thanks for your feedback',
      Captain: 'Captain',
      Default: 'Default',
      SetDefault: 'Set Default',
      Teamexists: 'Team exists',
      Send: 'Send',
      inviteyoutojoin: 'invite you to join',
      Scores: 'Scores',
      Score: 'Score',
      League: 'League (Comming Soon)',
      Nextmatch: 'Next match',
      Going: 'Going',
      Cannotgo: 'Can not go',
      Typeyourmessage: 'Type your message',
      Redcard: 'Red card',
      Yellowcard: 'Yellow card',
      Rank: 'Rank',
      Ranks: 'Ranks',
      Message: 'Message',
      Messages: 'Messages',
      Played: 'Played',
      Matches: 'Matches',
      Popularity: 'Popularity',
      MyPage: 'My Page',
      Notifications: 'Notifications',
      UpcomingMatches: 'Upcoming Match',
      Today: 'Today',
      Tomorrow: 'Tomorrow',
      Yesterday: 'Yesterday',
      MatchDetail: 'Match Detail',
      EditPlayer: 'Edit Player',
      Photo: 'Photo',
      Nickname: 'Nick Name',
      HeightCM: 'Height (CM)',
      WeightKG: 'Weight (KG)',
      Save: 'Save',
      TeamName: 'Team Name',
      ConnectWithFacebook: 'Connect with Facebook',
      UsingSBAccount: 'Or via SoccerBro account',
      ResetPwd: 'Reset Password',
      ManagePlayers: 'Manage Players',
      ManageTeams: 'Manage Teams',
      Me: 'Me',
      PlayerInfo: 'Player Info',
      Ability: 'Ability',
      TeamInfo: 'Team Info',
      NewMatch: 'New Match',
      Notice: 'Notice',
      ResetMsg: 'Check your email to reset password.',
      InviteMsg: 'Team invitation link is copied to clipboard.',
      Withdraw: 'Withdraw',
      WithdrawMatch: 'Withdraw this match?',
      FeedbackMsg: 'Thanks for your feedback!',
      speed: 'speed',
      power: 'power',
      stamina: 'stamina',
      pass: 'pass',
      attack: 'attack',
      defence: 'defence',
      Email: 'Email',
      Password: 'Password',
      ViewAll: 'View All',
      EditTeam: 'Edit Team',
      Edit: 'Edit',
      Logo: 'Logo',
      SoccerBro: 'SoccerBro',
      OK: 'OK',
      Tournaments: 'Tournaments',
      FriendlyMatches: 'All Matches',
      Info: 'Info',
      Table: 'Table',
      Fixtures: 'Fixtures',
      SquadNumbers: 'Squad Numbers',
      Goals: 'Goals',
      Assists: 'Assists',
      Yellow: 'Yellow Card',
      Red: 'Red Card',
      AwayTeam: 'Away Team',
      HomeTeam: 'Home Team',
      Referee: 'Referee',
      SortBy: 'Sort By',
      Update: 'Update',
      Close: 'Close',
      Name: 'Name',
      GFGA: 'GF/GA',
      P: 'P',
      W: 'W',
      L: 'L',
      D: 'D',
      PTS: 'PTS',
      RateMatch: 'Rate Match',
      Terrible: 'Terrible',
      Bad: 'Bad',
      OK2: 'OK',
      Good: 'Good',
      Excellent: 'Excellent',
      Giveacompliment: 'Give a compliment',
      Whatwentwrong: 'What went wrong',
      Punctual: 'Punctual',
      Active: 'Active',
      Competent: 'Competent',
      WellJudged: 'Well-Judged',
      Notontime: 'Not on time',
      Inactive: 'Inactive',
      Incapable: 'Incapable',
      Unfair: 'Unfair',
      Type: 'Type',
      Guide: 'Guide',
      Youneedateam: 'You need a team',
      Needtofillnumber: 'All your performance data is recored based on your sqaud number. Please fill up your squad number.',
      Done: 'Done',
      Welcometobrotherhood: 'Welcome to brotherhood',
      Numberexists: 'Number exists',
      ViewMore: 'View More',
      Recent5Matches: 'Recent 5 Matches',
      YearBuilt: 'Year Built',
      AvgAge: 'Avg. Age',
      WholeSeasonRecord: 'Whole Season Record',
      GF: 'GF',
      GA: 'GA',
      Records: 'Records',
      Recent15matches: 'Recent 15 matches',
      Recent30matches: 'Recent 30 matches',
      All: 'All',
      BecomeCheerleader: 'Join Cheerleaders',
      ApplicationSubmited: 'Your application is submitted. We will process it within 1 working day',
      PendingforReview: 'Pending for Review',
      Cheerleadersavailable: 'Cheerleaders available',
      Cheerleaders: 'Cheerleaders',
      Cheerleader: 'Cheerleader',
      avgga: 'Avg. GA',
      avggf: 'Avg. GF',
      maxgf: 'Max. GF',
      maxga: 'Max. GA',
      maxvictory: 'Max. successive victory',
      maxlose: 'Max. successive lose',
      mostundefeated: 'Most consecutive undefeated',
      mostcleansheets: 'Most consecutive clean sheets',
      winningrate: 'Winning rate',
      updatematch: 'Update Match',
      CreateTeam: 'Create Team',
      participants: 'Participants',
      ResponseRate: 'Response Rate',
      warning: 'Warning',
      note: 'Please Note',
      starcard: 'Star Card',
      teamupdateonceandearnpoints: 'Upon confirming, you cannot modify match data again. you team will earn %d points.',
      rateearnpoints: 'Upon confirming, you can not rate again. You will earn %d points.',
      teaminvitation: "%s invited you to join \"%s\". \n\nCopy this message and go back to \"SoccerBro\" to accept the invitation.\n(%s)",
      teamInvitationCopied: "Invitation link is copied. Send to players to invite them",
      bench: 'Substitutes',
      schedule: 'Schedule',
      standings: 'Standings',
      share: 'Share',
      join: 'Join',
      teamInvitation: 'Team invitation',
      teamJoinSuccess: 'Welcome to ',
      stats: 'stats',
      owngoals: 'Own Goals',
      rating: 'Rating',
      ratings: 'Ratings',
      excellent: 'Excellent',
      verygood: 'Very Good',
      good: 'Good',
      average: 'Average',
      poor: 'Poor',
      verypoor: 'Very Poor',
      extremelypoor: 'Extremely Poor',
      register: 'Register',
      inProgress: 'In Progress',
      showResults: 'Show results',
      results: 'Results',
      vote: 'Vote',
      charm: 'Charm',
      Ilikehim: 'I like him',
      Idislikehim: 'I dislike him',
      skill: 'Skill',
      heisagoodplayer: 'He plays well',
      hesucks: 'He sucks',
      playstyle: 'Style',
      heiscleanandelegant: 'Clean and Elegant',
      heisdirty: 'Too Aggressive',
      tags: 'Tags',
      registerRules: 'Notice',
      registeredTeams: 'Registered Teams',
      registerNow: 'Register Now',
      registered: 'Registered',
      leagueInfo: 'League Info',
      searchMatchPageNoRecord: 'No match record... :(',
      chatPageNoRecord: 'start chatting...',
      messagePageNoRecord: 'Find a star card or unlock a cheerleader to start chat.',
      unlockPoints: 'Unlock Points',
      points: 'Points',
      joinDate: 'Join Date',
      delete: 'Delete',
      year: 'Year',
      checkCheerLeaders: 'Have a look',
      skip: 'Skip',
      whatsNew: "What's New",
      playerDesc: 'Shows player information and appraisal',
      teamDesc: 'All team statistics could be found here.',
      squadDesc: 'Arrange your squads',
      cheerleadersDesc: 'Chat with cheerleaders you like',
      changecoverphoto: 'Change Cover Photo',
      squad: 'Squad',
      squads: 'Squads',
      squaddescription: 'Squad Description',
      entersquaddescription: 'Please enter squad description',
      creator: 'Creator',
      inputscores: 'Input Scores',
      recentmatches: 'Recent Matches',
      deletethismatch: 'Delete this match?',
      rateplayers: 'Rate Players',
      deletematch: 'Delete Match',
      ManageSquadHello: 'Hello, Ace coach!',
      ManageSquadCheer: "Cheers! ",
      goals: 'Goals',
      assists: 'Assists',
      notEnoughPoints: 'Not enough points',
      balance: 'Current balance: ',
      pointsNedded: 'You need at least %d points to unlock her.',
      unlockMsg: 'You will be able to message her once unlocked.',
      unlockPointsUsed: '%d points needed',
      singapore: 'Singapore',
      versus: 'vs',
      enroll: 'Enroll',
      youarenotcaptain: 'You are not captain',
      youearnedpoints: 'You have earned %d points',
      usephone: 'Or Via Phone',
      more: 'More',
      getotp: 'Get OTP',
      start: 'Start to use',
      agree: 'I Agree',
      agreement: 'User Agreement',
      agreementDesc: "By using SoccerBro’s mobile application and service, you agree to the following conditions: \n\n- Allows SoccerBro to scan the images you upload.\n- No objectionable content is allowed, this including the images uploaded, the descriptions used in profile and messages in chatroom.\n- SoccerBro has zero tolerance for abusive users. Once found, the account will be banned permanently.",
      unlock: 'Unlock',
      reportobjectionalbecontent: 'Report objectionable content',
      systemadminsdealwithreport: 'System Admin will deal with your report ASAP',
      block: "Block",
      blocked: "Blocked",
      unblock: "Unblock",
      blockingMsg: "You've blocked this user.",
      blockedMsg: "You've been blocked by this user.",
      matchfinished: '%s vs %s (%d : %d), please rate your teammate to earn player points',
      report: "Report",
      total: 'Total',
      youarecaptain: 'You are already the captain',
      removefromteam: 'Remove from team',
      appointadmin: 'Promote to admin',
      removeadmin: 'Remove from admin',
      unlockDefaultMsg: "Hello %s, so glad to unlock you. Let's start chatting!",
      promoteToCaptain2: "Promote %s to captain?",
      confirm: "Confirm",
      noUndo: "You cannot undo this action.",
      confirmJoinTeam: "Would you like to join %s?",
      captain: 'Captain',
      admin: 'Admin',
      player: 'Player',
      confirmremove: 'Do you want to remove %s from %s?',
      swipeFromRightToLeft: 'Please swipe items from right to left for more operations',
      editplayernickname: 'Edit nickname',
      Role: 'Role',
      Number: 'Number',
      EditNumberByClickingClothesIcon: 'You can edit your own number by clicking icon',
      help: 'Help',
      recruitplayers: 'Recruit players',
      code: 'Code',
      NotSet: 'Not set',
      TBD: 'TBD',
      applyleave: 'Apply leave',
      roundNumber: 'Round %s',
      matchInfo: 'Match',
      pending: 'Pending',
      informAll: 'Message ALL',
      eliminations: 'Eliminations',
      joinMatchDetail: "A new match is waiting for you!",
      joinMatch: "Clik to Join",
      rateMatchDetail: "Rate your match to earn points!",
      rateMatch: "Click to Rate",
      welcomeCheerleader: "Welcome to SoccerBro Cheerleaders!",
      personalPointsFAQTitle: "How to earn player points?",
      personalPointsFAQContent: "If you are one of the participants of a match, you can earn 100 points after rating your teammates. You can also earn player points by inviting players, sharing on facebook or wechat moments.",
      teamPointsFAQTitle: "How to earn team points?",
      teamPointsFAQContent: "Once a team captain have updated result and participants of a match, his team receive 100 + 10 * number of participants (cap to 250) points.",
      careerRecord: "Career Record",
      totalGoals: "Total Goals",
      totalAssists: "Total Assists",
      avgGoals: "Avg.Goals",
      avgAssists: "Avg.Assists",
      attendanceRate: "Attendance",
      mvpTimes: "MOMs",
      attendWinRate: "Att.Winning",
      attendWinRateShort: "Attended",
      notAttendWinRate: "Abs.Winning",
      notAttendWinRateShort: "Not Attended",
      winningRate: "Winning Rate",
      seasonalRecord: "Seasonal Record",
      attendedMatches: "Attended",
      totalMatches: "Matches",
      sending: "Sending...",
      noRequirement:"No Jersey Color Required",
      absentNumber:"Not Attending Players",
      attendedNumber:"Attending Players",
      tbdNumber:"TBD Players",
      website: "Website",
      enteremail: 'Please enter your email',
      enterpwd: 'Must contain at least 6 digits',
      group: 'Group',
      addPlayer: 'Add Player',
      contactCaptain: 'Contact Captain',
      groups: 'Groups',
      top100: 'Top 100',
      welcomeToClGroup: 'Welcome to Cheerleaders group chat!',
      yellows: 'Yellow Cards',
      reds: 'Red Cards',
      saves: 'Saves',
      confirmmodify: 'Comfirm modification?',
      selectateam: 'Please select a team',
      penalty: 'Penalty',
      teamschedule: 'Team Schedule',
      lw: 'LW',
      ss: 'SS',
      rw: 'RW',
      am: 'AM',
      lm: 'LM',
      cm: 'CM',
      rm: 'RM',
      dm: 'DM',
      lwb: 'LWB',
      rwb: 'RWB',
      lb: 'LB',
      rb: 'RB',
      sw: 'SW',
      rememberme: 'Remember Me',
      mom: 'Man of Match',
      training: 'Training',
      playertrained: 'player(s) trained',
      physical: 'Physical',
      technique: 'Technique',
      tactics: 'Tactics',
      video: 'Video',
      trainingmessage: 'Training can reduce the chance of injury',
      abilitybytraining: 'Ability (Acquired during training)',
      congrats: 'Congratulations! Your %s is %d (+1)'
    },

    zh: {
      Description: '座右铭',
      West: '西部',
      East: '东部',
      Central: '中部',
      North: '北部',
      South: '南部',
      Book: '预定',
      Team: '球队',
      Teams: '球队',
      MyTeam: '我的球队',
      NewTeam: '新球队',
      NoTeamPrompt: '你还没有自己的球队',
      JoinTeam: '加入球队',
      Home: '首页',
      Settings: '设置',
      ChatRoom: '聊天室',
      Create: '创建',
      CreateAccount: '创建账号',
      Quit: '退出',
      players: '队员',
      Players: '队员',
      Player: '球员',
      PromoteToCaptain: '移交队长袖标',
      Date: '日期',
      Time: '时间',
      Opponent: '对手',
      Location: '地点',
      JerseyColor: '队服颜色',
      Details: '详细信息',
      Post: '发布',
      Cancel: '取消',
      MatchNotice: '比赛通知',
      MyProfile: '我的信息',
      Height: '身高',
      Weight: '体重',
      left: '左',
      right: '右',
      Foot: '惯用脚',
      RightFoot: '右脚',
      LeftFoot: '左脚',
      Position: '场上位置',
      gk: '门神',
      cb: '中卫',
      sb: '边卫',
      dmf: '兽腰',
      amf: '前腰',
      cf: '中锋',
      sf: '边锋',
      Feedback: '反馈',
      Submit: '提交',
      Logout: '注销',
      PleaseLogin: '请登录',
      Login: '登录',
      createteamsucceededly: '创建球队成功',
      Schedulematchsuccessfully: '创建比赛成功',
      Youcannotquitdefaultteam: '你不能退出默认球队',
      Captaincannotquit: '队长不能退队',
      Thanksforyourfeedback: '感谢你的反馈',
      Captain: '队长',
      Default: '默认',
      SetDefault: '设为默认',
      Teamexists: '球队已存在',
      Send: '发送',
      inviteyoutojoin: '邀请你加入',
      Scores: '战报',
      Score: '比分',
      League: '联赛 (即将开赛)',
      Nextmatch: '下一场比赛',
      Going: '报名',
      Cannotgo: '不报名',
      Typeyourmessage: '输入消息',
      Redcard: '红牌',
      Yellowcard: '黄牌',
      Rank: '排名',
      Ranks: '排名',
      Message: '信息',
      Messages: '消息',
      Played: '出场',
      Matches: '赛事',
      Popularity: '人气',
      MyPage: '我的主页',
      Notifications: '通知',
      UpcomingMatches: '赛程',
      Today: '今天',
      Tomorrow: '明天',
      Yesterday: '昨天',
      MatchDetail: '比赛信息',
      EditPlayer: '编辑球员',
      Photo: '头像',
      Nickname: '昵称',
      HeightCM: '身高 (厘米)',
      WeightKG: '体重 (公斤)',
      Save: '保存',
      TeamName: '队名',
      ConnectWithFacebook: '用Facebook登录',
      UsingSBAccount: '或 用绿茵兄弟账号登陆',
      ResetPwd: '重置密码',
      ManagePlayers: '管理球员',
      ManageTeams: '管理球队',
      Me: '个人',
      PlayerInfo: '球员信息',
      Ability: '能力',
      TeamInfo: '球队信息',
      NewMatch: '新球赛',
      Notice: '注意事项',
      ResetMsg: '重置密码的连接已经发到您的邮箱。',
      InviteMsg: '球队邀请链接已复制到剪贴板。',
      Withdraw: '撤销',
      WithdrawMatch: '撤销比赛',
      FeedbackMsg: '感谢你的反馈!',
      speed: '速度',
      power: '力量',
      stamina: '体能',
      pass: '传球',
      attack: '进攻',
      defence: '防守',
      Email: '邮箱',
      Password: '密码',
      ViewAll: '查看所有',
      EditTeam: '编辑球队',
      Edit: '编辑',
      Logo: '队徽',
      SoccerBro: '绿茵兄弟',
      OK: '确定',
      Tournaments: '比赛',
      FriendlyMatches: '所有比赛',
      Info: '信息',
      Table: '积分榜',
      Fixtures: '赛程表',
      SquadNumbers: '球衣号码',
      Goals: '进球',
      Assists: '助攻',
      Yellow: '黄牌',
      Red: '红牌',
      AwayTeam: '客队',
      HomeTeam: '主队',
      Referee: '裁判',
      SortBy: '按条件排序',
      Update: '更新',
      Close: '关闭',
      Name: '姓名',
      GSGA: '进/失',
      P: '赛',
      W: '胜',
      L: '负',
      D: '平',
      PTS: '积分',
      RateMatch: '比赛评价',
      Terrible: '很糟糕',
      Bad: '差',
      OK2: '一般',
      Good: '好',
      Excellent: '很满意',
      Giveacompliment: '哪些方面做得很好',
      Whatwentwrong: '哪里出错了',
      Punctual: '准时',
      Active: '跑动积极',
      Competent: '胜任工作',
      WellJudged: '判罚公平',
      Notontime: '不准时',
      Inactive: '跑动消极',
      Incapable: '他就一SB',
      Unfair: '黑哨',
      Type: '场地类型',
      Guide: '设置向导',
      Youneedateam: '你需要一支球队',
      Needtofillnumber: '裁判会根据你的球衣号码记录你在比赛中的表现。请正确填写你在球队中的号码。',
      Done: '完成',
      Welcometobrotherhood: '欢迎来到兄弟会',
      Numberexists: '号码已经有人使用了',
      ViewMore: '查看更多',
      Recent5Matches: '最近5场比赛战绩',
      YearBuilt: '成立 ',
      AvgAge: '成立时间',
      WholeSeasonRecord: '赛季数据',
      GF: '进球',
      GA: '失球',
      Records: '记录',
      Recent15matches: '最近15场',
      Recent30matches: '最近30场',
      All: '全部',
      BecomeCheerleader: '成为宝贝',
      ApplicationSubmited: '你的申请已经提交，我们会在一个工作日之内处理你的请求',
      PendingforReview: '审核中',
      Cheerleadersavailable: '拉拉队员可约',
      Cheerleaders: '拉拉队',
      Cheerleader: '拉拉队',
      avgga: '场均进球',
      avggf: '场均失球',
      maxgf: '进球最多的比赛',
      maxga: '失球最多的比赛',
      maxvictory: '最长的连续胜利',
      maxlose: '最长的连续失利',
      mostundefeated: '最长的不败',
      mostcleansheets: '最长的不失球',
      winningrate: '胜率',
      updatematch: '更新比赛',
      CreateTeam: '创建球队',
      participants: '出场队员',
      ResponseRate: '回复率',
      warning: '警告',
      note: '请注意',
      starcard: '球星卡',
      teamupdateonceandearnpoints: '确认之后, 你就不能再更改比赛数据了。你的球队会得到%d积分',
      rateearnpoints: '确认之后就不能再对本次比赛评分. 你将获得%d积分.',
      teaminvitation: "%s 邀请你加入\“%s\”。\n\n复制这条信息，打开\“绿茵兄弟\”即可加入。\n(%s)",
      teamInvitationCopied: "成功复制邀请链接，发送给球员邀请入队",
      bench: '替补席',
      schedule: '赛程表',
      standings: '战绩',
      share: '分享',
      join: '加入',
      teamInvitation: '球队邀请',
      teamJoinSuccess: '欢迎加入 ',
      stats: '技术统计',
      owngoals: '乌龙球',
      rating: '评分',
      ratings: '评分',
      excellent: '球王',
      verygood: '很好',
      good: '好',
      average: '一般',
      poor: '差',
      verypoor: '很差',
      extremelypoor: '不会踢',
      register: '报名',
      inProgress: '进行中',
      showResults: '查看战绩',
      results: '战绩',
      vote: '投票',
      charm: '魅力',
      Ilikehim: '我喜欢他',
      Idislikehim: '看到他就想吐',
      skill: '球技',
      heisagoodplayer: '他球技我服',
      hesucks: '他弱爆了',
      playstyle: '球风',
      heiscleanandelegant: '他是艺术足球大师',
      heisdirty: '离他远点,小心受伤',
      tags: '标签',
      registerRules: '报名须知',
      registeredTeams: '参赛队伍',
      registerNow: '立即报名',
      registered: '已报名',
      leagueInfo: '联赛信息',
      searchMatchPageNoRecord: '没有比赛信息...',
      chatPageNoRecord: '开始对话吧 :)',
      messagePageNoRecord: '从球星卡中或者解锁拉拉队后开始聊天吧',
      unlockPoints: '解锁积分',
      points: '积分',
      joinDate: '注册时间',
      delete: '删除',
      year: '年份',
      checkCheerLeaders: '点击查看',
      skip: '跳过',
      whatsNew: "新特性",
      playerDesc: '查看球员数据及评价',
      teamDesc: '查看球队所有数据',
      squadDesc: '安排比赛阵容',
      cheerleadersDesc: '和你喜欢的拉拉队员聊天',
      changecoverphoto: '更换封面',
      squad: '阵型',
      squads: '战术',
      squaddescription: '阵型描述',
      entersquaddescription: '请输入阵型描述',
      creator: '创建者',
      inputscores: '录入比分',
      recentmatches: '最近的比赛',
      deletethismatch: '删除这场比赛?',
      rateplayers: '球员评分',
      deletematch: '删除比赛',
      ManageSquadHello: '你好, 战术大师',
      ManageSquadCheer: '加油! ',
      goals: '进球',
      assists: '助攻',
      notEnoughPoints: '积分不足',
      balance: '剩余积分：',
      pointsNedded: '你需要最少%d积分来解锁她.',
      unlockMsg: '解锁之后你就可以和她聊天了。',
      unlockPointsUsed: '需要%d积分',
      singapore: '新加坡',
      versus: '对阵',
      enroll: '报名',
      youarenotcaptain: '你不是队长',
      removefromteam: '移除球队',
      appointadmin: '任命管理员',
      removeadmin: '移除管理员',
      youearnedpoints: '你获得了%d积分',
      usephone: '或者使用手机',
      more: '更多',
      getotp: '获取验证码',
      start: '开始使用',
      agree: '我同意',
      agreement: '用户协议',
      agreementDesc: "使用绿茵兄弟的移动产品和服务，即表明您同意我们以下条款：\n\n－允许绿茵兄弟查看你所上传的图片。\n－任何会引起用户反感的内容都是不被允许的，包括您上传的图片，个人空间里的描述以及聊天室里的内容。\n－绿茵兄弟对滥用服务的用户是零容忍的。一旦发现，账号将被永久禁止。",
      unlock: '解锁',
      reportobjectionalbecontent: '举报不良内容',
      systemadminsdealwithreport: '系统管理员会尽快处理你的举报',
      block: "屏蔽",
      blocked: "已屏蔽",
      unblock: "解除屏蔽",
      blockingMsg: "你已屏蔽这个用户。",
      blockedMsg: "你已被对方屏蔽。",
      matchfinished: '%s vs %s (%d : %d), 快去给队友打分以获得个人积分吧',
      report: "举报",
      total: '总计',
      youarecaptain: '你已经是队长了',
      unlockDefaultMsg: "Hello %s, 终于成功解锁了你，开始聊天吧！",
      promoteToCaptain2: "将 %s 提升为队长？",
      confirm: "确认",
      noUndo: "你将无法撤销次个操作。",
      confirmJoinTeam: "要加入 %s 吗?",
      captain: '队长',
      admin: '管理员',
      player: '球员',
      confirmremove: '确定要将 %s 移除 %s吗?',
      swipeFromRightToLeft: '请从右向左滑动列表来获取更多操作',
      editplayernickname: '编辑球员昵称',
      Role: '角色',
      Number: '号码',
      EditNumberByClickingClothesIcon: '点击球衣可编辑自己的球衣号码',
      help: '帮助',
      recruitplayers: '招募队员',
      code: '邀请码',
      NotSet: '未设定',
      TBD: '待定',
      applyleave: '请假',
      roundNumber: '第%s轮',
      matchInfo: '比赛',
      pending: '待定',
      informAll: '群发短信',
      eliminations: '淘汰赛',
      joinMatchDetail: "一场新球赛等待你的加入!",
      joinMatch: "点击加入",
      rateMatchDetail: "评分经完成的比赛，赚取更多积分！",
      rateMatch: "点击评分",
      welcomeCheerleader: "欢迎加入拉拉队！",
      personalPointsFAQTitle: "如何赚取球员积分?",
      personalPointsFAQContent: "如果你参加了一场比赛，那么你可以通过给自己的队友评分来获取100积分.你也能通过邀请球员,分享facebook或者微信朋友圈来分别获取相应积分",
      teamPointsFAQTitle: "如何赚取球队积分?",
      teamPointsFAQContent: "当一个球队的队长更新了比赛结果和参加比赛球员信息之后，他的队伍将能得到100+10*(参与比赛的人数)的分数,但最高不超过250分",
      careerRecord: "生涯数据",
      totalGoals: "总进球",
      totalAssists: "总助攻",
      avgGoals: "场均进球",
      avgAssists: "场均助攻",
      attendanceRate: "出勤率",
      mvpTimes: "全场最佳",
      attendWinRate: "出场胜率",
      attendWinRateShort: "出场胜率",
      notAttendWinRate: "未出场胜率",
      notAttendWinRateShort: "未出场胜率",
      winningRate: "胜率",
      seasonalRecord: "赛季数据",
      attendedMatches: "参赛",
      totalMatches:"总场次",
      sending: "正在发送...",
      noRequirement:"无要求",
      absentNumber:"人请假",
      attendedNumber:"人报名",
      tbdNumber:"人待定",
      website: "网站",
      enteremail: '请输入你的电子邮箱地址',
      enterpwd: '密码至少应包含六位数字',
      group: '组',
      addPlayer: '添加球员',
      contactCaptain: '联系队长',
      groups: '小组赛',
      top100: '100强',
      welcomeToClGroup: '欢迎来到拉拉队聊天室！',
      yellows: '黄牌',
      reds: '红牌',
      saves: '扑救',
      confirmmodify: '确认修改吗?',
      selectateam: '请选择一个球队',
      teamschedule: '球队日程',
      lw: '左边锋',
      ss: '影锋',
      rw: '右边锋',
      am: '前腰',
      lm: '左中场',
      cm: '组织型中场',
      rm: '右中场',
      dm: '兽腰',
      lwb: '左边卫',
      rwb: '右边卫',
      lb: '左后卫',
      rb: '右后卫',
      sw: '清道夫',
      rememberme: '记住我',
      mom: '全场最佳',
      training: '训练',
      playertrained: '球员训练过',
      physical: '身体',
      technique: '技术',
      tactics: '战术',
      video: '视频',
      trainingmessage: '训练可以减少受伤几率',
      abilitybytraining: '能力值 (通过训练提升)',
      congrats: '恭喜! 你的%s为%d(+1)'
    }
  }
}

@Pipe({
  name: 'trans'
})

export class TransPipe implements PipeTransform {
  constructor(private localization: Localization) {
  }

  transform(id) {
    if (id) {
      return this.localization.getString(id);
    }
    return '';
  }
}
