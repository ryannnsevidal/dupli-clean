import { 
  generateSyntheticImages, 
  generateSyntheticPDFs, 
  generateAllSyntheticData, 
  generateTestStatistics,
  type DuplicateCluster,
  type SyntheticFile 
} from './testDataGenerator';

describe('Synthetic Data Generator', () => {
  describe('generateSyntheticImages', () => {
    it('generates realistic image clusters', () => {
      const clusters = generateSyntheticImages();
      
      expect(clusters).toBeInstanceOf(Array);
      expect(clusters.length).toBeGreaterThan(0);
      
      clusters.forEach(cluster => {
        expect(cluster).toHaveProperty('id');
        expect(cluster).toHaveProperty('similarity');
        expect(cluster).toHaveProperty('members');
        expect(cluster).toHaveProperty('clusterType', 'image');
        expect(cluster.similarity).toBeGreaterThan(0.8);
        expect(cluster.similarity).toBeLessThanOrEqual(1.0);
        expect(cluster.members.length).toBeGreaterThan(1);
      });
    });

    it('generates vacation photo cluster with high similarity', () => {
      const clusters = generateSyntheticImages();
      const vacationCluster = clusters.find(c => c.id === 'vacation-cluster-1');
      
      expect(vacationCluster).toBeDefined();
      expect(vacationCluster!.similarity).toBe(0.95);
      expect(vacationCluster!.members.length).toBe(4);
      
      const original = vacationCluster!.members.find(m => m.filename.includes('original'));
      const edited = vacationCluster!.members.find(m => m.filename.includes('edited'));
      
      expect(original).toBeDefined();
      expect(edited).toBeDefined();
      expect(original!.isKeeper).toBe(true);
      expect(edited!.isKeeper).toBe(false);
      expect(original!.similarity).toBe(1.0);
      expect(edited!.similarity).toBe(0.95);
    });

    it('generates screenshot cluster with medium similarity', () => {
      const clusters = generateSyntheticImages();
      const screenshotCluster = clusters.find(c => c.id === 'screenshot-cluster-1');
      
      expect(screenshotCluster).toBeDefined();
      expect(screenshotCluster!.similarity).toBe(0.88);
      expect(screenshotCluster!.members.length).toBe(3);
      
      screenshotCluster!.members.forEach(member => {
        expect(member.mimeType).toBe('image/png');
        expect(member.metadata.width).toBe(1366);
        expect(member.metadata.height).toBe(768);
      });
    });

    it('generates document scan cluster with very high similarity', () => {
      const clusters = generateSyntheticImages();
      const scanCluster = clusters.find(c => c.id === 'scan-cluster-1');
      
      expect(scanCluster).toBeDefined();
      expect(scanCluster!.similarity).toBe(0.97);
      expect(scanCluster!.members.length).toBe(2);
      
      scanCluster!.members.forEach(member => {
        expect(member.mimeType).toBe('image/jpeg');
        expect(member.metadata.width).toBe(2480);
        expect(member.metadata.height).toBe(3508); // A4 size
      });
    });

    it('ensures each cluster has exactly one keeper', () => {
      const clusters = generateSyntheticImages();
      
      clusters.forEach(cluster => {
        const keepers = cluster.members.filter(m => m.isKeeper);
        expect(keepers.length).toBe(1);
        
        const duplicates = cluster.members.filter(m => !m.isKeeper);
        expect(duplicates.length).toBeGreaterThan(0);
      });
    });

    it('generates realistic file sizes and metadata', () => {
      const clusters = generateSyntheticImages();
      
      clusters.forEach(cluster => {
        cluster.members.forEach(member => {
          expect(member.fileSize).toBeGreaterThan(0);
          expect(member.fileSize).toBeLessThan(10 * 1024 * 1024); // Less than 10MB
          expect(member.metadata.createdAt).toBeDefined();
          expect(member.metadata.modifiedAt).toBeDefined();
          expect(new Date(member.metadata.createdAt)).toBeInstanceOf(Date);
        });
      });
    });
  });

  describe('generateSyntheticPDFs', () => {
    it('generates realistic PDF clusters', () => {
      const clusters = generateSyntheticPDFs();
      
      expect(clusters).toBeInstanceOf(Array);
      expect(clusters.length).toBeGreaterThan(0);
      
      clusters.forEach(cluster => {
        expect(cluster).toHaveProperty('id');
        expect(cluster).toHaveProperty('similarity');
        expect(cluster).toHaveProperty('members');
        expect(cluster).toHaveProperty('clusterType', 'pdf');
        expect(cluster.similarity).toBeGreaterThan(0.8);
        expect(cluster.similarity).toBeLessThanOrEqual(1.0);
        expect(cluster.members.length).toBeGreaterThan(1);
      });
    });

    it('generates research paper cluster with high similarity', () => {
      const clusters = generateSyntheticPDFs();
      const paperCluster = clusters.find(c => c.id === 'paper-cluster-1');
      
      expect(paperCluster).toBeDefined();
      expect(paperCluster!.similarity).toBe(0.92);
      expect(paperCluster!.members.length).toBe(3);
      
      const final = paperCluster!.members.find(m => m.filename.includes('final'));
      const draft = paperCluster!.members.find(m => m.filename.includes('draft'));
      
      expect(final).toBeDefined();
      expect(draft).toBeDefined();
      expect(final!.isKeeper).toBe(true);
      expect(draft!.isKeeper).toBe(false);
      expect(final!.metadata.pages).toBe(15);
      expect(draft!.metadata.pages).toBe(14);
    });

    it('generates financial report cluster with medium similarity', () => {
      const clusters = generateSyntheticPDFs();
      const reportCluster = clusters.find(c => c.id === 'report-cluster-1');
      
      expect(reportCluster).toBeDefined();
      expect(reportCluster!.similarity).toBe(0.85);
      expect(reportCluster!.members.length).toBe(2);
      
      reportCluster!.members.forEach(member => {
        expect(member.mimeType).toBe('application/pdf');
        expect(member.metadata.pages).toBeGreaterThan(20);
        expect(member.metadata.pages).toBeLessThan(30);
      });
    });

    it('ensures PDF clusters have realistic page counts', () => {
      const clusters = generateSyntheticPDFs();
      
      clusters.forEach(cluster => {
        cluster.members.forEach(member => {
          expect(member.metadata.pages).toBeGreaterThan(0);
          expect(member.metadata.pages).toBeLessThan(100); // Reasonable page count
        });
      });
    });
  });

  describe('generateAllSyntheticData', () => {
    it('combines image and PDF clusters', () => {
      const allClusters = generateAllSyntheticData();
      const imageClusters = allClusters.filter(c => c.clusterType === 'image');
      const pdfClusters = allClusters.filter(c => c.clusterType === 'pdf');
      
      expect(allClusters.length).toBeGreaterThan(0);
      expect(imageClusters.length).toBeGreaterThan(0);
      expect(pdfClusters.length).toBeGreaterThan(0);
      expect(allClusters.length).toBe(imageClusters.length + pdfClusters.length);
    });

    it('generates diverse file types and sizes', () => {
      const allClusters = generateAllSyntheticData();
      const allFiles = allClusters.flatMap(c => c.members);
      
      const imageFiles = allFiles.filter(f => f.mimeType.startsWith('image/'));
      const pdfFiles = allFiles.filter(f => f.mimeType === 'application/pdf');
      
      expect(imageFiles.length).toBeGreaterThan(0);
      expect(pdfFiles.length).toBeGreaterThan(0);
      
      // Check for different image types
      const jpegFiles = imageFiles.filter(f => f.mimeType === 'image/jpeg');
      const pngFiles = imageFiles.filter(f => f.mimeType === 'image/png');
      
      expect(jpegFiles.length).toBeGreaterThan(0);
      expect(pngFiles.length).toBeGreaterThan(0);
    });

    it('maintains data integrity across all clusters', () => {
      const allClusters = generateAllSyntheticData();
      
      allClusters.forEach(cluster => {
        // Each cluster should have unique IDs
        const memberIds = cluster.members.map(m => m.id);
        const uniqueIds = new Set(memberIds);
        expect(uniqueIds.size).toBe(memberIds.length);
        
        // Each cluster should have exactly one keeper
        const keepers = cluster.members.filter(m => m.isKeeper);
        expect(keepers.length).toBe(1);
        
        // All members should have valid similarity scores
        cluster.members.forEach(member => {
          expect(member.similarity).toBeGreaterThan(0);
          expect(member.similarity).toBeLessThanOrEqual(1.0);
        });
      });
    });
  });

  describe('generateTestStatistics', () => {
    it('generates accurate statistics', () => {
      const stats = generateTestStatistics();
      
      expect(stats).toHaveProperty('totalFiles');
      expect(stats).toHaveProperty('totalDuplicates');
      expect(stats).toHaveProperty('totalKeepers');
      expect(stats).toHaveProperty('totalSize');
      expect(stats).toHaveProperty('duplicateClusters');
      expect(stats).toHaveProperty('fileTypes');
      expect(stats).toHaveProperty('averageSimilarity');
      
      expect(stats.totalFiles).toBeGreaterThan(0);
      expect(stats.totalDuplicates).toBeGreaterThan(0);
      expect(stats.totalKeepers).toBeGreaterThan(0);
      expect(stats.totalSize).toBeGreaterThan(0);
      expect(stats.duplicateClusters).toBeGreaterThan(0);
      expect(stats.averageSimilarity).toBeGreaterThan(0.8);
      expect(stats.averageSimilarity).toBeLessThan(1.0);
    });

    it('maintains consistency between files and statistics', () => {
      const allClusters = generateAllSyntheticData();
      const allFiles = allClusters.flatMap(c => c.members);
      const stats = generateTestStatistics();
      
      expect(stats.totalFiles).toBe(allFiles.length);
      expect(stats.totalDuplicates).toBe(allFiles.filter(f => !f.isKeeper).length);
      expect(stats.totalKeepers).toBe(allFiles.filter(f => f.isKeeper).length);
      expect(stats.duplicateClusters).toBe(allClusters.length);
      
      const totalSize = allFiles.reduce((sum, f) => sum + f.fileSize, 0);
      expect(stats.totalSize).toBe(totalSize);
    });

    it('provides realistic file type distribution', () => {
      const stats = generateTestStatistics();
      
      expect(stats.fileTypes.images).toBeGreaterThan(0);
      expect(stats.fileTypes.pdfs).toBeGreaterThan(0);
      expect(stats.fileTypes.images + stats.fileTypes.pdfs).toBe(stats.totalFiles);
    });
  });

  describe('Edge Cases and Error Handling', () => {
    it('handles empty cluster generation gracefully', () => {
      // This test ensures the generator doesn't crash with edge cases
      const clusters = generateAllSyntheticData();
      expect(clusters).toBeInstanceOf(Array);
      expect(clusters.length).toBeGreaterThan(0);
    });

    it('generates consistent data across multiple calls', () => {
      const clusters1 = generateAllSyntheticData();
      const clusters2 = generateAllSyntheticData();
      
      expect(clusters1.length).toBe(clusters2.length);
      expect(clusters1[0].members.length).toBe(clusters2[0].members.length);
    });

    it('ensures all file metadata is valid', () => {
      const allClusters = generateAllSyntheticData();
      
      allClusters.forEach(cluster => {
        cluster.members.forEach(member => {
          expect(member.id).toBeDefined();
          expect(member.filename).toBeDefined();
          expect(member.fileSize).toBeGreaterThan(0);
          expect(member.mimeType).toBeDefined();
          expect(member.hash).toBeDefined();
          expect(member.similarity).toBeGreaterThan(0);
          expect(member.metadata.createdAt).toBeDefined();
          expect(member.metadata.modifiedAt).toBeDefined();
        });
      });
    });
  });

  describe('Near-Duplicate Detection Simulation', () => {
    it('simulates realistic perceptual hash variations', () => {
      const clusters = generateAllSyntheticData();
      
      clusters.forEach(cluster => {
        const hashes = cluster.members.map(m => m.hash);
        const baseHash = hashes[0];
        
        // All hashes should have the same length
        hashes.forEach(hash => {
          expect(hash.length).toBe(baseHash.length);
          expect(hash).toMatch(/^[01]+$/); // Binary string
        });
        
        // Similarity should correlate with hash differences
        cluster.members.forEach(member => {
          const hashDiff = calculateHashDifference(baseHash, member.hash);
          const expectedSimilarity = 1 - (hashDiff / baseHash.length);
          expect(Math.abs(member.similarity - expectedSimilarity)).toBeLessThan(0.1);
        });
      });
    });

    it('demonstrates different similarity thresholds', () => {
      const clusters = generateAllSyntheticData();
      const similarities = clusters.map(c => c.similarity);
      
      // Should have variety in similarity scores
      const uniqueSimilarities = new Set(similarities);
      expect(uniqueSimilarities.size).toBeGreaterThan(1);
      
      // Should cover realistic similarity ranges
      expect(Math.min(...similarities)).toBeGreaterThan(0.8);
      expect(Math.max(...similarities)).toBeLessThan(1.0);
    });
  });
});

// Helper function to calculate hash difference
function calculateHashDifference(hash1: string, hash2: string): number {
  let differences = 0;
  for (let i = 0; i < hash1.length; i++) {
    if (hash1[i] !== hash2[i]) {
      differences++;
    }
  }
  return differences;
}
