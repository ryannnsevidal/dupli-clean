'use client';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { formatBytes } from '@/lib/utils';

interface DuplicateGroup {
  id: string;
  members: Array<{
    id: string;
    asset: {
      id: string;
      file: {
        originalName: string;
        byteSize: bigint;
      };
      width: number | null;
      height: number | null;
      thumbKey: string | null;
    };
    isKeeper: boolean;
  }>;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function DuplicatesPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [selectedAssets, setSelectedAssets] = useState<Record<string, string[]>>({});

  // Demo mode - bypass authentication
  const isDemo = true;

  const { data: groups, error, mutate } = useSWR<DuplicateGroup[]>(
    "/api/duplicates",
    fetcher,
    { refreshInterval: 5000 }
  );

  if (!isDemo && !session?.user) {
    router.push("/auth/signin");
    return null;
  }

  const handleDelete = async (clusterId: string, selectedAssetIds: string[]) => {
    try {
      const response = await fetch(`/api/duplicates/${clusterId}/delete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assetIds: selectedAssetIds }),
      });

      if (!response.ok) throw new Error("Failed to delete");

      toast({
        title: "Success",
        description: `${selectedAssetIds.length} duplicate(s) deleted successfully.`,
      });

      // Refresh the data
      mutate();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete duplicates. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Error Loading Duplicates
          </h1>
          <p className="text-gray-600">
            Failed to load duplicate groups. Please try refreshing the page.
          </p>
        </div>
      </div>
    );
  }

  if (!groups) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Scanning for Duplicates...
          </h1>
          <p className="text-gray-600">
            We're analyzing your files for duplicates. This may take a few moments.
          </p>
        </div>
      </div>
    );
  }

  if (groups.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            No Duplicates Found
          </h1>
          <p className="text-gray-600 mb-6">
            Great news! No duplicate files were found in your collection.
          </p>
          <Button onClick={() => router.push("/import")}>
            Import More Files
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Duplicate Groups ({groups.length})
        </h1>
        <p className="text-gray-600">
          Review and delete duplicate files. Keepers are automatically selected based on quality.
        </p>
      </div>

      <div className="space-y-6">
        {groups.map((group) => {
          const selectedMembers = group.members.filter((m) => !m.isKeeper);
          const hasSelected = selectedMembers.length > 0;

          return (
            <div key={group.id} className="border rounded-2xl p-4" data-test="group-card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Group {group.id.slice(-8)} ({group.members.length} files)
                </h3>
                {hasSelected && (
                  <Button
                    onClick={() => handleDelete(group.id, selectedMembers.map((m) => m.asset.id))}
                    variant="destructive"
                    size="sm"
                  >
                    Delete Selected ({selectedMembers.length})
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {group.members.map((member) => (
                  <div
                    key={member.id}
                    className={`border rounded-lg p-3 ${
                      member.isKeeper ? "bg-green-50 border-green-200" : "bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        {member.asset.thumbKey ? (
                          <img
                            src={`/api/thumb/${member.asset.id}`}
                            alt="Thumbnail"
                            className="w-16 h-16 object-cover rounded"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                            <span className="text-gray-500 text-xs">No preview</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {member.asset.file.originalName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatBytes(Number(member.asset.file.byteSize))}
                        </p>
                        {member.asset.width && member.asset.height && (
                          <p className="text-xs text-gray-500">
                            {member.asset.width} × {member.asset.height}
                          </p>
                        )}
                        {member.isKeeper && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                            Keep
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
