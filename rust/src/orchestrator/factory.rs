// use serde_json::Map;
use std::collections::HashMap;

#[derive(Clone)]
pub struct IObject {
    _uid: String,
}

impl IObject {
    pub fn _execute(&self) {
        println!("Executing IObject");
    }
}

pub struct Factory {
    // objects: Vec<IObject>
    objects: HashMap<String, IObject>,
}

impl Factory {
    pub fn new() -> Self {
        Self {
            objects: HashMap::new(),
        }
    }

    pub fn _register(&mut self, key: &str, object: IObject) {
        self.objects.insert(key.to_string(), object);
    }

    pub fn create(&self, key: &str) -> Option<&IObject> {
        self.objects.get(key)
    }
}
