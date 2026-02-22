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

// grpcurl -plaintext \
//   -d '{
//     "raw_input": "increased interest rates reduce consumer spending which slows economic growth",
//     "session_id": "test-session-1"
//   }' \
//   localhost:50051 \
//   reasoning.v1.ReasoningService/BuildConceptGraph

// rohitkatti@myBook rust % grpcurl -plaintext \
//   -d '{
//     "raw_input": "increased interest rates reduce consumer spending which slows economic growth",
//     "session_id": "test-session-1"
//   }' \
//   localhost:50051 \
//   reasoning.v1.ReasoningService/BuildConceptGraph
// {
//   "graph": {
//     "id": "graph_123",
//     "nodes": [
//       {
//         "id": "node_0",
//         "label": "Increased Interest Rates"
//       },
//       {
//         "id": "node_1",
//         "label": "Reduce Consumer Spending"
//       },
//       {
//         "id": "node_2",
//         "label": "Slows Economic Growth"
//       }
//     ],
//     "edges": [
//       {
//         "id": "edge_0",
//         "sourceId": "node_0",
//         "targetId": "node_1",
//         "kind": "EDGE_KIND_INFLUENCES",
//         "weight": -0.5
//       },
//       {
//         "id": "edge_1",
//         "sourceId": "node_1",
//         "targetId": "node_2",
//         "kind": "EDGE_KIND_INFLUENCES",
//         "weight": -0.6
//       }
//     ],
//     "meta": [
//       {
//         "key": "description"
//       }
//     ]
//   },
//   "confidence": 1,
//   "meta": {
//     "requestUid": "b75602bb-0727-4276-ab1f-343376f84b04",
//     "timestampMs": "1771774456109",
//     "sessionId": "test-session-1"
//   }
// }

// grpcurl -plaintext \
//   -d '{
//     "base_graph": {
//       "id": "macro-graph",
//       "nodes": [
//         {"id": "interest-rates", "label": "Interest Rates", "kind": 1, "properties": []},
//         {"id": "consumer-spending", "label": "Consumer Spending", "kind": 1, "properties": []},
//         {"id": "economic-growth", "label": "Economic Growth", "kind": 1, "properties": []}
//       ],
//       "edges": [
//         {"id": "e1", "source_id": "interest-rates", "target_id": "consumer-spending", "kind": 1, "weight": -0.8, "properties": []},
//         {"id": "e2", "source_id": "consumer-spending", "target_id": "economic-growth", "kind": 1, "weight": 0.7, "properties": []}
//       ],
//       "meta": []
//     },
//     "kinds": [1, 2, 3]
//   }' \
//   localhost:50051 \
//   reasoning.v1.ReasoningService/AnalyzeGraph

// grpcurl -plaintext \
//   -d '{
//     "meta": {
//       "file_path": "/tmp/test.obj",
//       "file_kind": 1,
//       "session_id": "test-session-1",
//       "goal": "compute bounding box"
//     }
//   }' \
//   localhost:50051 \
//   geometry.v1.GeometryService/ProcessGeometry
// grpcurl -plaintext \
//   -d '{
//     "geometry_id": "5168abb6-670f-4e03-ae8f-3eccbf5d48c4",
//     "pipeline": {
//       "id": "test-pipeline",
//       "nodes": [
//         {"id": "step-1", "label": "Bounding Box", "kind": 4, "properties": [
//           {"key": "algorithm_id", "string_payload": "bounding_box"}
//         ]}
//       ],
//       "edges": [],
//       "meta": []
//     },
//     "session_id": "test-session-1"
//   }' \
//   localhost:50051 \
//   geometry.v1.GeometryService/ExecutePipeline

// The scaffold is solid. Now it's yours to build on. The entry point for all your algorithm work is dispatch_algorithm in src/geometry/pipeline.rs — each match arm is where you implement the real logic using pasture/parry/sfcgal-rs.

// Current state of the full platform:
// ServiceStatusshared.v1.LLMGatewayCompletehealth.v1.HealthCompletereasoning.v1.ReasoningServiceCompletegeometry.v1.GeometryServiceScaffold done, algorithms yours to implement
// Your next steps on the Rust side:

// Implement stats_point_cloud in loader.rs using pasture-io
// Implement stats_mesh in loader.rs using parry3d
// Fill in dispatch_algorithm arms one by one

// After that:

// Next.js frontend with Connect-ES
// React Flow for reasoning visualization
// Three.js/Deck.gl for geometry visualization
