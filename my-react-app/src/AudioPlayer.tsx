import { useRef, useEffect } from 'react';

import music from '@/assets/SledRacing/Music.mp3'

type Props = {
  isGamePlaying: boolean;
}

const AudioPlayer = ({ isGamePlaying }: Props) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  // const [isPlaying, setIsPlaying] = useState(false);

  // useEffect(() => {
  //   setIsPlaying(isGamePlaying);
  //   togglePlayPause();
  // }, [isGamePlaying])

  // const togglePlayPause = () => {
  //   setIsPlaying(!isPlaying);
  // };

  useEffect(() => {
    const audioEl = audioRef.current;
    if (!audioEl) return;

    if (isGamePlaying) {
      audioEl.pause();
    } else {
      // play() returns a Promise; we can optionally handle it but keep simple here
      void audioEl.play();
    }
  }, [isGamePlaying]);

  // Optional: Reset state when the song ends
//   useEffect(() => {
//     audioRef.current.addEventListener('ended', () => setIsPlaying(false));
//     return () => {
//       audioRef.current.removeEventListener('ended', () => setIsPlaying(false));
//     };
//   }, []);

  // Corrected useEffect block
  // useEffect(() => {
  //   const audioEl = audioRef.current; // Create a local variable

  //   if (audioEl) { // Check if the element exists before adding listener
  //     const handleEnded = () => setIsPlaying(false);
  //     audioEl.addEventListener('ended', handleEnded);

  //     // The cleanup function
  //     return () => {
  //       // Check again before removing the listener
  //       if (audioEl) { 
  //         audioEl.removeEventListener('ended', handleEnded);
  //       }
  //     };
  //   }
  //   // If audioEl is null initially, the return function won't be set up this run.
  // }, []); // Empty dependency array means this runs once on mount


  return (
    <div>
      {/* <button onClick={togglePlayPause}>
        {isPlaying ? 'Pause' : 'Play'}
      </button> */}
      <audio ref={audioRef} src={music} />
    </div>
  );
};

export default AudioPlayer;
