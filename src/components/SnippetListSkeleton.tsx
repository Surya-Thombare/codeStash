// components/SnippetListSkeleton.tsx
import { motion } from 'framer-motion'
import { Card, CardContent, CardFooter, CardHeader } from './ui/card'

const skeletonVariants = {
  initial: { opacity: 0, y: 20 },
  animate: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
    },
  }),
}

export function SnippetListSkeleton() {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div className="h-8 w-48 bg-muted rounded-md animate-pulse" />
        <div className="h-10 w-32 bg-muted rounded-md animate-pulse" />
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            variants={skeletonVariants}
            initial="initial"
            animate="animate"
            custom={i}
          >
            <Card className="overflow-hidden">
              <CardHeader className="border-b space-y-2">
                <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
                <div className="h-4 w-1/4 bg-muted rounded animate-pulse" />
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-2 p-6">
                  {[...Array(4)].map((_, j) => (
                    <div
                      key={j}
                      className="h-4 bg-muted rounded animate-pulse"
                      style={{
                        width: `${Math.random() * 40 + 60}%`,
                      }}
                    />
                  ))}
                </div>
                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    {[...Array(3)].map((_, k) => (
                      <div
                        key={k}
                        className="h-6 w-16 bg-muted rounded-full animate-pulse"
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t p-4 gap-2">
                <div className="h-9 w-20 bg-muted rounded animate-pulse" />
                <div className="h-9 w-20 bg-muted rounded animate-pulse" />
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}