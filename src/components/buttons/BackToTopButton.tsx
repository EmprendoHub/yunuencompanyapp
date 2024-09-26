'use client';
import React from 'react';
import { useEffect, useState } from 'react';
import { FaArrowCircleUp } from 'react-icons/fa';

const BackToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 100) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    });
  }, []);

  const goTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      onClick={() => goTop()}
      className="btn-scrollTop bg-black fixed bottom-7 text-x2l z-[20] cursor-pointer right-6 bg-none rounded-full p-2 border-none opacity-90"
      style={{ display: isVisible ? 'block' : 'none' }}
    >
      <FaArrowCircleUp className="text-xl text-white" />
    </button>
  );
};

export default BackToTopButton;
