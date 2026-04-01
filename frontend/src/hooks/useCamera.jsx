import { useEffect, useState, useRef } from "react";

export const useCamera = () => {
    const [stream, setStream] = useState(null);
    const streamRef = useRef(null);

    useEffect(() => {
        const startCamera = async () => {
            try {
                const media = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: {
                        echoCancellation: true,
                        noiseSuppression: true,
                        autoGainControl: true,
                    }
                });
                streamRef.current = media;
                setStream(media);
            } catch (error) {
                console.log('Camera error:', error);
            }
        };
        startCamera();

        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach((track) => track.stop());
                streamRef.current = null;
            }
        };
    }, []);

    return stream;
};