import { isWithinRadius } from "libraries/func";
import ServiceSupabase from "libraries/ServiceSupabase";
import { isSeat, Seat } from "models";

export class SeatService{
    protected static readonly seatPath: string = "Seats";

    static seatManager = new ServiceSupabase<Seat, "seat_id">("seat_id", SeatService.seatPath, {
        typeGuard: isSeat,
        useCache: false,
    });

    static async isSeatAvailable(seat_id: number, branch_id: number): Promise<boolean>{
        const seats = await SeatService.seatManager.query((client) => {
            return client.select("*")
                .eq("seat_id", seat_id)
                .eq("branch_id", branch_id)
                .limit(1);
        });

        if(seats.length === 0)
            throw new Error("Seat not found");

        const seat = seats[0];

        return seat.available;
    }

    static async getSeat(seat_id: number, branch_id: number): Promise<Seat>{
        const seats = await SeatService.seatManager.query((client) => {
            return client.select("*")
                .eq("seat_id", seat_id)
                .eq("branch_id", branch_id)
                .limit(1);
        });

        if(seats.length === 0)
            throw new Error("Seat not found");

        return seats[0];
    }

    static async setSeatAvailability(seat_id: number, available: boolean): Promise<Seat>{
        const seat = await SeatService.seatManager.update(seat_id, { available });

        if(!seat)
            throw new Error("Seat not found");

        return seat;
    }
}