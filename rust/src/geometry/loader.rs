use crate::proto::geometry::v1::{BoundingBox, GeometryFileKind, GeometryMeta, GeometryStats};
// use std::collections::HashMap;

pub struct LoadedGeometry {
    pub geometry_id: String,
    pub meta: GeometryMeta,
    pub raw_bytes: Vec<u8>,
    pub stats: GeometryStats,
}

pub struct GeometryLoader;

impl GeometryLoader {
    pub fn load(meta: GeometryMeta, raw_bytes: Vec<u8>) -> Result<LoadedGeometry, String> {
        let geometry_id = uuid::Uuid::new_v4().to_string();

        let stats = match GeometryFileKind::try_from(meta.file_kind)
            .unwrap_or(GeometryFileKind::Unspecified)
        {
            GeometryFileKind::Las | GeometryFileKind::Laz | GeometryFileKind::Copc => {
                Self::stats_point_cloud(&raw_bytes)?
            }

            GeometryFileKind::Obj | GeometryFileKind::Stl | GeometryFileKind::Gltf => {
                Self::stats_mesh(&raw_bytes)?
            }

            GeometryFileKind::Geojson | GeometryFileKind::Wkt | GeometryFileKind::Shapefile => {
                Self::stats_gis(&raw_bytes)?
            }

            _ => GeometryStats::default(),
        };

        Ok(LoadedGeometry {
            geometry_id,
            meta,
            raw_bytes,
            stats,
        })
    }

    // ── Stats extractors — replace these with real pasture/parry logic ────────

    fn stats_point_cloud(_bytes: &[u8]) -> Result<GeometryStats, String> {
        // TODO: use pasture-io to read LAS/LAZ header and extract stats
        // let reader = pasture_io::las::LasReader::from_bytes(bytes)?;
        // let header = reader.header();
        // let bounds = header.bounds();
        Ok(GeometryStats {
            point_count: 0, // replace with header.point_count()
            bounding_box: Some(BoundingBox::default()),
            ..Default::default()
        })
    }

    fn stats_mesh(_bytes: &[u8]) -> Result<GeometryStats, String> {
        // TODO: use parry3d to load mesh and extract vertex/face counts
        // let mesh = parry3d::shape::TriMesh::from_obj_bytes(bytes)?;
        Ok(GeometryStats {
            vertex_count: 0, // replace with mesh.vertices().len()
            face_count: 0,   // replace with mesh.indices().len()
            bounding_box: Some(BoundingBox::default()),
            ..Default::default()
        })
    }

    fn stats_gis(_bytes: &[u8]) -> Result<GeometryStats, String> {
        // TODO: use sfcgal-rs or geo crate to parse and extract bounds
        Ok(GeometryStats {
            bounding_box: Some(BoundingBox::default()),
            ..Default::default()
        })
    }
}
