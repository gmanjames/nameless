export default (function() {
  function createLookAtMatrix(eyeVector, targetVector, upVector) {
    const out = [];
    const eye0 = eyeVector[0],
          eye1 = eyeVector[1],
          eye2 = eyeVector[2],
          target0 = targetVector[0],
          target1 = targetVector[1],
          target2 = targetVector[2],
          up0 = upVector[0],
          up1 = upVector[1],
          up2 = upVector[2];

    let z0 = eye0 - target0,
        z1 = eye1 - target1,
        z2 = eye2 - target2;

    let len = 1 / Math.hypot(z0, z1, z2);
    z0 *= len;
    z1 *= len;
    z2 *= len;

    let x0 = (z2 * up1) - (z1 * up2),
        x1 = (z0 * up2) - (z2 * up0),
        x2 = (z1 * up0) - (z0 * up1);

    len = 1 / Math.hypot(x0, x1, x2);
    x0 *= len;
    x1 *= len;
    x2 *= len;

    let y0 = (x2 * z1) - (x1 * z2),
        y1 = (x0 * z2) - (x2 * z0),
        y2 = (x1 * z0) - (x0 * z1);

    len = 1 / Math.hypot(y0, y1, y2);
    y0 *= len;
    y1 *= len;
    y2 *= len;
    
    out[0] = x0;
    out[1] = y0;
    out[2] = z0;
    out[3] = 0.0;
    out[4] = x1;
    out[5] = y1;
    out[6] = z1;
    out[7] = 0.0;
    out[8] = x2;
    out[9] = y2;
    out[10] = z2;
    out[11] = 0.0;
    out[12] = -(x0 * eye0 + x1 * eye1 + x2 * eye2);
    out[13] = -(y0 * eye0 + y1 * eye1 + y2 * eye2);
    out[14] = -(z0 * eye0 + z1 * eye1 + z2 * eye2);
    out[15] = 1.0;
    return out;
  }

  return {
    createLookAtMatrix
  };
})();

