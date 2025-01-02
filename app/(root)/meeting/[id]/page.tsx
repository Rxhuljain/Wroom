'use client';

import Loader from '@/components/ui/Loader';
import MeetingRoom from '@/components/ui/MeetingRoom';
import MeetingSetup from '@/components/ui/MeetingSetup';
import { useGetCallById } from '@/hooks/useGetCallById';
import { useUser } from '@clerk/nextjs';
import { StreamCall, StreamTheme } from '@stream-io/video-react-sdk';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

// Define the props inline with Next.js expectations
interface MeetingProps {
  params: { id: string };
}

// Ensure proper type alignment
const Meeting: React.FC<MeetingProps> = ({ params }) => {
  const { user, isLoaded } = useUser();

  console.log(user); // Avoid unused variable warning

  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const { call, isCallLoading } = useGetCallById(params.id);
  const [callError, setCallError] = useState<Error | null>(null);

  useEffect(() => {
    if (!call && !isCallLoading) {
      setCallError(new Error('Failed to load call'));
    }
  }, [call, isCallLoading]);

  useEffect(() => {
    const setupMeeting = async () => {
      try {
        const { id } = params;
        await navigator.clipboard.writeText(id);
        toast('Link Copied');
        setIsSetupComplete(true);
      } catch (error) {
        toast.error('Failed to copy meeting link');
        console.error('Error setting up meeting:', error);
      }
    };

    setupMeeting();
  }, [params]);

  if (!isLoaded || isCallLoading || !isSetupComplete) return <Loader />;

  if (callError) {
    return <div>Error loading call: {callError.message}</div>;
  }

  return (
    <main className="h-screen w-full">
      <StreamCall call={call}>
        <StreamTheme>
          {!isSetupComplete ? (
            <MeetingSetup setisSetupComplete={setIsSetupComplete} />
          ) : (
            <MeetingRoom />
          )}
        </StreamTheme>
      </StreamCall>
    </main>
  );
};

export default Meeting;
