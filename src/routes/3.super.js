const { Router } = require("express");
const upload = require("../utils/upload.js");
const superController = require("../controllers/3.super.js");
const checkToken = require("../middlewares/check-token.js");

const router = Router();

// router.use(checkToken);
router.get("/all", superController.getAllSuper);
router.get("/get/:id", superController.getSuper);
router.post("/create", superController.createSuper);
router.put("/update/:id", upload.single("imageUrl"), superController.updateSuper);
router.delete("/delete/:id", superController.deleteUser);

module.exports = router;

/**
 * @openapi
 * tags:
 *   - name: Super admin
 *     description: Operations for managing Super admin endpoints
 * /super/all:
 *   get:
 *     tags:
 *       - Super admin
 *     summary: Endpoint to get all super admins
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Super admins fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Super'
 *       401:
 *         description: No token provided or Invalid token
 *       403:
 *         description: You can't log in different device or You do not have permission to access this resource
 *       500:
 *         description: The error from backend
 * /super/create:
 *   post:
 *     tags:
 *       - Super admin
 *     summary: Create new super admin
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               imageUrl:
 *                 type: string
 *               fullName:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *                 pattern: '^\+998([378]{2}|(9[013-57-9]))\d{7}$'
 *               email:
 *                 type: string
 *               birthDate:
 *                 type: string
 *                 format: date-time
 *               gender:
 *                  type: string
 *                  enum: ["Мужской", "Женский"]
 *               address:
 *                 type: object
 *                 properties:
 *                   region:
 *                     type: string
 *                     required: true
 *                   city:
 *                     type: string
 *                     required: true
 *                   homeAddress:
 *                     type: string
 *                     required: true
 *               description:
 *                 type: string
 *             required:
 *               - fullName
 *               - phoneNumber
 *               - email
 *               - birthDate
 *               - gender
 *               - address
 *               - description
 *     responses:
 *       201:
 *         description: Super admin created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 loginName:
 *                   type: string
 *                   maxLength: 10
 *                   example: "R5n2QzjKw9"
 *                 loginPassword:
 *                   type: string
 *                   maxLength: 15
 *                   example: "X8p4Mq3Ls6tG7wZ"
 *       400:
 *         description: A super with the given phone number already exists
 *       401:
 *         description: No token provided or Invalid token
 *       403:
 *         description: You can't log in different device or You do not have permission to access this resource
 *       500:
 *         description: The error from backend
 * /super/update/{id}:
 *   put:
 *     tags:
 *       - Super admin
 *     summary: Update super by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the super to update
 *         schema:
 *           type: string
 *           format: ObjectId
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               imageUrl:
 *                 type: string
 *               fullName:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *                 pattern: '^\+998([378]{2}|(9[013-57-9]))\d{7}$'
 *               email:
 *                 type: string
 *               birthDate:
 *                 type: string
 *                 format: date-time
 *               gender:
 *                  type: string
 *                  enum: ["Мужской", "Женский"]
 *               address:
 *                 type: object
 *                 properties:
 *                   region:
 *                     type: string
 *                     required: true
 *                   city:
 *                     type: string
 *                     required: true
 *                   homeAddress:
 *                     type: string
 *                     required: true
 *               description:
 *                 type: string
 *             required:
 *               - fullName
 *               - phoneNumber
 *               - email
 *               - birthDate
 *               - gender
 *               - address
 *               - description
 *     responses:
 *       200:
 *         description: Super admin updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Super'
 *       401:
 *         description: No token provided or Invalid token
 *       403:
 *         description: You can't log in different device
 *       500:
 *         description: The error from backend
 * /super/delete/{id}:
 *   delete:
 *     tags:
 *       - Super admin
 *     summary: Delete super by id
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of super to delete
 *         required: true
 *         schema:
 *           type: string
 *           format: objectid
 *     responses:
 *       200:
 *         description: User deleted
 *       401:
 *         description: No token provided or Invalid token
 *       403:
 *         description: You can't log in different device
 *       500:
 *         description: The error from backend
 */

/**
 * @swagger
 *   components:
 *     schemas:
 *       Super:
 *         type: object
 *         properties:
 *           _id:
 *             type: string
 *             format: objectid
 *             readOnly: true
 *           loginName:
 *             type: string
 *           loginPassword:
 *             type: string
 *           imageUrl:
 *             type: string
 *           fullName:
 *             type: string
 *           phoneNumber:
 *             type: string
 *             pattern: '^\+998([378]{2}|(9[013-57-9]))\d{7}$'
 *           email:
 *             type: string
 *           birthDate:
 *             type: string
 *             format: date-time
 *           gender:
 *             type: string
 *             enum: ["Мужской", "Женский"]
 *           address:
 *             type: object
 *             properties:
 *               region:
 *                 type: string
 *                 required: true
 *               city:
 *                 type: string
 *                 required: true
 *               homeAddress:
 *                 type: string
 *                 required: true
 *           description:
 *             type: string
 *         required:
 *           - fullName
 *           - phoneNumber
 *           - email
 *           - birthDate
 *           - gender
 *           - address
 *           - description
 */