'use client'

import { AppUser, Invite } from '@/payload-types'
import { AppSidebar, ExtendedTeam } from './app-sidebar'
import { SidebarProvider } from './ui/sidebar'

export default function Dashboard({
  children,
  user,
  teams,
  activeTeamId,
  invites,
}: {
  children: React.ReactNode
  user: AppUser
  teams: ExtendedTeam[]
  activeTeamId: string
  invites: Invite[]
}) {
  return (
    <SidebarProvider>
      <AppSidebar user={user} teams={teams} activeTeamId={activeTeamId} invites={invites} />
      <main className="w-full">{children}</main>
    </SidebarProvider>
  )
}
