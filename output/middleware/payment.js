"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Midtrans_1 = require("../services/Midtrans");
const paymentRoutes = [
    {
        method: "post",
        path: "/api/payments/create",
        accessType: "public",
        handler: async (req, res) => {
            const { orderId, grossAmount, customerDetails } = req.body;
            try {
                console.log("Received data:", req.body);
                const transaction = await (0, Midtrans_1.createTransaction)(orderId, grossAmount, customerDetails);
                res.status(200).json(transaction);
            }
            catch (error) {
                console.error("Error creating transaction:", error);
                const errorMessage = error instanceof Error ? error.message : "Unknown error";
                res.status(500).json({ error: "Failed to create transaction", message: errorMessage });
            }
        },
    },
    // {
    //   method: "post",
    //   path: "/api/payments/webhook",
    //   accessType: "public",
    //   handler: async (req, res) => {
    //     try {
    //       const notification = req.body;
    //       console.log("Received webhook notification:", notification);
    //       const response = await handleWebhook(notification);
    //       res.status(200).json(response);
    //     } catch (error) {
    //       console.error("Error handling webhook:", error);
    //       res.status(500).json({ message: "Failed to process webhook" });
    //     }
    //   },
    // },
];
exports.default = paymentRoutes;
