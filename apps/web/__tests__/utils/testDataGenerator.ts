// Test Data Generator for DupliClean Demo
// Creates synthetic near-duplicate photos and PDFs for comprehensive testing

export interface SyntheticFile {
  id: string;
  filename: string;
  fileSize: number;
  mimeType: string;
  hash: string;
  similarity: number;
  isKeeper: boolean;
  metadata: {
    width?: number;
    height?: number;
    pages?: number;
    createdAt: string;
    modifiedAt: string;
  };
}

export interface DuplicateCluster {
  id: string;
  similarity: number;
  members: SyntheticFile[];
  clusterType: 'image' | 'pdf' | 'mixed';
}

// Generate synthetic perceptual hashes for near-duplicate detection
function generateSimilarHashes(baseHash: string, count: number, similarity: number): string[] {
  const hashes = [baseHash];
  const hashLength = baseHash.length;
  
  for (let i = 1; i < count; i++) {
    let newHash = baseHash;
    const differences = Math.floor((1 - similarity) * hashLength);
    
    for (let j = 0; j < differences; j++) {
      const pos = Math.floor(Math.random() * hashLength);
      const newChar = Math.random() > 0.5 ? '1' : '0';
      newHash = newHash.substring(0, pos) + newChar + newHash.substring(pos + 1);
    }
    hashes.push(newHash);
  }
  
  return hashes;
}

// Generate synthetic image files
export function generateSyntheticImages(): DuplicateCluster[] {
  const clusters: DuplicateCluster[] = [];
  
  // Cluster 1: Vacation photos (high similarity)
  const vacationHashes = generateSimilarHashes('10101010101010101010101010101010', 4, 0.95);
  const vacationCluster: DuplicateCluster = {
    id: 'vacation-cluster-1',
    similarity: 0.95,
    clusterType: 'image',
    members: [
      {
        id: 'vacation-1',
        filename: 'vacation_sunset_original.jpg',
        fileSize: 2.4 * 1024 * 1024,
        mimeType: 'image/jpeg',
        hash: vacationHashes[0],
        similarity: 1.0,
        isKeeper: true,
        metadata: {
          width: 1920,
          height: 1080,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
          modifiedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
        },
      },
      {
        id: 'vacation-2',
        filename: 'vacation_sunset_edited.jpg',
        fileSize: 2.1 * 1024 * 1024,
        mimeType: 'image/jpeg',
        hash: vacationHashes[1],
        similarity: 0.95,
        isKeeper: false,
        metadata: {
          width: 1920,
          height: 1080,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(),
          modifiedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(),
        },
      },
      {
        id: 'vacation-3',
        filename: 'IMG_2024_001.jpg',
        fileSize: 2.3 * 1024 * 1024,
        mimeType: 'image/jpeg',
        hash: vacationHashes[2],
        similarity: 0.93,
        isKeeper: false,
        metadata: {
          width: 1920,
          height: 1080,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
          modifiedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
        },
      },
      {
        id: 'vacation-4',
        filename: 'vacation_sunset_backup.jpg',
        fileSize: 2.0 * 1024 * 1024,
        mimeType: 'image/jpeg',
        hash: vacationHashes[3],
        similarity: 0.91,
        isKeeper: false,
        metadata: {
          width: 1920,
          height: 1080,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
          modifiedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
        },
      },
    ],
  };
  clusters.push(vacationCluster);

  // Cluster 2: Screenshots (medium similarity)
  const screenshotHashes = generateSimilarHashes('11001100110011001100110011001100', 3, 0.88);
  const screenshotCluster: DuplicateCluster = {
    id: 'screenshot-cluster-1',
    similarity: 0.88,
    clusterType: 'image',
    members: [
      {
        id: 'screenshot-1',
        filename: 'dashboard_screenshot_2024.png',
        fileSize: 800 * 1024,
        mimeType: 'image/png',
        hash: screenshotHashes[0],
        similarity: 1.0,
        isKeeper: true,
        metadata: {
          width: 1366,
          height: 768,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
          modifiedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        },
      },
      {
        id: 'screenshot-2',
        filename: 'dashboard_screenshot_copy.png',
        fileSize: 750 * 1024,
        mimeType: 'image/png',
        hash: screenshotHashes[1],
        similarity: 0.88,
        isKeeper: false,
        metadata: {
          width: 1366,
          height: 768,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
          modifiedAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
        },
      },
      {
        id: 'screenshot-3',
        filename: 'dashboard_screenshot_backup.png',
        fileSize: 820 * 1024,
        mimeType: 'image/png',
        hash: screenshotHashes[2],
        similarity: 0.85,
        isKeeper: false,
        metadata: {
          width: 1366,
          height: 768,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
          modifiedAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
        },
      },
    ],
  };
  clusters.push(screenshotCluster);

  // Cluster 3: Document scans (high similarity)
  const scanHashes = generateSimilarHashes('11110000111100001111000011110000', 2, 0.97);
  const scanCluster: DuplicateCluster = {
    id: 'scan-cluster-1',
    similarity: 0.97,
    clusterType: 'image',
    members: [
      {
        id: 'scan-1',
        filename: 'contract_scan_original.jpg',
        fileSize: 1.8 * 1024 * 1024,
        mimeType: 'image/jpeg',
        hash: scanHashes[0],
        similarity: 1.0,
        isKeeper: true,
        metadata: {
          width: 2480,
          height: 3508, // A4 size at 300 DPI
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
          modifiedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
        },
      },
      {
        id: 'scan-2',
        filename: 'contract_scan_enhanced.jpg',
        fileSize: 1.9 * 1024 * 1024,
        mimeType: 'image/jpeg',
        hash: scanHashes[1],
        similarity: 0.97,
        isKeeper: false,
        metadata: {
          width: 2480,
          height: 3508,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
          modifiedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        },
      },
    ],
  };
  clusters.push(scanCluster);

  return clusters;
}

