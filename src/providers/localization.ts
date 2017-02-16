import { Injectable, Pipe, PipeTransform } from '@angular/core';

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


    getString(id) {
        let s = this.translation[this.langCode][id];
        return s ? s : id;
    }

    translation = {
        en: {
            Description: 'Description',
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
            CreateAccount: 'CreateAccount',
            Quit: 'Quit',
            players: 'players',
            Players: 'Players',
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
            Message: 'Message',
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
            Logo: 'Logo',
            SoccerBro: 'SoccerBro',
            OK: 'OK',
            Tournaments: 'Tournaments',
            FriendlyMatches: 'Matches',
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
            All: 'all',
            BecomeCheerleader: 'Become Cheerleader',
            ApplicationSubmited: 'Your application is submitted. We will process it within 1 working day',
            PendingforReview: 'Pending for Review',
            Cheerleadersavailable: 'Cheerleaders available',
            Cheerleaders: 'Cheerleaders'
        },

        zh: {
            Description: '简介',
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
            PromoteToCaptain: '升为队长',
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
            Message: '信息',
            Played: '出场',
            Matches: '比赛',
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
            UsingSBAccount: '或 用足球兄弟账号登陆',
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
            Logo: '队徽',
            SoccerBro: '足球兄弟',
            OK: '确定',
            Tournaments: '比赛',
            FriendlyMatches: '友谊赛',
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
            GF: 'GF',
            GA: 'GA',
            Records: '记录',
            Recent15matches: '最近15场',
            Recent30matches: '最近30场',
            All: '全部',
            BecomeCheerleader: '成为宝贝',
            ApplicationSubmited: '你的申请已经提交，我们会在一个工作日之内处理你的请求',
            PendingforReview: '审核中',
            Cheerleadersavailable: '拉拉队员可约',
            Cheerleaders: '拉拉队'
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