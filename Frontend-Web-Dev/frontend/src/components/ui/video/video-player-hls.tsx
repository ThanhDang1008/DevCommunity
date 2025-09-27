"use client";

import { useRef, useState, useEffect } from "react";
import Hls, { Level } from "hls.js"; // Import hls.js
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Expand,
  Shrink,
  FastForward,
  Rewind,
} from "lucide-react";

const formatTime = (time: number) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

type VideoPlayerProps = {
  src: string;
};

const VideoPlayer = (props: VideoPlayerProps) => {
  const { src } = props; // Lấy props resolutions
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isClient, setIsClient] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [progress, setProgress] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showControls, setShowControls] = useState(false);
  const [showPlayButton, setShowPlayButton] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentTimePrevious, setCurrentTimePrevious] = useState(0);
  //console.log("Current time:", currentTime);
  const [duration, setDuration] = useState(0);
  const [videoEnded, setVideoEnded] = useState(false);
  const [showVolumeControl, setShowVolumeControl] = useState(false);
  const [selectedResolution, setSelectedResolution] = useState<string | null>(
    null
  ); // State quản lý độ phân giải được chọn

  const [availableResolutions, setAvailableResolutions] = useState<Level[]>([]);

  const [hideControlsTimeout, setHideControlsTimeout] =
    useState<NodeJS.Timeout | null>(null);
  const [videoError, setVideoError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !videoRef.current) return;
    const video = videoRef.current;

    let hls: Hls | null = null;

    const loadVideoSource = (videoSrc: string) => {
      // Reset video error khi tải video mới
      setIsLoading(true);
      setVideoError(false);
      //-------------------------------

      if (
        Hls.isSupported() &&
        videoSrc.startsWith("http") &&
        (videoSrc.endsWith(".m3u8") || videoSrc.includes("m3u8"))
      ) {
        hls = new Hls();
        hls.loadSource(videoSrc);
        hls.attachMedia(video);

        hls.on(Hls.Events.MANIFEST_PARSED, function () {
          if (hls && hls.levels.length > 1) {
            console.log("HLS levels:", hls.levels);
            setAvailableResolutions(hls.levels); // Lấy danh sách độ phân giải
          }

          if (videoRef.current && currentTimePrevious > 0) {
            videoRef.current.currentTime = currentTimePrevious; // Set lại thời gian trước khi chuyển độ phân giải
            videoRef.current.play(); // Tự động play video khi chuyển độ phân giải
          }
        });
        hls.on(Hls.Events.ERROR, function (event, data) {
          console.error("HLS error:", event, data);
          setIsLoading(false);
          setVideoError(true); // Hiển thị lỗi video
          if (hls) {
            hls.destroy();
          }
        });
      } else if (videoSrc) {
        video.src = videoSrc;
        setIsLoading(false); // Tắt loading khi không phải HLS
        video.onerror = () => {
          setIsLoading(false);
          setVideoError(true); // Hiển thị lỗi video
        };
      } else {
        setIsLoading(false);
        setVideoError(true); // Hiển thị lỗi video nếu src không hợp lệ
      }
    };

    console.log("Selected resolution:", selectedResolution);
    // Load video source ban đầu khi component mount hoặc khi src prop thay đổi
    loadVideoSource(selectedResolution ? selectedResolution : src);

    // const updateProgress = () => {
    //   setCurrentTime(video.currentTime);
    //   setProgress((video.currentTime / video.duration) * 100);
    //   if (video.currentTime > 0) setShowPlayButton(false);
    // };
    const updateProgress = () => {
      console.log("updateProgress");
      setCurrentTime(video.currentTime);
      // Kiểm tra duration trước khi tính toán progress
      const videoDuration = video.duration;
      // setProgress((video.currentTime / videoDuration) * 100);
      if (!isNaN(videoDuration)) {
        setProgress((video.currentTime / videoDuration) * 100);
      }
      if (video.currentTime > 0) setShowPlayButton(false); //button đầu giữa video
    };

    const handleWaiting = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);
    const setVideoDuration = () => setDuration(video.duration);

    video.addEventListener("timeupdate", updateProgress);
    video.addEventListener("loadedmetadata", setVideoDuration);
    video.addEventListener("waiting", handleWaiting);
    video.addEventListener("canplay", handleCanPlay);

    return () => {
      video.removeEventListener("timeupdate", updateProgress);
      video.removeEventListener("loadedmetadata", setVideoDuration);
      video.removeEventListener("waiting", handleWaiting);
      video.removeEventListener("canplay", handleCanPlay);
      if (hls) {
        hls.destroy(); // Destroy HLS instance khi component unmount
      }
      video.onerror = null; // Xóa handler lỗi để tránh memory leak
    };
  }, [isClient, src, selectedResolution]); // Thêm selectedResolution vào dependencies

  useEffect(() => {
    if ((duration > 0 && currentTime === duration) || currentTime > duration) {
      setPlaying(false);
      setVideoEnded(true);
    } else {
      setVideoEnded(false);
    }
  }, [currentTime, duration]);

  const togglePlay = () => {
    if (!isClient || !videoRef.current) return;
    const video = videoRef.current;

    if (videoEnded) {
      video.currentTime = 0;
      setVideoEnded(false);
    }

    if (video.paused) {
      video.play();
      setPlaying(true);
      setShowPlayButton(false);
    } else {
      video.pause();
      setPlaying(false);
    }
  };

  const changeVolume = (value: number) => {
    if (!isClient || !videoRef.current) return;
    videoRef.current.volume = value;
    setVolume(value);
  };

  const seek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isClient || !videoRef.current) return;
    const video = videoRef.current;
    video.currentTime = (parseFloat(e.target.value) / 100) * video.duration;
    setProgress(parseFloat(e.target.value));
  };

  const skipTime = (seconds: number) => {
    if (!isClient || !videoRef.current) return;
    videoRef.current.currentTime += seconds;
  };

  const changePlaybackRate = (rate: number) => {
    if (!isClient || !videoRef.current) return;
    videoRef.current.playbackRate = rate;
    setPlaybackRate(rate);
  };

  const toggleFullscreen = () => {
    if (!isClient || !videoRef.current?.parentElement) return;
    const videoContainer = videoRef.current.parentElement;
    if (!document.fullscreenElement) {
      videoContainer.requestFullscreen();
      setFullscreen(true);
    } else {
      document.exitFullscreen();
      setFullscreen(false);
    }
  };

  const resetHideControlsTimer = () => {
    if (hideControlsTimeout) clearTimeout(hideControlsTimeout);
    setShowControls(true);

    if (fullscreen) {
      const timeout = setTimeout(() => {
        setShowControls(false);
      }, 3000);
      setHideControlsTimeout(timeout);
    }
  };

  useEffect(() => {
    if (!fullscreen) {
      setShowControls(true);
      if (hideControlsTimeout) clearTimeout(hideControlsTimeout);
    }
  }, [fullscreen]);

  const showControlsTemporarily = () => {
    setShowControls(true);
  };

  if (!isClient) {
    return <></>;
  }

  const handleResolutionChange = (url: string) => {
    console.log("Selected resolution:", url);
    setCurrentTimePrevious(currentTime); // Lưu lại thời gian trước khi chuyển độ phân giải
    setSelectedResolution(url); // Cập nhật state độ phân giải được chọn, useEffect hook sẽ load lại video
    setShowControls(true); // Hiển thị lại controls khi đổi độ phân giải (tùy chỉnh nếu muốn)
  };

  return (
    <div
      className="relative w-full max-w-2xl mx-auto bg-black rounded-lg overflow-hidden shadow-lg"
      onMouseEnter={() => setShowControls(true)}
      onMouseMove={resetHideControlsTimer}
      onMouseLeave={() => setShowControls(false)}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {videoError ? (
        <div className="w-full h-[250px] flex flex-col items-center justify-center bg-black text-white">
          <p className="text-lg">Không thể tải video</p>
          <button
            onClick={() => {
              //setSelectedResolution(src)
              //tải lại trang
              window.location.reload();
            }} // Thử tải lại với src gốc
            className="mt-2 px-4 py-2 bg-red-500 rounded-lg hover:bg-red-600 transition"
          >
            Tải lại
          </button>
        </div>
      ) : (
        <video
          ref={videoRef}
          className="w-full h-auto max-h-screen object-contain aspect-[9/16] cursor-pointer"
          onClick={togglePlay}
        />
      )}

      {(!videoError && showPlayButton) || videoEnded ? (
        <button
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg transition-opacity duration-300"
        >
          {videoEnded ? (
            <RotateCcw
              size={64}
              className="text-white opacity-80 hover:opacity-100 transition"
            />
          ) : (
            <Play
              size={64}
              className="text-white opacity-80 hover:opacity-100 transition"
            />
          )}
        </button>
      ) : null}

      {/* Controls */}
      {!videoError && (
        <div
          className={`absolute bottom-0 left-0 w-full bg-black/30 transition-opacity duration-300 ${
            showControls ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Hiển thị thời gian */}
          <div className="flex items-center justify-between pt-2">
            <span className="text-white text-sm w-16 text-center">
              {formatTime(currentTime || currentTimePrevious)}
            </span>

            <span className="text-white text-sm w-16 text-center">
              {formatTime(duration)}
            </span>
          </div>

          <input
            type="range"
            value={progress}
            onChange={seek}
            className="w-full h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-blue-500"
            style={{
              background: `linear-gradient(to right, #3b82f6 ${progress}%, #d1d5db ${progress}%)`,
            }}
          />

          <div className="px-2 pb-2 flex justify-between gap-2 items-center">
            {/* Play/Pause */}
            <button onClick={togglePlay} className="text-white">
              {videoEnded ? (
                <RotateCcw size={24} />
              ) : playing ? (
                <Pause size={24} />
              ) : (
                <Play size={24} />
              )}
            </button>

            {/* Rewind -5s */}
            <button onClick={() => skipTime(-5)} className="text-white">
              <Rewind size={24} />
            </button>

            {/* Forward +5s */}
            <button onClick={() => skipTime(5)} className="text-white">
              <FastForward size={24} />
            </button>

            {/* Volume Control */}
            <div
              className="relative"
              onClick={() => setShowVolumeControl(!showVolumeControl)}
              onDoubleClick={() => changeVolume(volume > 0 ? 0 : 0.2)}
            >
              <button className="text-white">
                {volume > 0 ? <Volume2 size={24} /> : <VolumeX size={24} />}
              </button>
              {showVolumeControl && (
                <div className="absolute -top-24 left-1/2 -translate-x-1/2 p-2 rounded-lg">
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={(e) => changeVolume(parseFloat(e.target.value))}
                    className="w-24 rotate-[-90deg] bg-gray-300 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    style={{
                      background: `linear-gradient(to right,rgb(121, 159, 221) ${
                        volume * 100
                      }%, #d1d5db ${volume * 100}%)`,
                    }}
                  />
                </div>
              )}
            </div>

            {/* Resolution selection */}

            <select
              className="bg-black text-white border border-gray-500 rounded-md px-2 py-1"
              onChange={(e) => handleResolutionChange(e.target.value)}
            >
              <option value={src}>Tự động (Default)</option>
              {availableResolutions?.map((level, index) => (
                <option key={index} value={level?.url}>
                  {level?.name || level?.height + "p"}
                </option>
              ))}
            </select>

            {/* Fullscreen */}
            <button onClick={toggleFullscreen} className="text-white">
              {fullscreen ? <Shrink size={24} /> : <Expand size={24} />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
