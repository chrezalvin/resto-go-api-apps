"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeatService = void 0;
const ServiceSupabase_1 = __importDefault(require("../libraries/ServiceSupabase"));
const models_1 = require("../models");
class SeatService {
    // static async isSeatAvailable(seat_id: number, branch_id: number): Promise<boolean>{
    //     const seats = await SeatService.seatManager.queryBuilder((client) => {
    //         return client.select("*")
    //             .eq("seat_id", seat_id)
    //             .eq("branch_id", branch_id)
    //             .limit(1);
    //     });
    //     if(seats.length === 0)
    //         throw new Error("Seat not found");
    //     const seat = seats[0];
    //     return seat.available;
    // }
    static async getSeat(seat_id, branch_id) {
        const seat = await SeatService.seatManager.queryBuilder((client) => {
            return client.select("*")
                .eq("seat_id", seat_id)
                .eq("branch_id", branch_id)
                .limit(1)
                .single();
        });
        if (Array.isArray(seat))
            throw new Error("Seat not found");
        return seat;
    }
    static async getSeatById(seat_id) {
        const seat = await SeatService.seatManager.get(seat_id);
        if (!seat)
            throw new Error("Seat not found");
        return seat;
    }
    // static async setSeatAvailability(seat_id: number, available: boolean): Promise<Seat>{
    //     const seat = await SeatService.seatManager.update(seat_id, { available });
    //     if(!seat)
    //         throw new Error("Seat not found");
    //     return seat;
    // }
    static async addSeat(seat) {
        const res = await SeatService.seatManager.add(seat);
        if (!res)
            throw new Error("Failed to add seat");
        return res;
    }
    static async updateSeat(seat_id, seat) {
        const seatTarg = await SeatService.seatManager.get(seat_id);
        if (!seatTarg)
            throw new Error("Seat not found");
        const seatUpdated = await SeatService.seatManager.update(seat_id, seat);
        if (!seatUpdated)
            throw new Error("Failed to update seat");
        return seatUpdated;
    }
    static async deleteSeat(seat_id) {
        const seatTarg = await SeatService.seatManager.get(seat_id);
        if (!seatTarg)
            throw new Error("Seat not found");
        await SeatService.seatManager.delete(seat_id);
    }
}
exports.SeatService = SeatService;
SeatService.seatPath = "Seats";
SeatService.seatManager = new ServiceSupabase_1.default("seat_id", SeatService.seatPath, {
    typeGuard: models_1.isSeat,
    useCache: false,
});
