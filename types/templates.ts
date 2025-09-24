import type { Block } from "./blocks"

export interface BlockTemplate {
  id: string
  name: string
  description: string
  category: string
  icon: string
  blocks: Omit<Block, "id" | "createdAt" | "updatedAt">[]
  preview?: string
  coverPhoto?: string
}

export const blockTemplates: BlockTemplate[] = [
  {
    id: "getting-started",
    name: "Getting Started",
    description: "Welcome template with introduction and quick start guide",
    category: "Workspace",
    icon: "🚀",
    preview: "Welcome message with setup steps and helpful resources",
    blocks: [
      {
        type: "image",
        content: {
          url: "/welcome-workspace-banner-with-rocket-and-stars.jpg",
          caption: "Welcome to your new workspace!",
          altText: "Welcome banner with workspace elements",
        },
      },
      {
        type: "heading",
        content: { text: "Welcome to Your Workspace! 🎉", level: 1 },
      },
      {
        type: "text",
        content: {
          text: "This is your personal workspace where you can organize your thoughts, projects, and ideas. Let's get you started!",
        },
      },
      {
        type: "heading",
        content: { text: "Quick Start Guide", level: 2 },
      },
      {
        type: "numbered-list",
        content: {
          items: [
            "Create your first page by clicking '+ New page' in the sidebar",
            "Try different block types by typing '/' and selecting from the menu",
            "Organize your pages using the sidebar navigation",
            "Use templates to quickly create structured content",
          ],
        },
      },
      {
        type: "heading",
        content: { text: "Helpful Tips", level: 2 },
      },
      {
        type: "bullet-list",
        content: {
          items: [
            "Press '/' to open the block menu",
            "Use '@' to mention pages or create links",
            "Drag and drop blocks to reorder them",
            "Click on any text to start editing",
          ],
        },
      },
      {
        type: "quote",
        content: { text: '"The secret to getting ahead is getting started." - Mark Twain' },
      },
      {
        type: "divider",
        content: {},
      },
      {
        type: "text",
        content: {
          text: "Ready to begin? Start by creating your first page or exploring the templates available in the sidebar.",
        },
      },
    ],
  },
  {
    id: "quick-note",
    name: "Quick Note",
    description: "Simple note template for capturing quick thoughts and ideas",
    category: "Workspace",
    icon: "📌",
    preview: "Quick capture template with date, tags, and action items",
    blocks: [
      {
        type: "heading",
        content: { text: "Quick Note", level: 1 },
      },
      {
        type: "text",
        content: { text: `**Date:** ${new Date().toLocaleDateString()}\\n**Tags:** #idea #todo #important` },
      },
      {
        type: "divider",
        content: {},
      },
      {
        type: "image",
        content: {
          url: "/lightbulb-idea-inspiration-note-taking.jpg",
          caption: "Capture your brilliant ideas",
          altText: "Lightbulb representing ideas and inspiration",
        },
      },
      {
        type: "text",
        content: { text: "Capture your thoughts here..." },
      },
      {
        type: "heading",
        content: { text: "Action Items", level: 3 },
      },
      {
        type: "todo",
        content: { text: "Follow up on this idea", completed: false },
      },
      {
        type: "todo",
        content: { text: "Research more about this topic", completed: false },
      },
    ],
  },
  {
    id: "personal-home",
    name: "Personal Home",
    description: "Personal dashboard with goals, habits, and daily planning",
    category: "Workspace",
    icon: "🏠",
    preview: "Personal dashboard with goals, daily tasks, and reflection space",
    blocks: [
      {
        type: "image",
        content: {
          url: "/cozy-home-office-workspace-with-plants-and-books.jpg",
          caption: "Your personal productivity space",
          altText: "Cozy home office setup with plants and organization",
        },
      },
      {
        type: "heading",
        content: { text: "Personal Dashboard", level: 1 },
      },
      {
        type: "text",
        content: {
          text: `**Today:** ${new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}`,
        },
      },
      {
        type: "heading",
        content: { text: "Daily Goals", level: 2 },
      },
      {
        type: "todo",
        content: { text: "Complete morning routine", completed: false },
      },
      {
        type: "todo",
        content: { text: "Work on important project", completed: false },
      },
      {
        type: "todo",
        content: { text: "Exercise for 30 minutes", completed: false },
      },
      {
        type: "heading",
        content: { text: "Habits Tracker", level: 2 },
      },
      {
        type: "text",
        content: {
          text: "**Water:** 💧💧💧💧💧💧💧💧 (8 glasses)\n**Reading:** 📚 30 minutes\n**Meditation:** 🧘‍♀️ 10 minutes",
        },
      },
      {
        type: "heading",
        content: { text: "Priorities This Week", level: 2 },
      },
      {
        type: "numbered-list",
        content: {
          items: ["Finish quarterly review", "Plan weekend activities", "Organize workspace", "Call family members"],
        },
      },
      {
        type: "heading",
        content: { text: "Reflection", level: 2 },
      },
      {
        type: "text",
        content: { text: "What went well today?\n\nWhat could I improve tomorrow?\n\nWhat am I grateful for?" },
      },
    ],
  },
  {
    id: "task-list",
    name: "Task List",
    description: "Organized task management with priorities and categories",
    category: "Workspace",
    icon: "✅",
    preview: "Task management with priorities, categories, and progress tracking",
    blocks: [
      {
        type: "heading",
        content: { text: "Task Management", level: 1 },
      },
      {
        type: "image",
        content: {
          url: "/task-management-checklist-productivity-dashboard.jpg",
          caption: "Stay organized and productive",
          altText: "Task management dashboard with checkboxes and progress indicators",
        },
      },
      {
        type: "text",
        content: {
          text: `**Week of:** ${new Date().toLocaleDateString()}\n**Total Tasks:** 12 | **Completed:** 5 | **In Progress:** 4 | **Pending:** 3`,
        },
      },
      {
        type: "heading",
        content: { text: "🔥 High Priority", level: 2 },
      },
      {
        type: "todo",
        content: { text: "Complete project proposal (Due: Tomorrow)", completed: false },
      },
      {
        type: "todo",
        content: { text: "Review team performance reports", completed: false },
      },
      {
        type: "heading",
        content: { text: "📋 Work Tasks", level: 2 },
      },
      {
        type: "todo",
        content: { text: "Update project documentation", completed: true },
      },
      {
        type: "todo",
        content: { text: "Schedule team meeting for next week", completed: false },
      },
      {
        type: "todo",
        content: { text: "Review code changes", completed: false },
      },
      {
        type: "heading",
        content: { text: "🏠 Personal Tasks", level: 2 },
      },
      {
        type: "todo",
        content: { text: "Grocery shopping", completed: false },
      },
      {
        type: "todo",
        content: { text: "Book dentist appointment", completed: true },
      },
      {
        type: "todo",
        content: { text: "Plan weekend trip", completed: false },
      },
      {
        type: "heading",
        content: { text: "📚 Learning & Development", level: 2 },
      },
      {
        type: "todo",
        content: { text: "Complete online course module", completed: false },
      },
      {
        type: "todo",
        content: { text: "Read industry articles", completed: true },
      },
      {
        type: "divider",
        content: {},
      },
      {
        type: "text",
        content: { text: "**Notes:** Remember to break down large tasks into smaller, manageable steps." },
      },
    ],
  },
  {
    id: "journal",
    name: "Journal",
    description: "Daily journal template for reflection and personal growth",
    category: "Workspace",
    icon: "📔",
    preview: "Daily journal with mood tracking, gratitude, and reflection prompts",
    blocks: [
      {
        type: "image",
        content: {
          url: "/peaceful-journal-writing-with-coffee-and-morning-l.jpg",
          caption: "Your daily reflection space",
          altText: "Peaceful journaling scene with notebook and morning coffee",
        },
      },
      {
        type: "heading",
        content: {
          text: `Journal Entry - ${new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}`,
          level: 1,
        },
      },
      {
        type: "text",
        content: {
          text: "**Mood:** 😊 Great | 😌 Good | 😐 Okay | 😔 Not Great | 😢 Difficult\n**Weather:** ☀️ Sunny | ⛅ Partly Cloudy | ☁️ Cloudy | 🌧️ Rainy | ❄️ Snowy",
        },
      },
      {
        type: "heading",
        content: { text: "Morning Intentions", level: 2 },
      },
      {
        type: "text",
        content: { text: "What do I want to focus on today?\n\nHow do I want to feel by the end of the day?" },
      },
      {
        type: "heading",
        content: { text: "Daily Highlights", level: 2 },
      },
      {
        type: "bullet-list",
        content: {
          items: [
            "Something that made me smile today",
            "A challenge I overcame",
            "A person I connected with",
            "Something new I learned",
          ],
        },
      },
      {
        type: "heading",
        content: { text: "Gratitude", level: 2 },
      },
      {
        type: "numbered-list",
        content: {
          items: ["I'm grateful for...", "I appreciate...", "I'm thankful that..."],
        },
      },
      {
        type: "heading",
        content: { text: "Reflection", level: 2 },
      },
      {
        type: "text",
        content: {
          text: "What went well today?\n\nWhat could I have done differently?\n\nWhat did I learn about myself?",
        },
      },
      {
        type: "heading",
        content: { text: "Tomorrow's Focus", level: 2 },
      },
      {
        type: "text",
        content: { text: "What are my priorities for tomorrow?\n\nHow can I make tomorrow even better?" },
      },
      {
        type: "quote",
        content: { text: '"Every day is a new beginning. Take a deep breath, smile, and start again."' },
      },
    ],
  },
  {
    id: "reading-list",
    name: "Reading List",
    description: "Track books to read, currently reading, and completed with reviews",
    category: "Workspace",
    icon: "📚",
    preview: "Reading tracker with to-read, current, and completed books with ratings",
    blocks: [
      {
        type: "heading",
        content: { text: "My Reading List 📚", level: 1 },
      },
      {
        type: "image",
        content: {
          url: "/cozy-reading-nook-with-books-and-warm-lighting.jpg",
          caption: "Your personal library and reading journey",
          altText: "Cozy reading corner with stacked books and comfortable seating",
        },
      },
      {
        type: "text",
        content: {
          text: `**Reading Goal:** 24 books this year\n**Progress:** 8/24 books completed\n**Current Streak:** 15 days`,
        },
      },
      {
        type: "heading",
        content: { text: "📖 Currently Reading", level: 2 },
      },
      {
        type: "bullet-list",
        content: {
          items: [
            '"Atomic Habits" by James Clear - Page 127/320',
            '"The Psychology of Money" by Morgan Housel - Page 45/256',
          ],
        },
      },
      {
        type: "heading",
        content: { text: "📋 Want to Read", level: 2 },
      },
      {
        type: "todo",
        content: { text: '"Sapiens" by Yuval Noah Harari', completed: false },
      },
      {
        type: "todo",
        content: { text: '"The Midnight Library" by Matt Haig', completed: false },
      },
      {
        type: "todo",
        content: { text: '"Educated" by Tara Westover', completed: false },
      },
      {
        type: "todo",
        content: { text: '"The Seven Husbands of Evelyn Hugo" by Taylor Jenkins Reid', completed: false },
      },
      {
        type: "heading",
        content: { text: "✅ Completed This Month", level: 2 },
      },
      {
        type: "bullet-list",
        content: {
          items: [
            '"The Alchemist" by Paulo Coelho ⭐⭐⭐⭐⭐',
            '"Dune" by Frank Herbert ⭐⭐⭐⭐',
            '"The Great Gatsby" by F. Scott Fitzgerald ⭐⭐⭐⭐',
          ],
        },
      },
      {
        type: "heading",
        content: { text: "📝 Reading Notes", level: 2 },
      },
      {
        type: "text",
        content: {
          text: '**Key Insights:**\n• Small habits compound over time\n• Focus on systems, not goals\n• Environment shapes behavior\n\n**Favorite Quotes:**\n• "You do not rise to the level of your goals. You fall to the level of your systems."\n• "Every action is a vote for the type of person you wish to become."',
        },
      },
      {
        type: "heading",
        content: { text: "🎯 Reading Challenges", level: 2 },
      },
      {
        type: "todo",
        content: { text: "Read one book from each continent", completed: false },
      },
      {
        type: "todo",
        content: { text: "Read 5 books by authors I've never read before", completed: false },
      },
      {
        type: "todo",
        content: { text: "Read one classic literature book per quarter", completed: true },
      },
    ],
  },
  {
    id: "meeting-notes",
    name: "Meeting Notes",
    description: "Template for taking meeting notes with agenda and action items",
    category: "Productivity",
    icon: "📝",
    preview: "Meeting notes with date, attendees, agenda, and action items",
    blocks: [
      {
        type: "heading",
        content: { text: "Meeting Notes - [Date]", level: 1 },
      },
      {
        type: "image",
        content: {
          url: "/professional-meeting-room-with-whiteboard-and-coll.jpg",
          caption: "Productive team collaboration",
          altText: "Modern meeting room setup with presentation screen and collaborative workspace",
        },
      },
      {
        type: "text",
        content: { text: "**Attendees:** \n**Duration:** \n**Location:** " },
      },
      {
        type: "heading",
        content: { text: "Agenda", level: 2 },
      },
      {
        type: "numbered-list",
        content: { items: ["Topic 1", "Topic 2", "Topic 3"] },
      },
      {
        type: "heading",
        content: { text: "Discussion Points", level: 2 },
      },
      {
        type: "bullet-list",
        content: { items: ["Key point discussed", "Decision made", "Concern raised"] },
      },
      {
        type: "heading",
        content: { text: "Action Items", level: 2 },
      },
      {
        type: "todo",
        content: { text: "Action item 1 - Assigned to [Name]", completed: false },
      },
      {
        type: "todo",
        content: { text: "Action item 2 - Assigned to [Name]", completed: false },
      },
    ],
  },
  {
    id: "project-plan",
    name: "Project Plan",
    description: "Comprehensive project planning template with timeline and milestones",
    category: "Project Management",
    icon: "📊",
    preview: "Project overview, objectives, timeline, and deliverables",
    blocks: [
      {
        type: "heading",
        content: { text: "Project Plan: [Project Name]", level: 1 },
      },
      {
        type: "image",
        content: {
          url: "/project-timeline-gantt-chart-with-milestones-and-p.jpg",
          caption: "Project roadmap and timeline visualization",
          altText: "Project management timeline with milestones and progress tracking",
        },
      },
      {
        type: "text",
        content: { text: "**Project Manager:** \n**Start Date:** \n**End Date:** \n**Budget:** " },
      },
      {
        type: "heading",
        content: { text: "Project Overview", level: 2 },
      },
      {
        type: "text",
        content: { text: "Brief description of the project goals and scope..." },
      },
      {
        type: "heading",
        content: { text: "Objectives", level: 2 },
      },
      {
        type: "bullet-list",
        content: { items: ["Primary objective", "Secondary objective", "Success metrics"] },
      },
      {
        type: "heading",
        content: { text: "Timeline & Milestones", level: 2 },
      },
      {
        type: "numbered-list",
        content: {
          items: [
            "Phase 1: Planning (Week 1-2)",
            "Phase 2: Development (Week 3-6)",
            "Phase 3: Testing (Week 7-8)",
            "Phase 4: Launch (Week 9)",
          ],
        },
      },
      {
        type: "heading",
        content: { text: "Deliverables", level: 2 },
      },
      {
        type: "todo",
        content: { text: "Deliverable 1", completed: false },
      },
      {
        type: "todo",
        content: { text: "Deliverable 2", completed: false },
      },
    ],
  },
  {
    id: "daily-standup",
    name: "Daily Standup",
    description: "Quick daily standup template for team sync",
    category: "Team",
    icon: "🏃",
    preview: "Yesterday's work, today's plan, and blockers",
    blocks: [
      {
        type: "heading",
        content: { text: "Daily Standup - [Date]", level: 1 },
      },
      {
        type: "image",
        content: {
          url: "/agile-team-standup-meeting-with-sprint-board.jpg",
          caption: "Daily team sync and progress check",
          altText: "Agile team standup with kanban board and team collaboration",
        },
      },
      {
        type: "heading",
        content: { text: "What I did yesterday", level: 2 },
      },
      {
        type: "bullet-list",
        content: { items: ["Completed task 1", "Made progress on task 2"] },
      },
      {
        type: "heading",
        content: { text: "What I'm doing today", level: 2 },
      },
      {
        type: "bullet-list",
        content: { items: ["Focus on task 3", "Start task 4"] },
      },
      {
        type: "heading",
        content: { text: "Blockers", level: 2 },
      },
      {
        type: "text",
        content: { text: "No blockers / [Describe any blockers]" },
      },
    ],
  },
  {
    id: "bug-report",
    name: "Bug Report",
    description: "Structured template for reporting bugs and issues",
    category: "Development",
    icon: "🐛",
    preview: "Bug description, steps to reproduce, and expected behavior",
    blocks: [
      {
        type: "heading",
        content: { text: "Bug Report: [Bug Title]", level: 1 },
      },
      {
        type: "image",
        content: {
          url: "/software-debugging-with-code-and-error-messages.jpg",
          caption: "Bug tracking and resolution",
          altText: "Software debugging interface with code editor and error tracking",
        },
      },
      {
        type: "text",
        content: { text: "**Priority:** High/Medium/Low\n**Assigned to:** \n**Status:** Open" },
      },
      {
        type: "heading",
        content: { text: "Description", level: 2 },
      },
      {
        type: "text",
        content: { text: "Brief description of the bug..." },
      },
      {
        type: "heading",
        content: { text: "Steps to Reproduce", level: 2 },
      },
      {
        type: "numbered-list",
        content: { items: ["Step 1", "Step 2", "Step 3", "Bug occurs"] },
      },
      {
        type: "heading",
        content: { text: "Expected Behavior", level: 2 },
      },
      {
        type: "text",
        content: { text: "What should happen instead..." },
      },
      {
        type: "heading",
        content: { text: "Actual Behavior", level: 2 },
      },
      {
        type: "text",
        content: { text: "What actually happens..." },
      },
      {
        type: "heading",
        content: { text: "Environment", level: 2 },
      },
      {
        type: "text",
        content: { text: "**Browser:** \n**OS:** \n**Version:** " },
      },
    ],
  },
  {
    id: "contact-form",
    name: "Contact Form",
    description: "Ready-to-use contact form with common fields",
    category: "Forms",
    icon: "📧",
    preview: "Contact form with name, email, subject, and message fields",
    blocks: [
      {
        type: "heading",
        content: { text: "Contact Us", level: 1 },
      },
      {
        type: "image",
        content: {
          url: "/customer-service-contact-support-friendly-team.jpg",
          caption: "We're here to help - get in touch!",
          altText: "Friendly customer service team ready to assist",
        },
      },
      {
        type: "text",
        content: { text: "Get in touch with us using the form below. We'll get back to you as soon as possible." },
      },
      {
        type: "form",
        content: {
          title: "Contact Form",
          fields: [
            { id: "name", type: "text", label: "Full Name", required: true },
            { id: "email", type: "email", label: "Email Address", required: true },
            { id: "subject", type: "text", label: "Subject", required: true },
            {
              id: "message",
              type: "textarea",
              label: "Message",
              placeholder: "Tell us how we can help you...",
              required: true,
            },
            {
              id: "contact-method",
              type: "radio",
              label: "Preferred Contact Method",
              options: ["Email", "Phone"],
              required: false,
            },
          ],
        },
      },
    ],
  },
  {
    id: "survey-form",
    name: "Survey Form",
    description: "Customer feedback survey template",
    category: "Forms",
    icon: "📋",
    preview: "Survey with rating, multiple choice, and feedback questions",
    blocks: [
      {
        type: "heading",
        content: { text: "Customer Feedback Survey", level: 1 },
      },
      {
        type: "image",
        content: {
          url: "/customer-feedback-survey-with-rating-stars-and-for.jpg",
          caption: "Your feedback helps us improve",
          altText: "Customer feedback survey interface with rating stars and form elements",
        },
      },
      {
        type: "text",
        content: { text: "Help us improve by sharing your feedback. This survey takes about 3 minutes to complete." },
      },
      {
        type: "form",
        content: {
          title: "Feedback Survey",
          fields: [
            {
              id: "satisfaction",
              type: "radio",
              label: "How satisfied are you with our service?",
              options: ["Very Satisfied", "Satisfied", "Neutral", "Dissatisfied", "Very Dissatisfied"],
              required: true,
            },
            {
              id: "recommend",
              type: "radio",
              label: "Would you recommend us to others?",
              options: ["Definitely", "Probably", "Not Sure", "Probably Not", "Definitely Not"],
              required: true,
            },
            { id: "features", type: "checkbox", label: "Which features do you use most?", required: false },
            {
              id: "improvements",
              type: "textarea",
              label: "What could we improve?",
              placeholder: "Share your suggestions...",
              required: false,
            },
            {
              id: "email-updates",
              type: "checkbox",
              label: "I'd like to receive email updates about new features",
              required: false,
            },
          ],
        },
      },
    ],
  },
  {
    id: "recipe",
    name: "Recipe",
    description: "Template for documenting recipes with ingredients and instructions",
    category: "Personal",
    icon: "👨‍🍳",
    preview: "Recipe with ingredients list, instructions, and notes",
    blocks: [
      {
        type: "heading",
        content: { text: "[Recipe Name]", level: 1 },
      },
      {
        type: "image",
        content: {
          url: "/delicious-home-cooking-kitchen-ingredients-and-ute.jpg",
          caption: "Delicious homemade recipe",
          altText: "Beautiful food photography with fresh ingredients and cooking utensils",
        },
      },
      {
        type: "text",
        content: { text: "**Prep Time:** \n**Cook Time:** \n**Servings:** \n**Difficulty:** Easy/Medium/Hard" },
      },
      {
        type: "heading",
        content: { text: "Ingredients", level: 2 },
      },
      {
        type: "bullet-list",
        content: { items: ["1 cup flour", "2 eggs", "1/2 cup milk", "1 tsp salt"] },
      },
      {
        type: "heading",
        content: { text: "Instructions", level: 2 },
      },
      {
        type: "numbered-list",
        content: {
          items: ["Preheat oven to 350°F", "Mix dry ingredients", "Add wet ingredients", "Bake for 25 minutes"],
        },
      },
      {
        type: "heading",
        content: { text: "Notes", level: 2 },
      },
      {
        type: "text",
        content: { text: "Tips and variations..." },
      },
    ],
  },
  {
    id: "book-review",
    name: "Book Review",
    description: "Template for writing detailed book reviews",
    category: "Personal",
    icon: "📚",
    preview: "Book review with rating, summary, and personal thoughts",
    blocks: [
      {
        type: "heading",
        content: { text: "Book Review: [Book Title]", level: 1 },
      },
      {
        type: "image",
        content: {
          url: "/book-review-with-open-book-and-reading-glasses-coz.jpg",
          caption: "Thoughtful book analysis and review",
          altText: "Cozy reading setup with open book, glasses, and note-taking materials",
        },
      },
      {
        type: "text",
        content: { text: "**Author:** \n**Genre:** \n**Pages:** \n**Rating:** ⭐⭐⭐⭐⭐ (X/5)" },
      },
      {
        type: "heading",
        content: { text: "Summary", level: 2 },
      },
      {
        type: "text",
        content: { text: "Brief plot summary without spoilers..." },
      },
      {
        type: "heading",
        content: { text: "What I Liked", level: 2 },
      },
      {
        type: "bullet-list",
        content: { items: ["Compelling characters", "Engaging plot", "Beautiful writing style"] },
      },
      {
        type: "heading",
        content: { text: "What Could Be Better", level: 2 },
      },
      {
        type: "bullet-list",
        content: { items: ["Pacing in middle section", "Some plot holes"] },
      },
      {
        type: "heading",
        content: { text: "Final Thoughts", level: 2 },
      },
      {
        type: "text",
        content: { text: "Overall impression and recommendation..." },
      },
    ],
  },
]
