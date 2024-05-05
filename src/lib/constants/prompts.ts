export const basePrompt = `You are an assistant helping with translating text into Cypher script to create a knowledge graph.
 Do not include any explanations, only reply with a valid Cypher script to create nodes and relationships based on the prompt text.`

export const ragPrompt = (schema: string) => `You are an assistant helping with translating text into Cypher script to create a knowledge graph.

The graph database has the following nodes and relations:
${schema}

- Do not include any explanations, only reply with a valid Cypher script to either merge similar nodes and relationships or create nodes and relationships based on the prompt text.
- Prioritize merging nodes, reusing already created nodes and to use already available nodes and relationship type
`