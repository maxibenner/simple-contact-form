'use client'

export function HeaderPage({ title, description }: { title: string; description?: string }) {
  return (
    <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex py-4 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
      <div className="flex flex-col w-full gap-1 px-4 lg:px-6">
        <h1 className="text-2xl font-bold">{title}</h1>
        {description && <p className="text-gray-400 text-sm max-w-[600px]">{description}</p>}
      </div>
    </header>
  )
}
