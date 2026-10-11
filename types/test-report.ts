export interface TestStep {
  title: string;
  duration?: number;
  error?: string;
}

export interface TestCaseItem {
  id: string;
  title: string;
  suite: string;
  file: string;
  line: number;
  status: 'passed' | 'failed' | 'skipped' | 'timedOut' | 'flaky';
  duration: number; // ms
  browser: string;
  error?: {
    message: string;
    stack?: string;
    snippet?: string;
    location?: {
      file: string;
      line: number;
      column: number;
    };
  };
  steps?: TestStep[];
  stdout?: string[];
  stderr?: string[];
}

export interface TestRunReport {
  summary: {
    total: number;
    passed: number;
    failed: number;
    skipped: number;
    flaky: number;
    duration: number;
    startTime: string;
    passRate: number;
  };
  tests: TestCaseItem[];
}
