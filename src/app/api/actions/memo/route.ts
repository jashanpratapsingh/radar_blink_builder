import { ACTIONS_CORS_HEADERS, ActionGetResponse, ActionPostRequest, ActionPostResponse, MEMO_PROGRAM_ID, createPostResponse } from "@solana/actions"
import { clusterApiUrl, ComputeBudgetProgram, Connection, PublicKey, Transaction, TransactionInstruction, } from "@solana/web3.js";

export const GET = (req: Request) => {

    const payload : ActionGetResponse = {
        icon: new URL("/dash_lottery.png", new URL(req.url).origin).toString(),
        label: "Enter your 3 lottery numbers",
        title: "DASH Lottery",
        description: "Every Friday buy a ticket to win the Jackpot Select for 3 numbers for the Lottery. Enter the numbers between 0 and 20. For example, you could select: 2,14,7",
        links: {
            actions: [
              {
                href: `/api/actions/memo/numbers`,
                label: 'Buy Lottery',
                parameters: [
                  {
                    name: "first_number",
                    label: 'Enter the first number',
                  },
                  {
                    name: "second_numbers",
                    label: 'Enter the second number',
                  },
                  {
                    name: "thrid_number",
                    label: "Enter the thrid number"
                  }
                ],
              },
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