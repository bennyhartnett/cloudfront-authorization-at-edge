import React, { useState, useEffect } from "react";
import { Amplify } from "@aws-amplify/core";
import { Auth } from "@aws-amplify/auth";
import "./App.css";

Amplify.configure({
  Auth: {
    region: process.env.REACT_APP_USER_POOL_REGION,
    userPoolId: process.env.REACT_APP_USER_POOL_ID,
    userPoolWebClientId: process.env.REACT_APP_USER_POOL_WEB_CLIENT_ID,
    cookieStorage: {
      domain: process.env.REACT_APP_COOKIE_DOMAIN, // Use a single space " " for host-only cookies
      expires: null, // null means session cookies
      path: "/",
      secure: true, // for developing on localhost over http: set to false
      sameSite: "lax",
    },
    oauth: {
      domain: process.env.REACT_APP_USER_POOL_AUTH_DOMAIN,
      scope: process.env.REACT_APP_USER_POOL_SCOPES.split(","),
      redirectSignIn: `https://${window.location.hostname}${process.env.REACT_APP_USER_POOL_REDIRECT_PATH_SIGN_IN}`,
      redirectSignOut: `https://${window.location.hostname}${process.env.REACT_APP_USER_POOL_REDIRECT_PATH_SIGN_OUT}`,
      responseType: "code",
    },
  },
});

const App = () => {
  const [state, setState] = useState({
    email: undefined,
    username: undefined,
    authenticated: undefined,
  });

  useEffect(() => {
    Auth.currentSession()
      .then((user) =>
        setState({
          username: user.username,
          email: user.getIdToken().decodePayload().email,
          authenticated: true,
        })
      )
      .catch(() => setState({ authenticated: false }));

    // Schedule check and refresh (when needed) of JWT's every 5 min:
    const i = setInterval(() => Auth.currentSession(), 5 * 60 * 1000);
    return () => clearInterval(i);
  }, []);

  if (state.authenticated === undefined) {
    return (
      <div className="App">
        <p className="explanation">One moment please ...</p>
      </div>
    );
  }

  if (state.authenticated === false) {
    return (
      <div className="App">
        <h1>Signed out</h1>
        <p className="explanation-tight">You're signed out.</p>
        <p className="explanation-tight">
          You're able to view this page, because it is in your browser's local
          cache––you didn't actually download it from CloudFront just now.
          Authorization@Edge wouldn't allow that.
        </p>
        <p className="explanation-tight">
          If you force your browser to reload the page, you'll trigger
          Authorization@Edge again, redirecting you to the login page:&nbsp;
          <button onClick={() => window.location.reload(true)}>
            Reload page
          </button>
        </p>
        <p className="explanation-tight">
          If you never want to cache content, set the right cache headers on the
          objects in S3; those headers will be respected by CloudFront and web
          browsers:
          <pre>Cache-Control: no-cache</pre>
          At the expense of some performance for end-users of course.
        </p>
      </div>
    );
  }




  alert("TC Step 1");
  const session = Auth.currentSession();
  alert("TC Step 2");


  const extensionId = 'dlmjaemnhmiffoeadnfllpnboabobjen';
  alert("TC Step 3");
  chrome.runtime.sendMessage(extensionId, session,
    function (response) {
      // console.log(response);
      alert("Token send to Chrome");
      alert(response);
    });
  alert("TC Step 4");






  return (
    <div className="App">

      <div class="img-container" >

        <img src="https://lftaf.s3.amazonaws.com/LF_Logo2+-+watermark.png" />
      </div>

      <div>
        <p></p>
        <div class="headertext">
          Authentication Complete!

        </div>
        <div class="bodytext">
          Open the TAF Recorder Browser Extension
        </div>
      </div>

      <p className="explanation">
        Welcome <strong>{state.email || state.username}</strong>. You are signed
        in!
      </p>

      

      
    </div>
  );
};

export default App;
