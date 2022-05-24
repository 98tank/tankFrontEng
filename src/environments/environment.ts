// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyCuBMgcsNFtu8KXF88dVj3I6ndzwn27JFw',
    authDomain: 'tank-development.firebaseapp.com',
    projectId: 'tank-development',
    storageBucket: 'tank-development.appspot.com',
    messagingSenderId: '676047934734',
    appId: '1:676047934734:web:4a2e62de4f2aa1f345f35f'
  },
  api: 'https://us-central1-tank-development.cloudfunctions.net'
  // firebase: {
  //   apiKey: 'AIzaSyA_-hGMiqDE7VQzEreIWwotuXW00dk2DKM',
  //   authDomain: 'tank-98.firebaseapp.com',
  //   databaseURL: 'https://tank-98.firebaseio.com',
  //   projectId: 'tank-98',
  //   storageBucket: 'tank-98.appspot.com',
  //   messagingSenderId: '188697387783',
  //   appId: '1:188697387783:web:6fcbbc3389eb0628011ba2'
  // },
  // api: 'https://us-central1-tank-98.cloudfunctions.net'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
