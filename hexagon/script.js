const vertexShaderTxt = `
    precision mediump float;
    attribute vec2 vertPosition;
    attribute vec3 vertColor;
    varying vec3 fragColor;

    void main() {
        fragColor = vertColor;
        gl_Position = vec4(vertPosition, 0.0, 1.0);
    }
`;


const fragmentShaderTxt = `
    precision mediump float;
    varying vec3 fragColor;
    void main() {
        gl_FragColor = vec4(fragColor, 1.0);
    }
`;

const Hexagon = function(){
    const canvas = document.getElementById("canvas");
    const gl = canvas.getContext("webgl");

    if (!gl) {
        alert("no webgl");
    }
    gl.clearColor(0.7, 0.3, 0.83, 0.7);
    gl.clear(gl.COLOR_BUFFER_BIT);


    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderTxt);
    gl.compileShader(vertexShader);
    
    
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentShaderTxt);
    gl.compileShader(fragmentShader);
    
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS));

    
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    gl.detachShader(program, vertexShader);
    gl.detachShader(program, fragmentShader);
    
    gl.validateProgram(program);

    let vertices = [  0, 0, 1, 0, .5, .866, -.5, .866, -1, 0, -.5, -.866, .5, -.866, 1, 0];
    
 
    const hexagonVertexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, hexagonVertexBufferObject);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    
    
    const posAttrLocation = gl.getAttribLocation(program, `vertPosition`);
    gl.vertexAttribPointer(posAttrLocation, 2, gl.FLOAT, gl.FALSE, 0 ,0);


    const colorAttrLocation = gl.getAttribLocation(program, `vertColor`);
    gl.vertexAttribPointer(colorAttrLocation, 3, gl.FLOAT, gl.FALSE,1* Float32Array.BYTES_PER_ELEMENT, 0* Float32Array.BYTES_PER_ELEMENT);
    

    gl.enableVertexAttribArray(posAttrLocation);
    gl.enableVertexAttribArray(colorAttrLocation);
    gl.useProgram(program);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLE_FAN, 2, 6);
}