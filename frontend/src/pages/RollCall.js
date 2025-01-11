import { useRef, useEffect } from 'react';
import * as faceapi from 'face-api.js';
import './RollCall.css';

function RollCall() {
    const videoRef = useRef();
    const canvasRef = useRef();

    useEffect(() => {
        startVideo();
        videoRef && loadModels();
    }, []);

    const startVideo = () => {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then((currentStream) => {
                videoRef.current.srcObject = currentStream;
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const loadModels = () => {
        Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
            faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
            faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
            faceapi.nets.faceExpressionNet.loadFromUri("/models")
        ]).then(() => {
            faceMyDetect();
        });
    };

    const faceMyDetect = () => {
        setInterval(async () => {
            const detections = await faceapi.detectAllFaces(videoRef.current,
                new faceapi.TinyFaceDetectorOptions());

            canvasRef.current.innerHtml = faceapi.createCanvasFromMedia(videoRef.current);
            faceapi.matchDimensions(canvasRef.current, {
                width: 940,
                height: 650
            });

            const resized = faceapi.resizeResults(detections, {
                width: 940,
                height: 650
            });

            faceapi.draw.drawDetections(canvasRef.current, resized);
        }, 1000);
    };

    return (
        <div className="myapp">
            <h1>Điểm danh bằng khuôn mặt</h1>
            <div className="appvide">
                <video crossOrigin="anonymous" ref={videoRef} autoPlay></video>
            </div>
            <canvas ref={canvasRef} width="940" height="650" className="appcanvas" />
        </div>
    );
}

export default RollCall;