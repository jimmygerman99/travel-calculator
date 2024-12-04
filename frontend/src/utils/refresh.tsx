//This is what refreshes the token and sends call to it
import axios from "axios";
import createRefresh from "react-auth-kit/createRefresh";

const refresh = createRefresh({
    interval: 10, // Refresh every 10 seconds
    refreshApiCallback: async (param) => {
        try {
            const response = await axios.post("/refresh", param, {
                headers: { Authorization: `Bearer ${param.authToken}` },
            });
            console.log("Refreshing token");
            return {
                isSuccess: true,
                newAuthToken: response.data.token, // New access token
                newAuthTokenExpireIn: 600, // Token expires in seconds
                newRefreshTokenExpiresIn: 3600, // Refresh token expires in seconds
            };
        } catch (error) {
            console.error("Error refreshing token:", error);
            return {
                isSuccess: false,
            };
        }
    },
});

export default refresh;
