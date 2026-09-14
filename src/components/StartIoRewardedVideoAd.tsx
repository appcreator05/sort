import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  VolumeX,
  Star,
  Download,
  ExternalLink,
  Award,
  Sparkles,
  Play,
  CheckCircle2,
  AlertCircle,
  Film
} from 'lucide-react';
import { Movie, AdCreative } from '../types';
import { START_IO_ADS } from '../data/movies';

interface StartIoRewardedVideoAdProps {
  movie: Movie;
  onCloseAndPlay: () => void;
  skipCountdownSeconds?: number;
  onAdClick?: () => void;
  onAdImpression?: () => void;
  customAdUrl?: string;
}

export const StartIoRewardedVideoAd: React.FC<StartIoRewardedVideoAdProps> = ({
  movie,
  onCloseAndPlay,
  skipCountdownSeconds = 5,
  onAdClick,
  onAdImpression,
  customAdUrl
}) => {
  const [countdown, setCountdown] = useState(skipCountdownSeconds);
  const [isRewarded, setIsRewarded] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showSkipConfirm, setShowSkipConfirm] = useState(false);
  const [currentAdIndex] = useState(() => Math.floor(Math.random() * START_IO_ADS.length));

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const currentAd: AdCreative = START_IO_ADS[currentAdIndex];

  // Track ad impression on mount
  useEffect(() => {
    onAdImpression?.();
  }, []);

  // Countdown timer logic for Rewarded Video
  useEffect(() => {
    if (countdown <= 0) {
      setIsRewarded(true);
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setIsRewarded(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  // Attempt auto-play video
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay may be restricted on some devices until touch
      });
    }
  }, []);

  const handleCtaClick = () => {
    onAdClick?.();
    const targetUrl = customAdUrl?.trim() || currentAd.ctaUrl;
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  const handleCloseOrWatch = () => {
    if (!isRewarded && countdown > 0) {
      setShowSkipConfirm(true);
      return;
    }
    onCloseAndPlay();
  };

  const handleConfirmSkip = () => {
    setShowSkipConfirm(false);
    onCloseAndPlay();
  };

  const toggleSound = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Progress percentage (0 to 100%)
  const progressPercent = Math.min(100, Math.round(((skipCountdownSeconds - countdown) / skipCountdownSeconds) * 100));

  return (
    <div
      id="startio-rewarded-video-overlay"
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col justify-between overflow-y-auto animate-fadeIn select-none"
      role="dialog"
      aria-modal="true"
    >
      {/* Top Header Bar */}
      <div className="w-full bg-[#0d121c] border-b border-gray-800 px-3 sm:px-5 py-2.5 sm:py-3 flex items-center justify-between shadow-md">
        {/* Left: Start.io Rewarded Video Badge */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center font-black text-black text-xs shadow-md shadow-amber-500/20">
            <Award className="w-4 h-4 text-black stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-white font-extrabold text-xs tracking-wider">Start.io</span>
              <span className="bg-amber-500/20 text-amber-400 border border-amber-500/40 text-[9px] font-black tracking-wider px-2 py-0.5 rounded">
                REWARDED VIDEO AD
              </span>
            </div>
            <p className="text-[10px] text-gray-400">
              Watch to unlock HD Stream · {movie.title}
            </p>
          </div>
        </div>

        {/* Right Controls: Sound Toggle & Reward Countdown Badge */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={toggleSound}
            className="p-1.5 sm:p-2 rounded-lg bg-gray-800/90 hover:bg-gray-700 text-gray-300 hover:text-white transition-colors cursor-pointer"
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
          </button>

          {isRewarded ? (
            <button
              id="btn-claim-reward-play"
              onClick={handleCloseOrWatch}
              className="bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-black font-black text-xs px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg shadow-emerald-500/30 active:scale-95 transition-all cursor-pointer animate-pulse"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Watch Movie</span>
            </button>
          ) : (
            <div className="bg-black/70 border border-amber-500/50 text-amber-400 text-xs font-black px-3 py-1 rounded-full flex items-center gap-1.5 shadow">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span>Reward in {countdown}s</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Video Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-2 sm:p-4 max-w-3xl mx-auto w-full">
        {/* Reward Status Banner */}
        <div className="w-full mb-3 bg-[#111726] border border-amber-500/30 rounded-xl p-2.5 flex items-center justify-between gap-2 shadow-lg">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-lg">🎁</span>
            <div className="truncate">
              <span className="text-xs font-bold text-amber-300 block truncate">
                {isRewarded ? '🎉 Reward Unlocked: HD Stream Access Granted!' : `Reward Goal: Full HD Stream of "${movie.title}"`}
              </span>
              <span className="text-[10px] text-gray-400 block truncate">
                {isRewarded ? 'Click below to start instant movie playback' : 'Finish watching this short video to unlock 1080p Ultra HD streaming'}
              </span>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-amber-400 shrink-0">
            {progressPercent}%
          </span>
        </div>

        {/* Video Canvas / Player Container */}
        <div className="relative w-full aspect-video max-h-[50vh] rounded-2xl overflow-hidden bg-black border-2 border-amber-500/40 shadow-2xl group flex items-center justify-center">
          {currentAd.mediaVideo ? (
            <video
              ref={videoRef}
              src={currentAd.mediaVideo}
              poster={currentAd.mediaImage}
              playsInline
              muted={isMuted}
              autoPlay
              loop
              className="w-full h-full object-cover"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />
          ) : (
            <img
              src={currentAd.mediaImage}
              alt={currentAd.title}
              className="w-full h-full object-cover"
            />
          )}

          {/* Overlay Ad Watermark */}
          <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-sm border border-amber-500/50 text-amber-400 text-[10px] font-black px-2.5 py-0.5 rounded-md flex items-center gap-1 shadow-lg">
            <span>START.IO REWARDED VIDEO</span>
          </div>

          {/* Sound hint indicator */}
          {isMuted && (
            <button
              onClick={toggleSound}
              className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-sm border border-gray-700 text-gray-300 hover:text-white text-xs px-2.5 py-1 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <VolumeX className="w-3.5 h-3.5" />
              <span>Tap to unmute sound</span>
            </button>
          )}

          {/* Reward Finished Overlay when countdown hits 0 */}
          {isRewarded && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center animate-fadeIn">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-400 flex items-center justify-center mb-2 shadow-lg animate-bounce">
                <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
              </div>
              <h3 className="text-base sm:text-lg font-black text-white">
                Reward Granted!
              </h3>
              <p className="text-xs text-emerald-300 font-semibold max-w-sm mt-0.5">
                Full HD Access Unlocked for {movie.title}
              </p>
              <button
                id="btn-reward-start-movie-hero"
                onClick={handleCloseOrWatch}
                className="mt-3 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white font-extrabold text-xs sm:text-sm px-6 py-2.5 rounded-xl shadow-xl shadow-red-600/40 flex items-center gap-2 active:scale-95 transition-all cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>START WATCHING MOVIE NOW</span>
              </button>
            </div>
          )}

          {/* Video Progress Bar at bottom of player */}
          <div className="absolute inset-x-0 bottom-0 h-1.5 bg-black/60">
            <div
              className={`h-full transition-all duration-300 ${
                isRewarded ? 'bg-emerald-400' : 'bg-gradient-to-r from-amber-500 to-amber-300'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Advertiser App Info & CTA Card */}
        <div className="w-full mt-3 bg-[#0d121c] border border-gray-800 rounded-2xl p-3 sm:p-4 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <img
              src={currentAd.icon}
              alt={currentAd.title}
              className="w-12 h-12 rounded-xl object-cover border border-cyan-500/40 shrink-0 shadow-md"
            />
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="text-xs sm:text-sm font-bold text-white truncate">
                  {currentAd.title}
                </h4>
                <span className="text-[10px] text-amber-400 font-bold flex items-center gap-0.5 shrink-0">
                  <Star className="w-3 h-3 fill-amber-400" />
                  {currentAd.rating}
                </span>
              </div>
              <p className="text-[11px] text-gray-400 line-clamp-1 mt-0.5">
                {currentAd.description}
              </p>
              <div className="flex items-center gap-1.5 text-[10px] text-gray-400 mt-1">
                <span className="bg-gray-800 px-1.5 py-0.2 rounded text-cyan-300 font-semibold">
                  {currentAd.appCategory}
                </span>
                {currentAd.installs && <span>· {currentAd.installs} Downloads</span>}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-end">
            <button
              onClick={handleCtaClick}
              className="flex-1 sm:flex-initial bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>{currentAd.ctaText}</span>
            </button>

            {isRewarded ? (
              <button
                onClick={handleCloseOrWatch}
                className="bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md active:scale-95 flex items-center gap-1.5 cursor-pointer"
              >
                <Film className="w-3.5 h-3.5" />
                <span>Play Movie</span>
              </button>
            ) : (
              <button
                onClick={handleCloseOrWatch}
                className="bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white text-xs font-bold px-3 py-2.5 rounded-xl transition-colors cursor-pointer"
                title="Skip video ad"
              >
                Skip
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Dialog if user attempts to skip before reward is granted */}
      {showSkipConfirm && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#111724] border border-amber-500/60 rounded-2xl p-5 max-w-sm w-full text-center shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-3">
              <AlertCircle className="w-6 h-6 stroke-[2.5]" />
            </div>
            <h4 className="text-base font-bold text-white mb-1">
              Skip Rewarded Video?
            </h4>
            <p className="text-xs text-gray-300 mb-4 leading-relaxed">
              If you skip now, you will lose the full HD 1080p stream reward for <strong className="text-amber-300">"{movie.title}"</strong>. Only {countdown} seconds remaining!
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowSkipConfirm(false)}
                className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-xs py-2.5 rounded-xl transition-all shadow cursor-pointer"
              >
                Keep Watching ({countdown}s)
              </button>
              <button
                onClick={handleConfirmSkip}
                className="flex-1 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white font-bold text-xs py-2.5 rounded-xl transition-colors cursor-pointer"
              >
                Skip Anyway
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Footer Note */}
      <div className="py-2 text-center text-[10px] text-gray-500 bg-[#070a0f] border-t border-gray-900">
        Start.io Rewarded Video Network · App ID: 203877183 · Secure & Verified Ad Delivery
      </div>
    </div>
  );
};
