export interface User {
  id: string;
  email: string;
  name?: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface File {
  id: string;
  projectId: string;
  ownerId: string;
  originalName: string;
  mimeType: string;
  byteSize: bigint;
  sha256Hex: string;
  storageKey: string;
  createdAt: Date;
  status: FileStatus;
}

export type FileStatus = 'UPLOADED' | 'PROCESSED' | 'FAILED';

export interface Asset {
  id: string;
  fileId: string;
  ownerId: string;
  kind: AssetKind;
  pageIndex?: number;
  width?: number;
  height?: number;
  thumbKey?: string;
  createdAt: Date;
}

export type AssetKind = 'IMAGE' | 'PDF_PAGE';

export interface Hash {
  id: string;
  assetId: string;
  kind: HashKind;
  hex64: string;
  bucket16: number;
  createdAt: Date;
}

export type HashKind = 'PHASH' | 'AHASH' | 'DHASH';

export interface DuplicateCluster {
  id: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
  members: ClusterMember[];
}

export interface ClusterMember {
  id: string;
  clusterId: string;
  assetId: string;
  isKeeper: boolean;
  asset: Asset;
}

export interface AuditLog {
  id: string;
  ownerId: string;
  action: string;
  payload: Record<string, any>;
  createdAt: Date;
}

export interface UploadJob {
  ownerId: string;
  fileId: string;
  storageKey: string;
  mimeType: string;
}

export interface DuplicateGroup {
  id: string;
  members: ClusterMember[];
  createdAt: Date;
  updatedAt: Date;
}
