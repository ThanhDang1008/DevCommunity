"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import { X, ArrowLeft, ArrowRight } from "lucide-react";


type ImageViewerProps = {
    images: string[];
}

export default function ImageViewer(props: ImageViewerProps) {

  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const handleOpen = (i: number) => {
    setIndex(i);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);
  const prev = () => setIndex((i) => (i > 0 ? i - 1 : props.images.length - 1));
  const next = () => setIndex((i) => (i + 1) % props.images.length);

  return (
    <>
      {/* Thumbnail List */}
      <div className="flex flex-wrap gap-2 p-4">
        {props.images.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`thumb-${i}`}
            className="w-32 h-20 object-cover cursor-pointer rounded"
            onClick={() => handleOpen(i)}
          />
        ))}
      </div>

      {/* Fullscreen Viewer */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-white hover:text-gray-300"
            >
              <X size={28} />
            </button>

            {/* Image Display */}
            <motion.img
              key={props.images[index]}
              src={props.images[index]}
              alt={`image-${index}`}
              className={clsx("max-w-full max-h-full object-contain rounded")}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            />

            {/* Navigation Arrows */}
            {props.images.length > 1 && (
              <>
                <button
                  onClick={prev}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300"
                  
                >
                  <ArrowLeft size={28} />
                </button>
                <button
                  onClick={next}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300"
                >
                  <ArrowRight size={28} />
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
