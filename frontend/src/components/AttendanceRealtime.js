// src/components/AttendanceRealtime.js
import { useRef, useState, useEffect } from 'react';
import * as faceapi from 'face-api.js';
import 'bootstrap/dist/css/bootstrap.min.css';

function AttendanceRealtime() {
    const videoRef = useRef();
    const canvasRef = useRef();
    const [faceDetected, setFaceDetected] = useState(false);
    const [webcamActive, setWebcamActive] = useState(false);
    const [countdown, setCountdown] = useState(null);
    let detectionInterval = useRef(null);
    let countdownInterval = useRef(null);

    useEffect(() => {
        loadModels();
        return () => {
            clearResources(); // Cleanup khi component unmount
        };
    }, []);

    const loadModels = async () => {
        await Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
            faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
            faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
            faceapi.nets.faceExpressionNet.loadFromUri('/models'),
        ]);
        console.log('Models loaded successfully');
    };

    const startVideo = () => {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then((currentStream) => {
                videoRef.current.srcObject = currentStream;
                setWebcamActive(true);
                startFaceDetection();
            })
            .catch((err) => {
                console.error(err);
                setWebcamActive(false);
            });
    };

    const stopVideo = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            let stream = videoRef.current.srcObject;
            stream.getTracks().forEach((track) => track.stop());
            videoRef.current.srcObject = null;
        }
        setWebcamActive(false);
        clearResources();
    };

    const clearResources = () => {
        if (canvasRef.current) {
            const context = canvasRef.current.getContext('2d');
            context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        }
        if (detectionInterval.current) {
            clearInterval(detectionInterval.current);
            detectionInterval.current = null;
        }
        if (countdownInterval.current) {
            clearInterval(countdownInterval.current);
            countdownInterval.current = null;
        }
        setCountdown(null);
        setFaceDetected(false);
    };

    const startFaceDetection = () => {
        if (detectionInterval.current) clearInterval(detectionInterval.current);

        detectionInterval.current = setInterval(async () => {
            if (videoRef.current && videoRef.current.videoWidth > 0 && videoRef.current.videoHeight > 0) {
                const detections = await faceapi.detectAllFaces(
                    videoRef.current,
                    new faceapi.TinyFaceDetectorOptions()
                );

                canvasRef.current.innerHTML = faceapi.createCanvasFromMedia(videoRef.current);
                faceapi.matchDimensions(canvasRef.current, { width: 940, height: 650 });

                const resized = faceapi.resizeResults(detections, { width: 940, height: 650 });
                faceapi.draw.drawDetections(canvasRef.current, resized);

                if (detections.length > 0 && !faceDetected) {
                    setFaceDetected(true);
                    startCountdown(); // Bắt đầu đếm ngược
                } else if (detections.length === 0) {
                    resetCountdown(); // Dừng đếm ngược nếu không phát hiện khuôn mặt
                }
            }
        }, 1000); // Kiểm tra khuôn mặt mỗi giây
    };

    const startCountdown = () => {
        if (countdownInterval.current || countdown !== null) return;

        let count = 2; // Đếm ngược 2 giây
        setCountdown(count);

        countdownInterval.current = setInterval(() => {
            count -= 1;
            setCountdown(count);

            if (count === 0) {
                clearInterval(countdownInterval.current);
                countdownInterval.current = null;
                setCountdown(null);
                captureAndSendImage(); // Chụp ảnh khi đếm ngược xong
            }
        }, 1000);
    };

    const resetCountdown = () => {
        if (countdownInterval.current) {
            clearInterval(countdownInterval.current);
            countdownInterval.current = null;
        }
        setCountdown(null);
    };

    const captureAndSendImage = () => {
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const context = canvas.getContext('2d');
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');

        fetch('http://localhost:3000/api/capture', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ image: dataUrl }),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log('Image saved:', data);
            })
            .catch((error) => {
                console.error('Error saving image:', error);
            });
    };

    return (
        <div className="container text-center mt-3">
            <h1 className="mb-0 mt-0">Điểm danh bằng khuôn mặt</h1>
            <div className="row justify-content-center mt-3">
                <div className="col-md-6">
                    <div className="video-container position-relative border rounded shadow">
                        <video
                            crossOrigin="anonymous"
                            ref={videoRef}
                            autoPlay
                            className="w-100 rounded"
                            style={{ maxHeight: '400px' }}
                        ></video>
                        <canvas
                            ref={canvasRef}
                            className="position-absolute top-0 start-0 w-100 h-100"
                        />
                    </div>
                </div>
            </div>
            <div className="mt-3">
                <button
                    className={`btn btn-lg ${webcamActive ? 'btn-danger' : 'btn-success'
                        }`}
                    onClick={webcamActive ? stopVideo : startVideo}
                >
                    {webcamActive ? 'Tắt Webcam' : 'Bật Webcam'}
                </button>
            </div>
            {countdown !== null && (
                <div className="mt-2">
                    <h3>Chụp trong: {countdown} giây</h3>
                </div>
            )}
        </div>
    );
}

export default AttendanceRealtime;