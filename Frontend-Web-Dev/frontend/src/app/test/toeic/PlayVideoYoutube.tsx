"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  ListMusic,
  Play,
  Pause,
  Volume2,
  VolumeX,
  SkipBack,
  SkipForward,
  AlertCircle,
  X,
  Loader2,
  Dices,
} from "lucide-react";
import clsx from "clsx";

// Extend Window interface for YouTube API
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

const listLinkVideo = [
  "https://youtu.be/eNvUS-6PTbs?si=6rwPJYBEVGk7W28N",
  "https://youtu.be/T5aEFNnTB_4?si=MsJu8iGzGUO_cjrG",
  "https://youtu.be/-G4hzWOBEiI?si=xSkk3i2ShwQlw5_C",
  "https://youtu.be/VNRQghMtqAY?si=mTms5k_iVtbQ5f2a",
  "https://youtu.be/xESVaYvG4xE?si=TNLfckU_q7pt2EW8",
  "https://youtu.be/eNvUS-6PTbs?si=NUzA9eBJWqfqCHcL",
];

const PlayVideoYoutube = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<"up" | "down" | null>(
    null
  );

  // Player states
  const [videoUrl, setVideoUrl] = useState("");
  const [videoId, setVideoId] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [apiReady, setApiReady] = useState(false);

  const playerRef = useRef<any>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);

  // Extract video ID from YouTube URL
  const extractVideoId = (url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=)([^&\n?#]+)/,
      /(?:youtu\.be\/)([^&\n?#]+)/,
      /(?:youtube\.com\/embed\/)([^&\n?#]+)/,
      /(?:youtube\.com\/v\/)([^&\n?#]+)/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  // Format time to mm:ss
  // const formatTime = (seconds: number): string => {
  //   if (!seconds || isNaN(seconds)) return "0:00";
  //   const mins = Math.floor(seconds / 60);
  //   const secs = Math.floor(seconds % 60);
  //   return `${mins}:${secs.toString().padStart(2, "0")}`;
  // };

  // Load YouTube API
  const loadYouTubeAPI = useCallback(() => {
    // Check if API is already loaded
    if (window.YT && window.YT.Player) {
      setApiReady(true);
      return;
    }

    // Check if script is already loading
    const existingScript = document.querySelector(
      'script[src*="youtube.com/iframe_api"]'
    );
    if (existingScript) {
      // Script exists, set up callback and wait
      window.onYouTubeIframeAPIReady = () => {
        setApiReady(true);
      };

      // Check if API is loaded periodically
      const checkAPI = setInterval(() => {
        if (window.YT && window.YT.Player) {
          setApiReady(true);
          clearInterval(checkAPI);
        }
      }, 100);

      // Timeout after 10 seconds
      setTimeout(() => {
        clearInterval(checkAPI);
        if (!window.YT || !window.YT.Player) {
          setApiReady(true); // Allow trying anyway
        }
      }, 10000);

      return;
    }

    // Create and load script
    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    script.async = true;

    script.onload = () => {
      // Sometimes API is ready immediately after script load
      if (window.YT && window.YT.Player) {
        setApiReady(true);
      }
    };

    script.onerror = () => {
      console.error("Failed to load YouTube API");
      setApiReady(true); // Allow trying anyway
    };

    window.onYouTubeIframeAPIReady = () => {
      setApiReady(true);
    };

    document.head.appendChild(script);

    // Fallback timeout
    setTimeout(() => {
      if (!apiReady) {
        setApiReady(true);
      }
    }, 8000);
  }, [apiReady]);

  // Initialize API when component mounts
  useEffect(() => {
    loadYouTubeAPI();
  }, [loadYouTubeAPI]);

  // Handle scroll visibility
  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (Math.abs(currentScrollY - lastScrollY) < 100) {
        // Ignore small scrolls
        return;
      }
      if (currentScrollY > lastScrollY) {
        // Scrolling down
        setIsVisible(false);
        setScrollDirection("down");
      } else {
        // Scrolling up
        setIsVisible(true);
        setScrollDirection("up");
      }
      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Update player time
  useEffect(() => {
    if (isPlaying && playerRef.current) {
      intervalRef.current = setInterval(() => {
        try {
          if (
            playerRef.current &&
            typeof playerRef.current.getCurrentTime === "function"
          ) {
            const current = playerRef.current.getCurrentTime();
            const total = playerRef.current.getDuration();
            if (current !== undefined && total !== undefined) {
              setCurrentTime(current);
              setDuration(total);
            }
          }
        } catch (err) {
          console.log("Error updating time:", err);
        }
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (
        playerRef.current &&
        typeof playerRef.current.destroy === "function"
      ) {
        try {
          playerRef.current.destroy();
        } catch (err) {
          console.log("Error destroying player:", err);
        }
      }
    };
  }, []);

  // Hàm loadVideo được cập nhật để chấp nhận tham số autoplay
  const loadVideo = async (videoUrl: string, autoPlay: boolean = false) => {
    const id = extractVideoId(videoUrl);
    if (!id) {
      alert("URL YouTube không hợp lệ");
      setError("URL YouTube không hợp lệ");
      return;
    }

    setIsLoading(true);
    setError(null);
    setVideoId(id);
    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(false); // Đặt về false ban đầu, sẽ cập nhật trong onReady nếu autoplay

    // Destroy existing player
    if (playerRef.current) {
      try {
        playerRef.current.destroy();
      } catch (err) {
        console.log("Error destroying existing player:", err);
      }
      playerRef.current = null;
    }

    // Check if YouTube API is available
    if (!window.YT || !window.YT.Player) {
      setIsLoading(false);
      setError(
        "YouTube API không khả dụng. Vui lòng refresh trang và thử lại."
      );
      return;
    }

    try {
      const container = playerContainerRef.current;
      if (container) {
        const playerId = `Youtubeer-${Date.now()}`;
        container.innerHTML = `<div id="${playerId}"></div>`;

        playerRef.current = new window.YT.Player(playerId, {
          height: "1",
          width: "1",
          videoId: id,
          playerVars: {
            autoplay: autoPlay ? 1 : 0, // Sử dụng tham số autoPlay ở đây
            controls: 0,
            disablekb: 1,
            fs: 0,
            iv_load_policy: 3,
            modestbranding: 1,
            rel: 0,
            showinfo: 0,
            playsinline: 1,
            origin: window.location.origin,
          },
          events: {
            onReady: (event: any) => {
              setIsLoading(false);
              const player = event.target;
              try {
                player.setVolume(volume);
                player.setPlaybackRate(playbackRate);
                const videoDuration = player.getDuration();
                if (videoDuration && videoDuration > 0) {
                  setDuration(videoDuration);
                }
                if (autoPlay) {
                  player.playVideo(); // Đảm bảo tự động phát sau khi sẵn sàng
                  setIsPlaying(true);
                }
              } catch (err) {
                console.log("Error setting player properties or autoplay:", err);
              }
            },
            onStateChange: (event: any) => {
              try {
                const state = event.data;
                if (state === window.YT.PlayerState.PLAYING) {
                  setIsPlaying(true);
                } else if (
                  state === window.YT.PlayerState.PAUSED ||
                  state === window.YT.PlayerState.ENDED
                ) {
                  setIsPlaying(false);
                }
              } catch (err) {
                console.log("Error handling state change:", err);
              }
            },
            onError: (event: any) => {
              setIsLoading(false);
              setIsPlaying(false);
              const errorCode = event.data;
              let errorMessage = "Lỗi không xác định";

              switch (errorCode) {
                case 2:
                  errorMessage = "Video ID không hợp lệ";
                  break;
                case 5:
                  errorMessage = "Lỗi HTML5 player";
                  break;
                case 100:
                  errorMessage = "Video không tồn tại hoặc đã bị xóa";
                  break;
                case 101:
                case 150:
                  errorMessage =
                    "Chủ sở hữu video không cho phép phát trên trang web khác";
                  break;
                default:
                  errorMessage = `Lỗi phát video (Mã: ${errorCode})`;
              }
              setError(errorMessage);
            },
          },
        });
      }
    } catch (err) {
      setIsLoading(false);
      setError("Không thể tải video. Vui lòng thử lại.");
      console.error("Error creating player:", err);
    }
  };

  const togglePlay = () => {
    if (!playerRef.current) return;

    try {
      if (isPlaying) {
        playerRef.current.pauseVideo();
      } else {
        playerRef.current.playVideo();
      }
    } catch (err) {
      console.log("Error toggling play:", err);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
    if (playerRef.current) {
      try {
        playerRef.current.setVolume(newVolume);
        if (newVolume > 0 && isMuted) {
          setIsMuted(false);
        }
      } catch (err) {
        console.log("Error setting volume:", err);
      }
    }
  };

  const toggleMute = () => {
    if (!playerRef.current) return;

    try {
      if (isMuted) {
        playerRef.current.unMute();
        setIsMuted(false);
      } else {
        playerRef.current.mute();
        setIsMuted(true);
      }
    } catch (err) {
      console.log("Error toggling mute:", err);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = (parseFloat(e.target.value) / 100) * duration;
    setCurrentTime(newTime);
    if (playerRef.current && duration > 0) {
      try {
        playerRef.current.seekTo(newTime);
      } catch (err) {
        console.log("Error seeking:", err);
      }
    }
  };

  const handleSpeedChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRate = parseFloat(e.target.value);
    setPlaybackRate(newRate);
    if (playerRef.current) {
      try {
        playerRef.current.setPlaybackRate(newRate);
      } catch (err) {
        console.log("Error setting playback rate:", err);
      }
    }
  };

  const skipTime = (seconds: number) => {
    if (!playerRef.current || duration <= 0) return;

    try {
      const newTime = Math.max(0, Math.min(duration, currentTime + seconds));
      playerRef.current.seekTo(newTime);
      setCurrentTime(newTime);
    } catch (err) {
      console.log("Error skipping time:", err);
    }
  };

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

  const handleRandomVideo = () => {
    // 1. Chọn một video ngẫu nhiên từ listLinkVideo
    if (listLinkVideo.length === 0) {
      setError("Danh sách video trống.");
      return;
    }

    const randomIndex = Math.floor(Math.random() * listLinkVideo.length);
    const randomVideoLink = listLinkVideo[randomIndex];

    // 2. Tải video ngẫu nhiên và tự động phát
    setVideoUrl(randomVideoLink); // Cập nhật input với URL video ngẫu nhiên
    loadVideo(randomVideoLink, true); // Gọi loadVideo với autoPlay = true
  };

  return (
    <>
      {
        <>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={clsx(
              "fixed p-2 rounded-full bg-purple-600 hover:bg-purple-500 dark:bg-purple-700 dark:hover:bg-purple-600 shadow-lg shadow-purple-500/30 dark:shadow-purple-900/50 backdrop-blur-sm text-white transition-all duration-300 ease-in-out transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-purple-400 group z-40",
              "right-6 bottom-20",
              {
                //hidden: !isVisible,
                "opacity-20": scrollDirection === "down",
              }
            )}
          >
            <div className="flex justify-center items-center relative gap-2">
              <ListMusic
                size={18}
                className={clsx("group-hover:animate-bounce")}
              />
              {isPlaying && duration > 0 && (
                <span className="text-xs text-white">
                  {formatTime(currentTime)}
                </span>
              )}
            </div>
          </button>

          {
            <div
              className={clsx(
                "fixed right-6 bottom-32 w-80 bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 shadow-2xl rounded-xl p-4 z-50 border border-gray-200 dark:border-slate-700",
                "transition-all duration-300 transform",
                isOpen
                  ? "translate-y-0 opacity-100"
                  : "translate-y-full opacity-0",
                {
                  hidden: !isOpen,
                }
              )}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white drop-shadow">
                  YouTube Music Player
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white transition-colors p-1"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Bunton random music */}
              <div className="mb-4">
                <button
                  onClick={() => {
                    handleRandomVideo();
                  }}
                  className="px-4 py-2 w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium flex items-center gap-2"
                >
                  <Dices size={16} />
                  Ngẫu nhiên
                </button>
              </div>

              {/* URL Input */}
              <div className="mb-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Nhập link YouTube..."
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    className="flex-1 px-3 py-2 bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-white rounded-lg border border-gray-300 dark:border-slate-600 focus:border-purple-500 focus:outline-none text-sm placeholder-gray-500 dark:placeholder-gray-400"
                    onKeyDown={(e) =>
                      e.key === "Enter" && !isLoading && loadVideo(videoUrl)
                    }
                    disabled={isLoading}
                  />
                  <button
                    onClick={() => {
                      if (!videoUrl) {
                        setError("Vui lòng nhập URL YouTube");
                        return;
                      }
                      loadVideo(videoUrl);
                    }}
                    disabled={isLoading || !videoUrl}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors text-sm font-medium flex items-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        Đang tải...
                      </>
                    ) : (
                      "Tải"
                    )}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/50 border border-red-300 dark:border-red-700 rounded-lg flex items-center gap-2">
                  <AlertCircle
                    size={16}
                    className="text-red-500 dark:text-red-400 flex-shrink-0"
                  />
                  <span className="text-red-700 dark:text-red-200 text-sm">
                    {error}
                  </span>
                </div>
              )}

              {/* Player Controls */}
              {videoId && !error && (
                <div className="space-y-4">
                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={duration > 0 ? (currentTime / duration) * 100 : 0}
                      onChange={handleSeek}
                      className="w-full h-1 bg-gray-300 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${
                          duration > 0 ? (currentTime / duration) * 100 : 0
                        }%, ${
                          window.matchMedia &&
                          window.matchMedia("(prefers-color-scheme: dark)")
                            .matches
                            ? "#4b5563"
                            : "#d1d5db"
                        } ${
                          duration > 0 ? (currentTime / duration) * 100 : 0
                        }%, ${
                          window.matchMedia &&
                          window.matchMedia("(prefers-color-scheme: dark)")
                            .matches
                            ? "#4b5563"
                            : "#d1d5db"
                        } 100%)`,
                      }}
                      disabled={!duration || duration <= 0}
                    />
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                  </div>

                  {/* Main Controls */}
                  <div className="flex items-center justify-center gap-4">
                    <button
                      onClick={() => skipTime(-10)}
                      className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white transition-colors disabled:opacity-50"
                      disabled={!duration || duration <= 0}
                    >
                      <SkipBack size={20} />
                    </button>

                    <button
                      onClick={togglePlay}
                      className="p-3 bg-purple-600 hover:bg-purple-700 rounded-full text-white transition-colors disabled:opacity-50"
                      disabled={!duration || duration <= 0}
                    >
                      {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                    </button>

                    <button
                      onClick={() => skipTime(10)}
                      className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white transition-colors disabled:opacity-50"
                      disabled={!duration || duration <= 0}
                    >
                      <SkipForward size={20} />
                    </button>
                  </div>

                  {/* Volume Control */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={toggleMute}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white transition-colors"
                    >
                      {isMuted || volume === 0 ? (
                        <VolumeX size={18} />
                      ) : (
                        <Volume2 size={18} />
                      )}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={volume}
                      onChange={handleVolumeChange}
                      className="flex-1 h-1 bg-gray-300 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${volume}%, ${
                          window.matchMedia &&
                          window.matchMedia("(prefers-color-scheme: dark)")
                            .matches
                            ? "#4b5563"
                            : "#d1d5db"
                        } ${volume}%, ${
                          window.matchMedia &&
                          window.matchMedia("(prefers-color-scheme: dark)")
                            .matches
                            ? "#4b5563"
                            : "#d1d5db"
                        } 100%)`,
                      }}
                    />
                    <span className="text-xs text-gray-500 dark:text-gray-400 w-8">
                      {volume}%
                    </span>
                  </div>

                  {/* Speed Control */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Tốc độ:
                    </span>
                    <select
                      value={playbackRate}
                      onChange={handleSpeedChange}
                      className="bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-white rounded px-2 py-1 text-sm border border-gray-300 dark:border-slate-600 focus:border-purple-500 focus:outline-none"
                    >
                      <option value="0.25">0.25x</option>
                      <option value="0.5">0.5x</option>
                      <option value="0.75">0.75x</option>
                      <option value="1">1x</option>
                      <option value="1.25">1.25x</option>
                      <option value="1.5">1.5x</option>
                      <option value="1.75">1.75x</option>
                      <option value="2">2x</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Hidden YouTube Player Container */}
              <div
                ref={playerContainerRef}
                className="hidden"
                style={{ width: "1px", height: "1px", overflow: "hidden" }}
              />
            </div>
          }
        </>
      }
    </>
  );
};

export default PlayVideoYoutube;
export { PlayVideoYoutube };
