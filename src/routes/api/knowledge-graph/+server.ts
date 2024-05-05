import { json, RequestEvent } from "@sveltejs/kit";
import { basePrompt, ragPrompt } from "$lib/constants/prompts";
import { getSchema, graphHasNodes, returnAllNodes } from "$lib/constants/cypher";
import { generateRelationString } from "$lib/utils";


export async function POST({ request, locals: { neo4jdriver, openAIclient } }: RequestEvent): Promise<Response> {
        const maxRetries = 5;
        let retries = 0;
        const session = neo4jdriver.session()
        const deploymentId = 'gpt-35-turbo-16k';
        const messages = await request.json();
        // Check if nodes are created, if has nodes then use base prompt with context
        const nodes = await session.run(graphHasNodes);
        const hasNodes = nodes.records[0].get('graphHasNodes')
        let systemPrompt = basePrompt;
        if (hasNodes) {
            const result = await session.run(getSchema);
            const textResult = result.records.map(generateRelationString).join('\n')
            systemPrompt = ragPrompt(textResult);
        }
        
        const messagesWithBasePrompt = [
            {
                role: "system",
                content: systemPrompt
            },
            ...messages
        ]
        // Query generated from chatgpt might be error prone, so retry is needed
        while (retries < maxRetries) {
            try {
                const result = await openAIclient.chat.completions.create({ messages: messagesWithBasePrompt, temperature: 0.1, model: deploymentId });
                if (result.choices[0].message?.content) {
                    const createQuery = result.choices[0].message.content;
                    await session.run(createQuery)
                    const res = await session.run(returnAllNodes);
                    return json({
                        data: res.records[0].get('data'),
                        error: null
                    })
                }
            } catch {
                retries++;
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        }
        return json({
            data: null,
            error: 'Something went wrong'
        })
}