Customize functionality for your own nested workspace or build a beautiful app to share with the world. Provide your ingenious integrations with a suitably configurable container. Build a nested app.

## OAuth
OAuth 2.0 is a protocol that lets your app request authorization to private details in a user's nested account without getting their password. It's also the vehicle by which nested apps are installed on a team.

Your app asks for specific permission scopes and is rewarded with access tokens upon a user's approval.

You'll need to [register your app](https://store.nested.me/) before getting started. A registered app is assigned a unique Client ID which will be used in the OAuth flow.

![OAuth Flow](https://a.slack-edge.com/bfaba/img/api/slack_oauth_flow_diagram@2x.png)

### Step 1 - Create a token on your client side
In order to detect every requests that are being sent from you client side you have to create a token, Token represent a request ID and it will be used for detecting which callback is yours to respond.

### Step 2 - Open nested OAuth url
nested's OAuth url has template described below:

    https://web.nested.me/oauth/?client_id={app_id}&redirect_uri={callback_url}&scope={permissions}&token={your_optional_token}

`{app_id}`: your application id,

`{callback_url}`: sends a post request to this end point

    params : {
	    token:  {your_optional_token}
	    app_id: {app_id},
	    app_token: {app_token},
	    app_domain: {workspace domain},
	    username: {user _id},
	    admin: {user authority.admin},
	    fname: {user fname},
	    lname: {user lname},
	    email: {user email},
	    picture: {complete path user logo} // complete path to user logo
    };

`{permissions}`: comma separated values

`{your_optional_token}`: described in {callback_url} section

Notice that the end point you are providing supposes to accept all request and data will be sent as  **multi-part formdata**!

**DO NOT FORGET TO ADD `"Access-Control-Allow-Origin"` to `"*"` or those OAuth url I mentioned!**

### Step 3 - Use OAuth data for register or login
You have all the info you need to register a user!
`app_token` and `app_id` will help you to call nested's API as authenticated user. More details on abc section.

## Nested API
Almost all API's can be used with `app_token` and `app_id`, you can find list nested's API's [here](http://webapp.ronaksoftware.com:2222/)

Unlike Slack nested is not a single instance server and each workspace has its own api url, for obtaining those url addresses you have to call url below:

    https://npc.nested.me/dns/discover/{workspace or domain address}
    //e.g https://npc.nested.me/dns/discover/nested.me
You can use [this](/lib/nested.js) file to discover API addresses easier

### Calling nested API's

    {
      cmd,
      data,
      _reqid: {requesr id},
      _app_id: {app_id},
      _app_token: {app_token},
    }
here is the json model of each request

`cmd` is command that is listed in API section

`data` is payload of your request

`_reqid` is request ID and mostly is being used in websocket form of calling API's and in response you will get the same request ID!

`_app_id` is Client_Id

`_app_token` is the token you'll get from OAuth section

## Working with nested's Framework
nested has its own [framework](http://git.ronaksoftware.com/nested-apps/framework) to work third party apps.

nested and third party apps can talk through a iframe window, in order to do so framework must be initialized with client unique id.

Example:

    nstApp.init('_helloworld');
nested's Framework has two main parts:
### Api Call

    nstApp.sendIframeMessage({cmd}, {payload});
sendIframeMessage function calls nested framework API's directly,
List of nested's Framework commands:
| cmd | payload |response handler |
|--|--|--|
| getInfo | none |setInfo |
| setSize | `height`, `width` | none |
| setNotif | `type = {'success', 'info', 'warning', 'error'}`, `message`| none |
| createToken | `token` | setLoginInfo |

example

    nstApp.sendIframeMessage('setSize', {
        width: 100,
        height: 200
    });

### Handlers
| handler | response |
|--|--|
| setInfo | `userdId`, `email`, `fname`, `lanme`, `msgId`, `app`, `domain`, `locale`, `dark` |
| setTheme | `dark` |
| setLoginInfo | `token`, `appToken`, `appDomain`, `username`, `fname`, `lname`, `email` |

example:

    nstApp.handler.setInfo = function (response) {
    	console.log(response);
    };
