import { ACTIONS_CORS_HEADERS, ActionGetResponse, ActionPostRequest, ActionPostResponse, MEMO_PROGRAM_ID, createPostResponse } from "@solana/actions"
import { clusterApiUrl, ComputeBudgetProgram, Connection, PublicKey, Transaction, TransactionInstruction, } from "@solana/web3.js";

export const GET = (req: Request) => {

    const payload : ActionGetResponse = {
        icon: new URL("/bob.webp", new URL(req.url).origin).toString(),
        label: "Choose the blink that you want to make right now",
        title: "Hi, I am Bob the blink maker",
        description: "There are currently threee options for the blinks that you want to make. Choose from the options that are available right now.",
        links: {
            actions: [
              {
                href: `/api/actions/memo/dca`,
                label: 'DCA'
              },
              {
                href: "/api/actions/memo/swap",
                label: 'Swap'
              },
              {
                href: "/api/actions/memo/fundraising",
                label: 'Fundrasing'
              }
            ]
    }
}

    return Response.json(payload, {headers: ACTIONS_CORS_HEADERS});  
}

export const OPTIONS = GET;

export const POST = async (req: Request) => {
    try {
        const body: ActionPostRequest = await req.json();

        let account: PublicKey;
        try{
            account = new PublicKey(body.account);
        } catch(err) {
            return new Response("Invalid account provided", {
                status: 400,
                headers: ACTIONS_CORS_HEADERS,
            })
        }

        const transaction = new Transaction();

        transaction.add(

            ComputeBudgetProgram.setComputeUnitPrice({
                microLamports: 1000,
            }),
            new TransactionInstruction({
                programId: new PublicKey(MEMO_PROGRAM_ID),
                data: Buffer.from("this is a simple memo message", "utf8"),
                keys: []
            })
        );

        transaction.feePayer = account;

        const connection = new Connection(clusterApiUrl("devnet"));
        transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

        const payload: ActionPostResponse = await createPostResponse({
            fields: {
                transaction,
            },
        })

        return Response.json(payload, { headers: ACTIONS_CORS_HEADERS});
    } catch (err) {
        return Response.json("An unknown error has occured", {status: 400})
    }
}