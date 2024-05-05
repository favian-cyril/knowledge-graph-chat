import type { OpenAIClient } from "@azure/openai";
import type { Driver } from "neo4j-driver-core";
import type { Database } from "sqlite3";

declare global {
	namespace App {
		interface Locals {
			neo4jdriver: Driver
			openAIclient: OpenAIClient
			sqlite3db: Database
		}
		// interface Error {}
		// interface Platform {}
	}
}

export {};