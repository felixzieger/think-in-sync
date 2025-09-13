/// <reference types="vite-plugin-pwa/client" />
import { useEffect } from 'react'
import { useToast } from '@/hooks/use-toast'
import { ToastAction } from '@/components/ui/toast'
import { useTranslation } from '@/hooks/useTranslation'

export const PWAUpdatePrompt = () => {
  const { toast } = useToast()
  const t = useTranslation()

  useEffect(() => {
    let updateSW: ((reload?: boolean) => Promise<void>) | undefined

    const start = async () => {
      if (typeof window === 'undefined') return
      try {
        const { registerSW } = await import('virtual:pwa-register')
        updateSW = registerSW({
          immediate: true,
          onNeedRefresh() {
            toast({
              title: t.app?.update?.title ?? 'Update available',
              description: t.app?.update?.description ?? 'A new version is ready.',
              action: (
                <ToastAction
                  altText={t.app?.update?.refresh ?? 'Refresh'}
                  onClick={() => updateSW?.(true)}
                >
                  {t.app?.update?.refresh ?? 'Refresh'}
                </ToastAction>
              ),
            })
          },
        })
      } catch (error) {
        console.error('[PWA] register error', error)
      }
    }

    start()

    return () => {
      // nothing to clean up
    }
  }, [toast, t])

  return null
}
