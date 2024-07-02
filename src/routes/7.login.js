const { Router } = require("express");
const loginController = require("../controllers/7.login.js");

const router = Router();

router.post("/", loginController.userLogin);


module.exports = router;

/**
 * @openapi
 * /login:
 *   post:
 *     tags:
 *       - User
 *     summary: Login a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               loginName:
 *                 type: string
 *                 maxLength: 10
 *                 example: "R5n2QzjKw9"
 *               loginPassword:
 *                 type: string
 *                 maxLength: 15
 *                 example: "X8p4Mq3Ls6tG7wZ"
 *             required:
 *               - loginName
 *               - loginPassword
 *     responses:
 *       '200':
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   description: The user object
 *                 message:
 *                   type: string
 *                   description: A success message
 *                   example: Here is your token bro
 *                 token:
 *                   type: string
 *                   description: The JSON Web Token (JWT) for the user session
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MTRmMWQ2Y2I5ZTE3YTMyZjEyYzM0NzciLCJhZ2VudCI6IjEiLCJyb2xlIjoidXNlciIsImlhdCI6MTYzNDYyMzYyMywiZXhwIjoxNjM0NjI3MjIzfQ.Tv6l-GhqfU_5mEjfyxB9_ZPZrAmCxW60ZsiRg1jK7zI
 *       '400':
 *         description: Bad request
 *       '401':
 *         description: Invalid login credentials!
 *       '500':
 *         description: The error from backend
 */