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

*{app_id}*: your application id,

*{callback_url}*: sends a post request to this end point

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

*{permissions}*: comma separated values

*{your_optional_token}*: described in {callback_url} section

Notice that the end point you are providing supposes to accept all request and data will be sent as  **multi-part formdata**!

**DO NOT FORGET TO ADD "Access-Control-Allow-Origin" to "*" or those OAuth url I mentioned!**