import decode from 'jwt-decode';

const TOKEN_KEY = 'id_token';

class AuthService {
  getProfile() {
    const token = this.getToken();

    if (!token) {
      console.warn('No token found');
      console.groupEnd();
      return null;
    }

    try {
      const profile = decode(token);
      console.groupEnd();
      return profile;
    } catch (error) {
      console.error('Error decoding token:', error);
      console.groupEnd();
      return null;
    }
  }

  loggedIn() {
    const token = this.getToken();

    if (!token) {
      console.warn('No token found');
      console.groupEnd();
      return false;
    }
    
    try {
      if (this.isTokenExpired(token)) {
        console.warn("Token has expired.");
        this.clearToken();
        console.groupEnd();
        return false;
      } else {
        console.groupEnd();
        return true;
      }
    } catch (error) {
      console.error('Error validating token:', error);
      this.clearToken();
      console.groupEnd();
      return false;
    }
  }

  isTokenExpired(token) {
    try {
      const decoded = decode(token);

      if (decoded.exp < Date.now() / 1000) {
        console.warn('Token has expired.');
        console.groupEnd();
        return true;
      }

      console.log('Token has not expired.');
      console.groupEnd();
      return false;
    } catch (error) {
      console.error('Error decoding expiration from token:', error);
      console.groupEnd();
      return true;
    }
  }

  getToken() {
    const token = localStorage.getItem(TOKEN_KEY);
    console.groupEnd();
    return token;
  }

  clearToken() {
    localStorage.removeItem(TOKEN_KEY);
  }

  login(idToken) {
    localStorage.setItem(TOKEN_KEY, idToken);
    window.location.assign('/');
    console.groupEnd();
  }

  async logout(authMethod = 'local') {
    try {
      switch (authMethod) {
        case 'local':
        case 'google':
        case 'github':
          this.clearToken();
          window.location.reload();
          break;
        default:
          throw new Error('Unknown auth method');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
    console.groupEnd();
  }
}

export default new AuthService();