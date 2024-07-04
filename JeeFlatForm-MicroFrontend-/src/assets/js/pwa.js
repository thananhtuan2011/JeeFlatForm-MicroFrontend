// var manifestJSON =
// {
//     "name": "jeeplat11",
//     "short_name": "jeeplat11",
//     "scope": `${window.location.href}`,
//     "start_url": `${window.location.href}`,
//     "display": "standalone",
//     "icons": [
//         {
//             "src": "https://cdn.jee.vn/test/pwa/72.png",
//             "sizes": "72x72",
//             "type": "image/png",
//             "purpose": "maskable any"
//         },
//         {
//             "src": "https://cdn.jee.vn/test/pwa/96.png",
//             "sizes": "96x96",
//             "type": "image/png",
//             "purpose": "maskable any"
//         },
//         {
//             "src": "https://cdn.jee.vn/test/pwa/128.png",
//             "sizes": "128x128",
//             "type": "image/png",
//             "purpose": "maskable any"
//         },
//         {
//             "src": "https://cdn.jee.vn/test/pwa/144.png",
//             "sizes": "144x144",
//             "type": "image/png",
//             "purpose": "maskable any"
//         },
//         {
//             "src": "https://cdn.jee.vn/test/pwa/152.png",
//             "sizes": "152x152",
//             "type": "image/png",
//             "purpose": "maskable any"
//         },
//         {
//             "src": "https://cdn.jee.vn/test/pwa/192.png",
//             "sizes": "192x192",
//             "type": "image/png",
//             "purpose": "maskable any"
//         },
//         {
//             "src": "https://cdn.jee.vn/test/pwa/384.png",
//             "sizes": "384x384",
//             "type": "image/png",
//             "purpose": "maskable any"
//         },
//         {
//             "src": "https://cdn.jee.vn/test/pwa/512.png",
//             "sizes": "512x512",
//             "type": "image/png",
//             "purpose": "maskable any"
//         }
//     ],
//     "background_color": "black",
//     "theme_color": "#027be3"
// };
function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

let token = this.getCookie("sso_token");
const manifestURL = token ? `https://jeechat-api.jee.vn/api/chat?token=${token}&location=${window.location.href}&AppID=${3}` : `https://jeechat-api.jee.vn/api/chat?location=${window.location.href}&AppID=${3}`;

document.querySelector('#my-manifest-placeholder').setAttribute('type', '"application/manifest+json"');
document.querySelector('#my-manifest-placeholder').setAttribute('href', manifestURL);
