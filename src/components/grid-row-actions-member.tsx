'use client'

import { MoreHorizontal, UserX } from 'lucide-react'
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
  DropdownMenuTrigger,
} from './ui/dropdown-menu'

export default function GridRowActionsInvite({
  teamId,
  memberId,
}: {
  teamId: string
  memberId: string
}) {
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  function closeDialogs() {
    setDeleteDialogOpen(false)
  }

  return (
    <>
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem variant="destructive" onClick={() => setDeleteDialogOpen(true)}>
              <UserX /> Remove member
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {deleteDialogOpen && (
          <DeleteDialog
            deleteLoading={deleteLoading}
            setDeleteLoading={setDeleteLoading}
            teamId={teamId}
            closeDialogs={closeDialogs}
            memberId={memberId}
          />
        )}
      </Dialog>
    </>
  )
}

function DeleteDialog({
  deleteLoading,
  setDeleteLoading,
  teamId,
  closeDialogs,
  memberId,
}: {
  deleteLoading: boolean
  setDeleteLoading: (loading: boolean) => void
  teamId: string
  closeDialogs: () => void
  memberId: string
}) {
  const router = useRouter()
  async function handleDelete(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setDeleteLoading(true)

    const res = await fetch(`/api/teams/${teamId}/members/${memberId}`, {
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
        <DialogTitle>Are you sure you want to remove this member?</DialogTitle>
        <DialogDescription>
          They will no longer have access to this team and any of its forms.
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleDelete}>
        <DialogFooter>
          <SubmitButton variant="destructive" loading={deleteLoading}>
            Remove member
          </SubmitButton>
        </DialogFooter>
      </form>
    </DialogContent>
  )
}
