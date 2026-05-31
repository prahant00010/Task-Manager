import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import Button from "./Button";

export default function Modal({ open, onClose, title, children, footer }) {
  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            className="relative z-10 flex max-h-[min(92dvh,100%)] w-full flex-col rounded-t-2xl border border-slate-800 bg-slate-900 shadow-2xl sm:max-h-[90dvh] sm:max-w-lg sm:rounded-xl"
          >
            <div className="flex shrink-0 items-center justify-between border-b border-slate-800 px-4 py-4 sm:px-6">
              <h3 className="pr-2 text-lg font-semibold text-white">{title}</h3>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4 sm:px-6">{children}</div>
            {footer ? (
              <div className="shrink-0 border-t border-slate-800 px-4 py-4 sm:px-6">{footer}</div>
            ) : null}
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}

export function ModalActions({ onCancel, onConfirm, confirmLabel = "Save", loading = false }) {
  return (
    <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
      <Button variant="secondary" className="w-full sm:w-auto" onClick={onCancel}>
        Cancel
      </Button>
      <Button className="w-full sm:w-auto" onClick={onConfirm} disabled={loading}>
        {confirmLabel}
      </Button>
    </div>
  );
}
