export function SnippetListSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="flex justify-between items-center mb-8">
        <div className="h-8 w-48 bg-gray-200 rounded" />
        <div className="h-10 w-32 bg-gray-200 rounded" />
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-64 bg-gray-200 rounded" />
        ))}
      </div>
    </div>
  )
}