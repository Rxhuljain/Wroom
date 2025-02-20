import { useState, useEffect } from 'react';
import { useStreamVideoClient, Call } from '@stream-io/video-react-sdk';

export const useGetCallById = (id: string) => {
  const client = useStreamVideoClient();
  const [call, setCall] = useState<Call | null>(null);
  const [isCallLoading, setIsCallLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCall = async () => {
      if (!id) {
        setError("Invalid call ID");
        setIsCallLoading(false);
        return;
      }

      if (!client) {
        console.warn("Stream client is not initialized yet.");
        return; // Wait for client to be available
      }

      try {
        const call = client.call('default', id);
        await call.getOrCreate();
        setCall(call);
      } catch (err) {
        console.error("Error fetching call:", err);
        setError("Failed to load call");
      } finally {
        setIsCallLoading(false);
      }
    };

    fetchCall();
  }, [id, client]);

  return { call, isCallLoading, error };
};
