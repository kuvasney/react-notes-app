import SkeletonItem from '@components/Skeleton/SkeletonItem'

export default function NotesContentSkeleton() {
  const skeletonCards = Array.from({ length: 6 }, (_, index) => (
    <div className="note-skeleton" key={index} style={{ height: '300px', width: '200px' }}>
        <SkeletonItem height="20px" width="70%" className="skeleton-title" />
        <SkeletonItem height="14px" />
        <SkeletonItem height="14px" />
        <SkeletonItem height="14px" width="60%" />
        <SkeletonItem height="12px" width="80%" className="skeleton-date" />
    </div>
  ))

  return (
    <div className="notes-content">
      {skeletonCards}
    </div>
  )
}
