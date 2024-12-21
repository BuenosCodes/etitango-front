# First install NPM environment:

1. Verify if NPM is already installed, if not, install it with:
   `$ sudo apt install npm`
2. Clone the repository into your desired path:
   ` $ git clone git@github.com:BuenosCodes/etitango-front.git`
3. Stay into main branch, if you are not there:
   ` $ git checkout main`
4. Create an `.env` file and save it into the root and /functions folders (see the `.env_example` files for reference). Get the credentials from rom https://console.firebase.google.com/u/0/project/etitango-5118a/settings/general/web:NGU3MjE2NDctODNjYy00YTFjLTliZWEtZDAxODhiNTExZDBk
5. Create `extensions/firestore-send-email.env` file (see the `firestore-send-email.env_example` file for reference). Get the credentials from https://console.firebase.google.com/u/0/project/etitango-5118a/extensions/instances/firestore-send-email?tab=config.
6. Make the install:
   ` $ npm install`
7. Go to the folder /functions
   ` $ cd functions/`
8. Make the install
   ` $ npm install`
9. Make the build
   `$ npm run build`
10. Go back to the root folder and start
    `$ npm start`

# Firebase environment set up

1. Install [Firebase CLI](https://firebase.google.com/docs/cli#setup_update_cli)
2. Log in into [Firebase CLI](https://firebase.google.com/docs/cli#sign-in-test-cli). Contact the PM in order to be added to the ETI project.
3. Start firebase:
   `$ firebase emulators:start`
   It should start Authentication, Functions, Firestore y Hosting. If some error occurs, run
   `$ firebase init`
4. Start front:
   `$ npm run start`
5. In order to keep the local data, run:
   `$ firebase emulators:start --export-on-exit=<PATH_TO_DIRECTORY> --import <PATH_TO_DIRECTORY>`
   where the path is any local folder user decides to use to storage data.
6. Create file extensions/firestore-send-email.env (from repository root, a level up from functions) with the data provided by the team

# ENV files
are stored as codebase secrets in the github repository.

# Auth and users
On first auth, you'll be prompted to create a dummy user. this will also create it in the db. you then need to go to http://localhost:4000/ and add a map key called "roles" having 2 subkeys: "admin": true, "superadmin": true

`doc: user/<userid> - prop: roles: {superadmin: true}`
