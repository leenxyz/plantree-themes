/* eslint-disable jsx-a11y/anchor-is-valid */
'use client'

import { slug } from 'github-slugger'
import { usePathname } from 'next/navigation'
import Link from './Link'

interface PostListWithTagProps {
  tagData: Record<string, number>
  title?: string
}

export function TagList({ tagData = {}, title }: PostListWithTagProps) {
  const pathname = usePathname()
  const tagCounts = tagData as Record<string, number>
  const tagKeys = Object.keys(tagCounts)
  const sortedTags = tagKeys.sort((a, b) => tagCounts[b] - tagCounts[a])

  return (
    <div>
      {title && (
        <div className="pb-6 pt-6">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-gray-900 dark:text-gray-100 sm:hidden sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            {title}
          </h1>
        </div>
      )}

      <ul className="flex flex-wrap gap-2">
        {sortedTags.map((t) => {
          return (
            <li key={t} className="my-3">
              {decodeURI(pathname.split('/tags/')[1]) === slug(t) ? (
                <h3 className="inline px-3 py-2 text-sm font-bold text-primary-500 rounded-full bg-gray-100 dark:text-gray-800 dark:bg-gray-300">
                  {`${t} (${tagCounts[t]})`}
                </h3>
              ) : (
                <Link
                  href={`/tags/${slug(t)}`}
                  className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-primary-500 dark:text-gray-800 dark:hover:text-primary-500 rounded-full bg-gray-100 dark:bg-gray-300"
                  aria-label={`View posts tagged ${t}`}
                >
                  {`${t} (${tagCounts[t]})`}
                </Link>
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}