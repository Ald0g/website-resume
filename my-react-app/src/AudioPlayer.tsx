import { useRef, useEffect } from 'react';

import music from '@/assets/SledRacing/Music.mp3'

const AudioPlayer = ({isGamePlaying}) => {
  const audioRef = useRef(null);
  // const [isPlaying, setIsPlaying] = useState(false);

  // useEffect(() => {
  //   setIsPlaying(isGamePlaying);
  //   togglePlayPause();
  // }, [isGamePlaying])

  // const togglePlayPause = () => {
  //   setIsPlaying(!isPlaying);
  // };

  useEffect(() => {
    console.log('here', isGamePlaying)
    if (isGamePlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
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
