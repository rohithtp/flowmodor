import Image from 'next/image';
import { ReactNode } from 'react';
import { createClient } from '@/utils/supabase/server';
import { Chart, Gear, House } from '../Icons';
import SidebarTab from './SidebarTab';
import UserDropdown from './UserDropdown';

export default async function Sidebar({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex h-[100dvh] flex-col-reverse sm:flex-row">
      <div className="border-t-secondary sm:border-r-secondary bg-midground z-10 ml-0 flex w-full flex-row items-center justify-center border-t py-3 sm:h-full sm:w-14 sm:flex-col sm:border-r sm:border-t-0">
        <div className="flex flex-row items-center justify-center gap-3 sm:flex-col">
          <Image
            src="/images/logo-no-bg.png"
            alt="logo"
            unoptimized
            width={28}
            height={28}
            priority
            className="hidden sm:block"
          />
          <SidebarTab tabPathname="/" tabName="Home" hotkey="H">
            <House />
          </SidebarTab>
          <SidebarTab tabPathname="/stats" tabName="Stats" hotkey="T">
            <Chart />
          </SidebarTab>
          <SidebarTab tabPathname="/settings" tabName="Settings" hotkey="S">
            <Gear />
          </SidebarTab>
        </div>
        <div className="absolute right-5 top-5 mt-auto flex flex-row items-center gap-5 sm:static sm:flex-col">
          <UserDropdown user={user} />
        </div>
      </div>
      <div className="scrollbar-hide flex h-full flex-col items-center overflow-y-scroll sm:w-full">
        {children}
      </div>
    </div>
  );
}
