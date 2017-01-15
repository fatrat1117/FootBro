import * as firebase from 'firebase';
import {Modal, NavController, ViewController} from 'ionic-angular';
import {Component, Inject} from '@angular/core';
import {
    AngularFire, firebaseAuthConfig, AuthProviders,
    AuthMethods
} from 'angularfire2';
import {Facebook} from 'ng2-cordova-oauth/core';
import {OauthCordova} from 'ng2-cordova-oauth/platform/cordova'
import {Localization} from '../../providers/localization';

@Component({
    selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

    error: any
    busy: boolean;
    _credentials: any;
    private facebookProvider = new Facebook({
        clientId: "463670290510920",
        appScope: ["email"]
    })
    private cordovaOauth: OauthCordova = new OauthCordova();

    constructor(public af: AngularFire,
        public viewCtrl: ViewController,
        private local: Localization
    ) {
        this._credentials = {
            email: '',
            password: ''
        };
        this.busy = false;
        //this.cordovaOauth = new CordovaOauth(new Facebook({clientId: "502807016597247", appScope: ["email"]}));
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }
    /**
     * this create in the user using the form credentials. 
     *
     * we are preventing the default behavor of submitting 
     * the form
     * 
     * @param _credentials {Object} the email and password from the form
     * @param _event {Object} the event information from the form submit
     */
    registerUser(_event) {
        _event.preventDefault();
        this.busy = true;

        let self = this;
        let _credentials = this._credentials;
        console.log("create user");
        this.af.auth.createUser(_credentials)
            .then((user) => {
                console.log(`Create User Success:`, user);
                //_credentials.created = true;
                self.dismiss();
                //return this.login(_credentials, _event);
            })
            .catch(e => {
                self.error = e;
                self.busy = false;
            });
    }

    registerUserWithFacebook(_event) {
        _event.preventDefault();
        let self = this;

        this.busy = true;
        //console.log(this.cordovaOauth);
        this.cordovaOauth.logInVia(this.facebookProvider).then(fb => {
            console.log("Facebook success: " + JSON.stringify(fb));
            try {
            let token = fb["access_token"];
            console.log(token, firebase);
            let creds = firebase.auth.FacebookAuthProvider.credential(token);
            console.log(creds);

            let providerConfig = {
                provider: AuthProviders.Facebook,
                method: AuthMethods.OAuthToken,
                scope: ['email'],
            };
            
            this.af.auth.login(creds, providerConfig).then((value) => {
                console.log('firebase success');
                //console.log(value);
                this.dismiss();
            }).catch((error) => {
                this.error = error;
                self.busy = false;
            });
            } catch(e) {alert(e);}
        }).catch((error) => {
            //this.error = error;
            self.busy = false;
        });
    }

    registerUserWithWechat(_event) {

    }
    /**
     * this logs in the user using the form credentials.
     * 
     * if the user is a new user, then we need to create the user AFTER
     * we have successfully logged in
     * 
     * @param _credentials {Object} the email and password from the form
     * @param _event {Object} the event information from the form submit
     */
    login(credentials, _event) {
        _event.preventDefault();
        // if this was called from the register user,  the check if we 
        // need to create the user object or not
        // let addUser = credentials.created
        // credentials.created = null;
        let self = this;
        this.busy = true;
        // login usig the email/password auth provider
        this.af.auth.login(credentials, {
            provider: AuthProviders.Password,
            method: AuthMethods.Password
        }).then((authData) => {
            //console.log(authData)
            // if (addUser) {
            //     const itemObservable = this.af.database.object('/users/' + authData.uid);
            //     itemObservable.set({
            //         "provider": authData.auth.providerData[0].providerId,
            //         "avatar": authData.auth.photoURL || "MISSING",
            //         "displayName": authData.auth.providerData[0].displayName || authData.auth.email,
            //     })
            // } else {
            this.dismiss();
            //}
        }).catch((error) => {
            this.error = error
            self.busy = false;
            //console.log(error)
        });
    }

    ResetPassword() {
        let self = this;
        this.busy = true;
        firebase.auth().sendPasswordResetEmail(this._credentials.email).then(_ => {
            alert(this.local.getString('ResetMsg'));
            self.busy = false;
        }).catch(err => {
            alert(err);
            self.busy = false;
        });
    }
}