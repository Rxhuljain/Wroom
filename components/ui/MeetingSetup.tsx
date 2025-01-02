'use client';

import { DeviceSettings, useCall, VideoPreview } from '@stream-io/video-react-sdk';
import React, { useEffect, useState } from 'react';
import { Button } from './button';

const MeetingSetup = ({
  setisSetupComplete,
}: {
  setisSetupComplete: (value: boolean) => void;
}) => {
  const [isMicCamToggledOn, setisMicCamToggledOn] = useState(false);

  const call = useCall();
  if (!call) {
    throw new Error('useCall must be used within a StreamCall component.');
  }

  useEffect(() => {
    if (isMicCamToggledOn) {
      call?.camera.disable();
      call?.microphone.disable();
    } else {
      call?.camera.enable();
      call?.microphone.enable();
    }
  }, [isMicCamToggledOn, call?.camera, call?.microphone]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-3 text-white">
      <h1 className="text-2xl font-bold">Setup</h1>
      <VideoPreview />

      <div className="flex h-16 items-center justify-center gap-3">
        <label className="flex items-center justify-center gap-2 font:medium">
          <input
            type="checkbox"
            checked={isMicCamToggledOn}
            onChange={(e) => setisMicCamToggledOn(e.target.checked)}
          />
          Join with mic and camera off
        </label>
        <DeviceSettings />
      </div>
      <Button
  className="rounded-md bg-red-500 px-4 py-2.5"
  onClick={() => {
    call.join(); // Ensure the call.join() completes
    setisSetupComplete(true); // Properly update state
  }}
>
  Join meeting
</Button>
    </div>
  );
};

export default MeetingSetup;