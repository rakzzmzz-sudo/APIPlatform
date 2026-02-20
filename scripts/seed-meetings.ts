import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Starting meeting seeding...');

  // Get or create a default user
  let user = await prisma.user.findFirst();
  if (!user) {
    user = await prisma.user.create({
      data: {
        email: 'demo@example.com',
        full_name: 'Demo User',
        organization_name: 'Demo Corp',
        balance: 1000.0,
        role: 'user'
      }
    });
  }

  // Clear existing data
  await prisma.meetingAIInsight.deleteMany();
  await prisma.meetingAnalytics.deleteMany();
  await prisma.meetingSummary.deleteMany();
  await prisma.meetingActionItem.deleteMany();
  await prisma.meetingTranscript.deleteMany();
  await prisma.meetingParticipant.deleteMany();
  await prisma.meeting.deleteMany();

  const SAMPLE_MEETINGS = [
    {
      title: 'Q1 Product Strategy Sync',
      desc: 'Quarterly alignment on product roadmap and feature prioritization.',
      status: 'ended',
      type: 'product_steering',
      duration: 60,
      tags: ['product', 'strategy', '2026'],
      host_name: 'Sarah Chen'
    },
    {
      title: 'Global Sales Pipeline Review',
      desc: 'Reviewing enterprise deals and regional sales forecasts.',
      status: 'live',
      type: 'sales_review',
      duration: 45,
      tags: ['sales', 'global', 'enterprise'],
      host_name: 'Michael Ross'
    },
    {
      title: 'Engineering: Microservices Migration',
      desc: 'Technical deep dive into the legacy to microservices transition plan.',
      status: 'ended',
      type: 'technical_sync',
      duration: 90,
      tags: ['engineering', 'backend', 'migration'],
      host_name: 'David Miller'
    },
    {
      title: 'Marketing: Spring Campaign Brainstorm',
      desc: 'Creative session for multi-channel marketing campaigns.',
      status: 'scheduled',
      type: 'creative_workshop',
      duration: 60,
      tags: ['marketing', 'campaign', 'spring'],
      host_name: 'Lisa Wong'
    },
    {
      title: 'Customer Success: Tier 1 Health Review',
      desc: 'Bi-weekly health check for top-tier enterprise accounts.',
      status: 'ended',
      type: 'account_review',
      duration: 30,
      tags: ['customer_success', 'retention'],
      host_name: 'Elena Rodriguez'
    },
    {
      title: 'Monthly Town Hall: Growth & Vision',
      desc: 'Monthly CEO update to the entire organization.',
      status: 'scheduled',
      type: 'town_hall',
      duration: 45,
      tags: ['company', 'culture', 'growth'],
      host_name: 'Alex Tan'
    },
    {
      title: 'HR: Recruitment Strategy 2026',
      desc: 'Planning hiring targets and diversity initiatives.',
      status: 'ended',
      type: 'hr_planning',
      duration: 45,
      tags: ['hr', 'hiring', 'strategy'],
      host_name: 'Sarah Chen'
    },
    {
      title: 'Security Compliance Audit Prep',
      desc: 'Internal review of security controls for upcoming audit.',
      status: 'ended',
      type: 'security_audit',
      duration: 120,
      tags: ['security', 'compliance', 'iso27001'],
      host_name: 'David Miller'
    },
    {
      title: 'Finance: Annual Budget Planning',
      desc: 'Reviewing budget allocations for the next fiscal year.',
      status: 'scheduled',
      type: 'finance_sync',
      duration: 60,
      tags: ['finance', 'budget', '2026'],
      host_name: 'Michael Ross'
    },
    {
      title: 'Operations: Supply Chain Optimization',
      desc: 'Discussion on logistics and vendor management improvements.',
      status: 'ended',
      type: 'ops_review',
      duration: 60,
      tags: ['ops', 'logistics', 'vendor'],
      host_name: 'Lisa Wong'
    }
  ];

  const participantPool = [
    { name: 'Alice Smith', email: 'alice@example.com' },
    { name: 'Bob Johnson', email: 'bob@example.com' },
    { name: 'Charlie Davis', email: 'charlie@example.com' },
    { name: 'Diana Prince', email: 'diana@example.com' },
    { name: 'Edward Norton', email: 'edward@example.com' },
    { name: 'Frank Miller', email: 'frank@example.com' },
    { name: 'Grace Hopper', email: 'grace@example.com' }
  ];

  const transcriptPool = [
    { speaker: 'Host', text: 'Let\'s start the discussion on our primary goals.', sentiment: 'neutral' },
    { speaker: 'Lead', text: 'I recommend we focus on the core platform first.', sentiment: 'positive' },
    { speaker: 'Member', text: 'Do we have enough developers to cover that?', sentiment: 'neutral', isQuestion: true },
    { speaker: 'Lead', text: 'Yes, we have allocated three senior devs for this phase.', sentiment: 'positive' },
    { speaker: 'Host', text: 'Great, let\'s move forward with that plan.', sentiment: 'positive' }
  ];

  for (let i = 0; i < SAMPLE_MEETINGS.length; i++) {
    const sm = SAMPLE_MEETINGS[i];
    const meetingId = `meeting-${i + 1}`;
    
    // Calculate dates
    const now = new Date();
    let startTime = new Date(now);
    if (sm.status === 'ended') {
      startTime.setDate(now.getDate() - (i + 1));
    } else if (sm.status === 'scheduled') {
      startTime.setDate(now.getDate() + (i + 1));
    }
    const endTime = new Date(startTime.getTime() + sm.duration * 60000);

    const meeting = await prisma.meeting.create({
      data: {
        host_user_id: user.id,
        meeting_title: sm.title,
        meeting_description: sm.desc,
        meeting_type: sm.type,
        status: sm.status,
        host_name: sm.host_name,
        room_id: `room-${meetingId}`,
        room_url: `https://meet.cpaas-platform.com/${meetingId}`,
        scheduled_start_time: startTime,
        scheduled_end_time: endTime,
        actual_start_time: sm.status === 'ended' ? startTime : (sm.status === 'live' ? startTime : null),
        actual_end_time: sm.status === 'ended' ? endTime : null,
        duration_minutes: sm.duration,
        enable_transcription: true,
        enable_ai_summary: true,
        enable_action_items: true,
        enable_sentiment_analysis: true,
        tags: JSON.stringify(sm.tags)
      }
    });

    // Add participants for all meetings
    const numParticipants = 3 + Math.floor(Math.random() * 4);
    for (let j = 0; j < numParticipants; j++) {
      const p = participantPool[j];
      await prisma.meetingParticipant.create({
        data: {
          meeting_id: meeting.id,
          participant_name: p.name,
          participant_email: p.email,
          role: j === 0 ? 'host' : (j === 1 ? 'co-host' : 'participant'),
          joined_at: startTime,
          left_at: sm.status === 'ended' ? endTime : null,
          speaking_time_seconds: Math.floor(Math.random() * (sm.duration * 60)),
          questions_asked: Math.floor(Math.random() * 8),
          reactions_count: Math.floor(Math.random() * 15)
        }
      });
    }

    if (sm.status === 'ended') {
      // Add transcripts
      for (let k = 0; k < transcriptPool.length; k++) {
        const t = transcriptPool[k];
        await prisma.meetingTranscript.create({
          data: {
            meeting_id: meeting.id,
            segment_number: k + 1,
            speaker_name: t.speaker === 'Host' ? sm.host_name : (t.speaker === 'Lead' ? participantPool[1].name : participantPool[2].name),
            transcript_text: t.text,
            start_time_seconds: k * 30,
            end_time_seconds: (k + 1) * 30,
            sentiment: t.sentiment,
            is_question: t.isQuestion || false,
            keywords: JSON.stringify(['strategy', 'platform', 'resource']),
            topics: JSON.stringify(['Planning', 'Infrastructure'])
          }
        });
      }

      // Add summaries
      await prisma.meetingSummary.create({
        data: {
          meeting_id: meeting.id,
          summary_type: 'executive',
          summary_text: `The ${sm.title} meeting resulted in a clear path forward for our ${sm.tags[0]} initiatives. The team reached consensus on resource allocation and timelines.`,
          key_points: JSON.stringify(['Primary goal alignment', 'Resource confirm', 'Timeline set']),
          decisions_made: JSON.stringify(['Proceed with phase 1', 'Approve budget increase']),
          next_steps: JSON.stringify(['Draft final report', 'Schedule follow-up']),
          confidence_score: 0.85 + (Math.random() * 0.1)
        }
      });

      // Add analytics
      await prisma.meetingAnalytics.create({
        data: {
          meeting_id: meeting.id,
          total_participants: numParticipants,
          peak_concurrent_participants: numParticipants,
          total_speaking_time_seconds: Math.floor(sm.duration * 60 * 0.8),
          engagement_score: 7.5 + (Math.random() * 2),
          participation_balance: 0.6 + (Math.random() * 0.3),
          action_items_count: 3
        }
      });

      // Add action items
      const priorities = ['urgent', 'high', 'medium', 'low'];
      for (let l = 0; l < 3; l++) {
        await prisma.meetingActionItem.create({
          data: {
            meeting_id: meeting.id,
            action_item_text: `Action item ${l + 1} for ${sm.title}`,
            action_item_type: l === 1 ? 'decision' : 'task',
            assigned_to: participantPool[l].name,
            due_date: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
            priority: priorities[l],
            status: l === 2 ? 'completed' : 'pending',
            confidence_score: 0.9
          }
        });
      }

      // Add AI insights
      await prisma.meetingAIInsight.create({
        data: {
          meeting_id: meeting.id,
          insight_type: 'engagement',
          insight_category: 'Participation',
          insight_title: 'Unbalanced Participation',
          insight_description: 'The host spoke for 60% of the meeting. Consider encouraging more input from other members.',
          importance_score: 6.5,
          confidence_level: 0.92
        }
      });

      await prisma.meetingAIInsight.create({
        data: {
          meeting_id: meeting.id,
          insight_type: 'topic',
          insight_category: 'Focus Area',
          insight_title: 'Infrastructure Focus',
          insight_description: '30% of the meeting was spent discussing backend infrastructure and scalability.',
          importance_score: 8.0,
          confidence_level: 0.88
        }
      });
    }
  }

  console.log('Meeting seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
