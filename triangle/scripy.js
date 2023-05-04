const vertexShaderTxt =
`
    precision mediump float;
    attribute vec2 vertPosition;
    attribute vec3 vertColor;
    varying vec3 fragColor;


    void main(){
        fragColor = vertColor;
        gl_Position = vec4(vertPosition, 0.0, 1.0);
    }
`
    ;

const fragmentShaderTxt =
`   precision mediump float;
    varying vec3 fragColor;
    void main(){
        gl_FragColor = vec4(fragColor, 1.);
    }
`
    ;


const Triangle = function () {
    const canvas = document.getElementById("canvas");
    const gl = canvas.getContext("webgl");

    if (!gl) {
        alert("no webgl");
    }
    gl.clearColor(0.0, 0.96, 0.83, 0.32);
    gl.clear(gl.COLOR_BUFFER_BIT);

    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

    gl.shaderSource(vertexShader, vertexShaderTxt);
    gl.shaderSource(fragmentShader, fragmentShaderTxt);

    gl.compileShader(vertexShader);
    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS));

    const program = gl.createProgram();

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    gl.detachShader(program, vertexShader);
    gl.detachShader(program, fragmentShader);

    gl.validateProgram(program);


    let triangleVert = [
        0.0, 0.5, 1.0, 0.0, 0.0,
        -0.5, -0.5, 0.0, 1.0, 0.0,
        0.5, -0.5, 0.0, 0.0, 1.0,
    ];

    const triangleVertexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBufferObject);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVert), gl.STATIC_DRAW);

    const posAttrLocation = gl.getAttribLocation(program, `vertPosition`);
    gl.vertexAttribPointer(posAttrLocation, 2, gl.FLOAT, gl.FALSE, 5 * Float32Array.BYTES_PER_ELEMENT, 0,);


    const colorAttrLocation = gl.getAttribLocation(program, `vertColor`);
    gl.vertexAttribPointer(colorAttrLocation, 3, gl.FLOAT, gl.FALSE, 5 * Float32Array.BYTES_PER_ELEMENT, 2*Float32Array.BYTES_PER_ELEMENT,);


    gl.enableVertexAttribArray(posAttrLocation);
    gl.enableVertexAttribArray(colorAttrLocation);
    gl.useProgram(program);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
};