use crate::geometry::loader::LoadedGeometry;
use std::collections::HashMap;
use std::sync::{Arc, RwLock};

#[derive(Clone, Default)]
pub struct GeometryStore {
    inner: Arc<RwLock<HashMap<String, LoadedGeometry>>>,
}

impl GeometryStore {
    pub fn new() -> Self {
        Self::default()
    }

    pub fn insert(&self, geometry: LoadedGeometry) -> String {
        let id = geometry.geometry_id.clone();
        self.inner.write().unwrap().insert(id.clone(), geometry);
        id
    }

    pub fn get(&self, id: &str) -> Option<LoadedGeometry> {
        self.inner.read().unwrap().get(id).cloned()
    }

    pub fn remove(&self, id: &str) {
        self.inner.write().unwrap().remove(id);
    }
}

// LoadedGeometry needs Clone
impl Clone for crate::geometry::loader::LoadedGeometry {
    fn clone(&self) -> Self {
        Self {
            geometry_id: self.geometry_id.clone(),
            meta: self.meta.clone(),
            raw_bytes: self.raw_bytes.clone(),
            stats: self.stats.clone(),
        }
    }
}
