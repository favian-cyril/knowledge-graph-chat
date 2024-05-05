import { PRIVATE_AZURE_OPENAI_ENDPOINT, PRIVATE_AZURE_OPENAI_KEY, PRIVATE_NEO4J_PASSWORD, PRIVATE_NEO4J_USERNAME, PRIVATE_NEO4J_ENDPOINT } from "$env/static/private";
// import { AzureKeyCredential, OpenAIClient } from "@azure/openai";
import OpenAI from 'openai';
import { Handle } from "@sveltejs/kit";
import neo4j from "neo4j-driver";
import sqlite3 from "sqlite3";

const driver = neo4j.driver(PRIVATE_NEO4J_ENDPOINT, neo4j.auth.basic(PRIVATE_NEO4J_USERNAME, PRIVATE_NEO4J_PASSWORD));
const db = new sqlite3.Database(process.env.DATABASE_URL || 'chat.db');

db.run(`
  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sender TEXT,
    content TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

export const handle: Handle = async ({ event, resolve }) => {
    event.locals.neo4jdriver = driver;
    event.locals.openAIclient = new OpenAI({ apiKey: PRIVATE_AZURE_OPENAI_KEY });
    event.locals.sqlite3db = db;
    return resolve(event)
}

process.on('exit', () => {
    console.log('Closing connections');
    db.close();
    driver.close();
    process.exit();
});
process.on('SIGINT', () => {
    console.log('Closing connections');
    db.close();
    driver.close();
    process.exit();
});