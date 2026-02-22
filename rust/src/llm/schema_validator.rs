// use jsonschema::JSONSchema;
use jsonschema::Validator;
use serde_json::Value;

pub enum ValidationTarget {
    Concept,
    Entity,
    Scenario,
    Algorithm,
}

// pub struct SchemaValidator {
//     concept: JSONSchema,
//     entity: JSONSchema,
//     scenario: JSONSchema,
//     algorithm: JSONSchema,
// }
// And update the struct:
pub struct SchemaValidator {
    concept: Validator,
    entity: Validator,
    scenario: Validator,
    algorithm: Validator,
}

impl SchemaValidator {
    pub fn new() -> Self {
        let concept_raw: Value =
            serde_json::from_str(include_str!("../schemas/concept_graph.schema.json"))
                .expect("Invalid concept schema");

        let entity_raw: Value =
            serde_json::from_str(include_str!("../schemas/entity_scene.schema.json"))
                .expect("Invalid entity schema");

        let scenario_raw: Value =
            serde_json::from_str(include_str!("../schemas/scenario.schema.json"))
                .expect("Invalid scenario schema");

        let algorithm_raw: Value =
            serde_json::from_str(include_str!("../schemas/algorithm_pipeline.schema.json"))
                .expect("Invalid algorithm schema");

        Self {
            // concept: JSONSchema::compile(&concept_raw).expect("Failed to compile concept schema"),
            concept: jsonschema::validator_for(&concept_raw)
                .expect("Failed to compile concept schema"),

            // entity: JSONSchema::compile(&entity_raw).expect("Failed to compile entity schema"),
            entity: jsonschema::validator_for(&entity_raw)
                .expect("Failed to compile entity schema"),
            scenario: jsonschema::validator_for(&scenario_raw)
                .expect("Failed to compile scenario schema"),
            algorithm: jsonschema::validator_for(&algorithm_raw)
                .expect("Failed to compile algorithm schema"),
        }
    }

    pub fn validate(&self, json: &Value, target: &ValidationTarget) -> Result<(), String> {
        let schema = match target {
            ValidationTarget::Concept => &self.concept,
            ValidationTarget::Entity => &self.entity,
            ValidationTarget::Scenario => &self.scenario,
            ValidationTarget::Algorithm => &self.algorithm,
        };

        schema
            .validate(json)
            .map_err(|e| format!("{} at {}", e, e.instance_path()))
    }
}
