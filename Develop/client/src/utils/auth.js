// use this to decode a token and get the user's information out of it
import { AuthenticationError } from 'apollo-server-express';
import AuthService from './path-to-auth-service';
import decode from 'jwt-decode';

const authMiddleware = (context) => {
  const token = context.req.headers.authorization || '';

  if (!token) {
    throw new AuthenticationError('Authentication token missing');
  }

  try {
    // Verify and decode the token using your authentication service
    const user = AuthService.verifyToken(token);

    // Attach the decoded user data to the context to be used in resolvers
    context.user = user;

    return context;
  } catch (error) {
    throw new AuthenticationError('Invalid or expired token');
  }
};

// create a new class to instantiate for a user
class AuthService {
  // get user data
  getProfile() {
    return decode(this.getToken());
  }

  // check if user's logged in
  loggedIn() {
    // Checks if there is a saved token and it's still valid
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token); // handwaiving here
  }

  // check if token is expired
  isTokenExpired(token) {
    try {
      const decoded = decode(token);
      if (decoded.exp < Date.now() / 1000) {
        return true;
      } else return false;
    } catch (err) {
      return false;
    }
  }

  getToken() {
    // Retrieves the user token from localStorage
    return localStorage.getItem('id_token');
  }

  login(idToken) {
    // Saves user token to localStorage
    localStorage.setItem('id_token', idToken);
    window.location.assign('/');
  }

  logout() {
    // Clear user token and profile data from localStorage
    localStorage.removeItem('id_token');
    // this will reload the page and reset the state of the application
    window.location.assign('/');
  }
}

export default new AuthService();
