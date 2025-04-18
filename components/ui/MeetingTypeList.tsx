'use client';
import { Input } from "@/components/ui/input"
import React, { useState } from 'react';
import HomeCard from './HomeCard';
import { useRouter } from 'next/navigation';
import MeetingModel from './MeetingModel';
import { useUser } from '@clerk/nextjs';
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Textarea } from './textarea';
import ReactDatePicker from 'react-datepicker';
import { v4 as uuidv4 } from 'uuid'; // Import the uuid package

const MeetingTypeList = () => {
  const router = useRouter();
  const [meetingState, setmeetingState] = useState<
    'isScheduleMeeting' | 'isJoiningMeeting' | 'isInstantMeeting' | undefined
  >();

  const { user } = useUser();
  const client = useStreamVideoClient();
  const [values, setvalues] = useState({
    dateTime: new Date(),
    description: '',
    link: '',
  });
  const [callDetails, setcallDetails] = useState<Call>();

  const createMeeting = async () => {
    if (!client || !user) return;
    try {
      if (!values.dateTime) {
        toast.error('Please select a date and time');
        return;
      }
      const id = uuidv4(); // Use uuidv4 to generate a UUID
      const call = client.call('default', id);
      if (!call) throw new Error('Failed to create call');
      const startsAt = values.dateTime.toISOString() || new Date(Date.now()).toISOString();
      const description = values.description || 'Instant Meeting';

      await call.getOrCreate({
        data: {
          starts_at: startsAt,
          custom: { description },
        },
      });

      setcallDetails(call);
      router.push(`/meeting/${call.id}`);
      toast.success('Meeting Created');
    } catch (error) {
      console.error('Error creating meeting:', error);
      toast.error('Failed to create meeting');
    }
  };

  const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetails?.id}`;

  return (
    <>
      <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        <HomeCard
          img="/icons/add-meeting.svg"
          title="New Meeting"
          description="Start Instant Meeting"
          handleClickable={() => {
            console.log('Clicked New Meeting');
            setmeetingState('isInstantMeeting');
          }}
          className="bg-orange-1"
        />

        <HomeCard
          img="/icons/schedule.svg"
          title="Schedule Meeting"
          description="Plan your Meeting"
          handleClickable={() => setmeetingState('isScheduleMeeting')}
          className="bg-blue-1"
        />

        <HomeCard
          img="/icons/recordings.svg"
          title="View Recordings"
          description="Check out the recordings"
          handleClickable={() => router.push('/recordings')}
          className="bg-purple-1"
        />

        <HomeCard
          img="/icons/join-meeting.svg"
          title="Join Meeting"
          description="via invitation link"
          handleClickable={() => setmeetingState('isJoiningMeeting')}
          className="bg-yellow-1"
        />

        {!callDetails ? (
          <MeetingModel
            isOpen={meetingState === 'isScheduleMeeting'}
            onClose={() => setmeetingState(undefined)}
            title="Create Meeting"
            handleClick={createMeeting}
          >
            <div className="flex flex-col gap-2.5">
              <label className="text-base font-normal leading-[22.4px] text-sky-2">
                Add a description
              </label>
              <Textarea
                className="border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0"
                onChange={(e) => {
                  setvalues({ ...values, description: e.target.value });
                }}
              />
            </div>
            <div className="flex w-full flex-col gap-2.5">
              <label className="text-base font-normal leading-[22.4px] text-sky-2">
                Select Date and Time
              </label>
              <ReactDatePicker
                selected={values.dateTime}
                onChange={(date) => setvalues({ ...values, dateTime: date! })}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                timeCaption="time"
                dateFormat="MMMM d, yyyy h:mm aa"
                className="w-full rounded bg-dark-3 p-2 focus:outline-none"
              />
            </div>
          </MeetingModel>
        ) : (
          <MeetingModel
            isOpen={meetingState === 'isScheduleMeeting'}
            onClose={() => setmeetingState(undefined)}
            title="Meeting Created"
            handleClick={() => {
              navigator.clipboard.writeText(meetingLink);
              toast('Link Copied');
            }}
            image={'/icons/checked.svg'}
            buttonIcon="/icons/copy.svg"
            className="text-center"
            buttonText=" Copy Meeting Link"
          />
        )}

        <MeetingModel
          isOpen={meetingState === 'isInstantMeeting'}
          onClose={() => {
            console.log('Closing dialog');
            setmeetingState(undefined);
          }}
          title="Start an Instant Meeting"
          className="text-center"
          buttonText="Start Meeting"
          handleClick={createMeeting}
        />

        <MeetingModel
          isOpen={meetingState === 'isJoiningMeeting'}
          onClose={() => {
            console.log('Closing dialog');
            setmeetingState(undefined);
          }}
          title="Paste the link here"
          className="text-center"
          buttonText="Join Meeting"
          handleClick={() => router.push(values.link)}
        >
          <Input
            placeholder="Meeting link"
            onChange={(e) => setvalues({ ...values, link: e.target.value })}
            className="border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </MeetingModel>
      </section>

      {/* Toast Notification Container */}
      <ToastContainer />
    </>
  );
};

export default MeetingTypeList;
