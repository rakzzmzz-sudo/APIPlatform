/*
  Warnings:

  - You are about to drop the `pm_issue_priorities` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `pm_issue_statuses` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `pm_issue_types` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `pm_issues` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `pm_projects` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `pm_sprints` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "pm_issue_priorities";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "pm_issue_statuses";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "pm_issue_types";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "pm_issues";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "pm_projects";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "pm_sprints";
PRAGMA foreign_keys=on;
