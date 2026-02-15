use super::factory::IObject;
use std::collections::HashMap;
use std::sync::{Arc, Mutex};

#[allow(dead_code)]
pub struct Manager {
    live_objects: HashMap<String, Arc<Mutex<IObject>>>,
    dangling_objects: HashMap<String, Arc<Mutex<IObject>>>,
}

#[allow(dead_code)]
impl Manager {
    pub fn new() -> Self {
        Self {
            live_objects: HashMap::new(),
            dangling_objects: HashMap::new(),
        }
    }

    pub fn retrieve(&self, id: &str) -> Option<Arc<Mutex<IObject>>> {
        self.live_objects.get(id).cloned()
    }

    pub fn retrieve_dangling(&self, id: &str) -> Option<Arc<Mutex<IObject>>> {
        self.dangling_objects.get(id).cloned()
    }

    pub fn register(&mut self, id: &str, object: IObject) -> Arc<Mutex<IObject>> {
        let arc = Arc::new(Mutex::new(object));
        self.live_objects.insert(id.to_string(), Arc::clone(&arc));
        arc
    }

    pub fn dangle(&mut self, id: &str) -> Option<()> {
        let object = self.live_objects.remove(id)?;
        self.dangling_objects.insert(id.to_string(), object);
        Some(())
    }

    pub fn restore(&mut self, id: &str) -> Option<()> {
        let object = self.dangling_objects.remove(id)?;
        self.live_objects.insert(id.to_string(), object);
        Some(())
    }

    pub fn unregister(&mut self, id: &str) -> Option<Arc<Mutex<IObject>>> {
        self.live_objects.remove(id)
    }

    pub fn remove_dangling(&mut self, id: &str) -> Option<Arc<Mutex<IObject>>> {
        self.dangling_objects.remove(id)
    }

    pub fn live_count(&self) -> usize {
        self.live_objects.len()
    }

    pub fn dangling_count(&self) -> usize {
        self.dangling_objects.len()
    }
}
