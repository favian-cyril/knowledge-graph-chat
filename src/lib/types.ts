export interface Node {
    id: string
    labels?: [string]
    properties: {
        name: string
    }
    type: string
}
export interface Edge {
    end: Node
    id: string
    label: string
    start: Node
    type: string
}