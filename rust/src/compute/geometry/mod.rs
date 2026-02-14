use nalgebra::{Matrix4, Point3, Vector3};

use super::utils::is_positive;

pub struct Triangle {
    pub v0: Point3<f32>,
    pub v1: Point3<f32>,
    pub v2: Point3<f32>,
}

trait PointExt {
    fn inside(&self, triangle: &Triangle) -> bool;
}

impl PointExt for Point3<f32> {
    fn inside(&self, triangle: &Triangle) -> bool {
        // let v0 = triangle.v1 - triangle.v0;
        // let v1 = triangle.v2 - triangle.v0;
        // let v2 = self - triangle.v0;

        // let dot00 = v0.dot(&v0);
        // let dot01 = v0.dot(&v1);
        // let dot02 = v0.dot(&v2);
        // let dot11 = v1.dot(&v1);
        // let dot12 = v1.dot(&v2);

        // let inv_denom = 1.0 / (dot00 * dot11 - dot01 * dot01);
        // let u = (dot11 * dot02 - dot01 * dot12) * inv_denom;
        // let v = (dot00 * dot12 - dot01 * dot02) * inv_denom;

        // (u >= 0.0) && (v >= 0.0) && (u + v <= 1.0)

        true
    }
}

impl Triangle {
    pub fn normal(&self) -> Vector3<f32> {
        let edge1 = self.v1 - self.v0;
        let edge2 = self.v2 - self.v0;
        edge1.cross(&edge2).normalize()
    }

    pub fn is_ccw(&self) -> bool {
        let normal = self.normal();
        is_positive(normal.z)
    }

    pub fn contains(&self, points: &[Point3<f32>]) -> bool {
        for point in points {
            if !point.inside(self) {
                return false;
            }
        }

        true
    }
}

pub struct Surface {
    pub triangles: Vec<Triangle>,
}
