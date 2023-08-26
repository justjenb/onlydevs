import decode from 'jwt-decode';

class AuthService {
  getProfile() {
    return decode(this.getToken());
  }

  loggedIn() {
    const token = this.getToken();
    return token && !this.isTokenExpired(token) ? true : false;
  }

  isTokenExpired(token) {
    const decoded = decode(token);
    if (decoded.exp < Date.now() / 1000) {
      localStorage.removeItem('id_token');
      return true;
    }
    return false;
  }

  getToken() {
    return localStorage.getItem('id_token');
  }

  login(idToken) {
    localStorage.setItem('id_token', idToken);
    window.location.assign('/');
  }

  async logout(authMethod = 'local') {
    try {
      switch (authMethod) {
        case 'local':
          localStorage.removeItem('id_token');
          window.location.reload();
          break;

        case 'google':
          if (window.gapi) {
            const auth2 = window.gapi.auth2.getAuthInstance();
            await auth2.signOut();
          }
          localStorage.removeItem('id_token'); // Remove token if you also save Google's token in localStorage.
          window.location.reload();
          break;

        case 'github':
          const VITE_SERVER_ENDPOINT = import.meta.env.VITE_SERVER_ENDPOINT;
          const response = await fetch(`${VITE_SERVER_ENDPOINT}/api/auth/github/revoke`, {
            credentials: "include",
          });
          if (!response.ok) {
            throw new Error('Failed to revoke GitHub token');
          }
          localStorage.removeItem('id_token'); // Remove token if you also save GitHub's token in localStorage.
          window.location.reload();
          break;

        default:
          throw new Error('Unknown auth method');
      }
    } catch (error) {
      console.error('Error during logout:', error);
      // Handle error as needed (e.g., display an error message to the user)
    }
  }

  getGitHubUrl(from) {
    const rootURl = "https://github.com/login/oauth/authorize";
  
    const options = {
      'client_id': import.meta.env.VITE_GITHUB_OAUTH_CLIENT_ID,
      'redirect_uri': import.meta.env.VITE_GITHUB_OAUTH_REDIRECT_URL,
      'scope': "user:email",
      'state': from,
    };
  
    const qs = new URLSearchParams(options);
  
    return `${rootURl}?${qs.toString()}`;
  }
  
}

export default new AuthService();
