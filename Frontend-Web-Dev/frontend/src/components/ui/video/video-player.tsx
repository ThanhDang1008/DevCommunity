"use client";

import { useRef, useState, useEffect, CSSProperties, use } from "react";
import clsx from "clsx";

const formatTime = (time: number) => {
  if (isNaN(time) || time < 0) return "00:00";
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = Math.floor(time % 60);
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

type VideoPlayerProps = {
  src: string;
  style?: CSSProperties;
};

const SettingsMenu = (props: {
  showSettings: boolean;
  setShowSettings: (show: boolean) => void;
  playbackRate: number;
  changePlaybackRate: (rate: number) => void;
}) => {
  const settingsMenuRef = useRef<HTMLDivElement>(null);

  const speedOptions = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
  const qualityOptions = ["Auto", "1080p", "720p", "480p", "360p"];
  const subtitleOptions = ["Tắt", "Tiếng Việt", "English"];

  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const [selectedQuality, setSelectedQuality] = useState("Auto");
  const [selectedSubtitle, setSelectedSubtitle] = useState("Tắt");

  const handleSubmenuClick = (submenu: string) => {
    setActiveSubmenu(activeSubmenu === submenu ? null : submenu);
  };

  const handleBackToMain = () => {
    setActiveSubmenu(null);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        settingsMenuRef.current &&
        !settingsMenuRef.current.contains(event.target as Node) &&
        !(event.target as HTMLElement).closest("[data-setting-button]") //lưu ý
      ) {
        props.setShowSettings(false);
      }
    };

    if (props.showSettings) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [props.showSettings]);

  return (
    <>
      {/* Settings Dropdown */}
      <div className="relative" ref={settingsMenuRef}>
        <div
          className={clsx(
            "absolute -right-20 bottom-7 mb-2 bg-zinc-800 backdrop-blur-sm rounded-lg shadow-xl min-w-[280px] transition-all duration-200 ease-in-out overflow-hidden",
            props.showSettings
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 translate-y-2 pointer-events-none"
          )}
        >
          {/* Main Menu */}
          <div
            className={clsx(
              "transition-transform duration-300 ease-in-out",
              activeSubmenu ? "-translate-x-full" : "translate-x-0"
            )}
          >
            <div className="p-3 border-b border-gray-600 overflow-y-auto max-h-[200px]">
              <div className="text-white text-base font-medium mb-3">
                Cài đặt
              </div>

              {/* Speed Option */}
              <button
                onClick={() => handleSubmenuClick("speed")}
                className="w-full flex items-center justify-between p-2 text-sm text-gray-300 hover:bg-gray-700 rounded transition-colors"
              >
                <div className="flex items-center gap-3">
                  <i className="bi bi-speedometer2 text-blue-400"></i>
                  <span>Tốc độ phát</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">
                    {props.playbackRate}x
                  </span>
                  <i className="bi bi-chevron-right text-gray-400"></i>
                </div>
              </button>

              {/* Quality Option */}
              <button
                onClick={() => handleSubmenuClick("quality")}
                className="w-full flex items-center justify-between p-2 text-sm text-gray-300 hover:bg-gray-700 rounded transition-colors"
              >
                <div className="flex items-center gap-3">
                  <i className="bi bi-display text-green-400"></i>
                  <span>Chất lượng</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">
                    {selectedQuality}
                  </span>
                  <i className="bi bi-chevron-right text-gray-400"></i>
                </div>
              </button>

              {/* Subtitle Option */}
              <button
                onClick={() => handleSubmenuClick("subtitle")}
                className="w-full flex items-center justify-between p-2 text-sm text-gray-300 hover:bg-gray-700 rounded transition-colors"
              >
                <div className="flex items-center gap-3">
                  <i className="bi bi-chat-square-text text-yellow-400"></i>
                  <span>Phụ đề</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">
                    {selectedSubtitle}
                  </span>
                  <i className="bi bi-chevron-right text-gray-400"></i>
                </div>
              </button>

              {/* About */}
              <button className="w-full flex items-center justify-center p-1 text-xs text-gray-300 rounded transition-colors">
                <div className="flex items-center gap-1">
                  <i className="bi bi-info-circle text-blue-400"></i>
                  <span className="text-gray-300 hover:text-white">
                    Thiết kế bởi devlogik.minwandev.io.vn
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* Submenu - Speed */}
          <div
            className={clsx(
              "absolute top-0 left-0 w-full bg-zinc-800 transition-transform duration-300 ease-in-out",
              activeSubmenu === "speed" ? "translate-x-0" : "translate-x-full"
            )}
          >
            <div className="p-3">
              <button
                onClick={handleBackToMain}
                className="flex items-center gap-2 mb-3 text-gray-300 hover:text-white text-sm"
              >
                <i className="bi bi-arrow-left"></i>
                <span>Tốc độ phát</span>
              </button>

              <div className="space-y-1 overflow-y-auto max-h-[140px]">
                {speedOptions.map((speed) => (
                  <button
                    key={speed}
                    onClick={() => {
                      props.changePlaybackRate(speed);
                      props.setShowSettings(false);
                      setActiveSubmenu(null);
                    }}
                    className={clsx(
                      "w-full text-left px-3 py-2 text-sm rounded transition-colors flex items-center justify-between",
                      props.playbackRate === speed
                        ? "bg-blue-500 text-white"
                        : "text-gray-300 hover:bg-gray-700"
                    )}
                  >
                    <span>{speed}x</span>
                    {props.playbackRate === speed && (
                      <i className="bi bi-check2 text-lg"></i>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Submenu - Quality */}
          <div
            className={clsx(
              "absolute top-0 left-0 w-full bg-zinc-800 transition-transform duration-300 ease-in-out",
              activeSubmenu === "quality" ? "translate-x-0" : "translate-x-full"
            )}
          >
            <div className="p-3">
              <button
                onClick={handleBackToMain}
                className="flex items-center gap-2 mb-3 text-gray-300 hover:text-white text-sm"
              >
                <i className="bi bi-arrow-left"></i>
                <span>Chất lượng</span>
              </button>

              <div className="space-y-1 overflow-y-auto max-h-[140px]">
                {qualityOptions.map((quality) => (
                  <button
                    key={quality}
                    onClick={() => {
                      setSelectedQuality(quality);
                      props.setShowSettings(false);
                      setActiveSubmenu(null);
                    }}
                    className={clsx(
                      "w-full text-left px-3 py-2 text-sm rounded transition-colors flex items-center justify-between",
                      selectedQuality === quality
                        ? "bg-green-500 text-white"
                        : "text-gray-300 hover:bg-gray-700"
                    )}
                  >
                    <span>{quality}</span>
                    {selectedQuality === quality && (
                      <i className="bi bi-check2 text-lg"></i>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Submenu - Subtitle */}
          <div
            className={clsx(
              "absolute top-0 left-0 w-full bg-zinc-800 transition-transform duration-300 ease-in-out",
              activeSubmenu === "subtitle"
                ? "translate-x-0"
                : "translate-x-full"
            )}
          >
            <div className="p-3">
              <button
                onClick={handleBackToMain}
                className="flex items-center gap-2 mb-3 text-gray-300 hover:text-white text-sm"
              >
                <i className="bi bi-arrow-left"></i>
                <span>Phụ đề</span>
              </button>

              <div className="space-y-1 overflow-y-auto max-h-[140px]">
                {subtitleOptions.map((subtitle) => (
                  <button
                    key={subtitle}
                    onClick={() => {
                      setSelectedSubtitle(subtitle);
                      props.setShowSettings(false);
                      setActiveSubmenu(null);
                    }}
                    className={clsx(
                      "w-full text-left px-3 py-2 text-sm rounded transition-colors flex items-center justify-between",
                      selectedSubtitle === subtitle
                        ? "bg-yellow-500 text-black font-medium"
                        : "text-gray-300 hover:bg-gray-700"
                    )}
                  >
                    <span>{subtitle}</span>
                    {selectedSubtitle === subtitle && (
                      <i className="bi bi-check2 text-lg"></i>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export const VideoPlayer = (props: VideoPlayerProps) => {
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
  const [duration, setDuration] = useState(0);
  const [videoEnded, setVideoEnded] = useState(false);

  const [showVolumeControl, setShowVolumeControl] = useState(false);

  const [showSettings, setShowSettings] = useState(false);

  const [isPictureInPicture, setIsPictureInPicture] = useState(false);

  const progressBarRef = useRef<HTMLInputElement>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [hoverTime, setHoverTime] = useState(0); // Thời gian đang hover
  const [tooltipLeft, setTooltipLeft] = useState(0); // Vị trí ngang của tooltip

  const [hideControlsTimeout, setHideControlsTimeout] =
    useState<NodeJS.Timeout | null>(null);
  const [videoError, setVideoError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Kiểm tra nếu đang chạy trên client
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !videoRef.current) return;
    const video = videoRef.current;

    const updateProgress = () => {
      setCurrentTime(video.currentTime);
      setProgress((video.currentTime / video.duration) * 100);
      if (video.currentTime > 0) setShowPlayButton(false);
    };

    const handleWaiting = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);
    const setVideoDuration = () => setDuration(video.duration);
    // const handleVideoEnd = () => {
    //   setPlaying(false);
    //   setVideoEnded(true);
    // };
    const handleEnterPictureInPicture = () => {
      setIsPictureInPicture(true);
    };

    const handleLeavePictureInPicture = () => {
      setIsPictureInPicture(false);
    };

    video.addEventListener("timeupdate", updateProgress);
    video.addEventListener("loadedmetadata", setVideoDuration);
    video.addEventListener("waiting", handleWaiting);
    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener(
      "enterpictureinpicture",
      handleEnterPictureInPicture
    );
    video.addEventListener(
      "leavepictureinpicture",
      handleLeavePictureInPicture
    );
    //video.addEventListener("ended", handleVideoEnd);

    return () => {
      video.removeEventListener("timeupdate", updateProgress);
      video.removeEventListener("loadedmetadata", setVideoDuration);
      video.removeEventListener("waiting", handleWaiting);
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener(
        "enterpictureinpicture",
        handleEnterPictureInPicture
      );
      video.removeEventListener(
        "leavepictureinpicture",
        handleLeavePictureInPicture
      );
      //video.removeEventListener("ended", handleVideoEnd);
    };
  }, [isClient]);

  useEffect(() => {
    if ((duration > 0 && currentTime === duration) || currentTime > duration) {
      setPlaying(false);
      setVideoEnded(true);
    } else {
      setVideoEnded(false);
    }
    // console.log("duration", duration);
    // console.log("currentTime", currentTime);
  }, [currentTime]);

  //khi nhấn giữa video thì play/pause
  const togglePlay = () => {
    if (!isClient || !videoRef.current) return;
    const video = videoRef.current;

    //nếu video đã kết thúc thì quay lại đầu video
    if (videoEnded) {
      video.currentTime = 0;
      setVideoEnded(false);
    }

    //nếu video đang pause thì play
    if (video.paused) {
      video.play();
      setPlaying(true);
      setShowPlayButton(false);
    } else {
      //nếu video đang play thì pause
      video.pause();
      setPlaying(false);
    }
  };

  //chỉnh âm lượng video
  const changeVolume = (value: number) => {
    if (!isClient || !videoRef.current) return;
    videoRef.current.volume = value;
    setVolume(value);
  };

  //chỉnh thanh tiến độ video
  const seek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isClient || !videoRef.current) return;
    const video = videoRef.current;
    video.currentTime = (parseFloat(e.target.value) / 100) * video.duration;
    setProgress(parseFloat(e.target.value));
  };

  //tua video
  const skipTime = (seconds: number) => {
    if (!isClient || !videoRef.current) return;
    videoRef.current.currentTime += seconds;
  };

  //chỉnh tốc độ phát
  const changePlaybackRate = (rate: number) => {
    if (!isClient || !videoRef.current) return;
    videoRef.current.playbackRate = rate;
    setPlaybackRate(rate);
  };

  //--------------------- fullscreen ---------------------

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
    // Nếu đang fullscreen thì không ẩn controls khi move chuột
    if (hideControlsTimeout) clearTimeout(hideControlsTimeout);
    setShowControls(true);

    //nếu đang fullscreen thì ẩn control sau 3s không move chuột
    if (fullscreen) {
      const timeout = setTimeout(() => {
        setShowControls(false);
      }, 3000);
      // Lưu timeout để clear sau
      setHideControlsTimeout(timeout);
    }
  };

  useEffect(() => {
    if (!fullscreen) {
      setShowControls(true); // Luôn hiển thị control khi không fullscreen
      // Xóa timeout khi thoát fullscreen
      if (hideControlsTimeout) clearTimeout(hideControlsTimeout);
    }
  }, [fullscreen]);

  //------------------------------------------

  const showControlsTemporarily = () => {
    setShowControls(true);
    //setTimeout(() => setShowControls(false), 2000);
  };

  const handleVolumeMouseEnter = () => {
    setShowVolumeControl(true);
  };

  const handleVolumeMouseLeave = () => {
    setShowVolumeControl(false);
  };

  // Chế độ Picture-in-Picture
  const togglePictureInPicture = async () => {
    if (!isClient || !videoRef.current) return;

    try {
      if (isPictureInPicture) {
        await document.exitPictureInPicture();
        setIsPictureInPicture(false);
      } else {
        await videoRef.current.requestPictureInPicture();
        setIsPictureInPicture(true);
      }
    } catch (error) {
      console.log("Picture-in-Picture not supported or failed:", error);
    }
  };

  //-------------------------------------------
  // Hàm xử lý khi di chuyển chuột trên thanh tiến độ
  const handleMouseMoveOnProgress = (e: React.MouseEvent<HTMLInputElement>) => {
    if (!progressBarRef.current || duration === 0) return;

    const rect = progressBarRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left; // Vị trí chuột so với bên trái của thanh progress bar
    const percentage = Math.max(0, Math.min(1, mouseX / rect.width));

    const time = percentage * duration;
    setHoverTime(time);

    // --- LOGIC SỬA LỖI LỆCH TRÁI TẠI ĐÂY ---
    const tooltipWidth = 40; // Ước lượng chiều rộng của tooltip (ví dụ: "00:00" có thể là 40-50px)
    // Bạn nên kiểm tra kích thước thực tế của tooltip trong trình duyệt
    // hoặc đo lường kỹ hơn.
    let calculatedLeft = percentage * rect.width; // Vị trí mong muốn của tâm tooltip

    // Điều chỉnh vị trí `left` để tooltip không bị tràn ra ngoài thanh progress bar
    // Khi tooltip có `transform: translateX(-50%)`, điểm `left` chính là tâm của tooltip.
    // Do đó, chúng ta cần đảm bảo `left` không quá gần mép trái (bằng 0 + nửa chiều rộng tooltip)
    // và không quá gần mép phải (bằng chiều rộng thanh - nửa chiều rộng tooltip).
    const minLeft = tooltipWidth / 2;
    const maxLeft = rect.width - tooltipWidth / 2;

    // Áp dụng giới hạn cho calculatedLeft
    calculatedLeft = Math.max(minLeft, Math.min(maxLeft, calculatedLeft));

    setTooltipLeft(calculatedLeft);
    setShowTooltip(true);
    // ------------------------------------------
  };
  // Hàm xử lý khi chuột rời khỏi thanh tiến độ
  const handleMouseLeaveProgress = () => {
    // Không cần setShowTooltip(false) ở đây nữa
    setShowTooltip(false);
    setHoverTime(0); // Tùy chọn: Reset thời gian hover khi không hover
    setTooltipLeft(0); // Tùy chọn: Reset vị trí khi không hover
  };
  //-------------------------------------------

  //-------------------------------------------------------
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (hideControlsTimeout) {
      clearTimeout(hideControlsTimeout);
      setHideControlsTimeout(null);
    }
    const timeout = setTimeout(() => {
      if (!fullscreen) {
        setShowControls(false);
      }
    }, 1500); // Ẩn controls sau 1.5 giây không di chuyển chuột
    setHideControlsTimeout(timeout);
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    setShowControls(true);
  };
  //--------------------------------------------------------

  if (!isClient) {
    return <></>;
  }

  return (
    // mx-auto để căn giữa video player
    <div
      className="relative bg-black rounded-lg overflow-hidden shadow-lg"
      onMouseEnter={(e) => handleMouseEnter(e)}
      onMouseMove={resetHideControlsTimer}
      onMouseLeave={(e) => handleMouseMove(e)}
      style={{
        height: 300,
        maxWidth: 500,
        ...props.style,
      }}
    >
      {/* Loading */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {/* Video */}

      {videoError ? (
        <div className="w-full h-[250px] flex flex-col items-center justify-center bg-black text-white">
          <p className="text-lg">Không thể tải video</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-red-500 rounded-lg hover:bg-red-600 transition"
          >
            Tải lại
          </button>
        </div>
      ) : (
        <video
          ref={videoRef}
          className="absolute top-0 left-0 w-full h-full object-contain cursor-pointer"
          src={props.src}
          //onDoubleClick={toggleFullscreen}
          onClick={togglePlay}
          onError={() => {
            setVideoError(true);
            setPlaying(false);
          }}
        />
      )}
      {/* Nút Play hoặc Reload ở giữa video*/}
      {(!videoError && showPlayButton) || videoEnded ? (
        <button
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg transition-opacity duration-300"
        >
          {videoEnded ? (
            <i className="bi bi-arrow-counterclockwise text-6xl text-white opacity-80 hover:opacity-100 transition"></i>
          ) : (
            <i className="bi bi-play text-6xl text-white opacity-80 hover:opacity-100 transition"></i>
          )}
        </button>
      ) : null}

      {/* Custom range thumb styling using a class */}
      <style>{`
          .custom-range-video::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: #ff0101;
            border: 2px solid #fff;
            box-shadow: 0 2px 6px rgba(0,0,0,0.15);
            cursor: pointer;
            transition: background 0.2s;
          }
          .custom-range-video:hover::-webkit-slider-thumb {
            background: #d10000;
          }

         .custom-range-volume::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background: #ffd400;
            border: 2px solid #fff;
            box-shadow: 0 2px 6px rgba(0,0,0,0.15);
            cursor: pointer;
            transition: background 0.2s;
          }
          .custom-range-volume:hover::-webkit-slider-thumb {
            background: #d1a000;
          }
     
          /* Hide thumb for .hide-thumb */
          .hide-thumb::-webkit-slider-thumb {
            display: none;
          }
          .hide-thumb::-moz-range-thumb {
            display: none;
          }
          .hide-thumb::-ms-thumb {
            display: none;
          }
        `}</style>

      {!showControls && !fullscreen && (
        <div className="absolute bottom-[-5px] left-0 w-full z-10">
          <div className="relative w-full group">
            <input
              type="range"
              value={progress}
              onChange={seek}
              className="hide-thumb w-full h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-blue-500"
              style={{
                background: `linear-gradient(to right, #ff0101 ${progress}%, #d1d5db ${progress}%)`,
              }}
            />
          </div>
        </div>
      )}

      {/* Controls */}
      <div
        className={`absolute bottom-0 left-0 w-full bg-black/30 transition-opacity duration-300 ${
          showControls ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* Hiển thị thời gian */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-white text-sm w-16 text-center">
            {formatTime(currentTime)}
          </span>

          <span className="text-white text-sm w-16 text-center">
            {formatTime(duration)}
          </span>
        </div>

        {/* Thanh tiến độ và Tooltip */}
        <div className="relative w-full group">
          {/* Thêm lớp 'group' vào div này */}
          <input
            type="range"
            ref={progressBarRef}
            value={progress}
            onChange={seek}
            onMouseMove={handleMouseMoveOnProgress}
            onMouseLeave={handleMouseLeaveProgress}
            className="custom-range-video w-full h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-blue-500"
            style={{
              background: `linear-gradient(to right, #ff0101 ${progress}%, #d1d5db ${progress}%)`,
            }}
          />
          {/* Tooltip thời gian */}
          {showTooltip && (
            <div
              // Dùng group-hover:opacity-100 để hiển thị khi hover group
              className="absolute bottom-full px-2 py-1 bg-zinc-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-150"
              style={{
                left: tooltipLeft,
                transform: "translateX(-50%)", // Đảm bảo tooltip được căn giữa
              }}
            >
              {formatTime(hoverTime)}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between px-2 pb-1">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            {/* Play/Pause */}
            <button
              onClick={togglePlay}
              className="text-gray-300 hover:text-white"
            >
              {videoEnded ? (
                <i className="bi bi-arrow-counterclockwise text-lg sm:text-2xl"></i>
              ) : playing ? (
                <i className="bi bi-pause text-lg sm:text-2xl"></i>
              ) : (
                <i className="bi bi-play text-lg sm:text-2xl"></i>
              )}
            </button>

            {/* Rewind -5s */}
            <button
              onClick={() => skipTime(-5)}
              className="text-gray-300 hover:text-white"
            >
              {/* <Rewind size={24} /> */}
              <i className="bi bi-rewind-btn text-lg sm:text-2xl"></i>
            </button>

            {/* Forward +5s */}
            <button
              onClick={() => skipTime(5)}
              className="text-gray-300 hover:text-white"
            >
              {/* <FastForward size={24} /> */}
              <i className="bi bi-fast-forward-btn text-lg sm:text-2xl"></i>
            </button>

            {/* Volume Control */}
            <div
              className="relative"
              onClick={() => setShowVolumeControl(!showVolumeControl)}
              onDoubleClick={
                //tắt tiếng
                () => changeVolume(volume > 0 ? 0 : 0.5)
              }
            >
              <div
                className="relative flex items-center"
                onMouseEnter={handleVolumeMouseEnter}
                onMouseLeave={handleVolumeMouseLeave}
              >
                <button className="text-gray-300 hover:text-white transition-colors">
                  {0 < volume && volume <= 0.8 && (
                    <i className="bi bi-volume-down-fill text-lg sm:text-2xl"></i>
                  )}
                  {volume === 0 && (
                    <i className="bi bi-volume-mute-fill text-lg sm:text-2xl"></i>
                  )}
                  {volume > 0.8 && (
                    <i className="bi bi-volume-up-fill text-lg sm:text-2xl"></i>
                  )}
                </button>

                {/* Volume Slider */}
                <div
                  className={clsx(
                    "absolute left-full bottom-0 flex items-center gap-2 backdrop-blur-sm rounded-lg transition-all duration-200 ease-in-out",
                    showVolumeControl
                      ? "opacity-100 translate-x-0 pointer-events-auto"
                      : "opacity-0 -translate-x-2 pointer-events-none",
                    "px-3 py-[5px]"
                  )}
                >
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={(e) => changeVolume(parseFloat(e.target.value))}
                    className="custom-range-volume w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    style={{
                      background: `linear-gradient(to right, #ffd400 ${
                        volume * 100
                      }%, #4b5563 ${volume * 100}%)`,
                    }}
                  />
                  <span className="text-white text-sm font-medium min-w-[3ch] text-center">
                    {Math.round(volume * 100)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Settings */}
            <SettingsMenu
              showSettings={showSettings}
              setShowSettings={(show: boolean) => setShowSettings(show)}
              playbackRate={playbackRate}
              changePlaybackRate={(rate: number) => changePlaybackRate(rate)}
            />
            <button
              onClick={() => setShowSettings(!showSettings)}
              data-setting-button // Thêm thuộc tính này để kiểm tra click bên ngoài
              className="text-gray-300 hover:text-white transition-colors"
            >
              <i className="bi bi-gear-fill text-base sm:text-xl"></i>
            </button>
            {/* Picture in Picture */}
            <button
              onClick={togglePictureInPicture}
              className={clsx(
                "transition-colors",
                isPictureInPicture
                  ? "text-blue-400 hover:text-blue-300"
                  : "text-gray-300 hover:text-white"
              )}
              title="Trình phát thu nhỏ"
            >
              <i
                className={clsx(
                  "text-lg sm:text-xl",
                  isPictureInPicture ? "bi bi-pip-fill" : "bi bi-pip"
                )}
              ></i>
            </button>
            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="text-gray-300 hover:text-white transition-colors"
            >
              {fullscreen ? (
                <i className="bi bi-fullscreen-exit text-base sm:text-base"></i>
              ) : (
                <i className="bi bi-fullscreen text-base sm:text-base"></i>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
