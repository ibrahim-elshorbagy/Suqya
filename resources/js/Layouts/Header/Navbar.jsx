import React, { useState } from 'react'
import ProfileMenu from '../Sidebar/ProfileMenu'
import { useTrans } from '@/Hooks/useTrans';

export default function Navbar() {

  return (
    <nav className="max-md:hidden flex items-center justify-between px-4 py-3 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 h-auto sticky top-0 z-30">
      <ProfileMenu position="navbar" />
    </nav>
  )
}
