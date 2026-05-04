import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * Unified live-radio audio engine.
 *  - HLS (.m3u8) streams use hls.js (or native Safari HLS) on a plain <audio> element.
 *  - Direct MP3/AAC streams use Howler.js.
 *
 * Both libs are dynamically imported the first time they're needed — the
 * initial JS bundle ships without any audio code. ~80 kB gzip saved on cold load.
 */

// Module-level lazy loaders — promise is cached so we only fetch once.
let hlsPromise;
let howlerPromise;
const loadHls = () => (hlsPromise ||= import('hls.js').then((m) => m.default || m));
const loadHowler = () => (howlerPromise ||= import('howler').then((m) => m.Howl));

export default function useAudioEngine() {
  const audioElRef = useRef(null);
  const hlsRef = useRef(null);
  const howlRef = useRef(null);
  const currentRef = useRef(null);

  const [current, setCurrent] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [volume, setVolumeState] = useState(0.85);
  const [muted, setMuted] = useState(false);
  const [error, setError] = useState(null);

  if (!audioElRef.current && typeof Audio !== 'undefined') {
    const a = new Audio();
    a.preload = 'none';
    a.crossOrigin = 'anonymous';
    audioElRef.current = a;
  }

  const teardown = useCallback(() => {
    if (hlsRef.current) {
      try { hlsRef.current.destroy(); } catch (_) {}
      hlsRef.current = null;
    }
    if (howlRef.current) {
      try { howlRef.current.unload(); } catch (_) {}
      howlRef.current = null;
    }
    const a = audioElRef.current;
    if (a) {
      try {
        a.pause();
        a.removeAttribute('src');
        a.load();
      } catch (_) {}
    }
  }, []);

  useEffect(() => () => teardown(), [teardown]);

  useEffect(() => {
    const a = audioElRef.current;
    if (a) a.volume = muted ? 0 : volume;
    if (howlRef.current) howlRef.current.volume(muted ? 0 : volume);
  }, [volume, muted]);

  const play = useCallback(
    async (radio) => {
      if (!radio) return;
      const sameRadio = currentRef.current?.id === radio.id;

      if (sameRadio) {
        if (howlRef.current) {
          if (howlRef.current.playing()) {
            howlRef.current.pause();
            setIsPlaying(false);
          } else {
            howlRef.current.play();
            setIsPlaying(true);
          }
          return;
        }
        const a = audioElRef.current;
        if (a) {
          if (a.paused) {
            a.play().then(() => setIsPlaying(true)).catch((e) => setError(e?.message || 'Lecture impossible'));
          } else {
            a.pause();
            setIsPlaying(false);
          }
          return;
        }
      }

      teardown();
      setError(null);
      setIsLoading(true);
      setIsPlaying(false);
      currentRef.current = radio;
      setCurrent(radio);

      const useHls = radio.streamType === 'hls' || /\.m3u8(\?|$)/i.test(radio.stream);

      if (useHls) {
        const a = audioElRef.current;
        if (!a) return;
        a.volume = muted ? 0 : volume;

        if (a.canPlayType('application/vnd.apple.mpegurl')) {
          // Safari / iOS — native HLS, no library needed
          a.src = radio.stream;
          try {
            await a.play();
            setIsPlaying(true); setIsLoading(false);
          } catch (err) {
            setError(err?.message || 'Lecture impossible'); setIsLoading(false);
          }
          return;
        }

        // Other browsers — fetch hls.js on demand, cached after first use
        let Hls;
        try { Hls = await loadHls(); }
        catch (err) {
          setError('Impossible de charger hls.js'); setIsLoading(false); return;
        }
        if (currentRef.current?.id !== radio.id) return; // user switched while we were loading

        if (Hls.isSupported()) {
          const hls = new Hls({ lowLatencyMode: true, maxBufferLength: 8 });
          hlsRef.current = hls;
          hls.loadSource(radio.stream);
          hls.attachMedia(a);
          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            a.play()
              .then(() => { setIsPlaying(true); setIsLoading(false); })
              .catch((err) => { setError(err?.message || 'Lecture impossible'); setIsLoading(false); });
          });
          hls.on(Hls.Events.ERROR, (_, data) => {
            if (data?.fatal) {
              setError('Flux HLS indisponible'); setIsLoading(false); setIsPlaying(false);
            }
          });
        } else {
          setError('HLS non supporté sur ce navigateur'); setIsLoading(false);
        }
        return;
      }

      // MP3 / AAC streams via Howler — also lazy-loaded
      let Howl;
      try { Howl = await loadHowler(); }
      catch (err) {
        setError('Impossible de charger Howler'); setIsLoading(false); return;
      }
      if (currentRef.current?.id !== radio.id) return;

      const howl = new Howl({
        src: [radio.stream],
        html5: true,
        format: ['mp3', 'aac'],
        volume: muted ? 0 : volume,
        onplay:  () => { setIsPlaying(true); setIsLoading(false); },
        onpause: () => setIsPlaying(false),
        onstop:  () => setIsPlaying(false),
        onend:   () => setIsPlaying(false),
        onloaderror: (_id, err) => {
          setError(typeof err === 'string' ? err : 'Flux indisponible');
          setIsLoading(false); setIsPlaying(false);
        },
        onplayerror: (_id, err) => {
          setError(typeof err === 'string' ? err : 'Lecture impossible');
          setIsLoading(false); setIsPlaying(false);
        },
      });
      howlRef.current = howl;
      howl.play();
    },
    [muted, teardown, volume]
  );

  const togglePlay = useCallback(() => {
    if (!currentRef.current) return;
    play(currentRef.current);
  }, [play]);

  const stop = useCallback(() => {
    teardown();
    currentRef.current = null;
    setCurrent(null);
    setIsPlaying(false);
    setIsLoading(false);
  }, [teardown]);

  const setVolume = useCallback((v) => {
    setVolumeState(v);
    if (v > 0 && muted) setMuted(false);
  }, [muted]);

  const toggleMute = useCallback(() => setMuted((m) => !m), []);

  return {
    current,
    isPlaying,
    isLoading,
    volume,
    muted,
    error,
    play,
    togglePlay,
    stop,
    setVolume,
    toggleMute,
  };
}
