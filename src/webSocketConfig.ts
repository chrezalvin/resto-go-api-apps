const debug = require("debug")("Server:events");

import { WebSocket, Server as WSServer } from "ws";
import {Server} from "http";
import { BranchService } from "services/BranchService";
import { CustomerViewService } from "services/CustomerViewService";

const wss = new WSServer({noServer: true});

export function createWebsocketConfig(httpServer: Server){
    httpServer.on("upgrade", (request, socket, head) => {
        debug("Upgrading connection");

        wss.handleUpgrade(request, socket, head, (ws) => {
            wss.emit("connection", ws, request);
        });
    });
}

// ws, branch_id
const chefSubscriptions = new Map<WebSocket, number>();

// ws, customer_id
const customerSubscriptions = new Map<WebSocket, string>();

interface SubscriptionInfoStructure <_T extends "chef" | "customer">{
    // specify whether the subscription is for a chef or a customer
    subscriptionType: _T;

    // if chef, this refer to branch_id, for customer this refers to customer_id
    subscription_id: _T extends "chef" ? number : string;
}

function isSubscriptionInfoStructure(value: unknown): value is SubscriptionInfoStructure<"chef" | "customer"> {
    if (typeof value !== 'object' || value === null) return false;

    if (!("subscriptionType" in value) || typeof value.subscriptionType !== 'string') return false;

    if (!("subscription_id" in value)) return false;

    if(value.subscriptionType === "chef" && typeof value.subscription_id !== 'number') return false;
    if(value.subscriptionType === "customer" && typeof value.subscription_id !== 'string') return false;

    return true;
}

wss.on("error", debug);

// Handle WebSocket connections
wss.on('connection', (ws) => {
    debug('New client connected');

    // Listen for messages from clients
    ws.on('message', async (message) => {
        try{
            const data = JSON.parse(message.toString()) as unknown;
    
            if(isSubscriptionInfoStructure(data)){
                if(data.subscriptionType === "chef"){
                    const chefData = data as SubscriptionInfoStructure<"chef">;
                    // check if branch exist
                    const branch = await BranchService.getBranch(chefData.subscription_id);

                    if(!branch)
                        return ws.send(JSON.stringify({ error: 'Branch not found' }));
                    else
                        debug(`Branch found: ${branch.branch_name} | ${branch.address}`);

                    chefSubscriptions.set(ws, chefData.subscription_id);
                    debug(`New chef subscription, branch_id: ${chefData.subscription_id}`);
        
                    ws.send(JSON.stringify({ message: 'Subscription added' }));
                }
                else if(data.subscriptionType === "customer"){
                    const customerData = data as SubscriptionInfoStructure<"customer">;

                    const customer = await CustomerViewService.getCustomerView(customerData.subscription_id);

                    if(!customer)
                        return ws.send(JSON.stringify({ error: 'Customer not found' }));

                    customerSubscriptions.set(ws, customerData.subscription_id);
                    debug(`New customer subscription, customer_id: ${customerData.subscription_id}`);
        
                    ws.send(JSON.stringify({ message: 'Subscription added' }));
                }
            }
            else {
                debug('Received:', message.toString("utf-8"));
    
                ws.send(JSON.stringify({ error: 'Invalid data' }));
            }
        }
        catch(err){
            if(err instanceof Error)
                debug(err.message);
            ws.send(JSON.stringify({ error: 'Invalid data' }));
        }
    });

    // Notify client on new data
    ws.send(JSON.stringify({ message: 'Welcome to the WebSocket server!' }));

    // Handle client disconnection
    ws.on('close', () => {
        debug('Client disconnected');

        chefSubscriptions.delete(ws);
    });
});

// Simulate database change notification
export function notifyClientsById(id: number, newData: string) {
    debug(`Notifying clients of branch ${id} with data: ${newData}`);
    chefSubscriptions.forEach((branch_id, ws) => {
        if (branch_id === id) {
            debug(`found client with branch_id ${branch_id}`);
            ws.send(JSON.stringify({ type: 'newData', data: newData }));
        }
    });
}

export function notifyChefByBranchId(branch_id: number, data: string){
    debug(`Notifying chef of branch ${branch_id} with data: ${data}`);
    chefSubscriptions
        .forEach((branch_id, ws) => {
            if (branch_id === branch_id) {
                debug(`found client with branch_id ${branch_id}`);
                ws.send(JSON.stringify(data));
            }
        });
}

export function notifyCustomerById(customer_id: string, data: string){
    debug(`Notifying customer of id ${customer_id} with data: ${data}`);
    customerSubscriptions
        .forEach((customer_id, ws) => {
            if (customer_id === customer_id) {
                debug(`found client with customer_id ${customer_id}`);
                ws.send(JSON.stringify(data));
            }
        });
}

export default wss;