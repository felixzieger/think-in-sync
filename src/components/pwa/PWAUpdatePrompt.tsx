import { useEffect } from 'react'
import { useRegisterSW } from 'virtual:pwa-register/react'
import { useToast } from '@/hooks/use-toast'
import { ToastAction } from '@/components/ui/toast'
import { useTranslation } from '@/hooks/useTranslation'

export const PWAUpdatePrompt = () => {
  const { toast } = useToast()
  const t = useTranslation()

  const { needRefresh, updateServiceWorker } = useRegisterSW({
    immediate: true,
    onRegisteredSW() {
      // no-op
    },
  })

  useEffect(() => {
    if (needRefresh) {
      toast({
        title: t.app?.update?.title ?? 'Update available',
        description: t.app?.update?.description ?? 'A new version is ready.',
        action: (
          <ToastAction
            altText={t.app?.update?.refresh ?? 'Refresh'}
            onClick={() => updateServiceWorker(true)}
          >
            {t.app?.update?.refresh ?? 'Refresh'}
          </ToastAction>
        ),
      })
    }
  }, [needRefresh, toast, t, updateServiceWorker])

  return null
}

