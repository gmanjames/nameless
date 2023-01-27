import glUtils from "./glUtils"
import { mat4 } from "../vendor/js/toji-gl-matrix-4480752/dist/esm/index.js"

const canvas = document.getElementById("canvas"),
      gl = canvas.getContext("webgl2");

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

  const positions = [-0.03673940151929855, 0.03673940151929855, 0.03673940151929855, -0.03673940151929855, -0.03673940151929855, 0.03673940151929855, 0.03673940151929855, -0.03673940151929855, 0.03673940151929855, 0.03673940151929855, -0.03673940151929855, -0.03673940151929855, -0.03673940151929855, -0.03673940151929855, -0.03673940151929855, -0.03673940151929855, 0.03673940151929855, -0.03673940151929855, 0.03673940151929855, -0.03673940151929855, -0.03673940151929855, 0.03673940151929855, -0.03673940151929855, 0.03673940151929855, -0.03673940151929855, -0.03673940151929855, 0.03673940151929855, 0.03673940151929855, 0.03673940151929855, -0.03673940151929855, 0.03673940151929855, 0.03673940151929855, 0.03673940151929855, 0.03673940151929855, -0.03673940151929855, 0.03673940151929855, -0.03673940151929855, 0.03673940151929855, -0.03673940151929855, -0.03673940151929855, 0.03673940151929855, 0.03673940151929855, 0.03673940151929855, 0.03673940151929855, 0.03673940151929855, -0.03673940151929855, -0.03673940151929855, -0.03673940151929855, -0.03673940151929855, -0.03673940151929855, 0.03673940151929855, -0.03673940151929855, 0.03673940151929855, 0.03673940151929855, 0.03673940151929855, -0.03673940151929855, 0.03673940151929855, 0.03673940151929855, 0.03673940151929855, 0.03673940151929855, -0.03673940151929855, 0.03673940151929855, 0.03673940151929855, -0.03673940151929855, 0.03673940151929855, -0.03673940151929855, 0.03673940151929855, 0.03673940151929855, -0.03673940151929855, 0.03673940151929855, -0.03673940151929855, -0.03673940151929855, -0.03673940151929855, -0.03673940151929855, 0.03673940151929855, -0.03673940151929855, -0.03673940151929855, -0.03673940151929855, 0.03673940151929855, -0.03673940151929855, -0.03673940151929855, 0.03673940151929855, -0.03673940151929855, 0.03673940151929855, 0.03673940151929855, -0.03673940151929855, -0.03673940151929855, 0.03673940151929855, 0.03673940151929855, -0.03673940151929855, 0.03673940151929855, 0.03673940151929855, 0.03673940151929855, 0.03673940151929855, 0.03673940151929855, -0.03673940151929855, -0.03673940151929855, 0.03673940151929855, -0.03673940151929855, -0.03673940151929855, 0.03673940151929855, 0.03673940151929855, -0.03673940151929855, 0.03673940151929855, -0.03673940151929855, -0.03673940151929855, -0.03673940151929855, -0.03673940151929855];

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

  const fieldOfView = 45 * Math.PI / 180;   // in radians
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  const zNear = 0.1;
  const zFar = Math.Infinity;
  const projectionMatrix = mat4.create();

  const progInfo = {
    program: shaderProgram,
    projectionMatrix: mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar),
    modelViewMatrix: mat4.create(),
    VBO,
    EBO,
    VAO,
    camera: {
      position: [0.0, 0.0,  1.0],
      front:    [0.0, 0.0, -1.0],
      up:       [0.0, 1.0,  0.0]
    }
  };

  setupEventListeners(progInfo);

  let then = 0;
  function render(now) {
    now *= 0.001
    const deltaTime = now - then;
    then = now;

    progInfo.deltaTime = deltaTime;

    drawScene(gl, progInfo);

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

function drawScene(gl, progInfo) {
  gl.clearColor(0.2, 0.5, 0.1, 1.0);
  gl.clearDepth(1.0); // Clear everything
  gl.enable(gl.DEPTH_TEST); // Enable depth testing
  gl.depthFunc(gl.LEQUAL); // Near things obscure far things
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  const projMatrixLocation = gl.getUniformLocation(progInfo.program, "projectionMatrix");
  gl.uniformMatrix4fv(projMatrixLocation, false, progInfo.projectionMatrix);

  const mvMatrixLocation = gl.getUniformLocation(progInfo.program, "modelViewMatrix");
  gl.uniformMatrix4fv(mvMatrixLocation, false, progInfo.modelViewMatrix);

  let eye = progInfo.camera.position,
      center = [
        progInfo.camera.front[0] + progInfo.camera.position[0],
        progInfo.camera.front[1] + progInfo.camera.position[1],
        progInfo.camera.front[2] + progInfo.camera.position[2]
      ],
      up = progInfo.camera.up;
  mat4.lookAt(progInfo.modelViewMatrix, eye, center, up);

  gl.useProgram(progInfo.program);
  gl.bindVertexArray(progInfo.VAO);

  gl.drawElements(gl.LINES, 36, gl.UNSIGNED_INT, 0);
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

function setupEventListeners(progInfo) {
  const { front, up } = progInfo.camera;

  // cx = aybz − azby
  // cy = azbx − axbz
  // cz = axby − aybx
  const cameraSpeed = 0.1;
  window.addEventListener("keyup", (e) => {
    switch (e.key) {
      case "w":
        progInfo.camera.position[2] += cameraSpeed * front[2];
        break;
      case "s":
        progInfo.camera.position[2] -= cameraSpeed * front[2];
        break;
      case "a":
        progInfo.camera.position[0] -= cameraSpeed * ((front[1] * up[2]) - (front[2] * up[1]));
        break;
      case "d":
        progInfo.camera.position[0] += cameraSpeed * ((front[1] * up[2]) - (front[2] * up[1]));
        break;
      default:
        break;
    }
  })
}

main();
