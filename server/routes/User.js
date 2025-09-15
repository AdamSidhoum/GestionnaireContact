const express = require('express');
const router = express.Router();
const userCtrl = require('../Controllers/User');

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Crée un nouvel utilisateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 */
router.post('/signup', userCtrl.signup);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Connexion d'un utilisateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Connexion réussie avec token JWT
 */
router.post('/login', userCtrl.login);

module.exports = router;
