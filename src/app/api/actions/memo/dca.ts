import type {NextApiRequest, NextApiResponse} from "next";

type Data = {
    name: string;
};

export interface ActionGetResponse {
    icon: string;
    title: string;
    description: string;
    label: string;
    disabled?: boolean;
    links?: {
        actions: LinkedAction[];
    };

    error?: ActionError;
}

export interface ActionError {
    message: string;
}

export interface LinkedAction {
    href: string;
    label: string;
    parameters?: [ActionParameter];
}

export interface ActionParameter {
    name: string;
    label?: string;
    required?: boolean;
}

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<ActionGetResponse>,
  ) {
    if (req.method === 'OPTIONS') {
    res.status(200).json({ 
      "title": "Orb Reading",
      "icon": "https://shdw-drive.genesysgo.net/G1Tzt42SDqCV3x9vPY5X826foA8fEk8BR4bB5wARh75d/orb2.PNG",
      "description": "Ask the Orb for answers to your question. Donate SOL to the Orb.",
      "label": "Ask",
      "links": {
          "actions": [
          // {
          //     "label": "Get Reading", // button text
          //     "href": "/api/mint"
          // },
          // {
          //     "label": "Fortune Favors", // button text
          //     "href": "/api/hello"
          // },
          {
              "label": "Donate", // button text
              "href": "/api/donate?amount={amount}", // or /api/donate?amount={amount}
              "parameters": [
                // {amount} input field
                {
                  "name": "amount", // input field name
                  "label": "SOL Donation" // text input placeholder
                }
              ]
            }
          ]
      },
    });
  } else if (req.method == 'POST') {
    const { data } = req.body
    const decodedData = JSON.parse(Buffer.from(data, 'base64').toString('utf-8'));
  
    console.log(decodedData);
  
    res.status(200).json({ 
      "title": "Orb",
      "icon": "https://shdw-drive.genesysgo.net/G1Tzt42SDqCV3x9vPY5X826foA8fEk8BR4bB5wARh75d/orb2.PNG",
      "description": "Ask the Orb for answers to your question. Donate SOL to the Orb.",
      "label": "Ask",
      "links": {
          "actions": [
          // {
          //     "label": "Get Reading", // button text
          //     "href": "/api/mint"
          // },
          // {
          //     "label": "Fortune Favors", // button text
          //     "href": "/api/hello"
          // },
          {
              "label": "Donate", // button text
              "href": "/api/donate?amount={amount}", // or /api/donate?amount={amount}
              "parameters": [
                // {amount} input field
                {
                  "name": "amount", // input field name
                  "label": "SOL Donation" // text input placeholder
                }
              ]
            }
          ]
      },
      error: {
        message: decodedData.message
      }
    });
  } else if (req.method == 'GET') {
    res.status(200).json({ 
      "icon": "https://shdw-drive.genesysgo.net/G1Tzt42SDqCV3x9vPY5X826foA8fEk8BR4bB5wARh75d/orb2.PNG",
      "label": "Ask",
      "title": "Orb Reading",
      "description": "Ask the Orb for answers to your question. Donate SOL to the Orb.",
      "links": {
          "actions": [
          // {
          //     "label": "Get Reading", // button text
          //     "href": "/api/mint"
          // },
          {
              "label": "Get a Free Fortune", // button text
              "href": "/api/getReading"
          },
          {
              "label": "Donate", // button text
              "href": "/api/donate?amount={amount}", // or /api/donate?amount={amount}
              "parameters": [
                // {amount} input field
                {
                  "name": "amount", // input field name
                  "label": "SOL Donation" // text input placeholder
                }
              ]
            }
          ]
        },
     });
    }
  }