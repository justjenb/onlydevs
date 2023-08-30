import decode from 'jwt-decode';

class AuthService {
  getProfile() {
    return decode(this.getToken());
  }

  loggedIn() {
    const token = this.getToken();
    if (!token) {
      return false;
    }
    
    try {
      if (this.isTokenExpired(token)) {
        console.error("Token has expired.");
        return false;
      } else {
        return true;
      }
    } catch (error) {
      console.error('Error decoding token:', error);
      return false;
    }
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
          localStorage.removeItem('id_token');
          window.location.reload();
          break;
  
        case 'github':
          localStorage.removeItem('id_token');
          window.location.reload();
          break;
  
        default:
          throw new Error('Unknown auth method');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }
}

export default new AuthService();
