// This file is created from a youtube webGL course: https://www.youtube.com/watch?v=y2UsQB3WSvo

const init = () => {
  const canvas = document.getElementById("canvas");

  if (!canvas) {
    alert("Canvas not found.");
    return;
  }

  let gl = canvas.getContext("webgl2");

  if (!gl) {
    alert("WebGL not supported on your browser.");
  }

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  // Used to clear the buffer and define the default color of buffer
  gl.clearColor(0.05, 0.05, 0.05, 1);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Declare triangle points (x and y)
  const triangleVertices = [
    // Top middle
    -0.5, 0,
    // Bottom left
    -0.5, -0.5,
    // Bottom right
    1, -1,
  ];

  // Transform data for GPU
  const triangleGeoCpuBuffer = new Float32Array(triangleVertices);

  // Init triangle buffer
  const triangleGeoBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, triangleGeoBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, triangleGeoCpuBuffer, gl.STATIC_DRAW);

  // GLSL shader code
  const vertexShaderSourceCode = `#version 300 es
  precision mediump float;
  
  in vec2 vertexPosition;

  void main() {
    gl_Position = vec4(vertexPosition, 0.0, 1.0);
  }`;

  // Init the vertex shader (points)
  const vertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertexShader, vertexShaderSourceCode);
  gl.compileShader(vertexShader);
  if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
    const compileError = gl.getShaderInfoLog(vertexShader);
    console.log(compileError);
  }

  // GLSL shader code
  const fragmentShaderSourceCode = `#version 300 es
  precision mediump float;

  out vec4 outputColor;
  
  void main() {
    outputColor = vec4(0.5, 0.5, 0, 1);
  }`;

  // Init the fragment shader (lines)
  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragmentShader, fragmentShaderSourceCode);
  gl.compileShader(fragmentShader);
  if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
    const compileError = gl.getShaderInfoLog(fragmentShader);
    console.log(compileError);
  }
  
  // Init the program
  // A program is the combination of 2 Shader
  const triangleShaderProgram = gl.createProgram();
  gl.attachShader(triangleShaderProgram, vertexShader);
  gl.attachShader(triangleShaderProgram, fragmentShader);
  gl.linkProgram(triangleShaderProgram);
  if (!gl.getProgramParameter(triangleShaderProgram, gl.LINK_STATUS)) {
    const linkError = gl.getProgramInfoLog(triangleShaderProgram);
    console.log(linkError);
    return;
  }

  // Get vertex position in GL
  const vertexPositionAttributeLocation = gl.getAttribLocation(triangleShaderProgram, 'vertexPosition');
  if (vertexPositionAttributeLocation < 0) {
    console.log('Failed to get attrib location of vertex position');
    return;
  }

  // Set "background" color
  gl.clearColor(0.0, 0.1, 0.08, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Define viewport (x, y, width, height)
  gl.viewport(0, 0, canvas.width, canvas.height);

  // Set up GPU program
  gl.useProgram(triangleShaderProgram);
  gl.enableVertexAttribArray(vertexPositionAttributeLocation);

  // Input assembler (how to read vertex information from buffers?)
  gl.bindBuffer(gl.ARRAY_BUFFER, triangleGeoBuffer);
  gl.vertexAttribPointer(
    // Index (vertex attrib location)
    vertexPositionAttributeLocation,
    // Size
    2, // (points and lines)
    // Data type
    gl.FLOAT,
    // Normalized: if type=float and is writing to a vec(n) float input, should WebGL normalize the ints first?
    false,
    // Stride: bytes between starting byte of attribute for a vertex and the same attrib for the next vertex
    2 * Float32Array.BYTES_PER_ELEMENT,
    // Offset: bytes between the start of the buffer and the first byte of the attribute
    0
  );
  
  // Draw call
  gl.drawArrays(gl.TRIANGLES, 0, 3);
};

try {
  init();
} catch(e) {
  console.log("script issue:", e);
}
