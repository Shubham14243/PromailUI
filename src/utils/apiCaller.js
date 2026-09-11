import useAuthStore from "../context/AuthContext";

const callApi = async (
  reqMethod,
  reqEndpoint,
  reqBody = {},
  params = null,
  tokenOverride = null,
) => {
  const { getStoredUser } = useAuthStore.getState();

  const backendBaseUrl =
    import.meta.env.VITE_BACKEND_BASE_URL || "http://localhost:8080";

  const storedUser = getStoredUser();
  const token = tokenOverride ?? storedUser?.auth_token ?? "";

  if (params && typeof params === "object") {
    const queryString = new URLSearchParams(params)
      .toString()
      .replace(/%3A/gi, ":");
    reqEndpoint += `?${queryString}`;
  }

  const isBodyAllowed = !["GET", "HEAD"].includes(
    reqMethod.toUpperCase(),
  );

  const res = await fetch(`${backendBaseUrl}${reqEndpoint}`, {
    method: reqMethod,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
    ...(isBodyAllowed
      ? { body: JSON.stringify(reqBody) }
      : {}),
  });

  const contentType = res.headers.get("Content-Type") || "";

  let data = null;

  if (contentType.includes("application/json")) {
    data = await res.json().catch(() => null);
  } else {
    data = await res.text().catch(() => "");
  }

  return { res, data };
};


// Refresh request
// This must NOT go through apiCaller().
const refreshAccessToken = async (refreshToken) => {
  const backendBaseUrl =
    import.meta.env.VITE_BACKEND_BASE_URL || "http://localhost:8080";

  const res = await fetch(
    `${backendBaseUrl}/api/v1/auth/refresh`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        refresh_token: refreshToken,
      }),
    },
  );

  const contentType = res.headers.get("Content-Type") || "";

  let data = null;

  if (contentType.includes("application/json")) {
    data = await res.json().catch(() => null);
  } else {
    data = await res.text().catch(() => "");
  }

  return { res, data };
};


const apiCaller = async (
  reqMethod,
  reqEndpoint,
  reqBody = {},
  params = null,
) => {
  const { refreshUser, clearUser } = useAuthStore.getState();

  // -----------------------------------------
  // 1. Original request
  // -----------------------------------------

  const { res, data } = await callApi(
    reqMethod,
    reqEndpoint,
    reqBody,
    params,
  );

  // Request succeeded
  if (res.status !== 401) {
    return {
      res,
      data,
    };
  }


  // -----------------------------------------
  // 2. Get refresh token
  // -----------------------------------------

  const storedUser = JSON.parse(
    localStorage.getItem("proMailUser") || "null",
  );

  const refreshToken = storedUser?.refresh_token;

  if (!refreshToken) {
    clearUser();

    return {
      res,
      data,
    };
  }


  // -----------------------------------------
  // 3. Refresh access token
  // -----------------------------------------

  try {
    const refresh = await refreshAccessToken(refreshToken);


    // Your response is:
    //
    // {
    //   message: "...",
    //   data: {
    //     auth_token: "..."
    //   }
    // }

    if (
      !refresh.res.ok ||
      !refresh.data?.data?.auth_token
    ) {

      clearUser();

      return {
        res: refresh.res,
        data: refresh.data,
      };
    }


    // -----------------------------------------
    // 4. Extract new access token
    // -----------------------------------------

    const newAccessToken =
      refresh.data.data.auth_token;


    // -----------------------------------------
    // 5. Store new token
    // -----------------------------------------

    refreshUser(newAccessToken);


    // -----------------------------------------
    // 6. Retry original request
    // -----------------------------------------

    const retry = await callApi(
      reqMethod,
      reqEndpoint,
      reqBody,
      params,
      newAccessToken,
    );

    return {
      res: retry.res,
      data: retry.data,
    };

  } catch (error) {

    clearUser();

    return {
      res,
      data,
    };
  }
};

export default apiCaller;