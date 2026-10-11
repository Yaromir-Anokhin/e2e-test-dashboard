import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { TestCaseItem, TestRunReport } from '@/types/test-report';


function cleanAnsiCodes(str: string): string {
  if (!str) return '';
  // Remove ANSI escape codes
  return str.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '');
}

export async function GET() {
  try {
    const reportPath = path.join(process.cwd(), 'playwright-report', 'test-results.json');

    if (!fs.existsSync(reportPath)) {
      return NextResponse.json(
        { error: 'Playwright report file not found. Please run tests first.' },
        { status: 404 }
      );
    }

    const rawData = fs.readFileSync(reportPath, 'utf-8');
    const json = JSON.parse(rawData);

    const tests: TestCaseItem[] = [];

    // Helper function to extract specs recursively
    function extractSuites(suites: any[], parentSuiteName = '') {
      for (const suite of suites) {
        const suiteName = parentSuiteName ? `${parentSuiteName} > ${suite.title}` : suite.title;

        if (suite.specs && suite.specs.length > 0) {
          for (const spec of suite.specs) {
            for (const testInstance of spec.tests || []) {
              const result = testInstance.results?.[0];
              const browser = testInstance.projectName || testInstance.projectId || 'chromium';

              let status: TestCaseItem['status'] = 'passed';
              if (result) {
                if (result.status === 'passed') status = 'passed';
                else if (result.status === 'failed') status = 'failed';
                else if (result.status === 'timedOut') status = 'timedOut';
                else if (result.status === 'skipped') status = 'skipped';
                else status = 'failed';
              }

              let errorDetails: TestCaseItem['error'] = undefined;
              if (result?.error) {
                errorDetails = {
                  message: cleanAnsiCodes(result.error.message || ''),
                  stack: cleanAnsiCodes(result.error.stack || ''),
                  snippet: cleanAnsiCodes(result.error.snippet || ''),
                  location: result.error.location,
                };
              } else if (result?.errors && result.errors.length > 0) {
                errorDetails = {
                  message: cleanAnsiCodes(result.errors[0].message || ''),
                  stack: cleanAnsiCodes(result.errors[0].stack || ''),
                  snippet: cleanAnsiCodes(result.errors[0].snippet || ''),
                  location: result.errors[0].location,
                };
              }

              const steps = (result?.steps || []).map((step: any) => ({
                title: cleanAnsiCodes(step.title),
                duration: step.duration,
                error: step.error ? cleanAnsiCodes(step.error.message || '') : undefined,
              }));

              tests.push({
                id: spec.id || `${spec.file}-${spec.line}-${testInstance.projectName}`,
                title: spec.title,
                suite: suiteName,
                file: spec.file,
                line: spec.line,
                status,
                duration: result?.duration ?? 0,
                browser,
                error: errorDetails,
                steps: steps.length > 0 ? steps : undefined,
                stdout: result?.stdout?.map((o: any) => cleanAnsiCodes(typeof o === 'string' ? o : o.text || '')),
                stderr: result?.stderr?.map((o: any) => cleanAnsiCodes(typeof o === 'string' ? o : o.text || '')),
              });
            }
          }
        }

        if (suite.suites && suite.suites.length > 0) {
          extractSuites(suite.suites, suiteName);
        }
      }
    }

    if (json.suites) {
      extractSuites(json.suites);
    }

    const total = tests.length;
    const passed = tests.filter((t) => t.status === 'passed').length;
    const failed = tests.filter((t) => t.status === 'failed' || t.status === 'timedOut').length;
    const skipped = tests.filter((t) => t.status === 'skipped').length;
    const flaky = json.stats?.flaky || 0;
    const passRate = total > 0 ? Math.round((passed / total) * 100) : 0;

    const report: TestRunReport = {
      summary: {
        total,
        passed,
        failed,
        skipped,
        flaky,
        duration: Math.round(json.stats?.duration || 0),
        startTime: json.stats?.startTime || new Date().toISOString(),
        passRate,
      },
      tests,
    };

    return NextResponse.json(report);
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Failed to parse Playwright report', details: err?.message },
      { status: 500 }
    );
  }
}
