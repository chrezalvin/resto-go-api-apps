"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionService = void 0;
const ServiceSupabase_1 = __importDefault(require("../libraries/ServiceSupabase"));
const models_1 = require("../models");
class TransactionService {
    static async getTransactions() {
        return await TransactionService.transactionManager.getAll();
    }
    static async getTransactionById(transaction_id) {
        return await TransactionService.transactionManager.get(transaction_id);
    }
    static async addTransaction(transaction) {
        return await TransactionService.transactionManager.add(transaction);
    }
    static async updateTransaction(transaction_id, transaction) {
        return await TransactionService.transactionManager.update(transaction_id, transaction);
    }
    static async deleteTransaction(transaction_id) {
        return await TransactionService.transactionManager.delete(transaction_id);
    }
}
exports.TransactionService = TransactionService;
TransactionService.transactionPath = "Transaction";
TransactionService.transactionManager = new ServiceSupabase_1.default("transaction_id", TransactionService.transactionPath, {
    typeGuard: models_1.isTransaction,
    useCache: false,
});
