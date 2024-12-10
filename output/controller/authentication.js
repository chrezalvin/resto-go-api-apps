"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate_post = authenticate_post;
exports.logout_get = logout_get;
exports.profile_get = profile_get;
const CustomerService_1 = require("../services/CustomerService");
async function authenticate_post(req, res) {
    const seat_id = parseInt(req.body.seat_id);
    const long = parseFloat(req.body.long);
    const lat = parseFloat(req.body.lat);
    if (isNaN(seat_id) || isNaN(long) || isNaN(lat))
        throw new Error("Invalid input data!");
    const customer = await CustomerService_1.CustomerService.authenticateCustomer(seat_id, long, lat);
    res.json(customer);
}
async function logout_get(req, res) {
    const customer = req.customer;
    if (!customer)
        throw new Error("Invalid customer!");
    await CustomerService_1.CustomerService.deleteCustomer(customer.customer_id);
    res.json({
        message: "success"
    });
}
async function profile_get(req, res) {
    const profile = req.customer;
    if (!profile)
        throw new Error("Invalid profile!");
    res.json(profile);
}
