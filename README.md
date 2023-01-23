# crud-api

## Installing
1. clone the repo: `git clone https://github.com/pavelgorbach/crud-api.git`
2. go to the project forlder: `cd crud-api`
3. checkout to `dev` branch: `git checkout dev`
3. install dependencies: `npm install`

## Running
Create `.env` file at the project root. Add a content: `PORT=4000`.

There are three options to run:
1. `npm run start:dev`
2. `npm run start:prod`
3. `npm run start:multi`
## Testing
You can test with Postman or use auto tests
### Manual testing
1. Download and open Postman
2. Import postman collection from the project root `rss-crud-api.postman_collection.json`
### Auto testing
1. `npm run test`
