"use client";
import useSWR from "swr";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const fetcher = (u: string) => fetch(u).then(r => r.json());

export default function RclonePane() {
  const { data } = useSWR("/api/rclone/remotes", fetcher);
  const [remote, setRemote] = useState<string>("");
  const [path, setPath] = useState<string>("");
  const [isImporting, setIsImporting] = useState(false);
  const { toast } = useToast();

  async function importNow() {
    if (!remote) {
      toast({
        title: "Error",
        description: "Please select a cloud service",
        variant: "destructive",
      });
      return;
    }

    setIsImporting(true);
    try {
      const fs = `${remote}:${path || ""}`;
      const r = await fetch("/api/rclone/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fs }),
      });
      
      const j = await r.json();
      if (j.ok) {
        toast({
          title: "Import Started",
          description: "We'll scan your files as they arrive. Check the duplicates page for progress.",
        });
        setRemote("");
        setPath("");
      } else {
        throw new Error(j.error || "Import failed");
      }
    } catch (error) {
      toast({
        title: "Import Failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Cloud Service
        </label>
        <select 
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={remote} 
          onChange={e => setRemote(e.target.value)}
        >
          <option value="">Select a service...</option>
          {data?.remotes?.map((r: string) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Path (optional)
        </label>
        <input 
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={path} 
          onChange={e => setPath(e.target.value)} 
          placeholder="e.g., Photos/2024"
        />
      </div>
      
      <Button 
        onClick={importNow} 
        disabled={isImporting || !remote}
        className="w-full"
      >
        {isImporting ? "Importing..." : "Import from Cloud"}
      </Button>
      
      <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-md">
        <p className="font-medium mb-1">💡 Setup Tip:</p>
        <p>Open the rclone GUI at <a href="http://localhost:5572" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">http://localhost:5572</a> to connect Google Drive, Google Photos, OneDrive, Dropbox, and other cloud services.</p>
      </div>
    </div>
  );
}
