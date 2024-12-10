"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Midtrans_1 = require("../services/Midtrans");
const router = express_1.default.Router();
router.post('/create', async (req, res) => {
    const { orderId, grossAmount, customerDetails } = req.body;
    try {
        const result = await (0, Midtrans_1.createTransaction)(orderId, grossAmount, customerDetails);
        res.status(200).json(result);
    }
    catch (error) {
        console.error('Error creating transaction:', error.message);
        res.status(500).json({
            error: 'Failed to create transaction',
            message: error.message,
        });
    }
});
exports.default = router;
