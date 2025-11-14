const EPSILON: f64 = 1e-9;

fn is_positive(val: &f64) -> bool {
    *val > EPSILON
}

fn is_negative(val: &f64) -> bool {
    *val < EPSILON
}

fn is_zero(val: &f64) -> bool {
    (val - EPSILON).abs() < EPSILON
}

#[derive(Copy, Clone)]
pub struct Vertex {
    pub x: f64,
    pub y: f64,
}

impl Vertex {
    pub fn to_vector(&self, to_vertex: &Vertex) -> Vector {
        Vector {
            i: to_vertex.x - self.x,
            j: to_vertex.y - self.y,
        }
    }
}

pub struct Segment {
    pub st: Vertex,
    pub en: Vertex,
}

pub struct Vector {
    pub i: f64,
    pub j: f64,
}

impl Vector {
    pub fn cross(&self, other: &Vector) -> f64 {
        self.i * other.j - self.j * other.i
    }
}

pub struct Triangle {
    pub v0: Vertex,
    pub v1: Vertex,
    pub v2: Vertex,
}

impl Segment {
    pub fn length(&self) -> f64 {
        ((&self.st.x - &self.en.x).powf(2.0) + (&self.st.y - &self.en.y).powf(2.0)).powf(0.5)
    }
}

impl Triangle {
    pub fn is_ccw(&self) -> bool {
        // v0->v1->v2

        let v1_v0 = &self.v1.to_vector(&self.v0);
        let v1_v2 = &self.v1.to_vector(&self.v2);

        let cross = v1_v2.cross(v1_v0); // gt 0.0 true, else false

        is_positive(&cross) && !is_zero(&cross)
    }
}
