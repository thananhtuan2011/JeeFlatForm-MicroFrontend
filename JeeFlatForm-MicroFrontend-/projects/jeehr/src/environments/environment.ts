// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  HOST_MINIO: 'https://cdn.jee.vn',
  HOST_JEEHR_API: 'https://jeehr-api.jee.vn', // https://jeehr-api.jee.vn // https://localhost:44313
  HOST_JEEWORK_API: 'https://localhost:5001',
  HOST_JEEMEETING_API: 'https://jeemeeting-api.jee.vn',
  HOST_JEELANDINGPAGE_API: 'https://jeeglobal-api.jee.vn', //https://localhost:44327
  HOST_JEEWORK_API_2023: 'https://work-api.jee.vn',       //https://work-api.jee.vn 
  HOST_JEECOMMENT_API: 'https://jeecomment-api.jee.vn',
  HOST_JEEACCOUNT_API: 'https://jeeaccount-api.jee.vn',
  HOST_JEETEAM_API: 'https://team-api.jee.vn',
  APPCODE_JEEHR: 'JeeHR',
  APPCODE_JEEWORK: 'WORK',
  APPCODE_JEEMEETING: 'MEETING',
  HOST_SOCKET: 'wss://socket.jee.vn',
  HOST_NOTIFICATION: 'https://notification.jee.vn',
  VERSION_WEB: '1.0.0',
};

export const version = {
  menu: {
    ver: "1.0",//Trường hợp đánh version ở controller
  }
};

