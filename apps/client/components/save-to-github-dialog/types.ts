/**
 * Type definitions for GitHub commit form data.
 * Includes:
 * - File name field
 * - Commit message field
 *
 *   ( )
 */

export interface CommitForm {
  commitSummary: string;
  fileName: string;
}
