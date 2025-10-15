interface SkeletonItemProps {
  width?: string
  height?: string
  className?: string
}

export function SkeletonItem({ width = '100%', height = '14px', className = '' }: SkeletonItemProps) {
  return (
    <div 
      className={`skeleton ${className}`} 
      style={{ width, height }}
    />
  )
}


export default SkeletonItem