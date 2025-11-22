import React, { useEffect, useState } from "react";

const DebugInfo = () => {
  const [debugInfo, setDebugInfo] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    const userInfo = localStorage.getItem("user");

    setDebugInfo({
      hasToken: !!token,
      tokenLength: token ? token.length : 0,
      tokenPreview: token ? token.substring(0, 50) + "..." : "None",
      hasUserInfo: !!userInfo,
      userInfo: userInfo ? JSON.parse(userInfo) : null,
      localStorage: Object.keys(localStorage),
    });
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: 10,
        right: 10,
        background: "white",
        padding: 10,
        border: "1px solid #ccc",
        fontSize: "12px",
        maxWidth: "300px",
        zIndex: 9999,
      }}
    >
      <h4>Debug Info</h4>
      <p>
        <strong>Has JWT Token:</strong> {debugInfo.hasToken ? "✅" : "❌"}
      </p>
      <p>
        <strong>Token Length:</strong> {debugInfo.tokenLength}
      </p>
      <p>
        <strong>Token Preview:</strong> {debugInfo.tokenPreview}
      </p>
      <p>
        <strong>Has User Info:</strong> {debugInfo.hasUserInfo ? "✅" : "❌"}
      </p>
      {debugInfo.userInfo && (
        <p>
          <strong>User:</strong>{" "}
          {debugInfo.userInfo.name || debugInfo.userInfo.email}
        </p>
      )}
      <p>
        <strong>LocalStorage Keys:</strong> {debugInfo.localStorage?.join(", ")}
      </p>
    </div>
  );
};

export default DebugInfo;
