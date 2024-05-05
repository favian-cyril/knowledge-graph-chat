export const returnAllNodes = `CALL apoc.export.json.query('MATCH (n)
OPTIONAL MATCH (n)-[r]->()
RETURN COLLECT(DISTINCT n) AS nodes, COLLECT(DISTINCT r) AS edges', '', {stream: true}) YIELD data
RETURN data`

export const graphHasNodes = `MATCH (n)
RETURN COUNT(n) > 0 AS graphHasNodes;`

export const getSchema = `MATCH p=()-[r]->()
RETURN p;`