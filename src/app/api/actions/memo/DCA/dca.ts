// import type {NextApiRequest, NextApiResponse} from "next";

// type Data = {
//     name: string;
// };

// export interface ActionGetResponse {
//     icon: string;
//     title: string;
//     description: string;
//     label: string;
//     disabled?: boolean;
//     links?: {
//         actions: LinkedAction[];
//     };

//     error?: ActionError;
// }

// export interface ActionError {
//     message: string;
// }

// export interface LinkedAction {
//     href: string;
//     label: string;
//     parameters?: [ActionParameter];
// }

// export interface ActionParameter {
//     name: string;
//     label?: string;
//     required?: boolean;
// }

// export default function handler(
//     req: NextApiRequest,
//     res: NextApiResponse<ActionGetResponse>,
//   ) {
//     if (req.method === 'OPTIONS') {
//     res.status(200).json({ 
//       "title": "Orb Reading",
//       "icon": "https://shdw-drive.genesysgo.net/G1Tzt42SDqCV3x9vPY5X826foA8fEk8BR4bB5wARh75d/orb2.PNG",
//       "description": "Ask the Orb for answers to your question. Donate SOL to the Orb.",
//       "label": "Ask",
//       "links": {
//           "actions": [
//           // {
//           //     "label": "Get Reading", // button text
//           //     "href": "/api/mint"
//           // },
//           // {
//           //     "label": "Fortune Favors", // button text
//           //     "href": "/api/hello"
//           // },
//           {
//               "label": "Donate", // button text
//               "href": "/api/donate?amount={amount}", // or /api/donate?amount={amount}
//               "parameters": [
//                 // {amount} input field
//                 {
//                   "name": "amount", // input field name
//                   "label": "SOL Donation" // text input placeholder
//                 }
//               ]
//             }
//           ]
//       },
//     });
//   } else if (req.method == 'POST') {
//     const { data } = req.body
//     const decodedData = JSON.parse(Buffer.from(data, 'base64').toString('utf-8'));
  
//     console.log(decodedData);
  
//     res.status(200).json({ 
//       "title": "Orb",
//       "icon": "https://shdw-drive.genesysgo.net/G1Tzt42SDqCV3x9vPY5X826foA8fEk8BR4bB5wARh75d/orb2.PNG",
//       "description": "Ask the Orb for answers to your question. Donate SOL to the Orb.",
//       "label": "Ask",
//       "links": {
//           "actions": [
//           // {
//           //     "label": "Get Reading", // button text
//           //     "href": "/api/mint"
//           // },
//           // {
//           //     "label": "Fortune Favors", // button text
//           //     "href": "/api/hello"
//           // },
//           {
//               "label": "Donate", // button text
//               "href": "/api/donate?amount={amount}", // or /api/donate?amount={amount}
//               "parameters": [
//                 // {amount} input field
//                 {
//                   "name": "amount", // input field name
//                   "label": "SOL Donation" // text input placeholder
//                 }
//               ]
//             }
//           ]
//       },
//       error: {
//         message: decodedData.message
//       }
//     });
//   } else if (req.method == 'GET') {
//     res.status(200).json({ 
//       "icon": "https://shdw-drive.genesysgo.net/G1Tzt42SDqCV3x9vPY5X826foA8fEk8BR4bB5wARh75d/orb2.PNG",
//       "label": "Ask",
//       "title": "Orb Reading",
//       "description": "Ask the Orb for answers to your question. Donate SOL to the Orb.",
//       "links": {
//           "actions": [
//           // {
//           //     "label": "Get Reading", // button text
//           //     "href": "/api/mint"
//           // },
//           {
//               "label": "Get a Free Fortune", // button text
//               "href": "/api/getReading"
//           },
//           {
//               "label": "Donate", // button text
//               "href": "/api/donate?amount={amount}", // or /api/donate?amount={amount}
//               "parameters": [
//                 // {amount} input field
//                 {
//                   "name": "amount", // input field name
//                   "label": "SOL Donation" // text input placeholder
//                 }
//               ]
//             }
//           ]
//         },
//      });
//     }
//   }

import { ACTIONS_CORS_HEADERS, ActionGetResponse, ActionPostRequest, ActionPostResponse, MEMO_PROGRAM_ID, createPostResponse } from "@solana/actions"
import { clusterApiUrl, ComputeBudgetProgram, Connection, PublicKey, Transaction, TransactionInstruction, } from "@solana/web3.js";

export const GET = (req: Request) => {

    const payload : ActionGetResponse = {
        icon: new URL("/bob.webp", new URL(req.url).origin).toString(),
        label: "Choose the blink that you want to make right now",
        title: "WooHoo cool, you want to make a DCA blink",
        description: "Alright lets make your DCA blink in this case",
        links: {
            actions: [
              {
                href: `/api/actions/memo/dca`,
                label: 'Build a blink',
                parameters: [
                    {
                        name: "token_address_first",
                        label: "Enter the token address of the token you want to swap"
                    },
                    {
                        name: "token_address_second",
                        label: "Enter the token address that you want to swap to"
                    },
                    {
                        name: "title",
                        label: "Enter the title of your blink in this case"
                    },
                    {
                        name: "Description",
                        label: "Enter the description for your blink"
                    }

                ]
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