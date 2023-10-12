# AIDM: Play DND with chat GPT!

![image](./public/aidmimage.png)

## Features
Persistant Adventure: Through the journaling and character statblock system, you can have adventures with baked-in continuity!

Do whatever you want: Use the power of modern llms to have the dnd story of your dreams!

Customize for your usecase: Easily editable code for changing prompt chains! (api/chat/route.ts -- edit the rules variable)

## Tech Stack
AIDM is built with the following:

Frontend: The user interface of AIDM is handled with NextJS 13

Backend: The backend is powered by MongoDB and NextJS 13

## Getting Started
**First install nodeJS and Python**
To get AIDM running locally on your machine, please follow the steps below:

1. Clone the repository to your local machine.

2. Install the dependencies by running `npm i` in your terminal.

3. Initialize your Mongodb Atlas cluster -- https://www.mongodb.com/atlas/database

4. Get an api key from Open AI -- https://platform.openai.com/overview (warning: not free)

5. Get an api key from Leonardo AI -- https://app.leonardo.ai/settings (warning: not free - you may want to not use this functionality or replace it with your own preferred model)

6. Set up an .env file with the necessary environment variables (outlined in exampleenv.txt).

7. To start the development server, `npm run dev` in your terminal.

8. Visit localhost:3000 in your browser to view the application.

## Contributions
I welcome all kinds of contributions! Please feel free to contribute by opening issues, suggesting features, updating documentation, or even fixing bugs.

## License
AIDM is open-source and is licensed under the MIT License.

For any further questions, you can reach out to me directly. Happy coding!

## Other
If you are interested in starting a new adventure, delete your player document in MongoDB

Due to the inherent costs of running an app like this, I am not at this time interested in deploying this app.
