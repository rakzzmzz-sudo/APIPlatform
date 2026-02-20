-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "full_name" TEXT,
    "organization_name" TEXT,
    "balance" REAL NOT NULL DEFAULT 0,
    "role" TEXT NOT NULL DEFAULT 'user',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Industry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "industry_name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "CustomerSegment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "segment_name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Customer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "company_name" TEXT NOT NULL,
    "business_registration_number" TEXT,
    "industry_id" TEXT,
    "customer_segment_id" TEXT,
    "website" TEXT,
    "phone_number" TEXT,
    "email" TEXT,
    "city" TEXT,
    "country" TEXT,
    "contract_value" REAL NOT NULL DEFAULT 0,
    "customer_status" TEXT NOT NULL DEFAULT 'active',
    "contact_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "created_by" TEXT,
    CONSTRAINT "Customer_industry_id_fkey" FOREIGN KEY ("industry_id") REFERENCES "Industry" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Customer_customer_segment_id_fkey" FOREIGN KEY ("customer_segment_id") REFERENCES "CustomerSegment" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CustomerHealthScore" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "customer_id" TEXT NOT NULL,
    "health_score" INTEGER NOT NULL,
    "health_status" TEXT NOT NULL,
    "engagement_score" INTEGER NOT NULL,
    "satisfaction_score" INTEGER NOT NULL,
    "churn_risk_level" TEXT NOT NULL,
    "churn_probability" INTEGER NOT NULL,
    "calculated_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CustomerHealthScore_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "Customer" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CustomerInteraction" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "customer_id" TEXT NOT NULL,
    "interaction_type" TEXT NOT NULL,
    "interaction_channel" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "description" TEXT,
    "outcome" TEXT,
    "sentiment" TEXT,
    "interaction_date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "duration_minutes" INTEGER NOT NULL DEFAULT 0,
    "user_id" TEXT,
    CONSTRAINT "CustomerInteraction_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "Customer" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CustomerSupportTicket" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "customer_id" TEXT NOT NULL,
    "ticket_number" TEXT NOT NULL,
    "ticket_subject" TEXT NOT NULL,
    "ticket_description" TEXT,
    "ticket_priority" TEXT NOT NULL,
    "ticket_status" TEXT NOT NULL,
    "ticket_category" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT,
    "assigned_to" TEXT,
    CONSTRAINT "CustomerSupportTicket_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "Customer" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CustomerActivity" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "customer_id" TEXT NOT NULL,
    "activity_type" TEXT NOT NULL,
    "activity_title" TEXT NOT NULL,
    "activity_description" TEXT,
    "activity_status" TEXT NOT NULL,
    "due_date" DATETIME,
    "priority" TEXT NOT NULL,
    "completed_at" DATETIME,
    "created_by" TEXT,
    "assigned_to" TEXT,
    CONSTRAINT "CustomerActivity_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "Customer" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CustomerNote" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "customer_id" TEXT NOT NULL,
    "note_title" TEXT NOT NULL,
    "note_content" TEXT NOT NULL,
    "note_type" TEXT NOT NULL,
    "is_pinned" BOOLEAN NOT NULL DEFAULT false,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT,
    CONSTRAINT "CustomerNote_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "Customer" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CustomerRevenueMetric" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "customer_id" TEXT NOT NULL,
    "total_revenue" REAL NOT NULL DEFAULT 0,
    "monthly_recurring_revenue" REAL NOT NULL DEFAULT 0,
    "annual_recurring_revenue" REAL NOT NULL DEFAULT 0,
    "lifetime_value" REAL NOT NULL DEFAULT 0,
    "total_orders" INTEGER NOT NULL DEFAULT 0,
    "average_order_value" REAL NOT NULL DEFAULT 0,
    CONSTRAINT "CustomerRevenueMetric_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "Customer" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Platform" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "platform_name" TEXT NOT NULL,
    "platform_type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "total_messages" INTEGER NOT NULL DEFAULT 0,
    "total_campaigns" INTEGER NOT NULL DEFAULT 0,
    "success_rate" REAL NOT NULL DEFAULT 0,
    "last_sync" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "campaigns" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "campaign_name" TEXT NOT NULL,
    "campaign_type" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "platform_id" TEXT NOT NULL,
    "messages_sent" INTEGER NOT NULL DEFAULT 0,
    "messages_delivered" INTEGER NOT NULL DEFAULT 0,
    "messages_failed" INTEGER NOT NULL DEFAULT 0,
    "success_rate" REAL NOT NULL DEFAULT 0,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "scheduled_at" DATETIME,
    "completed_at" DATETIME,
    CONSTRAINT "campaigns_platform_id_fkey" FOREIGN KEY ("platform_id") REFERENCES "Platform" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "sms_campaigns" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT,
    "campaign_name" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "total_recipients" INTEGER NOT NULL,
    "sent_recipients" INTEGER NOT NULL,
    "insent_recipients" INTEGER NOT NULL DEFAULT 0,
    "duplicate_numbers" INTEGER NOT NULL DEFAULT 0,
    "success_rate" REAL NOT NULL DEFAULT 0,
    "route_type" TEXT,
    "sender_id" TEXT,
    "message" TEXT,
    "template_id" TEXT,
    "recipient_source" TEXT,
    "created_by" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "sms_templates" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "template_name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "variables" TEXT NOT NULL,
    "use_case" TEXT,
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "sms_configurations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tenant_id" TEXT,
    "gateway_name" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "protocol" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "smpp_config" TEXT,
    "http_config" TEXT,
    "credentials" TEXT,
    "settings" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "sms_messages" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "campaign_id" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "error_message" TEXT,
    "sent_at" DATETIME,
    "delivered_at" DATETIME,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "sms_messages_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "sms_campaigns" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "rcs_campaigns" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT,
    "campaign_name" TEXT NOT NULL,
    "message_type" TEXT,
    "sender_id" TEXT,
    "message" TEXT,
    "template_id" TEXT,
    "recipient_source" TEXT,
    "status" TEXT NOT NULL,
    "total_recipients" INTEGER NOT NULL,
    "valid_numbers" INTEGER NOT NULL,
    "invalid_numbers" INTEGER NOT NULL DEFAULT 0,
    "duplicate_numbers" INTEGER NOT NULL DEFAULT 0,
    "created_by" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "rcs_templates" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "message_content" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "media_url" TEXT,
    "media_type" TEXT,
    "buttons" TEXT,
    "variables" TEXT NOT NULL,
    "use_case" TEXT NOT NULL,
    "is_default" BOOLEAN NOT NULL DEFAULT false,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "rcs_messages" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "campaign_id" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "error_message" TEXT,
    "sent_at" DATETIME,
    "delivered_at" DATETIME,
    "read_at" DATETIME,
    "credits" REAL,
    "error_code" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "rcs_messages_campaign_id_fkey" FOREIGN KEY ("campaign_id") REFERENCES "rcs_campaigns" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "message" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "pm_projects" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "project_key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "lead_id" TEXT,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "pm_issue_types" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "color" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "pm_issue_statuses" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "pm_issue_priorities" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "level" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "pm_sprints" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "goal" TEXT,
    "start_date" DATETIME NOT NULL,
    "end_date" DATETIME NOT NULL,
    "status" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "pm_sprints_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "pm_projects" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "pm_issues" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "issue_key" TEXT NOT NULL,
    "issue_number" INTEGER NOT NULL,
    "summary" TEXT NOT NULL,
    "description" TEXT,
    "issue_type_id" TEXT NOT NULL,
    "status_id" TEXT NOT NULL,
    "priority_id" TEXT NOT NULL,
    "project_id" TEXT NOT NULL,
    "sprint_id" TEXT,
    "assignee_id" TEXT,
    "reporter_id" TEXT,
    "story_points" INTEGER NOT NULL DEFAULT 0,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "pm_issues_issue_type_id_fkey" FOREIGN KEY ("issue_type_id") REFERENCES "pm_issue_types" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "pm_issues_status_id_fkey" FOREIGN KEY ("status_id") REFERENCES "pm_issue_statuses" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "pm_issues_priority_id_fkey" FOREIGN KEY ("priority_id") REFERENCES "pm_issue_priorities" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "pm_issues_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "pm_projects" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "pm_issues_sprint_id_fkey" FOREIGN KEY ("sprint_id") REFERENCES "pm_sprints" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "menu_access_control" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "menu_key" TEXT NOT NULL,
    "menu_name" TEXT NOT NULL,
    "is_enabled" BOOLEAN NOT NULL DEFAULT true,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Platform_platform_name_key" ON "Platform"("platform_name");

-- CreateIndex
CREATE UNIQUE INDEX "pm_projects_project_key_key" ON "pm_projects"("project_key");

-- CreateIndex
CREATE UNIQUE INDEX "pm_issues_issue_key_key" ON "pm_issues"("issue_key");
