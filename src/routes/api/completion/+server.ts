import { json, RequestEvent } from "@sveltejs/kit";

export async function POST({ request, locals: { openAIclient, sqlite3db } }: RequestEvent): Promise<Response> {
        const query = 'INSERT INTO messages (sender, content) VALUES (?, ?)';
        const deploymentId = 'gpt-35-turbo-16k';
        const messages = await request.json();
        // Only get last message from user to prevent duplicates
        const sender = messages.at(-1).role;
        const content = messages.at(-1).content;
        const values = [sender, content];
        const result = await openAIclient.chat.completions.create({ messages, model: deploymentId });
        sqlite3db.serialize(() => {
            sqlite3db.run(query, values);
            const newValues = ['assistant', result.choices[0].message?.content];
            sqlite3db.run(query, newValues);
        })
        return json({
            content: result.choices[0].message?.content || ''
        })
}