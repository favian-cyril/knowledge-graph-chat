<script lang="ts">
	import type { Edge, Node } from '$lib/types';
	import { Avatar, ProgressRadial } from '@skeletonlabs/skeleton';
	import Graph, { MultiGraph } from "graphology";
	import {assignLayout} from 'graphology-layout/utils';
	import forceLayout from 'graphology-layout-force';
	import Sigma from "sigma";
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	interface Chat {
		role: 'user' | 'assistant'
		content: string
	}
	export let data: PageData;
	let sigmaRef: HTMLElement;
	let elemChat: HTMLElement;
	let sigmaObj: Sigma;
	const graph = new MultiGraph();
	const dataGraph = data.result.split('\n').map((d: string) => JSON.parse(d))
	
	let chat: Chat[] = []
	let currentMessage = '';
	let completionLoading = false;
	let graphLoading = false;

	function updateGraph (graph: Graph, data: { nodes: Node[], edges: Edge[] }) {
		data.nodes.forEach((node: Node) => {
			graph.addNode(node.id, {
				x: Math.random(),
				y: Math.random(),
				size: 12,
				label: node.properties?.name || node?.labels?.[0] || '',
				...node.properties
			})
		})
		data.edges.forEach((edge: Edge) => {
			graph.addEdge(edge.start.id, edge.end.id, {
				label: edge.label,
			})
		});
		const points = forceLayout(graph, { maxIterations: 500, settings: { attraction: 0.5, repulsion: 0.5 }});
		assignLayout(graph, points);
	}
	onMount(() => {
		scrollChatBottom()
		updateGraph(graph, dataGraph[0]);
		sigmaObj = new Sigma(graph, sigmaRef, {
			renderEdgeLabels: true,
			defaultNodeColor: '#ec5148',
			labelColor: { color: '#ffffff' }, 
			defaultEdgeColor: '#ffffff',
		})
		chat = data.chatData.map((chatData) => ({ role: chatData.sender, content: chatData.content }))
	})
	async function chatCompletion () {
		chat = [...chat, { role: 'user', content: currentMessage }];
		const body = JSON.stringify(chat);
		completionLoading = true;
		currentMessage = '';
		const response = await fetch('/api/completion', { method: 'POST', body });
		const result = await response.json();
		chat = [...chat, { role: 'assistant', content: result.content }];
		completionLoading = false;
		scrollChatBottom();
	}
	async function submitGraph(message: Chat) {
		graphLoading = true;
		const body = JSON.stringify([message])
		const response = await fetch('/api/knowledge-graph', { method: 'POST', body });
		const result = await response.json();
		const newData = result.data
			.split('\n')
			.map((d: string) => JSON.parse(d))
		graph.clear()
		updateGraph(graph, newData[0]);
		sigmaObj.refresh()
		graphLoading = false;
	}
	function scrollChatBottom(behavior: ScrollBehavior = 'auto'): void {
		if (elemChat) {
			if (elemChat.scrollHeight !== elemChat.clientHeight) {
				elemChat.scrollTo({ top: elemChat.scrollHeight, behavior });
			} else {
				setTimeout(() => scrollChatBottom(behavior), 100);
			}
		}
	}
</script>

<div class="w-full h-screen grid grid-cols-[1fr_auto]">
	<div class="h-screen grid grid-rows-[1fr_auto] gap-1">
		<div bind:this={elemChat} class="flex gap-2 flex-col bg-surface-500/30 p-4 h-full overflow-y-scroll">
			{#each chat as bubble}
				<div class="grid grid-cols-[auto_1fr] gap-2">
					<Avatar width="w-9" />
					<div class="card p-2 variant-soft rounded-tl-none space-y-2">
						<header class="flex justify-between items-center">
							<p class="font-bold">{bubble.role === 'user' ? 'You' : 'Assistant'}</p>
						</header>
						<pre class="whitespace-break-spaces">{bubble.content}</pre>
						{#if bubble.role === 'assistant' && !graphLoading}
							<button class="btn variant-ghost p-2" on:click={() => submitGraph(bubble)}>
								Insert to graph
							</button>
						{:else if graphLoading}
							<button disabled class="btn variant-ghost p-2"><ProgressRadial class="w-4" /></button>
						{/if}
					</div>
				</div>	
			{/each}
			{#if completionLoading}
				<div class="flex content-center justify-center w-full">
					<ProgressRadial class="w-5" />
				</div>
			{/if}
		</div>
		<div class="bg-surface-500/30 p-4">
			<div class="input-group input-group-divider grid-cols-[1fr_auto] rounded-container-token">
				<textarea
					bind:value={currentMessage}
					class="bg-transparent border-0 ring-0 p-2"
					name="prompt"
					id="prompt"
					placeholder="Write a message..."
					rows="1"
				/>
				<button class="variant-filled-secondary" on:click={chatCompletion}>Send</button>
			</div>
		</div>
	</div>
	<div bind:this={sigmaRef} class="w-[1000px] h-screen bg-slate-800"></div>
</div>