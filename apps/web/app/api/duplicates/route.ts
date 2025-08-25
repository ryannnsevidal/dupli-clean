import { NextResponse } from 'next/server';

export async function GET() {
  // Comprehensive synthetic test data for near-duplicate detection demo
  const demoDuplicates = [
    {
      id: 'vacation-cluster-1',
      similarity: 0.95,
      members: [
        {
          id: 'vacation-1',
          asset: {
            id: 'vacation-1',
            file: {
              originalName: 'vacation_sunset_original.jpg',
              byteSize: 2.4 * 1024 * 1024, // Convert to regular number
            },
            width: 1920,
            height: 1080,
            thumbKey: 'thumb-vacation-1',
          },
          isKeeper: true,
        },
        {
          id: 'vacation-2',
          asset: {
            id: 'vacation-2',
            file: {
              originalName: 'vacation_sunset_edited.jpg',
              byteSize: 2.1 * 1024 * 1024, // Convert to regular number
            },
            width: 1920,
            height: 1080,
            thumbKey: 'thumb-vacation-2',
          },
          isKeeper: false,
        },
        {
          id: 'vacation-3',
          asset: {
            id: 'vacation-3',
            file: {
              originalName: 'IMG_2024_001.jpg',
              byteSize: 2.3 * 1024 * 1024, // Convert to regular number
            },
            width: 1920,
            height: 1080,
            thumbKey: 'thumb-vacation-3',
          },
          isKeeper: false,
        },
        {
          id: 'vacation-4',
          asset: {
            id: 'vacation-4',
            file: {
              originalName: 'vacation_sunset_backup.jpg',
              byteSize: 2.0 * 1024 * 1024, // Convert to regular number
            },
            width: 1920,
            height: 1080,
            thumbKey: 'thumb-vacation-4',
          },
          isKeeper: false,
        },
      ],
    },
    {
      id: 'screenshot-cluster-1',
      similarity: 0.88,
      members: [
        {
          id: 'screenshot-1',
          asset: {
            id: 'screenshot-1',
            file: {
              originalName: 'dashboard_screenshot_2024.png',
              byteSize: 800 * 1024, // Convert to regular number
            },
            width: 1366,
            height: 768,
            thumbKey: 'thumb-screenshot-1',
          },
          isKeeper: true,
        },
        {
          id: 'screenshot-2',
          asset: {
            id: 'screenshot-2',
            file: {
              originalName: 'dashboard_screenshot_copy.png',
              byteSize: 750 * 1024, // Convert to regular number
            },
            width: 1366,
            height: 768,
            thumbKey: 'thumb-screenshot-2',
          },
          isKeeper: false,
        },
        {
          id: 'screenshot-3',
          asset: {
            id: 'screenshot-3',
            file: {
              originalName: 'dashboard_screenshot_backup.png',
              byteSize: 820 * 1024, // Convert to regular number
            },
            width: 1366,
            height: 768,
            thumbKey: 'thumb-screenshot-3',
          },
          isKeeper: false,
        },
      ],
    },
    {
      id: 'scan-cluster-1',
      similarity: 0.97,
      members: [
        {
          id: 'scan-1',
          asset: {
            id: 'scan-1',
            file: {
              originalName: 'contract_scan_original.jpg',
              byteSize: 1.8 * 1024 * 1024, // Convert to regular number
            },
            width: 2480,
            height: 3508,
            thumbKey: 'thumb-scan-1',
          },
          isKeeper: true,
        },
        {
          id: 'scan-2',
          asset: {
            id: 'scan-2',
            file: {
              originalName: 'contract_scan_enhanced.jpg',
              byteSize: 1.9 * 1024 * 1024, // Convert to regular number
            },
            width: 2480,
            height: 3508,
            thumbKey: 'thumb-scan-2',
          },
          isKeeper: false,
        },
      ],
    },
    {
      id: 'paper-cluster-1',
      similarity: 0.92,
      members: [
        {
          id: 'paper-1',
          asset: {
            id: 'paper-1',
            file: {
              originalName: 'research_paper_final.pdf',
              byteSize: 2.1 * 1024 * 1024, // Convert to regular number
            },
            width: null,
            height: null,
            thumbKey: 'thumb-paper-1',
          },
          isKeeper: true,
        },
        {
          id: 'paper-2',
          asset: {
            id: 'paper-2',
            file: {
              originalName: 'research_paper_draft.pdf',
              byteSize: 1.9 * 1024 * 1024, // Convert to regular number
            },
            width: null,
            height: null,
            thumbKey: 'thumb-paper-2',
          },
          isKeeper: false,
        },
        {
          id: 'paper-3',
          asset: {
            id: 'paper-3',
            file: {
              originalName: 'research_paper_backup.pdf',
              byteSize: 2.0 * 1024 * 1024, // Convert to regular number
            },
            width: null,
            height: null,
            thumbKey: 'thumb-paper-3',
          },
          isKeeper: false,
        },
      ],
    },
    {
      id: 'report-cluster-1',
      similarity: 0.85,
      members: [
        {
          id: 'report-1',
          asset: {
            id: 'report-1',
            file: {
              originalName: 'financial_report_q4_2024.pdf',
              byteSize: 3.2 * 1024 * 1024, // Convert to regular number
            },
            width: null,
            height: null,
            thumbKey: 'thumb-report-1',
          },
          isKeeper: true,
        },
        {
          id: 'report-2',
          asset: {
            id: 'report-2',
            file: {
              originalName: 'financial_report_q4_2024_revised.pdf',
              byteSize: 3.4 * 1024 * 1024, // Convert to regular number
            },
            width: null,
            height: null,
            thumbKey: 'thumb-report-2',
          },
          isKeeper: false,
        },
      ],
    },
  ];

  return NextResponse.json(demoDuplicates);
}
