const { Router } = require("express");
const upload = require("../utils/upload.js");
const userController = require("../controllers/5.user.js");
const checkToken = require("../middlewares/check-token.js");
const checkBlocked = require("../middlewares/check-blocked.js");

const router = Router();


router.use(checkToken);
router.use(checkBlocked);

router.get("/all/:merchant_id", userController.getAllUsers);
router.get("/get/:id", userController.getUser);
router.post("/create", userController.createUser);
router.put("/update/:id", upload.single("imageUrl"), userController.updateUser);
router.delete("/delete/:id", userController.deleteUser);

module.exports = router;

/**
 * @openapi
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * tags:
 *   - name: User
 *     description: Operations for managing User endpoints
 * /user/all:
 *   get:
 *     tags:
 *       - User
 *     summary: Endpoint to get all users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Users fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: No token provided or Invalid token
 *       403:
 *         description: You can't log in different device
 *       500:
 *         description: The error from backend
 * /user/get/{id}:
 *   get:
 *     tags:
 *       - User
 *     summary: Get user by id
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of user to retrieve
 *         required: true
 *         schema:
 *           type: string
 *           format: objectid
 *     responses:
 *       200:
 *         description: User fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: No token provided or Invalid token
 *       403:
 *         description: You can't log in different device
 *       500:
 *         description: The error from backend
 * /user/create:
 *   post:
 *     tags:
 *       - User
 *     summary: Create new user
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
 *         description: User created successfully
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
 *         description: A user with the given phone number already exists
 *       401:
 *         description: No token provided or Invalid token
 *       403:
 *         description: You can't log in different device or You do not have permission to access this resource
 *       500:
 *         description: The error from backend
 * /user/update/{id}:
 *   put:
 *     tags:
 *       - User
 *     summary: Update user by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the user to update
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
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: No token provided or Invalid token
 *       403:
 *         description: You can't log in different device
 *       500:
 *         description: The error from backend
 * /user/delete/{id}:
 *   delete:
 *     tags:
 *       - User
 *     summary: Delete user by id
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of user to delete
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
 *       User:
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