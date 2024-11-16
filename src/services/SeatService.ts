import { isWithinRadius } from "libraries/func";
import ServiceSupabase from "libraries/ServiceSupabase";
import { isSeat, Seat } from "models";

export class SeatService{
    protected static readonly seatPath: string = "Seats";

    static seatManager = new ServiceSupabase<Seat, "seat_id">("seat_id", SeatService.seatPath, {
        typeGuard: isSeat,
        useCache: false,
    });

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

    static async getSeat(seat_id: number, branch_id: number): Promise<Seat>{
        const seat = await SeatService.seatManager.queryBuilder((client) => {
            return client.select("*")
                .eq("seat_id", seat_id)
                .eq("branch_id", branch_id)
                .limit(1)
                .single();
        });

        if(Array.isArray(seat))
            throw new Error("Seat not found");

        return seat;
    }

    static async getSeatById(seat_id: number): Promise<Seat>{
        const seat = await SeatService.seatManager.get(seat_id);

        if(!seat)
            throw new Error("Seat not found");

        return seat;
    }

    // static async setSeatAvailability(seat_id: number, available: boolean): Promise<Seat>{
    //     const seat = await SeatService.seatManager.update(seat_id, { available });

    //     if(!seat)
    //         throw new Error("Seat not found");

    //     return seat;
    // }

    static async addSeat(seat: Omit<Seat, "seat_id">): Promise<Seat>{
        const res = await SeatService.seatManager.add(seat);

        if(!res)
            throw new Error("Failed to add seat");

        return res;
    }

    static async updateSeat(seat_id: number, seat: Partial<Omit<Seat, "seat_id">>): Promise<Seat>{
        const seatTarg = await SeatService.seatManager.get(seat_id);

        if(!seatTarg)
            throw new Error("Seat not found");

        const seatUpdated = await SeatService.seatManager.update(seat_id, seat);

        if(!seatUpdated)
            throw new Error("Failed to update seat");

        return seatUpdated;
    }

    static async deleteSeat(seat_id: number){
        const seatTarg = await SeatService.seatManager.get(seat_id);

        if(!seatTarg)
            throw new Error("Seat not found");

        await SeatService.seatManager.delete(seat_id);
    }
}