// ── Reusable Empty State component ───────────────────────────────────────────

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon = "📭", title, description, action, secondaryAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="text-5xl mb-4 select-none">{icon}</div>
      <h3 className="text-base font-semibold text-gray-700 mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-gray-400 max-w-xs mb-6">{description}</p>
      )}
      {(action || secondaryAction) && (
        <div className="flex flex-col sm:flex-row gap-3 items-center">
          {action && (
            <button
              onClick={action.onClick}
              className="bg-indigo-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
            >
              {action.label}
            </button>
          )}
          {secondaryAction && (
            <button
              onClick={secondaryAction.onClick}
              className="text-indigo-600 border border-indigo-300 px-5 py-2 rounded-lg text-sm font-medium hover:bg-indigo-50 transition"
            >
              {secondaryAction.label}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ── Preset: No Products ───────────────────────────────────────────────────────

interface NoProductsEmptyStateProps {
  onAdd: () => void;
  filtered?: boolean;
}

export function NoProductsEmptyState({ onAdd, filtered = false }: NoProductsEmptyStateProps) {
  if (filtered) {
    return (
      <EmptyState
        icon="🔍"
        title="Tidak ada produk yang cocok"
        description="Coba ubah atau hapus filter untuk melihat semua produk."
      />
    );
  }
  return (
    <EmptyState
      icon="📦"
      title="Belum ada produk"
      description="Mulai jualan dengan menambahkan produk pertama Anda ke toko."
      action={{ label: "+ Tambah Produk Pertama", onClick: onAdd }}
    />
  );
}

// ── Preset: Shop Unpublished ──────────────────────────────────────────────────

interface UnpublishedShopEmptyStateProps {
  onPublish: () => void;
  onCustomize?: () => void;
}

export function UnpublishedShopEmptyState({ onPublish, onCustomize }: UnpublishedShopEmptyStateProps) {
  return (
    <EmptyState
      icon="🔒"
      title="Toko belum dipublikasikan"
      description="Toko Anda masih berstatus draft dan tidak dapat diakses publik. Publikasikan sekarang agar pelanggan dapat menemukan Anda."
      action={{ label: "🌐 Publikasikan Sekarang", onClick: onPublish }}
      secondaryAction={onCustomize ? { label: "Kustomisasi Dulu", onClick: onCustomize } : undefined}
    />
  );
}

