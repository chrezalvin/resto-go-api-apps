import { websocketPort } from "@config";
import { WebSocket, WebSocketServer } from "ws";

const wss = new WebSocketServer({port: websocketPort});
const subscriptions = new Map<WebSocket, number>();

interface SubscriptionInfoStructure {
    branch_id: number;
    subscription: string;
}

interface NotifySubscriptor{
    branch_id: number;
    data: string;
}

function isNotifySubscriptor(value: unknown): value is NotifySubscriptor{
    if(typeof value !== 'object' || value === null) return false;

    if(!("branch_id" in value) || typeof value.branch_id !== 'number') return false;

    if(!("data" in value) || typeof value.data !== 'string') return false;

    return true;
}

function isSubscriptionInfoStructure(value: unknown): value is SubscriptionInfoStructure {
    if (typeof value !== "object" || value === null) return false;

    if (!("branch_id" in value) || typeof value.branch_id !== "number") return false;

    if (!("subscription" in value) || typeof value.subscription !== "string") return false;

    return true;
}

wss.once("connection", (ws) => {
    console.log(`WebSocket server running on port ${websocketPort}`);
})

// Handle WebSocket connections
wss.on('connection', (ws) => {
    console.log('New client connected');

    // Listen for messages from clients
    ws.on('message', (message) => {
        try{
            const data = JSON.parse(message.toString());
    
            if(isSubscriptionInfoStructure(data)){
                subscriptions.set(ws, data.branch_id);
                console.log(`New subscription: ${data.branch_id} -> ${data.subscription}`);
    
                ws.send(JSON.stringify({ message: 'Subscription added' }));
            }
            else if(isNotifySubscriptor(data)){
                notifyClientsById(data.branch_id, data.data);
            }
            else {
                console.log('Received:', message.toString("utf-8"));
    
                ws.send(JSON.stringify({ message: 'Invalid data' }));
            }
        }
        catch(err){
            console.error(err);
            ws.send(JSON.stringify({ message: 'Invalid data' }));
        }
    });

    // Notify client on new data
    ws.send(JSON.stringify({ message: 'Welcome to the WebSocket server!' }));

    // Handle client disconnection
    ws.on('close', () => {
        console.log('Client disconnected');

        subscriptions.delete(ws);
    });
});

// Simulate database change notification
export function notifyClientsById(id: number, newData: string) {
    console.log(`Notifying clients of branch ${id} with data: ${newData}`);
    subscriptions.forEach((branch_id, ws) => {
        if (branch_id === id) {
            console.log(`found client with branch_id ${branch_id}`);
            ws.send(JSON.stringify({ type: 'newData', data: newData }));
        }
    });
}

export default wss;