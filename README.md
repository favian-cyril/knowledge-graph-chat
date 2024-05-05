## Prerequisite

Both Docker and docker-compose should be installed beforehand

links:
 - [Docker](https://docs.docker.com/engine/install/)
 - [docker-compose](https://docs.docker.com/compose/install/)

## Running the project

```bash
# start the project
docker-compose up
```

The webapp is running on [http://localhost:5173/](http://localhost:5173/)

Browser for Neo4j is available on [http://localhost:7474/browser](http://localhost:7474/)

## Project structure

- src
    - lib (this contains types, constants and utils)
        - constants
            - cypher.ts (Cypher query constants)
            - prompts.ts (System prompt template)
        - utils
    - routes (all the routes. SvelteKit uses a file based routing, any folders and files here represent actual routes)
        - api (api routes which contain server side handlers)
            - completion
            - knowledge-graph
        - +page.svelte (since we only use one page, the file is on root route )
        - +page.server.ts (server side loader for the page)
- statis (static files)

