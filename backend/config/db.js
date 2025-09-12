import {neon} from '@neondatabase/serverless'
import "dotenv/config"

const {PGHOST, PGUSER, PGPASSWORD, PGDATABASE} = process.env

// Database SQL connection
export const sql = neon(
    `postgresql://${PGUSER}:${PGPASSWORD}@${PGHOST}/${PGDATABASE}?sslmode=require&channel_binding=require`
)