import { returnAllNodes } from "$lib/constants/cypher";
import type { PageServerLoad } from "./$types";

type ChatData = {
    id: number;
    sender: 'assistant' | 'user';
    content: string;
    timestamp: string;
}
export const load: PageServerLoad = async ({ locals: { neo4jdriver, sqlite3db }}) => {
    const session = neo4jdriver.session()
    const query = 'SELECT * FROM messages ORDER BY timestamp ASC';
    const chatData: ChatData[] = await new Promise((resolve) => {
        sqlite3db.all(query, (err, res) => {
            if (!err) resolve(res)
        });
    })
    const data = await session.run(returnAllNodes)
    return {
        result: data.records[0].get('data'),
        chatData
    }
}