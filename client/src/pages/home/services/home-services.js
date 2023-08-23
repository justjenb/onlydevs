import axios from "axios";

export function getAccessTokenGithub(code) {
    return axios.get(`http://localhost:3001/api/github/accessToken?code=${code}`, {
        headers: {
            "Content-Type": "application/json",
        },
    }).then(response => response.data);
}

export function getUserDataGithub(accessToken) {
    return axios.get(`http://localhost:3001/api/github/userData?accessToken=${accessToken}`, {
        headers: {
            "Content-Type": "application/json",
        },
    }).then(response => response.data);
}

export function getUserDataGoogle(accessToken) {
    return axios.get(`http://localhost:3001/api/google/userData?accessToken=${accessToken}`, {
        headers: {
            "Content-Type": "application/json",
        },
    }).then(response => response.data);
}
