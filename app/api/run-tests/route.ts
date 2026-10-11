import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import util from 'util';

const execPromise = util.promisify(exec);

export async function POST() {
  try {
    // Run playwright test; it might exit with code 1 if tests fail, so catch error and still parse
    try {
      await execPromise('npx playwright test', { cwd: process.cwd() });
    } catch {
      // Expected when tests intentionally fail
    }

    return NextResponse.json({ success: true, message: 'Test execution finished' });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to run tests', details: error.message },
      { status: 500 }
    );
  }
}
