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
          localStorage.removeItem('id_token'); // Remove token if you also save Google's token in localStorage.
          window.location.reload();
          break;
  
        case 'github':
          await this.clearServerToken(); // Clear server side token
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

}

export default new AuthService();
