import React, { useEffect, useState } from 'react'; 
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import videoBack from '../../../public/video_back.mp4';

const LandingPage = () => {
  const navigate = useNavigate();
  const [showButton, setShowButton] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowButton(true), 500); // Delay to show button
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Background video */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover"
        src={videoBack}
        autoPlay
        loop
        muted
        playsInline
        onLoadedData={() => setVideoLoaded(true)} // Detect when video is ready
      />

      {/* Dark overlay appears only after video is loaded */}
      {videoLoaded && (
        <div className="absolute inset-0 bg-black bg-opacity-60 z-10" />
      )}

      {/* Foreground Content */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full text-white px-6 text-center">
        {showButton && (
          <motion.button
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 60 }}
            onClick={() => navigate('/login')}
            className="bg-white text-black px-6 py-3 text-xl font-semibold hover:text-white hover:bg-green-400 hover:border-white shadow-lg hover:bg-gray-100 transition"
          >
            Let’s Get Started
          </motion.button>
        )}

        {/* Paragraph overview */}
        {showButton && (
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 max-w-2xl text-lg text-gray-200"
          >
            <p>
              Welcome to <strong>Textbook Trader</strong> – your one-stop platform for exchanging, buying, or selling educational materials across campuses. Whether you're looking to declutter your shelf or find that one missing book at an affordable price, we connect students seamlessly.
            </p>
            <p className="mt-4">
              Enjoy fast deliveries, reliable communication, and a growing student marketplace powered by technology. Join us today and be part of the future of learning and trading.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default LandingPage;
