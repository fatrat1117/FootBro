import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Injectable, Input, NgModule, NgZone, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReplaySubject } from 'rxjs/ReplaySubject';
var YoutubePlayerService = (function () {
    /**
     * @param {?} zone
     */
    function YoutubePlayerService(zone) {
        this.zone = zone;
        this.isFullscreen = false;
        this.defaultSizes = {
            height: 270,
            width: 367
        };
        this.createApi();
    }
    Object.defineProperty(YoutubePlayerService, "win", {
        /**
         * @return {?}
         */
        get: function () {
            return window;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(YoutubePlayerService, "YT", {
        /**
         * @return {?}
         */
        get: function () {
            return YoutubePlayerService.win['YT'];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(YoutubePlayerService, "Player", {
        /**
         * @return {?}
         */
        get: function () {
            return YoutubePlayerService.YT.Player;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} options
     * @return {?}
     */
    YoutubePlayerService.prototype.loadPlayerApi = function (options) {
        var /** @type {?} */ doc = YoutubePlayerService.win.document;
        var /** @type {?} */ playerApiScript = doc.createElement("script");
        playerApiScript.type = "text/javascript";
        console.log('loadPlayerApi', options.protocol);
        playerApiScript.src = `https://www.youtube.com/iframe_api`;
        doc.body.appendChild(playerApiScript);
    };
    /**
     * @param {?} elementId
     * @param {?} outputs
     * @param {?} sizes
     * @param {?=} videoId
     * @param {?=} playerVars
     * @return {?}
     */
    YoutubePlayerService.prototype.setupPlayer = function (elementId, outputs, sizes, videoId, playerVars) {
        var _this = this;
        if (videoId === void 0) { videoId = ''; }
        var /** @type {?} */ createPlayer = function () {
            if (YoutubePlayerService.Player) {
                _this.createPlayer(elementId, outputs, sizes, videoId, playerVars);
            }
        };
        this.api.subscribe(createPlayer);
    };
    /**
     * @param {?} player
     * @return {?}
     */
    YoutubePlayerService.prototype.play = function (player) {
        player.playVideo();
    };
    /**
     * @param {?} player
     * @return {?}
     */
    YoutubePlayerService.prototype.pause = function (player) {
        player.pauseVideo();
    };
    /**
     * @param {?} media
     * @param {?} player
     * @return {?}
     */
    YoutubePlayerService.prototype.playVideo = function (media, player) {
        var /** @type {?} */ id = media.id.videoId ? media.id.videoId : media.id;
        player.loadVideoById(id);
        this.play(player);
    };
    /**
     * @param {?} player
     * @return {?}
     */
    YoutubePlayerService.prototype.isPlaying = function (player) {
        // because YT is not loaded yet 1 is used - YT.PlayerState.PLAYING
        var /** @type {?} */ isPlayerReady = player && player.getPlayerState;
        var /** @type {?} */ playerState = isPlayerReady ? player.getPlayerState() : {};
        var /** @type {?} */ isPlayerPlaying = isPlayerReady
            ? playerState !== YT.PlayerState.ENDED && playerState !== YT.PlayerState.PAUSED
            : false;
        return isPlayerPlaying;
    };
    /**
     * @param {?} elementId
     * @param {?} outputs
     * @param {?} sizes
     * @param {?=} videoId
     * @param {?=} playerVars
     * @return {?}
     */
    YoutubePlayerService.prototype.createPlayer = function (elementId, outputs, sizes, videoId, playerVars) {
        var _this = this;
        if (videoId === void 0) { videoId = ''; }
        if (playerVars === void 0) { playerVars = {}; }
        var /** @type {?} */ service = this;
        var /** @type {?} */ playerSize = {
            height: sizes.height || this.defaultSizes.height,
            width: sizes.width || this.defaultSizes.width
        };
        return new YoutubePlayerService.Player(elementId, Object.assign({}, playerSize, {
            events: {
                onReady: function (ev) {
                    _this.zone.run(function () { return outputs.ready && outputs.ready.next(ev.target); });
                },
                onStateChange: function (ev) {
                    _this.zone.run(function () { return outputs.change && outputs.change.next(ev); });
                    // this.zone.run(() => onPlayerStateChange(ev));
                }
            },
            videoId: videoId,
            playerVars: playerVars,
        }));
        // TODO: DEPRECATE?
        // function onPlayerStateChange (event: any) {
        //   const state = event.data;
        //   const PlayerState = YoutubePlayerService.YT.PlayerState;
        //   // play the next song if its not the end of the playlist
        //   // should add a "repeat" feature
        //   if (state === PlayerState.ENDED) {
        //   }
        //   if (state === PlayerState.PAUSED) {
        //       // service.playerState = PlayerState.PAUSED;
        //   }
        //   if (state === PlayerState.PLAYING) {
        //       // service.playerState = PlayerState.PLAYING;
        //   }
        // }
    };
    /**
     * @param {?} player
     * @param {?} isFullScreen
     * @return {?}
     */
    YoutubePlayerService.prototype.toggleFullScreen = function (player, isFullScreen) {
        var _a = this.defaultSizes, height = _a.height, width = _a.width;
        if (!isFullScreen) {
            height = window.innerHeight;
            width = window.innerWidth;
        }
        player.setSize(width, height);
        // TODO: dispatch event
    };
    /**
     * @return {?}
     */
    YoutubePlayerService.prototype.generateUniqueId = function () {
        var /** @type {?} */ len = 7;
        return Math.random().toString(35).substr(2, len);
    };
    /**
     * @return {?}
     */
    YoutubePlayerService.prototype.createApi = function () {
        var _this = this;
        this.api = new ReplaySubject(1);
        var /** @type {?} */ onYouTubeIframeAPIReady = function () {
            if (YoutubePlayerService.win) {
                _this.api.next(/** @type {?} */ (YoutubePlayerService.YT));
            }
        };
        YoutubePlayerService.win['onYouTubeIframeAPIReady'] = onYouTubeIframeAPIReady;
    };
    return YoutubePlayerService;
}());
YoutubePlayerService.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
YoutubePlayerService.ctorParameters = function () { return [
    { type: NgZone, },
]; };
var YoutubePlayerComponent = (function () {
    /**
     * @param {?} playerService
     * @param {?} elementRef
     */
    function YoutubePlayerComponent(playerService, elementRef) {
        this.playerService = playerService;
        this.elementRef = elementRef;
        this.videoId = '';
        /**
         * \@description sets the protocol by the navigator object
         * if there is no window, it sets a default http protocol
         * unless the protocol is set from outside
         */
        this.protocol = this.getProtocol();
        this.playerVars = {};
        // player created and initialized - sends instance of the player
        this.ready = new EventEmitter();
        // state change: send the YT event with its state
        this.change = new EventEmitter();
    }
    /**
     * @return {?}
     */
    YoutubePlayerComponent.prototype.ngAfterContentInit = function () {
        var /** @type {?} */ htmlId = this.playerService.generateUniqueId();
        var /** @type {?} */ playerSize = { height: this.height, width: this.width };
        this.ytPlayerContainer.nativeElement.setAttribute('id', htmlId);
        this.playerService.loadPlayerApi({
            protocol: this.protocol
        });
        this.playerService.setupPlayer(htmlId, {
            change: this.change,
            ready: this.ready,
        }, playerSize, this.videoId, this.playerVars);
    };
    /**
     * @return {?}
     */
    YoutubePlayerComponent.prototype.getProtocol = function () {
        var /** @type {?} */ hasWindow = window && window.location;
        var /** @type {?} */ protocol = hasWindow
            ? window.location.protocol.replace(':', '')
            : 'http';
        return protocol;
    };
    return YoutubePlayerComponent;
}());
YoutubePlayerComponent.decorators = [
    { type: Component, args: [{
                changeDetection: ChangeDetectionStrategy.OnPush,
                selector: 'youtube-player',
                template: "\n    <div id=\"yt-player-ng2-component\" #ytPlayerContainer></div>\n  ",
            },] },
];
/**
 * @nocollapse
 */
YoutubePlayerComponent.ctorParameters = function () { return [
    { type: YoutubePlayerService, },
    { type: ElementRef, },
]; };
YoutubePlayerComponent.propDecorators = {
    'videoId': [{ type: Input },],
    'height': [{ type: Input },],
    'width': [{ type: Input },],
    'protocol': [{ type: Input },],
    'playerVars': [{ type: Input },],
    'ready': [{ type: Output },],
    'change': [{ type: Output },],
    'ytPlayerContainer': [{ type: ViewChild, args: ['ytPlayerContainer',] },],
};
var YoutubePlayerModule = (function () {
    function YoutubePlayerModule() {
    }
    return YoutubePlayerModule;
}());
YoutubePlayerModule.decorators = [
    { type: NgModule, args: [{
                declarations: [
                    YoutubePlayerComponent
                ],
                exports: [
                    YoutubePlayerComponent
                ],
                imports: [
                    CommonModule
                ],
                providers: [
                    YoutubePlayerService
                ]
            },] },
];
/**
 * @nocollapse
 */
YoutubePlayerModule.ctorParameters = function () { return []; };
/**
 * Angular library starter.
 * Build an Angular library compatible with AoT compilation & Tree shaking.
 * Written by Roberto Simonetti.
 * MIT license.
 * https://github.com/robisim74/angular-library-starter
 */
/**
 * Entry point for all public APIs of the package.
 */
/**
 * Generated bundle index. Do not edit.
 */
export { YoutubePlayerModule, YoutubePlayerComponent as ɵa, YoutubePlayerService as ɵb };
//# sourceMappingURL=ng2-youtube-player.es5.js.map
