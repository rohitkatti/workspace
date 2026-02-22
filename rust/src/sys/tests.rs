// grpcurl -plaintext \
//   -d '{
//     "context": {
//       "id": "mock-concept",
//       "nodes": [
//         {"id": "interest-rates", "label": "Interest Rates", "kind": 1, "properties": []},
//         {"id": "consumer-spending", "label": "Consumer Spending", "kind": 1, "properties": []}
//       ],
//       "edges": [
//         {"id": "e1", "source_id": "interest-rates", "target_id": "consumer-spending", "kind": 1, "weight": -0.8, "properties": []}
//       ],
//       "meta": []
//     },
//     "goal": "find the most influential nodes",
//     "module": 2
//   }' \
//   localhost:50051 \
//   shared.v1.LLMGateway/SuggestAlgorithms
// {
//   "suggestions": [
//     {
//       "algorithmId": "betweenness_centrality",
//       "name": "Betweenness Centrality",
//       "rationale": "Identifies nodes that act as bridges in the causal graph",
//       "confidence": 0.92,
//       "parameters": [
//         {
//           "key": "normalized",
//           "stringPayload": "true"
//         }
//       ]
//     },
//     {
//       "algorithmId": "influence_propagation",
//       "name": "Influence Propagation",
//       "rationale": "Propagates weighted influence through edges to find downstream effects",
//       "confidence": 0.87,
//       "parameters": [
//         {
//           "key": "max_iterations",
//           "stringPayload": "10"
//         },
//         {
//           "key": "convergence_delta",
//           "stringPayload": "0.001"
//         }
//       ]
//     }
//   ]
// }
// rohitkatti@myBook rust %

// grpcurl -plaintext \
//   -d '{"raw_input": "increased interest rates reduce consumer spending which slows economic growth", "target": 1}' \
//   localhost:50051 \
//   shared.v1.LLMGateway/StructureInput
// grpcurl -plaintext localhost:50051 list
