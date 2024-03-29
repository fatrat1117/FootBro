import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Injectable, Input, NgModule, NgZone, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReplaySubject } from 'rxjs/ReplaySubject';

class YoutubePlayerService {
    /**
     * @param {?} zone
     */
    constructor(zone) {
        this.zone = zone;
        this.isFullscreen = false;
        this.defaultSizes = {
            height: 270,
            width: 367
        };
        this.createApi();
    }
    /**
     * @return {?}
     */
    static get win() {
        return window;
    }
    /**
     * @return {?}
     */
    static get YT() {
        return YoutubePlayerService.win['YT'];
    }
    /**
     * @return {?}
     */
    static get Player() {
        return YoutubePlayerService.YT.Player;
    }
    /**
     * @param {?} options
     * @return {?}
     */
    loadPlayerApi(options) {
        const /** @type {?} */ doc = YoutubePlayerService.win.document;
        let /** @type {?} */ playerApiScript = doc.createElement("script");
        playerApiScript.type = "text/javascript";
        console.log('loadPlayerApi', options.protocol);
        playerApiScript.src = `https://www.youtube.com/iframe_api`;
        doc.body.appendChild(playerApiScript);
    }
    /**
     * @param {?} elementId
     * @param {?} outputs
     * @param {?} sizes
     * @param {?=} videoId
     * @param {?=} playerVars
     * @return {?}
     */
    setupPlayer(elementId, outputs, sizes, videoId = '', playerVars) {
        const /** @type {?} */ createPlayer = () => {
            if (YoutubePlayerService.Player) {
                this.createPlayer(elementId, outputs, sizes, videoId, playerVars);
            }
        };
        this.api.subscribe(createPlayer);
    }
    /**
     * @param {?} player
     * @return {?}
     */
    play(player) {
        player.playVideo();
    }
    /**
     * @param {?} player
     * @return {?}
     */
    pause(player) {
        player.pauseVideo();
    }
    /**
     * @param {?} media
     * @param {?} player
     * @return {?}
     */
    playVideo(media, player) {
        const /** @type {?} */ id = media.id.videoId ? media.id.videoId : media.id;
        player.loadVideoById(id);
        this.play(player);
    }
    /**
     * @param {?} player
     * @return {?}
     */
    isPlaying(player) {
        // because YT is not loaded yet 1 is used - YT.PlayerState.PLAYING
        const /** @type {?} */ isPlayerReady = player && player.getPlayerState;
        const /** @type {?} */ playerState = isPlayerReady ? player.getPlayerState() : {};
        const /** @type {?} */ isPlayerPlaying = isPlayerReady
            ? playerState !== YT.PlayerState.ENDED && playerState !== YT.PlayerState.PAUSED
            : false;
        return isPlayerPlaying;
    }
    /**
     * @param {?} elementId
     * @param {?} outputs
     * @param {?} sizes
     * @param {?=} videoId
     * @param {?=} playerVars
     * @return {?}
     */
    createPlayer(elementId, outputs, sizes, videoId = '', playerVars = {}) {
        const /** @type {?} */ service = this;
        const /** @type {?} */ playerSize = {
            height: sizes.height || this.defaultSizes.height,
            width: sizes.width || this.defaultSizes.width
        };
        return new YoutubePlayerService.Player(elementId, Object.assign({}, playerSize, {
            events: {
                onReady: (ev) => {
                    this.zone.run(() => outputs.ready && outputs.ready.next(ev.target));
                },
                onStateChange: (ev) => {
                    this.zone.run(() => outputs.change && outputs.change.next(ev));
                    // this.zone.run(() => onPlayerStateChange(ev));
                }
            },
            videoId,
            playerVars,
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
    }
    /**
     * @param {?} player
     * @param {?} isFullScreen
     * @return {?}
     */
    toggleFullScreen(player, isFullScreen) {
        let { height, width } = this.defaultSizes;
        if (!isFullScreen) {
            height = window.innerHeight;
            width = window.innerWidth;
        }
        player.setSize(width, height);
        // TODO: dispatch event
    }
    /**
     * @return {?}
     */
    generateUniqueId() {
        const /** @type {?} */ len = 7;
        return Math.random().toString(35).substr(2, len);
    }
    /**
     * @return {?}
     */
    createApi() {
        this.api = new ReplaySubject(1);
        const /** @type {?} */ onYouTubeIframeAPIReady = () => {
            if (YoutubePlayerService.win) {
                this.api.next(/** @type {?} */ (YoutubePlayerService.YT));
            }
        };
        YoutubePlayerService.win['onYouTubeIframeAPIReady'] = onYouTubeIframeAPIReady;
    }
}
YoutubePlayerService.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
YoutubePlayerService.ctorParameters = () => [
    { type: NgZone, },
];

class YoutubePlayerComponent {
    /**
     * @param {?} playerService
     * @param {?} elementRef
     */
    constructor(playerService, elementRef) {
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
    ngAfterContentInit() {
        const /** @type {?} */ htmlId = this.playerService.generateUniqueId();
        const /** @type {?} */ playerSize = { height: this.height, width: this.width };
        this.ytPlayerContainer.nativeElement.setAttribute('id', htmlId);
        this.playerService.loadPlayerApi({
            protocol: this.protocol
        });
        this.playerService.setupPlayer(htmlId, {
            change: this.change,
            ready: this.ready,
        }, playerSize, this.videoId, this.playerVars);
    }
    /**
     * @return {?}
     */
    getProtocol() {
        const /** @type {?} */ hasWindow = window && window.location;
        const /** @type {?} */ protocol = hasWindow
            ? window.location.protocol.replace(':', '')
            : 'http';
        return protocol;
    }
}
YoutubePlayerComponent.decorators = [
    { type: Component, args: [{
                changeDetection: ChangeDetectionStrategy.OnPush,
                selector: 'youtube-player',
                template: `
    <div id="yt-player-ng2-component" #ytPlayerContainer></div>
  `,
            },] },
];
/**
 * @nocollapse
 */
YoutubePlayerComponent.ctorParameters = () => [
    { type: YoutubePlayerService, },
    { type: ElementRef, },
];
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

class YoutubePlayerModule {
}
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
YoutubePlayerModule.ctorParameters = () => [];

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
//# sourceMappingURL=ng2-youtube-player.js.map
