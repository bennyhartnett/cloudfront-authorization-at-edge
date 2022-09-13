// Copyright 2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

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

  return (
    <div className="App">
    
    
    
    
    
    
    
      <style>
        .img-container {
            text-align: center;
            font-family: 'Trebuchet MS', sans-serif;
        }

        h2 {
            font-family: 'Trebuchet MS', sans-serif;
            text-align: center;
            text-transform: uppercase;
            color: #2e5666;
        }
    </style>
    <div class="img-container" style="padding-top: 100px;">

        <!-- Block parent element -->
        <img src="data:image/png;base64,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"
            alt="Lion Federal">
    </div>




    <div>
        <p></p>
        <div class="img-container">
            <h2>Authentication Complete!</h2>

        </div>
        <div class="img-container">
            Open the TAF Recorder Browser Extension
        </div>
    </div>
    
    
    
    
    
    
    
    
      <h1>Private</h1>

      <p className="explanation">
        Welcome <strong>{state.email || state.username}</strong>. You are signed
        in!
      </p>

      <p className="explanation">
        If you are able to come here, it means everything was deployed in order.
        Amongst other things, you've deployed a CloudFront distribution that
        you're viewing right now.
      </p>

      <h4>What just happened:</h4>

      <ol className="explanation-points">
        <li>
          You just signed-in at the Cognito Hosted UI. You were redirected there
          by a Lambda@Edge function; it detected you had not yet authenticated.
        </li>
        <li>
          After sign-in you were redirected back by Cognito to your Cloudfront
          distribution. Another Lambda@Edge function handled that redirect and
          traded the authorization code for JWT's and stored these in your
          cookies.
        </li>
        <li>
          After that, the Lambda@Edge redirected you back to the URL you
          originally requested. This time you have valid JWT's in your cookies
          so you were allowed access, and here you are.
        </li>
      </ol>

      <h3>Good job!</h3>

      <p className="explanation">
        The page you're viewing right now is served from S3 (through
        CloudFront). You can upload your own SPA (React, Angular, Vue, ...) to
        the S3 bucket instead and thus instantly secure it with Cognito
        authentication. If your SPA uses AWS Amplify framework with cookie
        storage for Auth, the detection of the sign-in status in the SPA will
        work seamlessly, because the Lambda@Edge setup uses the same cookies. Of
        course your SPA needs to be made aware of the right&nbsp;
        <span className="config">
          config
          <span className="config-text">
            {`Amplify.configure({
  Auth: {
    region: "us-east-1",
    userPoolId: "${process.env.REACT_APP_USER_POOL_ID}",
    userPoolWebClientId: "${process.env.REACT_APP_USER_POOL_WEB_CLIENT_ID}",
    cookieStorage: {
      domain: "${
        process.env.REACT_APP_COOKIE_DOMAIN
      }", // Use a single space " " for host-only cookies
      expires: null, // null means session cookies
      path: "/",
      secure: true, // for developing on localhost over http: set to false
      sameSite: "lax"
    },
    oauth: {
      domain: "${process.env.REACT_APP_USER_POOL_AUTH_DOMAIN}",
      scope: ${JSON.stringify(
        process.env.REACT_APP_USER_POOL_SCOPES.split(",")
      )},
      redirectSignIn: "https://${window.location.hostname}${
              process.env.REACT_APP_USER_POOL_REDIRECT_PATH_SIGN_IN
            }",
      redirectSignOut: "https://${window.location.hostname}${
              process.env.REACT_APP_USER_POOL_REDIRECT_PATH_SIGN_OUT
            }",
      responseType: "code"
    }
  }
});`}
          </span>
        </span>
        .
      </p>

      <p className="explanation">
        Take a look at your cookies (open the developer panel in your browser)
        and you'll see a couple of JWT's there. Try clearing these cookies and
        reload the page, then you'll have to sign in again––unless you are still
        signed in at the Cognito hosted UI, in which case you would be
        redirected back here seamlessly with new JWT's.
      </p>

      <p className="explanation">
        To sign-out both locally (by clearing cookies) as well as at the Cognito
        hosted UI, use the sign-out button:{" "}
        <button onClick={() => Auth.signOut()}>Sign out</button>. That uses
        Amplify to sign out. Alternatively, sign out using Lambda@Edge by
        explicitly visiting the sign-out URL:{" "}
        <a href={process.env.REACT_APP_SIGN_OUT_URL}>Sign Out</a>.
      </p>

      <p className="explanation">
        Now that you're signed in, you can access any file in the protected S3
        bucket, directly through the URL. For example, open this AWS SAM
        introduction image:{" "}
        <a href="aws_sam_introduction.png" target="_blank">
          link
        </a>
        . If you open the link, your browser will automatically send the cookies
        along, allowing Cloudfront Lambda@Edge to inspect and validate them, and
        only return you that image if the JWT's in your cookies are indeed still
        valid. Try clearing your cookies again and then open the link,
        Lambda@Edge will then redirect you to the Cognito hosted UI. After
        sign-in there (you may still be signed in there) you will be redirected
        back to the link location.
      </p>
    </div>
  );
};

export default App;
