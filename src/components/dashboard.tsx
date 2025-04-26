'use client'

import { Invite } from '@/payload-types'
import { AppSidebar, ExtendedTeam } from './app-sidebar'
import { SidebarProvider } from './ui/sidebar'

export default function Dashboard({
  children,
  teams,
  activeTeamId,
  invites,
}: {
  children: React.ReactNode
  teams: ExtendedTeam[]
  activeTeamId: string
  invites: Invite[]
}) {
  return (
    <SidebarProvider>
      <AppSidebar teams={teams} activeTeamId={activeTeamId} invites={invites} />
      <main className="w-full">{children}</main>
    </SidebarProvider>
  )
}