// Generate synthetic PDF files
export function generateSyntheticPDFs(): DuplicateCluster[] {
  const clusters: DuplicateCluster[] = [];
  
  // Cluster 1: Research papers (high similarity)
  const paperHashes = generateSimilarHashes('10101010101010101010101010101010', 3, 0.92);
  const paperCluster: DuplicateCluster = {
    id: 'paper-cluster-1',
    similarity: 0.92,
    clusterType: 'pdf',
    members: [
      {
        id: 'paper-1',
        filename: 'research_paper_final.pdf',
        fileSize: 2.1 * 1024 * 1024,
        mimeType: 'application/pdf',
        hash: paperHashes[0],
        similarity: 1.0,
        isKeeper: true,
        metadata: {
          pages: 15,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
          modifiedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
        },
      },
      {
        id: 'paper-2',
        filename: 'research_paper_draft.pdf',
        fileSize: 1.9 * 1024 * 1024,
        mimeType: 'application/pdf',
        hash: paperHashes[1],
        similarity: 0.92,
        isKeeper: false,
        metadata: {
          pages: 14,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(),
          modifiedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 6).toISOString(),
        },
      },
      {
        id: 'paper-3',
        filename: 'research_paper_backup.pdf',
        fileSize: 2.0 * 1024 * 1024,
        mimeType: 'application/pdf',
        hash: paperHashes[2],
        similarity: 0.89,
        isKeeper: false,
        metadata: {
          pages: 15,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
          modifiedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
        },
      },
    ],
  };
  clusters.push(paperCluster);

  // Cluster 2: Financial reports (medium similarity)
  const reportHashes = generateSimilarHashes('11001100110011001100110011001100', 2, 0.85);
  const reportCluster: DuplicateCluster = {
    id: 'report-cluster-1',
    similarity: 0.85,
    clusterType: 'pdf',
    members: [
      {
        id: 'report-1',
        filename: 'financial_report_q4_2024.pdf',
        fileSize: 3.2 * 1024 * 1024,
        mimeType: 'application/pdf',
        hash: reportHashes[0],
        similarity: 1.0,
        isKeeper: true,
        metadata: {
          pages: 25,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
          modifiedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
        },
      },
      {
        id: 'report-2',
        filename: 'financial_report_q4_2024_revised.pdf',
        fileSize: 3.4 * 1024 * 1024,
        mimeType: 'application/pdf',
        hash: reportHashes[1],
        similarity: 0.85,
        isKeeper: false,
        metadata: {
          pages: 26,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
          modifiedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
        },
      },
    ],
  };
  clusters.push(reportCluster);

  return clusters;
}

// Generate all synthetic test data
export function generateAllSyntheticData(): DuplicateCluster[] {
  const imageClusters = generateSyntheticImages();
  const pdfClusters = generateSyntheticPDFs();
  
  return [...imageClusters, ...pdfClusters];
}

// Generate comprehensive test statistics
export function generateTestStatistics() {
  const allClusters = generateAllSyntheticData();
  const allFiles = allClusters.flatMap(cluster => cluster.members);
  
  const totalFiles = allFiles.length;
  const totalDuplicates = allFiles.filter(file => !file.isKeeper).length;
  const totalKeepers = allFiles.filter(file => file.isKeeper).length;
  const totalSize = allFiles.reduce((sum, file) => sum + file.fileSize, 0);
  
  const imageFiles = allFiles.filter(file => file.mimeType.startsWith('image/'));
  const pdfFiles = allFiles.filter(file => file.mimeType === 'application/pdf');
  
  return {
    totalFiles,
    totalDuplicates,
    totalKeepers,
    totalSize,
    duplicateClusters: allClusters.length,
    fileTypes: {
      images: imageFiles.length,
      pdfs: pdfFiles.length,
    },
    averageSimilarity: allClusters.reduce((sum, cluster) => sum + cluster.similarity, 0) / allClusters.length,
  };
}
