import { useEffect, useMemo, useState } from 'react';
import { SHADOW_SCENARIOS, ShadowComment } from '../lib/shadow-data';

type UseAudienceSimulationParams = {
  videoRef: React.RefObject<HTMLVideoElement>;
  selectedPersonas: string[];
  scenarioId: string;
  overrideComments?: ShadowComment[];
};

export const useAudienceSimulation = ({
  videoRef,
  selectedPersonas,
  scenarioId,
  overrideComments
}: UseAudienceSimulationParams) => {
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [videoRef]);

  const scenario = useMemo(() => {
    if (overrideComments && overrideComments.length > 0) {
      return overrideComments;
    }
    return SHADOW_SCENARIOS[scenarioId] || [];
  }, [overrideComments, scenarioId]);

  const activeComments = useMemo(() => {
    return scenario.filter(
      (comment) =>
        comment.time <= currentTime &&
        comment.time + 5 > currentTime &&
        selectedPersonas.includes(comment.persona)
    );
  }, [scenario, currentTime, selectedPersonas]);

  return { activeComments } as { activeComments: ShadowComment[] };
};
