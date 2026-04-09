import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Search,
  Download,
  Check,
  FolderSync,
  BookOpen,
} from 'lucide-react';
import { useResourcesQuery } from './use-resources-query';

function formatResourceName(name: string): string {
  return name
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function generateKey(name: string): string {
  const words = name.split('-');
  if (words.length === 1) return words[0].slice(0, 3).toUpperCase();
  return words.map((w) => w[0]).join('').toUpperCase().slice(0, 5);
}

function ResourceCheckbox({
  checked,
  onChange,
  disabled,
}: {
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      disabled={disabled}
      onClick={onChange}
      className={`flex size-4 shrink-0 items-center justify-center rounded-[5px] border transition-all duration-150 ${
        disabled
          ? 'cursor-default border-white/[0.06] bg-white/[0.02]'
          : checked
            ? 'border-(--accent)/40 bg-(--accent)/20'
            : 'border-white/[0.1] bg-white/[0.03] hover:border-white/[0.15] hover:bg-white/[0.05]'
      }`}
    >
      {(checked || disabled) && (
        <Check
          className={`size-2.5 ${disabled ? 'text-white/20' : 'text-(--accent)'}`}
          strokeWidth={3}
        />
      )}
    </button>
  );
}

export function ImportNotesDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const { data: resources = [], isLoading, isError, error } = useResourcesQuery(open);

  const normalizedSearch = search.trim().toLowerCase();

  const filtered = useMemo(
    () =>
      normalizedSearch
        ? resources.filter(
            (resource) =>
              formatResourceName(resource.name).toLowerCase().includes(normalizedSearch) ||
              resource.prefix.toLowerCase().includes(normalizedSearch),
          )
        : resources,
    [normalizedSearch, resources],
  );

  const allAvailableSelected =
    filtered.length > 0 && filtered.every((resource) => selected.has(resource.prefix));

  function toggleResource(prefix: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(prefix)) next.delete(prefix);
      else next.add(prefix);
      return next;
    });
  }

  function toggleAll() {
    if (allAvailableSelected) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map((resource) => resource.prefix)));
    }
  }

  function handleImport() {
    // TODO: wire up to real API
    onOpenChange(false);
    setSelected(new Set());
    setSearch('');
  }

  function handleClose(value: boolean) {
    onOpenChange(value);
    if (!value) {
      setSelected(new Set());
      setSearch('');
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent
        showCloseButton={false}
        className="flex max-h-[min(620px,85vh)] flex-col gap-0 overflow-hidden border border-white/[0.07] bg-[#161619]/95 p-0 shadow-[0_24px_80px_rgba(0,0,0,0.6)] ring-0 backdrop-blur-xl sm:max-w-[480px]"
      >
        <DialogHeader className="shrink-0 px-5 pt-5 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex size-7 items-center justify-center rounded-lg bg-(--accent)/10">
              <FolderSync className="size-3.5 text-(--accent)" />
            </div>
            <div>
              <DialogTitle className="font-dm text-[14px] font-semibold tracking-[-0.2px] text-white/90">
                Import from Notes
              </DialogTitle>
              <DialogDescription className="font-dm mt-0.5 text-[12px] text-white/35">
                Sync your Obsidian knowledge base as projects
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Status bar */}
        <div className="flex shrink-0 items-center gap-3 border-t border-b border-white/[0.05] bg-white/[0.015] px-5 py-2.5">
          <div className="flex items-center gap-1.5">
            <div className="size-1.5 rounded-full bg-white/20" />
            <span className="font-dm text-[11px] text-white/40">
              {isLoading ? 'Loading resources...' : `${resources.length} directories`}
            </span>
          </div>
          {selected.size > 0 && (
            <>
              <div className="h-2.5 w-px bg-white/[0.06]" />
              <span className="font-dm text-[11px] font-medium text-(--accent)/80">
                {selected.size} selected
              </span>
            </>
          )}
        </div>

        {/* Search */}
        <div className="shrink-0 px-5 pt-3 pb-2">
          <div className="relative">
            <Search className="absolute top-1/2 left-2.5 size-3 -translate-y-1/2 text-white/20" />
            <input
              type="text"
              placeholder="Filter resources..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="font-dm h-8 w-full rounded-lg border border-white/[0.07] bg-white/[0.04] pr-3 pl-8 text-[12px] text-white/80 transition-all placeholder:text-white/20 focus:border-(--accent)/20 focus:bg-white/[0.06] focus:outline-none"
            />
          </div>
        </div>

        {/* Select all toggle */}
        {filtered.length > 1 && !isLoading && !isError && (
          <div className="shrink-0 px-5 pb-1">
            <button
              type="button"
              onClick={toggleAll}
              className="font-dm flex items-center gap-2 py-1 text-[11px] text-white/30 transition-colors hover:text-white/50"
            >
              <ResourceCheckbox
                checked={allAvailableSelected}
                onChange={toggleAll}
              />
              {allAvailableSelected ? 'Deselect all' : 'Select all'}
            </button>
          </div>
        )}

        {/* Resource list */}
        <div className="min-h-0 flex-1 overflow-y-auto px-5 pb-3">
          {isLoading ? (
            <div className="py-8 text-center">
              <p className="font-dm text-[13px] text-white/25">Loading directories...</p>
            </div>
          ) : isError ? (
            <div className="py-8 text-center">
              <p className="font-dm text-[13px] text-red-400/80">
                {error instanceof Error ? error.message : 'Failed to load resources'}
              </p>
            </div>
          ) : (
            <div className="space-y-0.5">
              {filtered.map((resource, index) => {
                const isSelected = selected.has(resource.prefix);

                return (
                  <button
                    type="button"
                    key={resource.prefix}
                    onClick={() => toggleResource(resource.prefix)}
                    className={`motion-safe:animate-stagger-in group flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left transition-all ${
                      isSelected ? 'bg-(--accent)/[0.06]' : 'hover:bg-white/[0.03]'
                    }`}
                    style={{ animationDelay: `${index * 30}ms` }}
                  >
                    <ResourceCheckbox
                      checked={isSelected}
                      onChange={() => toggleResource(resource.prefix)}
                    />

                    <div className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-white/[0.06] bg-white/[0.03]">
                      <BookOpen className="size-3.5 text-white/30" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-dm truncate text-[13px] font-medium text-white/80">
                          {formatResourceName(resource.name)}
                        </span>
                        <span className="font-mono shrink-0 text-[10px] text-white/20">
                          {generateKey(resource.name)}
                        </span>
                      </div>
                      <div className="font-mono mt-0.5 text-[11px] text-white/25">
                        {resource.prefix}
                      </div>
                    </div>
                  </button>
                );
              })}

              {filtered.length === 0 && (
                <div className="py-8 text-center">
                  <p className="font-dm text-[13px] text-white/25">No resources found</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex shrink-0 items-center justify-between border-t border-white/[0.05] bg-white/[0.02] px-5 py-3.5">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => handleClose(false)}
            className="font-dm text-[12px] text-white/40 hover:bg-white/[0.04] hover:text-white/60"
          >
            Cancel
          </Button>
          <Button
            type="button"
            size="sm"
            disabled={selected.size === 0}
            onClick={handleImport}
            className="font-dm gap-1.5 rounded-[10px] border-(--accent)/20 bg-(--accent)/15 text-[12px] text-(--accent) hover:bg-(--accent)/25 disabled:opacity-30"
          >
            <Download className="size-3" />
            Import {selected.size > 0 ? `(${selected.size})` : 'selected'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
