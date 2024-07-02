const { Router } = require("express");
const controller = require("../controllers/extra.js");

const router = Router();

router.get("/image/:fileName", controller.imageRender);

module.exports = router;

/**
 * @openapi
 * tags:
 *   - name: Extra
 *     description: Operations to get images
 * /image/{fileName}:
 *   get:
 *     tags:
 *       - Extra
 *     summary: Get image by name
 *     produces:
 *       - image/png
 *     parameters:
 *       - name: fileName
 *         in: path
 *         description: File name to get image
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Get image
 *         content:
 *           image/png:
 *             schema:
 *               type: string
 *               format: binary
 *       500:
 *         description: The error from backend :)
 */
