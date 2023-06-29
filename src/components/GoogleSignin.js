import React, { useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import { GoogleClientId } from "../constants";

const GoogleSignIn = () => {
  const handleGoogleSignIn = (res) => {
    if (!res.clientId || !res.credential) return;
    // this res.credential is the idToken which is a JWT and can be decoded but not verified, this should be done on the server side by hitting backend api that verifies the token with google library
    const idToken = res.credential;
    const decoded = jwt_decode(idToken);
    // set this to profile data
    setProfile(decoded);
  };
  const [profile, setProfile] = useState(null);
  const [gsiScriptLoaded, setGsiScriptLoaded] = useState(false);
  function initializeGsi() {
    if (!window.google || gsiScriptLoaded) return;

    setGsiScriptLoaded(true);
    window.google.accounts.id.initialize({
      client_id: GoogleClientId,
      callback: handleGoogleSignIn,
    });
    window.google.accounts.id.renderButton(
      document.getElementById("buttonDiv"),
      {
        theme: "outline",
        size: "large",
        text: "continue_with",
        shape: "rectangular",
        longtitle: true,
        width: 400,
        height: 50,
      }
    );
    window.google.accounts.id.prompt(); // also display the One Tap dialog
  }

  useEffect(() => {
    if (gsiScriptLoaded) return;
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.onload = initializeGsi;
    script.async = true;
    script.defer = true;
    script.id = "google-client-script";
    document.querySelector("body")?.appendChild(script);

    return () => {
      // Cleanup function that runs when component unmounts
      window.google?.accounts.id.cancel();
      document.getElementById("google-client-script")?.remove();
    };
  }, [handleGoogleSignIn, initializeGsi]);

  return (
    <div style={{ textAlign: "center" }}>
      <h3>Simple signin with google</h3>
      <div
        className={"g_id_signin"}
        align="center"
        style={{ margin: "10pt 0" }}
        id="buttonDiv"
      ></div>
      {profile && (
        <div>
          <p>
            Profile data decoded. The decoding and validation should be done on
            the server side ideally with google official server side library ex.
            <a href="https://github.com/googleapis/google-auth-library-python">
              google-auth-library-python
            </a>{" "}
            this is normal decoded data.
          </p>
          <pre
            style={{
              display: "flex",
              justifyContent: "center",
              textAlign: "left",
            }}
          >
            <code>{JSON.stringify(profile, null, 2)}</code>
          </pre>
        </div>
      )}
    </div>
  );
};

export default GoogleSignIn;
