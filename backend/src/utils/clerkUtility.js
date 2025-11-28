import {Clerk} from '@clerk/backend';

const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY

const clerk = new Clerk({
    secretKey: CLERK_SECRET_KEY
})

export default clerk;