"use client"; // Add this line if `StreamVideoProvider` is imported here

import StreamVideoProvider from '@/providers/StreamClientProvider';


import React, { ReactNode } from 'react';


const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <main>
      <StreamVideoProvider>{children}</StreamVideoProvider>
    </main>
  );
};

export default Layout;