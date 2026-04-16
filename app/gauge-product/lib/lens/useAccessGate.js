/**
 * lib/lens/useAccessGate.js
 * PRODUCTIZE.LENS.COMMERCIAL.GATING.01
 *
 * UI-only entitlement gate.
 * Persists in localStorage (no backend required).
 * hasAccess === false → show gating modal
 * hasAccess === true  → allow deeper navigation
 */

import { useState, useEffect } from 'react'

const STORAGE_KEY = 'lens_access_granted'

export function useAccessGate() {
  const [hasAccess, setHasAccess] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    try {
      setHasAccess(localStorage.getItem(STORAGE_KEY) === '1')
    } catch {}
  }, [])

  function grantAccess() {
    try { localStorage.setItem(STORAGE_KEY, '1') } catch {}
    setHasAccess(true)
    setModalOpen(false)
  }

  function showModal() { setModalOpen(true) }
  function hideModal() { setModalOpen(false) }

  return { hasAccess, modalOpen, showModal, hideModal, grantAccess }
}
