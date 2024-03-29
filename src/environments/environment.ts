// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyDGN0Hlm1PAQN5DZdQfZq5tlZp9TeAf45I',
    authDomain: 'tank-english-dev.firebaseapp.com',
    projectId: 'tank-english-dev',
    storageBucket: 'tank-english-dev.appspot.com',
    messagingSenderId: '1056216382366',
    appId: '1:1056216382366:web:15512acb2c886eaa6bf48f'
  },
  // api: 'http://localhost:5000/tank-english-dev/us-central1'
  api: 'https://us-central1-tank-english-dev.cloudfunctions.net',
  jwt_key: 'EufoéÉîáÂþÑ§Ü£ë#Øçb¦WÕìç_êÃäØÝyR¸B¦yÓãMAËü²£Ìõþwìx£óc·-Bhî¯öNàÎyJõ½¼Õ¤ÑQïþaxÀ©UäFÞÆÁËL3¸âµ°úxÞ²uÞn±w',

  // firebase: {
  //   apiKey: 'AIzaSyCJRQTSUJ_DaR8TKxWw0ykluJvf_UjVj1M',
  //   authDomain: 'tank-english-prod.firebaseapp.com',
  //   projectId: 'tank-english-prod',
  //   storageBucket: 'tank-english-prod.appspot.com',
  //   messagingSenderId: '226577327419',
  //   appId: '1:226577327419:web:e316552b6510df1247431e'
  // },
  // api: 'https://us-central1-tank-english-prod.cloudfunctions.net'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
