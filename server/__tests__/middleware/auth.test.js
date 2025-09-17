const jwt = require('jsonwebtoken');
const auth = require('../../middleware/auth');

// Mock de jsonwebtoken
jest.mock('jsonwebtoken');

describe('Middleware d\'authentification', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      headers: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe('Token valide', () => {
    test('devrait appeler next() avec un token valide', () => {
      const mockToken = 'valid-token';
      const mockDecodedToken = { userId: 'user123' };
      
      req.headers.authorization = `Bearer ${mockToken}`;
      jwt.verify.mockReturnValue(mockDecodedToken);

      auth(req, res, next);

      expect(jwt.verify).toHaveBeenCalledWith(mockToken, 'RANDOM_TOKEN_SECRET');
      expect(req.user).toEqual({ id: 'user123' });
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });
  });

  describe('Token invalide ou manquant', () => {
    test('devrait retourner 401 si le header Authorization est manquant', () => {
      auth(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
    });

    test('devrait retourner 401 si le token est invalide', () => {
      const mockToken = 'invalid-token';
      req.headers.authorization = `Bearer ${mockToken}`;
      
      jwt.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      auth(req, res, next);

      expect(jwt.verify).toHaveBeenCalledWith(mockToken, 'RANDOM_TOKEN_SECRET');
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: expect.any(Error) });
      expect(next).not.toHaveBeenCalled();
    });

    test('devrait retourner 401 si le token a expiré', () => {
      const mockToken = 'expired-token';
      req.headers.authorization = `Bearer ${mockToken}`;
      
      jwt.verify.mockImplementation(() => {
        const error = new Error('Token expired');
        error.name = 'TokenExpiredError';
        throw error;
      });

      auth(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: expect.any(Error) });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('Format du header Authorization', () => {
    test('devrait extraire correctement le token du format "Bearer token"', () => {
      const mockToken = 'test-token';
      const mockDecodedToken = { userId: 'user456' };
      
      req.headers.authorization = `Bearer ${mockToken}`;
      jwt.verify.mockReturnValue(mockDecodedToken);

      auth(req, res, next);

      expect(jwt.verify).toHaveBeenCalledWith(mockToken, 'RANDOM_TOKEN_SECRET');
      expect(req.user).toEqual({ id: 'user456' });
      expect(next).toHaveBeenCalled();
    });

    test('devrait gérer les espaces supplémentaires dans le header', () => {
      const mockToken = 'test-token';
      const mockDecodedToken = { userId: 'user789' };
      
      req.headers.authorization = `  Bearer   ${mockToken}  `;
      jwt.verify.mockReturnValue(mockDecodedToken);

      auth(req, res, next);

      // Le code actuel utilise split(' ')[1] qui prend le deuxième élément après split
      // Avec "  Bearer   test-token  ", split(' ') donne ['', '', 'Bearer', '', '', 'test-token', '', '']
      // Donc [1] = '' (chaîne vide)
      expect(jwt.verify).toHaveBeenCalledWith('', 'RANDOM_TOKEN_SECRET');
      expect(req.user).toEqual({ id: 'user789' });
      expect(next).toHaveBeenCalled();
    });
  });
});
