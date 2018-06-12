var appId = 'YOUR_APP_ID';

$(document).ready(function(){
  window.hc = new HomeController();
});
window.addEventListener("message", receiveMessage, false);

function HomeController() {
  this.login = function() {
    const callbackUri = window.location.origin + '/oath/nested_response';
    const strWindowFeatures = 'location=yes,height=570,width=520,scrollbars=yes,status=yes';
    const oauthWindow = window.open('', '_blank', strWindowFeatures);
    $.ajax({
      url: '/oath/create_token',
      type: "POST",
      data: {},
      success: function (response) {
        if (response.status === 'ok') {
          var token = response.data.token;
          oauthWindow.location = 'https://webapp.ronaksoftware.com/oauth/?client_id=' + appId +
            '&redirect_uri=' + callbackUri + '&scope=read%20profile%20data,create%20app,get%20token&token=' +
            token;
          if (oauthWindow === undefined) {
            message.error('Please disable your popup blocker');
            return;
          }
          const interval = setInterval(() => {
            if (oauthWindow.closed) {
              clearInterval(interval);
              $.ajax({
                url: "/oath/verify_token",
                type: "POST",
                data: {
                  token: token,
                },
                success: function (res) {
                  if (res.data && res.data.user) {
                    window.location.reload();
                  }
                },
                error: function (jqXHR) {
                  console.log(jqXHR.responseText + ' :: ' + jqXHR.statusText);
                }
              });
            }
          }, 1000);
        } else {
          oauthWindow.close();
        }
      },
      error: function (jqXHR) {
        console.log(jqXHR.responseText + ' :: ' + jqXHR.statusText);
      }
    });
  }

  this.sendTest = function() {
    $.ajax({
      url: '/send_mail',
      type: "POST",
      data: {},
      success: function (response) {
        if (response.status === 'ok') {
        } else {
        }
      },
      error: function (jqXHR) {
        console.log(jqXHR.responseText + ' :: ' + jqXHR.statusText);
      }
    });
  }
}

function receiveMessage(event) {
  console.log('a message recieved from parent window ( nested )', event);
  if (event.origin.indexOf(window.origin) === -1) {
    return;
  }
}

function copyToClipboard(text) {
  var inp = document.createElement('input');
  document.body.appendChild(inp);
  inp.value = text;
  inp.select();
  document.execCommand('copy', false);
  inp.remove();
}