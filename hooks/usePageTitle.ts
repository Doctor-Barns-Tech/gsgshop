'use client';

import { useEffect } from 'react';

const SITE_NAME = 'GSG Convenience Goods & More';

export function usePageTitle(title: string) {
  useEffect(() => {
    document.title = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} | Premium Convenience Shopping in Ghana`;
  }, [title]);
}
