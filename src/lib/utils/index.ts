import type { Record } from "neo4j-driver";

export function generateRelationString (record: Record): string {
    const path = record.get('p').segments[0];
                
    const startNode = path.start;
    const endNode = path.end;
    const relationship = path.relationship;

    const startNodeString = `(${startNode.labels[0]} ${JSON.stringify(startNode.properties)})`;
    const endNodeString = `(${endNode.labels[0]} ${JSON.stringify(endNode.properties)})`;
    const relationshipString = `-[${relationship.type} ${JSON.stringify(relationship.properties)}]->`;

    return `${startNodeString}${relationshipString}${endNodeString}`;
}