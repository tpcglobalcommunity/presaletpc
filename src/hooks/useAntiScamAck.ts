import { useState } from 'react';

export function useAntiScamAck() {
  const [acknowledged, setAcknowledged] = useState(false);

  const acknowledge = () => {
    setAcknowledged(true);
    localStorage.setItem('antiScamAck', 'true');
  };

  const reset = () => {
    setAcknowledged(false);
    localStorage.removeItem('antiScamAck');
  };

  // Check localStorage on mount
  useState(() => {
    const stored = localStorage.getItem('antiScamAck');
    if (stored === 'true') {
      setAcknowledged(true);
    }
  });

  return {
    acknowledged,
    acknowledge,
    reset
  };
}
