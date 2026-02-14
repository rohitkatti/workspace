const EPSILON: f32 = 1e-9;

pub fn is_zero(value: f32) -> bool {
    value.abs() < EPSILON
}

pub fn is_positive(value: f32) -> bool {
    value > EPSILON
}
