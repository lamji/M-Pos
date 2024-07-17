import { Html5QrcodeScanner } from 'html5-qrcode';
import { useEffect, useRef } from 'react';

const qrcodeRegionId = 'html5qr-code-full-region';

// Creates the configuration object for Html5QrcodeScanner.
const createConfig = (props) => {
  let config = {};
  if (props.fps) {
    config.fps = props.fps;
  }
  if (props.qrbox) {
    config.qrbox = props.qrbox;
  }
  if (props.aspectRatio) {
    config.aspectRatio = props.aspectRatio;
  }
  if (props.disableFlip !== undefined) {
    config.disableFlip = props.disableFlip;
  }
  return config;
};

const Html5QrcodePlugin = (props) => {
  const scannerRef = useRef(null);

  useEffect(() => {
    const config = createConfig(props);
    const verbose = props.verbose === false;

    if (!props.qrCodeSuccessCallback) {
      throw 'qrCodeSuccessCallback is required callback.';
    }

    const html5QrcodeScanner = new Html5QrcodeScanner(qrcodeRegionId, config, verbose);
    scannerRef.current = html5QrcodeScanner;

    html5QrcodeScanner.render(props.qrCodeSuccessCallback, props.qrCodeErrorCallback);

    // Cleanup function when the component unmounts or props change
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch((error) => {
          console.error('Failed to clear html5QrcodeScanner. ', error);
        });
      }
    };
  }, [props]);

  useEffect(() => {
    if (scannerRef.current) {
      if (props.stopScanning) {
        scannerRef.current.clear().catch((error) => {
          console.error('Failed to clear html5QrcodeScanner. ', error);
        });
      }
    }
  }, [props.stopScanning]);

  return <div id={qrcodeRegionId} />;
};

export default Html5QrcodePlugin;
