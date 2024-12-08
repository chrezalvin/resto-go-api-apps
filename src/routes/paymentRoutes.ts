import { Router } from 'express';
import { createTransaction } from '../controller/paymentController';

const router = Router();

router.post('/api/payments/create', createTransaction);
export default router;
