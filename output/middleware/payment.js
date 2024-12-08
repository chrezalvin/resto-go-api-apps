"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Midtrans_1 = require("../services/Midtrans");
// Array RouterInterface untuk endpoint terkait pembayaran
const paymentRoutes = [
    {
        method: "post",
        path: "/api/payments/create",
        accessType: "public",
        handler: async (req, res) => {
            const { orderId, grossAmount, customerDetails } = req.body;
            try {
                // Log data input untuk memastikan data diterima dengan benar
                console.log("Received data:", req.body);
                // Buat transaksi Midtrans
                const transaction = await (0, Midtrans_1.createTransaction)(orderId, grossAmount, customerDetails);
                // Jika berhasil, kirimkan respons transaksi
                res.status(200).json(transaction);
            }
            catch (error) {
                // Log error untuk mendalami penyebab kesalahan
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
    //       // Handle webhook dari Midtrans
    //       const notification = req.body;
    //       console.log("Received webhook notification:", notification);
    //       // Validasi status pembayaran
    //       const response = await handleWebhook(notification);
    //       // Kirim respons sukses setelah memproses webhook
    //       res.status(200).json(response);
    //     } catch (error) {
    //       console.error("Error handling webhook:", error);
    //       res.status(500).json({ message: "Failed to process webhook" });
    //     }
    //   },
    // },
];
exports.default = paymentRoutes;
