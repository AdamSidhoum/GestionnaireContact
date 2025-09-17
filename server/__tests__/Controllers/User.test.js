const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../../Models/User');
const userController = require('../../Controllers/User');

// Mock des dépendances
jest.mock('bcrypt');
jest.mock('jsonwebtoken');
jest.mock('../../Models/User');

describe('Contrôleur User', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe('signup', () => {
    test('devrait créer un nouvel utilisateur avec succès', (done) => {
      const mockUser = {
        email: 'test@example.com',
        password: 'hashedPassword',
        save: jest.fn().mockResolvedValue()
      };

      req.body = {
        email: 'test@example.com',
        password: 'password123'
      };

      bcrypt.hash.mockResolvedValue('hashedPassword');
      User.mockImplementation(() => mockUser);

      userController.signup(req, res, next);

      // Attendre que les Promises se résolvent
      setTimeout(() => {
        expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
        expect(User).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'hashedPassword'
        });
        expect(mockUser.save).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ message: 'Utilisateur créé !' });
        done();
      }, 10);
    });

    test('devrait retourner une erreur 500 si bcrypt.hash échoue', (done) => {
      req.body = {
        email: 'test@example.com',
        password: 'password123'
      };

      bcrypt.hash.mockRejectedValue(new Error('Hash error'));

      userController.signup(req, res, next);

      setTimeout(() => {
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: expect.any(Error) });
        done();
      }, 10);
    });

    test('devrait retourner une erreur 400 si user.save échoue', (done) => {
      const mockUser = {
        email: 'test@example.com',
        password: 'hashedPassword',
        save: jest.fn().mockRejectedValue(new Error('Save error'))
      };

      req.body = {
        email: 'test@example.com',
        password: 'password123'
      };

      bcrypt.hash.mockResolvedValue('hashedPassword');
      User.mockImplementation(() => mockUser);

      userController.signup(req, res, next);

      setTimeout(() => {
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: expect.any(Error) });
        done();
      }, 10);
    });
  });

  describe('login', () => {
    test('devrait connecter un utilisateur avec des identifiants valides', (done) => {
      const mockUser = {
        _id: 'user123',
        email: 'test@example.com',
        password: 'hashedPassword'
      };

      req.body = {
        email: 'test@example.com',
        password: 'password123'
      };

      User.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue('mockToken');

      userController.login(req, res, next);

      setTimeout(() => {
        expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
        expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedPassword');
        expect(jwt.sign).toHaveBeenCalledWith(
          { userId: 'user123' },
          'RANDOM_TOKEN_SECRET',
          { expiresIn: '24h' }
        );
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
          userId: 'user123',
          token: 'mockToken'
        });
        done();
      }, 10);
    });

    test('devrait retourner 401 si l\'utilisateur n\'existe pas', (done) => {
      req.body = {
        email: 'nonexistent@example.com',
        password: 'password123'
      };

      User.findOne.mockResolvedValue(null);

      userController.login(req, res, next);

      setTimeout(() => {
        expect(User.findOne).toHaveBeenCalledWith({ email: 'nonexistent@example.com' });
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ 
          message: 'Utilisateur ou mot de passe incorrect' 
        });
        done();
      }, 10);
    });

    test('devrait retourner 401 si le mot de passe est incorrect', (done) => {
      const mockUser = {
        _id: 'user123',
        email: 'test@example.com',
        password: 'hashedPassword'
      };

      req.body = {
        email: 'test@example.com',
        password: 'wrongPassword'
      };

      User.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockResolvedValue(false);

      userController.login(req, res, next);

      setTimeout(() => {
        expect(bcrypt.compare).toHaveBeenCalledWith('wrongPassword', 'hashedPassword');
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ 
          message: 'Utilisateur ou mot de passe incorrect' 
        });
        done();
      }, 10);
    });

    test('devrait retourner 500 si User.findOne échoue', (done) => {
      req.body = {
        email: 'test@example.com',
        password: 'password123'
      };

      User.findOne.mockRejectedValue(new Error('Database error'));

      userController.login(req, res, next);

      setTimeout(() => {
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: expect.any(Error) });
        done();
      }, 10);
    });

    test('devrait retourner 500 si bcrypt.compare échoue', (done) => {
      const mockUser = {
        _id: 'user123',
        email: 'test@example.com',
        password: 'hashedPassword'
      };

      req.body = {
        email: 'test@example.com',
        password: 'password123'
      };

      User.findOne.mockResolvedValue(mockUser);
      bcrypt.compare.mockRejectedValue(new Error('Compare error'));

      userController.login(req, res, next);

      setTimeout(() => {
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: expect.any(Error) });
        done();
      }, 10);
    });
  });
});
