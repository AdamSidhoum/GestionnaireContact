const express = require('express');
const contactCtrl = require('../Controllers/Contact');
const auth = require('../middleware/auth');
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Contact:
 *       type: object
 *       required:
 *         - name
 *         - num
 *       properties:
 *         name:
 *           type: string
 *         num:
 *           type: string
 */

/**
 * @swagger
 * /contact:
 *   post:
 *     summary: Crée un nouveau contact
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Contact'
 *     responses:
 *       201:
 *         description: Contact créé
 */
router.post('/', auth, contactCtrl.createContact);

/**
 * @swagger
 * /contact/{id}:
 *   put:
 *     summary: Modifie un contact (utilise l'ID dans le path)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID du contact à modifier
 *     requestBody:
 *       description: Champs à modifier du contact
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Contact'
 *     responses:
 *       200:
 *         description: Contact modifié
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Contact'
 */
router.put('/:id', auth, contactCtrl.modifyContact);

/**
 * @swagger
 * /contact/{id}:
 *   delete:
 *     summary: Supprime un contact
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID du contact
 *     responses:
 *       200:
 *         description: Contact supprimé
 */
router.delete('/:id', auth, contactCtrl.deleteOneContact);

/**
 * @swagger
 * /contact:
 *   get:
 *     summary: Récupère tous les contacts
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des contacts
 */
router.get('/', auth, contactCtrl.getAllContact);

/**
 * @swagger
 * /contact/{id}:
 *   get:
 *     summary: Récupère un contact par ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID du contact
 *     responses:
 *       200:
 *         description: Contact trouvé
 */
router.get('/:id', auth, contactCtrl.getOneContact);


module.exports = router;