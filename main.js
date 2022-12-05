const canvas = document.getElementById("canvas"),
      gl = canvas.getContext("webgl2");

let cubeRotation = 0;

function main()
{
  const vsSrc = `#version 300 es
    in vec3 position;

    uniform mat4 modelViewMatrix;
    uniform mat4 projectionMatrix;

    void main() {
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fsSrc = `#version 300 es
    precision lowp float;

    out vec4 FragColor;

    void main() {
      FragColor = vec4(1.0, 1.0, 1.0, 1.0);
    }
  `;

  const shaderProgram = initShaderProgram(vsSrc, fsSrc);

  const positions = [9.183549615799121e-41, 2.755092910709023e-40, 4.5918308598381336e-40, 6.428568808967244e-40, 8.265306758096355e-40, 1.0102044707225466e-39, 1.1938782656354576e-39, 1.3775520605483687e-39, 1.5612258554612798e-39, 1.744899650374191e-39, 1.928573445287102e-39, 2.112247240200013e-39, 2.295921035112924e-39, 2.479594830025835e-39, 2.6632686249387462e-39, 2.8469424198516573e-39, 3.0306162147645684e-39, 3.2142900096774794e-39, -0.03673940151929855, 0.03673940151929855, 0.03673940151929855, -0.03673940151929855, -0.03673940151929855, 0.03673940151929855, 0.03673940151929855, -0.03673940151929855, 0.03673940151929855, 0.03673940151929855, -0.03673940151929855, -0.03673940151929855, -0.03673940151929855, -0.03673940151929855, -0.03673940151929855, -0.03673940151929855, 0.03673940151929855, -0.03673940151929855, 0.03673940151929855, -0.03673940151929855, -0.03673940151929855, 0.03673940151929855, -0.03673940151929855, 0.03673940151929855, -0.03673940151929855, -0.03673940151929855, 0.03673940151929855, 0.03673940151929855, 0.03673940151929855, -0.03673940151929855, 0.03673940151929855, 0.03673940151929855, 0.03673940151929855, 0.03673940151929855, -0.03673940151929855, 0.03673940151929855, -0.03673940151929855, 0.03673940151929855, -0.03673940151929855, -0.03673940151929855, 0.03673940151929855, 0.03673940151929855, 0.03673940151929855, 0.03673940151929855, 0.03673940151929855, -0.03673940151929855, -0.03673940151929855, -0.03673940151929855, -0.03673940151929855, -0.03673940151929855, 0.03673940151929855, -0.03673940151929855, 0.03673940151929855, 0.03673940151929855, 0.03673940151929855, -0.03673940151929855, 0.03673940151929855, 0.03673940151929855, 0.03673940151929855, 0.03673940151929855, -0.03673940151929855, 0.03673940151929855, 0.03673940151929855, -0.03673940151929855, 0.03673940151929855, -0.03673940151929855, 0.03673940151929855, 0.03673940151929855, -0.03673940151929855, 0.03673940151929855, -0.03673940151929855, -0.03673940151929855, -0.03673940151929855, -0.03673940151929855, 0.03673940151929855, -0.03673940151929855, -0.03673940151929855, -0.03673940151929855, 0.03673940151929855, -0.03673940151929855, -0.03673940151929855, 0.03673940151929855, -0.03673940151929855, 0.03673940151929855, 0.03673940151929855, -0.03673940151929855, -0.03673940151929855, 0.03673940151929855, 0.03673940151929855, -0.03673940151929855];

  const indices = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35];

  let VAO, VBO, EBO;
  VAO = gl.createVertexArray();
  VBO = gl.createBuffer();
  EBO = gl.createBuffer();

  gl.bindVertexArray(VAO);

  gl.bindBuffer(gl.ARRAY_BUFFER, VBO);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, EBO);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(indices), gl.STATIC_DRAW);

  const vPosLocation = gl.getAttribLocation(shaderProgram, "position");
  gl.vertexAttribPointer(
    vPosLocation,
    3,
    gl.FLOAT,
    false,
    3 * 4,
    0
  );
  gl.enableVertexAttribArray(vPosLocation);

  // stuff we need to do everytime
  let then = 0;
  function render(now) {
    now *= 0.001
    const deltaTime = now - then;
    then = now;

    drawScene(gl, VAO, shaderProgram, deltaTime);

    window.requestAnimationFrame(render);
  }
  window.requestAnimationFrame(render);

  
}

function initShaderProgram(vsSrc, fsSrc) {
  const vertexShader = gl.createShader(gl.VERTEX_SHADER),
        fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

  gl.shaderSource(vertexShader, vsSrc);
  gl.compileShader(vertexShader);

  if (reportShaderCompileErrors(vertexShader)) {
    return null;
  }

  gl.shaderSource(fragmentShader, fsSrc);
  gl.compileShader(fragmentShader);

  if (reportShaderCompileErrors(fragmentShader)) {
    return null;
  }

  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  if (reportProgramLinkErrors(shaderProgram)) {
    return null;
  }

  gl.useProgram(shaderProgram);

  return shaderProgram;
}

function drawScene(gl, VAO, shaderProgram, deltaTime) {
  gl.clearColor(0.2, 0.5, 0.1, 1.0);
  gl.clearDepth(1.0); // Clear everything
  gl.enable(gl.DEPTH_TEST); // Enable depth testing
  gl.depthFunc(gl.LEQUAL); // Near things obscure far things
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  const fieldOfView = 45 * Math.PI / 180;   // in radians
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  const zNear = 0.1;
  const zFar = Math.Infinity;
  const projectionMatrix = glMatrix.mat4.create();
  glMatrix.mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

  const projMatrixLocation = gl.getUniformLocation(shaderProgram, "projectionMatrix");
  gl.uniformMatrix4fv(projMatrixLocation, false, projectionMatrix);

  const modelViewMatrix = glMatrix.mat4.create();
  glMatrix.mat4.translate(modelViewMatrix, modelViewMatrix, [-0.0, 0.0, -1.0]);

  glMatrix.mat4.rotate(
    modelViewMatrix,
    modelViewMatrix,
    (Math.PI * (cubeRotation)) / 180,
    [0, 1, 0]
  );
  glMatrix.mat4.rotate(
    modelViewMatrix,
    modelViewMatrix,
    (Math.PI * (cubeRotation)) / 180,
    [1, 0, 0]
  );

  const mvMatrixLocation = gl.getUniformLocation(shaderProgram, "modelViewMatrix");
  gl.uniformMatrix4fv(mvMatrixLocation, false, modelViewMatrix);

  gl.useProgram(shaderProgram);
  gl.bindVertexArray(VAO);

  // TODO: explain behavior of gl.LINES here
  gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_INT, 0);

  cubeRotation += deltaTime;
}

function reportShaderCompileErrors(shader) {
  const compileStatus = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (!compileStatus) {
    console.error(gl.getShaderInfoLog(vertexShader));
    return true;
  } else {
    return false;
  }
}

function reportProgramLinkErrors(program) {
  const linkStatus = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (!linkStatus) {
    console.error(gl.getProgramInfoLog(vertexShader));
    return true;
  } else {
    return false;
  }
}

main();
