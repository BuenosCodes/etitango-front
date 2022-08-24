# Fisrt install NPM environment:

1. Verfify if NPM is already installed, if not, intall ir with:
   `$ sudo apt install npm`
2. Clone the repository into your desiderd path:
   ` $ git clone git@github.com:BuenosCodes/etitango-front.git`
3. Stay into main branch, if you are not there:
   ` $ git checkout main`
4. Create an `.env` file and save it into the root and /functions folders. Contact the PM to get the file content.
5. Make the install:
   ` $ npm install`
6. Go to the folder /functions
   ` $ cd functions/`
7. Make the install
   ` $ npm install`
8. Make the build
   `$ npm run build`
9. Go back to the root folder and start
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
   `$ firebase emulators:start --export-on-exit=<PATH_TO_DIRECTORY>> --import <PATH_TO_DIRECTORY>`
   where the path is any local folder user decides to use to storage data.
