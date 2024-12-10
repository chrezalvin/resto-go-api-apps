import { Request, Response } from 'express';

export const handleMidtransWebhook = (req: Request, res: Response) => {
    const notification = req.body;

    const { order_id, transaction_status, payment_type } = notification;

    switch (transaction_status) {
        case 'settlement':
            console.log(`Order ${order_id} is successful (settlement).`);
            break;
        case 'cancel':
            console.log(`Order ${order_id} was cancelled.`);
            break;
        case 'pending':
            console.log(`Order ${order_id} is pending.`);
            break;
        default:
            console.log(`Unhandled transaction status: ${transaction_status}`);
    }

    res.status(200).send('OK');
};
