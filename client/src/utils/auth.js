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

  logout() {
    localStorage.removeItem('id_token');
    window.location.reload();
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
