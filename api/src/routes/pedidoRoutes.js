const express = require("express");
const router = express.Router();
const pedidoController = require("../controllers/pedido");
const { authMiddleware } = require("../middleware/auth");

router.post("/", authMiddleware, pedidoController.create);
router.get("/", authMiddleware, pedidoController.read);
router.get("/:id", authMiddleware, pedidoController.readOne);
router.put("/:id", authMiddleware, pedidoController.update);
router.delete("/:id", authMiddleware, pedidoController.remove);

module.exports = router;
