import * as firebase from 'firebase';
import { NavController, ViewController } from 'ionic-angular';
import { Component } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Facebook } from 'ng2-cordova-oauth/core';
import { OauthCordova } from 'ng2-cordova-oauth/platform/cordova'
import { Localization } from '../../providers/localization';
import { UIHelper } from '../../providers/uihelper'
import { Storage } from '@ionic/storage';

@Component({
    selector: 'page-login',
    templateUrl: 'login.html',
})
export class LoginPage {
    //error: any
    busy: boolean;
    _credentials: any;
    rememberMe: false;
    private facebookProvider = new Facebook({
        clientId: "463670290510920",
        appScope: ["email"]
    })
    private cordovaOauth: OauthCordova = new OauthCordova();

    constructor(private afAuth: AngularFireAuth,
        private viewCtrl: ViewController,
        private local: Localization,
        private uiHelper: UIHelper,
        private storage: Storage) {
        this._credentials = {
            email: '',
            password: ''
        };
        this.busy = false;

        storage.get('rememberme').then((val) => {
            if (val)
                this.rememberMe = val;
        });

        storage.get('email').then((val) => {
            if (val)
                this._credentials.email = val;
        });

        storage.get('pwd').then((val) => {
            if (val)
                this._credentials.password = val;
        });
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }

    saveSettings() {
        this.storage.set('rememberme', this.rememberMe);

        if (this.rememberMe) {
            this.storage.set('email', this._credentials.email);
            this.storage.set('pwd', this._credentials.password);
        }
        else {
            this.storage.remove('email');
            this.storage.remove('pwd');
        }
    }

    registerUser(_event) {
        _event.preventDefault();
        this.busy = true;

        let self = this;
        let _credentials = this._credentials;
        //console.log("create user");
        this.afAuth.auth.createUserWithEmailAndPassword(_credentials.email, _credentials.password)
            .then((user) => {
                self.saveSettings();
                self.dismiss();
            })
            .catch(e => {
                self.uiHelper.showAlert(e);
                self.busy = false;
            });
    }

    registerUserWithFacebook(_event) {
        _event.preventDefault();
        let self = this;

        this.busy = true;
        this.cordovaOauth.logInVia(this.facebookProvider).then(fb => {
            console.log("Facebook success: " + JSON.stringify(fb));
            try {
                let token = fb["access_token"];
                console.log(token, firebase);
                const facebookCredential = firebase.auth.FacebookAuthProvider.credential(token);
                //let creds = firebase.auth.FacebookAuthProvider.credential(token);
                //console.log(creds);

                // let providerConfig = {
                //     provider: AuthProviders.Facebook,
                //     method: AuthMethods.OAuthToken,
                //     scope: ['email'],
                // };

                firebase.auth().signInWithCredential(facebookCredential).then((value) => {
                    console.log('firebase success');
                    this.dismiss();
                }).catch((error) => {
                    self.uiHelper.showAlert(error);
                    self.busy = false;
                });
            } catch (e) {
                self.uiHelper.showAlert(e);
            }
        }).catch((error) => {
            //this.error = error;
            self.busy = false;
        });
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
        this.afAuth.auth.signInWithEmailAndPassword(this._credentials.email, 
        this._credentials.password).then((authData) => {
            self.saveSettings();
            this.dismiss();
        }).catch((error) => {
            self.uiHelper.showAlert(error);
            self.busy = false;
        });
    }

    ResetPassword() {
        let self = this;
        this.busy = true;
        firebase.auth().sendPasswordResetEmail(this._credentials.email).then(_ => {
            self.uiHelper.showAlert(this.local.getString('ResetMsg'));
            self.busy = false;
        }).catch(err => {
            self.uiHelper.showAlert(err);
            self.busy = false;
        });
    }
}