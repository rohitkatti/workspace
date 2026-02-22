pub(crate) const FILE_DESCRIPTOR_SET: &[u8] = tonic::include_file_descriptor_set!("descriptor");

pub mod sys;

pub mod llm;

mod health;

// Re-export the proto generated types so the rest of the crate
// can use crate::proto::shared::v1::Graph etc.
pub mod proto {
    pub mod shared {
        pub mod v1 {
            tonic::include_proto!("shared.v1");
        }
    }
    // pub mod geometry {
    //     pub mod v1 {
    //         tonic::include_proto!("geometry.v1"); // matches package geometry.v1
    //     }
    // }
    // pub mod reasoning {
    //     pub mod v1 {
    //         tonic::include_proto!("reasoning.v1"); // matches package reasoning.v1
    //     }
    // }
    // pub mod health {
    //     pub mod v1 {
    //         tonic::include_proto!("health.v1");
    //     }
    // }
}
