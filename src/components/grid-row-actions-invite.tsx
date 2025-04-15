'use client'

import { MailX, MoreHorizontal, Repeat } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import SubmitButton from './button-submit'
import { Button } from './ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'

export default function GridRowActionsInvite({ teamId, docId }: { teamId: string; docId: string }) {
  const [renameLoading, setRenameLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [renameDialogOpen, setRenameDialogOpen] = useState(false)

  function closeDialogs() {
    setDeleteDialogOpen(false)
    setRenameDialogOpen(false)
  }

  return (
    <>
      <Dialog
        open={renameDialogOpen || deleteDialogOpen}
        onOpenChange={renameDialogOpen ? setRenameDialogOpen : setDeleteDialogOpen}
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Invite actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => setRenameDialogOpen(true)}>
              <Repeat color="black" />
              Resend
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={() => setDeleteDialogOpen(true)}>
              <MailX /> Revoke
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {renameDialogOpen && (
          <ResendDialog
            renameLoading={renameLoading}
            setRenameLoading={setRenameLoading}
            docId={docId}
            closeDialogs={closeDialogs}
          />
        )}
        {deleteDialogOpen && (
          <DeleteDialog
            deleteLoading={deleteLoading}
            setDeleteLoading={setDeleteLoading}
            docId={docId}
            teamId={teamId}
            closeDialogs={closeDialogs}
          />
        )}
      </Dialog>
    </>
  )
}

function ResendDialog({
  renameLoading,
  setRenameLoading,
  docId,
  closeDialogs,
}: {
  renameLoading: boolean
  setRenameLoading: (loading: boolean) => void
  docId: string
  closeDialogs: () => void
}) {
  const router = useRouter()
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setRenameLoading(true)

    const res = await fetch(`/api/invites/${docId}/resend`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Handle res
    if (res.ok) {
      console.log('Invite sent successfully')
    } else {
      const error = await res.json()
      console.error(error)
    }

    // Reset
    setRenameLoading(false)
    closeDialogs()
    router.refresh()
  }
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Resend invite?</DialogTitle>
        <DialogDescription>
          This will send a new email to the user with a link to join the team.
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit}>
        <DialogFooter>
          <SubmitButton loading={renameLoading} className="mt-4">
            Resend invite
          </SubmitButton>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}

function DeleteDialog({
  deleteLoading,
  setDeleteLoading,
  teamId,
  docId,
  closeDialogs,
}: {
  deleteLoading: boolean
  setDeleteLoading: (loading: boolean) => void
  teamId: string
  docId: string
  closeDialogs: () => void
}) {
  const router = useRouter()
  async function handleDelete(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setDeleteLoading(true)

    const res = await fetch(`/api/invites/${docId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Handle res
    if (res.ok) {
      router.push(`/${teamId}/team`)
    } else {
      console.error('Error deleting form')
    }

    // Reset
    setDeleteLoading(false)
    closeDialogs()
  }
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Are you sure you want to revoke this invite?</DialogTitle>
        <DialogDescription>
          Attempts to use this invite link in the future will fail.
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleDelete}>
        <DialogFooter>
          <SubmitButton variant="destructive" loading={deleteLoading}>
            Remove invite
          </SubmitButton>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}
